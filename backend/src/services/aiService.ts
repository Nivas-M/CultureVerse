import Knowledge, { IKnowledge } from '../models/Knowledge.js';
import Custodian from '../models/Custodian.js';

export interface RAGSourceCitation {
  id: string;
  title: string;
  custodianName: string;
  culturalAffiliation: string;
  sourceProvenance: string;
  category: string;
  visibility: string;
  excerpt: string;
}

export interface RAGQueryResult {
  answer: string;
  grounded: boolean;
  citations: RAGSourceCitation[];
  perspectives?: {
    custodianName: string;
    community: string;
    perspective: string;
  }[];
  fallbackNotice?: string;
}

/**
 * Text embedding generator.
 * Uses Gemini embedding-001 / text-embedding-004 when API key is present;
 * includes a fallback deterministic cosine embedding to ensure reliable local testing and zero breakage.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text: text.slice(0, 2048) }] }
          })
        }
      );

      if (response.ok) {
        const data: any = await response.json();
        if (data.embedding?.values) {
          return data.embedding.values;
        }
      }
    } catch (e) {
      console.warn('Gemini embedding API fallback to local vector generator:', e);
    }
  }

  // Deterministic local embedding (128-dimensional frequency-hash vector)
  return createLocalVector(text);
}

function createLocalVector(text: string): number[] {
  const dim = 128;
  const vector = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    vector[idx] += 1;
  }

  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const minLen = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < minLen; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dotProduct / denominator;
}

export class CulturalAIService {
  /**
   * Permission-gated RAG query over verified custodian knowledge
   */
  async queryCulturalAssistant(
    userQuery: string,
    userRole: 'traveller' | 'custodian' | 'admin' | 'anonymous' = 'anonymous',
    requestingUserId?: string
  ): Promise<RAGQueryResult> {
    const query = userQuery.trim();
    if (!query) {
      return {
        answer: "Please ask a question about our heritage, traditions, or custodians.",
        grounded: false,
        citations: []
      };
    }

    // Step 1: Strict Permission Filter
    // Public users can ONLY query APPROVED + PUBLIC documents.
    // Community members can query APPROVED + PUBLIC / COMMUNITY.
    // RESTRICTED is NEVER exposed to general assistant queries.
    const visibilityAllowed = userRole === 'admin'
      ? ['PUBLIC', 'COMMUNITY', 'RESTRICTED']
      : userRole === 'custodian'
        ? ['PUBLIC', 'COMMUNITY']
        : ['PUBLIC'];

    const filterCriteria: any = {
      verificationStatus: 'APPROVED',
      visibility: { $in: visibilityAllowed }
    };

    // Step 2: Retrieve candidate knowledge from database
    const candidates = await Knowledge.find(filterCriteria).populate('custodianId');

    if (!candidates || candidates.length === 0) {
      const graphResult = await this.searchCulturalGraph(query);
      if (graphResult) return graphResult;

      return {
        answer: "I couldn't find verified information about this in the available cultural sources.",
        grounded: false,
        citations: [],
        fallbackNotice: "No verified custodian sources match this query in the public corpus."
      };
    }

    // Step 3: Vector similarity calculation
    const queryVector = await generateEmbedding(query);
    const stopWords = new Set(['what', 'is', 'the', 'how', 'about', 'and', 'in', 'of', 'to', 'a', 'an', 'are', 'for', 'with', 'on', 'at', 'from', 'this', 'that', 'it', 'tell', 'me', 'can', 'you']);
    const meaningfulQueryTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !stopWords.has(t));

    const scoredCandidates = candidates.map((item) => {
      let score = 0;
      if (item.embedding && item.embedding.length > 0) {
        score = cosineSimilarity(queryVector, item.embedding);
      }

      // Keyword relevance with meaningful terms
      const corpusText = `${item.title} ${item.summary} ${item.content} ${item.tags?.join(' ')}`.toLowerCase();
      let keywordHits = 0;
      for (const term of meaningfulQueryTerms) {
        if (corpusText.includes(term)) {
          keywordHits++;
        }
      }

      const keywordRatio = meaningfulQueryTerms.length > 0 ? keywordHits / meaningfulQueryTerms.length : 0;
      
      // If none of the meaningful query words exist in this document, suppress score
      if (meaningfulQueryTerms.length > 0 && keywordHits === 0) {
        score = score * 0.1;
      } else {
        score += keywordRatio * 0.5;
      }

      return { item, score, keywordHits };
    });

    // Step 4: Rank and filter by confidence threshold
    scoredCandidates.sort((a, b) => b.score - a.score);
    const topMatches = scoredCandidates
      .filter((c) => (meaningfulQueryTerms.length > 0 ? c.keywordHits > 0 && c.score >= 0.35 : c.score >= 0.5))
      .slice(0, 3);

    // Fallback if no confident match in MongoDB: check Cultural Graph Datasets
    if (topMatches.length === 0) {
      const graphResult = await this.searchCulturalGraph(query);
      if (graphResult) return graphResult;

      return {
        answer: "I couldn't find verified information about this in the available cultural sources.",
        grounded: false,
        citations: [],
        fallbackNotice: "Query could not be grounded in approved custodian contributions."
      };
    }

    // Step 5: Extract Citations & Multiple Perspectives
    const citations: RAGSourceCitation[] = [];
    const collectedPerspectives: any[] = [];
    const contextBlocks: string[] = [];

    for (const { item } of topMatches) {
      const custodian = item.custodianId as any;
      const custodianName = custodian?.name || 'Traditional Custodian';
      const culturalAffiliation = custodian?.culturalAffiliation || 'Heritage Community';

      citations.push({
        id: (item._id as any).toString(),
        title: item.title,
        custodianName,
        culturalAffiliation,
        sourceProvenance: item.sourceDetails,
        category: item.culturalCategory,
        visibility: item.visibility,
        excerpt: item.summary
      });

      if (item.perspectives && item.perspectives.length > 0) {
        for (const p of item.perspectives) {
          collectedPerspectives.push({
            custodianName: p.custodianName,
            community: p.community,
            perspective: p.interpretation
          });
        }
      }

      contextBlocks.push(
        `[Source: "${item.title}"]\n` +
        `Custodian: ${custodianName} (${culturalAffiliation})\n` +
        `Provenance: ${item.sourceDetails}\n` +
        `Cultural Content: ${item.content}\n`
      );
    }

    // Step 6: Generate Grounded Response via LLM
    const groundedContext = contextBlocks.join('\n\n---\n\n');
    let answerText = await this.synthesizeWithLLM(query, groundedContext);

    // If perspectives exist, append multi-custodian perspectives cleanly
    if (collectedPerspectives.length > 0 && !answerText.includes('perspective')) {
      answerText += '\n\n**Regional & Community Perspectives:**\n';
      for (const p of collectedPerspectives) {
        answerText += `- **${p.custodianName} (${p.community}):** "${p.perspective}"\n`;
      }
    }

    return {
      answer: answerText,
      grounded: true,
      citations,
      perspectives: collectedPerspectives.length > 0 ? collectedPerspectives : undefined
    };
  }

  private async synthesizeWithLLM(query: string, context: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are the CultureVerse Cultural Assistant, representing the sacred knowledge preserved by traditional custodians.
CRITICAL INSTRUCTIONS:
1. Ground your response ONLY on the verified context provided below.
2. Attribute statements to the custodian or source specified in the context.
3. If multiple custodians give different interpretations, highlight each perspective respectfully without declaring one as absolute.
4. If the context does not contain sufficient verified information to answer the question, state: "I couldn't find verified information about this in the available cultural sources."
5. Do NOT hallucinate or invent cultural rituals, mantras, or histories.

VERIFIED CULTURAL CONTEXT:
${context}

USER QUESTION:
${query}

GROUNDED ANSWER WITH CUSTODIAN ATTRIBUTION:`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2, // Low temperature for high factual adherence
                maxOutputTokens: 800
              }
            })
          }
        );

        if (response.ok) {
          const data: any = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text.trim();
        }
      } catch (err) {
        console.error('LLM generation error, falling back to deterministic synthesis:', err);
      }
    }

    // Deterministic fallback synthesizer if LLM is unreachable
    return `Based on verified cultural records preserved in CultureVerse:\n\n${context
      .split('\n---\n')
      .map((block) => block.trim())
      .join('\n\n')}`;
  }

  /**
   * Human-Assisted Knowledge Capture:
   * Structures raw custodian notes, spoken transcripts, or oral histories into an approved schema.
   */
  async structureRawContribution(
    rawText: string,
    custodianName: string,
    categoryHint?: string
  ): Promise<{
    title: string;
    summary: string;
    structuredContent: string;
    culturalCategory: string;
    suggestedGuidelines: string[];
    sourceDetails: string;
  }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are assisting a cultural custodian (${custodianName}) in capturing traditional cultural knowledge.
Convert the raw oral narrative or notes below into a structured cultural record.
Do NOT alter the cultural essence or meaning. Keep the custodian's voice authentic.

RAW NOTES:
"""
${rawText}
"""

Return a valid JSON object with the following fields:
{
  "title": "A respectful, evocative title for this knowledge record",
  "summary": "A concise 2-sentence summary suitable for discovery",
  "structuredContent": "Well-formatted paragraphs preserving the custodian's oral lineage and instructions",
  "culturalCategory": "One of: temple_heritage, ritual_tradition, folk_art, craft, oral_history, festival, traditional_cuisine, sacred_geography",
  "suggestedGuidelines": ["Rule or etiquette devotees/travellers must respect"],
  "sourceDetails": "Description of provenance (e.g. Preserved by ${custodianName} through oral lineage)"
}
Return ONLY valid JSON.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (response.ok) {
          const data: any = await response.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            return JSON.parse(jsonText);
          }
        }
      } catch (e) {
        console.warn('AI structuring failed, using rule-based formatter:', e);
      }
    }

    // Rule-based deterministic formatter
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const title = lines[0]?.slice(0, 60) || 'Cultural Knowledge Record';
    const summary = lines.slice(1, 3).join(' ') || rawText.slice(0, 150) + '...';

    return {
      title,
      summary,
      structuredContent: rawText,
      culturalCategory: categoryHint || 'ritual_tradition',
      suggestedGuidelines: [
        'Maintain respectful decorum',
        'Follow traditional custodian directives on site'
      ],
      sourceDetails: `Oral narrative directly shared by ${custodianName}`
    };
  }

  private async searchCulturalGraph(query: string): Promise<RAGQueryResult | null> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const graphDir = path.join(__dirname, '../../DATA/cultural_graph');

      if (fs.existsSync(graphDir)) {
        const loadJSON = (file: string) => {
          const p = path.join(graphDir, file);
          return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
        };

        const rituals = loadJSON('rituals.json');
        const arts = loadJSON('performing_arts.json');
        const stories = loadJSON('stories.json');
        const ecology = loadJSON('sacred_ecology.json');
        const terms = loadJSON('cultural_terms.json');

        const qLower = query.toLowerCase();

        // Helper for safe query inclusion
        const matchesQuery = (text?: string) => {
          if (!text || text.trim().length === 0) return false;
          return qLower.includes(text.toLowerCase().trim());
        };

        // 1. Check Rituals
        const matchedRitual = rituals.find((r: any) =>
          matchesQuery(r.name) ||
          matchesQuery(r.vernacularName) ||
          matchesQuery(r.vernacular_name) ||
          matchesQuery(r.id)
        );

        if (matchedRitual) {
          const vName = matchedRitual.vernacularName || matchedRitual.vernacular_name || '';
          const epStatus = matchedRitual.epistemicStatus || matchedRitual.epistemic_status || 'Documented living practice';
          const summary = matchedRitual.fullDescription || matchedRitual.shortDescription || matchedRitual.summary || '';
          const timing = matchedRitual.calendarTiming || matchedRitual.seasonal_timing || '';
          const communities = matchedRitual.communities || matchedRitual.custodians || [];
          const sourceRef = matchedRitual.source || (matchedRitual.source_references ? matchedRitual.source_references.join(', ') : 'Coastal Ethnography Archive');

          return {
            answer: `**${matchedRitual.name}** ${vName ? `(${vName})` : ''}\n\n` +
              `**Category**: ${matchedRitual.category}\n` +
              `**Epistemic Status**: ${epStatus}\n\n` +
              `${summary}\n\n` +
              (timing ? `**Seasonal Rhythm**: ${timing}\n` : '') +
              (communities.length ? `**Custodian Lineages**: ${communities.join(', ')}\n` : ''),
            grounded: true,
            citations: [
              {
                id: matchedRitual.id,
                title: `${matchedRitual.name} Liturgical Record`,
                custodianName: communities.length ? communities.join(', ') : 'Hereditary Practitioners',
                culturalAffiliation: 'Coastal Karnataka Living Tradition',
                sourceProvenance: sourceRef,
                category: matchedRitual.category,
                visibility: 'PUBLIC',
                excerpt: matchedRitual.shortDescription || summary.slice(0, 200)
              }
            ]
          };
        }

        // 2. Check Performing Arts
        const matchedArt = arts.find((a: any) =>
          matchesQuery(a.name) ||
          matchesQuery(a.vernacularName) ||
          matchesQuery(a.vernacular_name) ||
          (a.name.toLowerCase().includes('yakshagana') && qLower.includes('yakshagana'))
        );

        if (matchedArt) {
          const vName = matchedArt.vernacularName || matchedArt.vernacular_name || '';
          const epStatus = matchedArt.epistemicStatus || matchedArt.epistemic_status || 'Documented living practice';
          const elements = matchedArt.keyElements ? matchedArt.keyElements.join('; ') : '';
          const instruments = matchedArt.musicalEnsemble ? matchedArt.musicalEnsemble.join(', ') : '';
          const gurus = matchedArt.prominentGurus ? matchedArt.prominentGurus.join(', ') : '';

          return {
            answer: `**${matchedArt.name}** ${vName ? `(${vName})` : ''}\n\n` +
              `**Epistemic Status**: ${epStatus}\n` +
              `**Region**: ${matchedArt.region || 'Coastal Karnataka'}\n\n` +
              (elements ? `**Key Stylistic Elements**: ${elements}\n\n` : '') +
              (instruments ? `**Musical Ensemble**: ${instruments}\n\n` : '') +
              (gurus ? `**Prominent Gurus & Masters**: ${gurus}\n` : ''),
            grounded: true,
            citations: [
              {
                id: matchedArt.id,
                title: `${matchedArt.name} Performance Dossier`,
                custodianName: gurus || 'Yakshagana & Folk Masters Guild',
                culturalAffiliation: 'Coastal Classical & Folk Arts',
                sourceProvenance: 'SRC-001 (K.S. Karanth Yakshagana Bayalata Archive)',
                category: 'Performing Arts',
                visibility: 'PUBLIC',
                excerpt: elements.slice(0, 200)
              }
            ]
          };
        }

        // 3. Check Stories / Oral Epics
        const matchedStory = stories.find((s: any) =>
          matchesQuery(s.title) ||
          (s.title.toLowerCase().includes('siri') && qLower.includes('siri')) ||
          (s.title.toLowerCase().includes('koti') && (qLower.includes('koti') || qLower.includes('chennaya'))) ||
          (s.title.toLowerCase().includes('bappa') && qLower.includes('bappa'))
        );

        if (matchedStory) {
          return {
            answer: `**${matchedStory.title}**\n\n` +
              `**Knowledge Type**: ${matchedStory.knowledgeType || 'Oral Epic'} (${matchedStory.epistemicStatus || 'Oral tradition'})\n` +
              `**Associated Place**: ${matchedStory.relatedPlace || 'Coastal Region'}\n\n` +
              `${matchedStory.narrative || ''}\n\n` +
              (matchedStory.notes ? `**Cultural Notes**: ${matchedStory.notes}` : ''),
            grounded: true,
            citations: [
              {
                id: matchedStory.id,
                title: matchedStory.title,
                custodianName: 'Oral Epic Bardic Lineages',
                culturalAffiliation: 'Coastal Oral Literature & Paad-dana Corpus',
                sourceProvenance: matchedStory.source || 'Oral Literature & Epigraphy Archive',
                category: 'Oral Epic',
                visibility: 'PUBLIC',
                excerpt: (matchedStory.narrative || '').slice(0, 200)
              }
            ]
          };
        }

        // 4. Check Sacred Ecology
        const matchedEco = ecology.find((e: any) =>
          matchesQuery(e.name) ||
          (e.name.toLowerCase().includes('nagabana') && qLower.includes('nagabana')) ||
          (e.name.toLowerCase().includes('estuary') && qLower.includes('estuary')) ||
          (e.name.toLowerCase().includes('kumara') && qLower.includes('kumara'))
        );

        if (matchedEco) {
          return {
            answer: `**${matchedEco.name}**\n\n` +
              `**Ecosystem Classification**: ${matchedEco.type || 'Sacred Natural Site'}\n` +
              `**Geographic Region**: ${matchedEco.region || 'Coastal Karnataka'}\n\n` +
              `${matchedEco.significance || ''}`,
            grounded: true,
            citations: [
              {
                id: matchedEco.id,
                title: `${matchedEco.name} Ecological Dossier`,
                custodianName: 'Sacred Grove & Estuarine Guardians',
                culturalAffiliation: 'Coastal Biocultural Watershed',
                sourceProvenance: 'Ecological Field Survey & Customary Forest Documentation',
                category: 'Sacred Ecology',
                visibility: 'PUBLIC',
                excerpt: (matchedEco.significance || '').slice(0, 200)
              }
            ]
          };
        }

        // 5. Check Vernacular Terms
        const matchedTerm = terms.find((t: any) =>
          matchesQuery(t.term) ||
          matchesQuery(t.meaning)
        );

        if (matchedTerm) {
          return {
            answer: `**${matchedTerm.term}**\n` +
              `*Language*: ${matchedTerm.language}\n\n` +
              `**Definition**: ${matchedTerm.meaning}\n\n` +
              (matchedTerm.context ? `**Cultural Context**: ${matchedTerm.context}` : ''),
            grounded: true,
            citations: [
              {
                id: matchedTerm.id,
                title: `Cultural Glossary: ${matchedTerm.term}`,
                custodianName: 'Linguistic & Ethnographic Corpus',
                culturalAffiliation: `${matchedTerm.language} Heritage Community`,
                sourceProvenance: 'Tulu Lexicon & Coastal Vernacular Studies',
                category: 'Vernacular Vocabulary',
                visibility: 'PUBLIC',
                excerpt: matchedTerm.meaning
              }
            ]
          };
        }
      }
    } catch (err) {
      console.warn('Cultural graph lookup failed:', err);
    }
    return null;
  }
}

export const aiService = new CulturalAIService();
