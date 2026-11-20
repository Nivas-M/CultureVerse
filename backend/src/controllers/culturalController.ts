import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../DATA/cultural_graph');

// Helper to safely read JSON
const readData = (fileName: string) => {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
  }
  return [];
};

// GET /api/cultural/overview
export const getCulturalOverview = async (req: Request, res: Response) => {
  try {
    const regions = readData('regions.json');
    const traditions = readData('traditions.json');
    const rituals = readData('rituals.json');
    const festivals = readData('festivals.json');
    const performingArts = readData('performing_arts.json');
    const crafts = readData('crafts.json');
    const stories = readData('stories.json');
    const communities = readData('communities.json');
    const sacredEcology = readData('sacred_ecology.json');
    const terms = readData('cultural_terms.json');
    const places = readData('places.json');
    const temples = readData('temples.json');

    res.status(200).json({
      success: true,
      data: {
        summary: {
          regionsCount: regions.length,
          placesCount: places.length,
          templesCount: temples.length,
          traditionsCount: traditions.length,
          ritualsCount: rituals.length,
          festivalsCount: festivals.length,
          performingArtsCount: performingArts.length,
          craftsCount: crafts.length,
          storiesCount: stories.length,
          communitiesCount: communities.length,
          ecologyCount: sacredEcology.length,
          termsCount: terms.length
        },
        featuredTraditions: traditions,
        featuredArts: performingArts.slice(0, 4),
        featuredStories: stories.slice(0, 4),
        featuredRituals: rituals.slice(0, 6),
        featuredFestivals: festivals.slice(0, 4),
        featuredEcology: sacredEcology.slice(0, 3),
        wordOfTheDay: terms[Math.floor(Math.random() * terms.length)] || terms[0]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/rituals
export const getRituals = async (req: Request, res: Response) => {
  try {
    let rituals = readData('rituals.json');
    const { category, search, epistemic_status, community } = req.query;

    if (category) {
      rituals = rituals.filter((r: any) => 
        r.category.toLowerCase().includes(String(category).toLowerCase())
      );
    }
    if (epistemic_status) {
      rituals = rituals.filter((r: any) => 
        r.epistemic_status === epistemic_status
      );
    }
    if (community) {
      rituals = rituals.filter((r: any) => 
        r.custodians && r.custodians.includes(String(community))
      );
    }
    if (search) {
      const q = String(search).toLowerCase();
      rituals = rituals.filter((r: any) => 
        r.name.toLowerCase().includes(q) ||
        r.vernacular_name.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ success: true, count: rituals.length, data: rituals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/festivals
export const getFestivals = async (req: Request, res: Response) => {
  try {
    const festivals = readData('festivals.json');
    res.status(200).json({ success: true, count: festivals.length, data: festivals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/arts
export const getArtsAndCrafts = async (req: Request, res: Response) => {
  try {
    const performingArts = readData('performing_arts.json');
    const crafts = readData('crafts.json');
    res.status(200).json({
      success: true,
      data: { performingArts, crafts }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/stories
export const getStories = async (req: Request, res: Response) => {
  try {
    const stories = readData('stories.json');
    res.status(200).json({ success: true, count: stories.length, data: stories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/places
export const getPlacesAndEcology = async (req: Request, res: Response) => {
  try {
    const places = readData('places.json');
    const sacredEcology = readData('sacred_ecology.json');
    const temples = readData('temples.json');
    res.status(200).json({
      success: true,
      data: { places, sacredEcology, temples }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/terms
export const getTerms = async (req: Request, res: Response) => {
  try {
    const terms = readData('cultural_terms.json');
    res.status(200).json({ success: true, count: terms.length, data: terms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cultural/graph
export const getCulturalGraph = async (req: Request, res: Response) => {
  try {
    const traditions = readData('traditions.json');
    const rituals = readData('rituals.json');
    const festivals = readData('festivals.json');
    const performingArts = readData('performing_arts.json');
    const crafts = readData('crafts.json');
    const stories = readData('stories.json');
    const communities = readData('communities.json');
    const ecology = readData('sacred_ecology.json');
    const places = readData('places.json');
    const temples = readData('temples.json');
    const relationships = readData('relationships.json');

    // Assemble nodes
    const nodes: any[] = [];
    traditions.forEach((t: any) => nodes.push({ id: t.id, label: t.name, type: 'Tradition', vernacular: t.vernacular_name }));
    rituals.forEach((r: any) => nodes.push({ id: r.id, label: r.name, type: 'Ritual', vernacular: r.vernacular_name }));
    festivals.forEach((f: any) => nodes.push({ id: f.id, label: f.name, type: 'Festival', vernacular: f.vernacular_name }));
    performingArts.forEach((a: any) => nodes.push({ id: a.id, label: a.name, type: 'PerformingArt', vernacular: a.vernacular_name }));
    crafts.forEach((c: any) => nodes.push({ id: c.id, label: c.name, type: 'Craft', vernacular: c.vernacular_name }));
    stories.forEach((s: any) => nodes.push({ id: s.id, label: s.title, type: 'Story', vernacular: s.title }));
    communities.forEach((c: any) => nodes.push({ id: c.id, label: c.name, type: 'Community', vernacular: c.name }));
    ecology.forEach((e: any) => nodes.push({ id: e.id, label: e.name, type: 'SacredEcology', vernacular: e.vernacular_name }));
    places.forEach((p: any) => nodes.push({ id: p.id, label: p.name, type: 'Place', vernacular: p.vernacular_name }));
    temples.forEach((t: any) => nodes.push({ id: t.id, label: t.name, type: 'Temple', vernacular: t.vernacular_name }));

    res.status(200).json({
      success: true,
      data: {
        nodes,
        edges: relationships
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
