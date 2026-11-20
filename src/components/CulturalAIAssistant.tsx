import React, { useState } from 'react';
import { aiAPI, RAGResponse } from '@/lib/api';
import { Compass, Send, ShieldCheck, BookOpen, AlertCircle, X, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CulturalAIAssistantProps {
  initialQuery?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CulturalAIAssistant: React.FC<CulturalAIAssistantProps> = ({
  initialQuery = '',
  isOpen: controlledIsOpen,
  onClose
}) => {
  const [isOpenState, setIsOpenState] = useState(false);
  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpenState;
  const toggleModal = () => {
    if (onClose) onClose();
    else setIsOpenState(!isOpenState);
  };

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<RAGResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    'What is Thenku Thittu Yakshagana and its rhythm codes?',
    'How is 400-year-old Kaavi Art painted on temple walls?',
    'What is the ecological significance of Nagara Bana sacred groves?',
    'Tell me about the 9th-century Nath tradition of Mangaladevi.'
  ];

  const handleAsk = async (questionToAsk?: string) => {
    const q = (questionToAsk || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    if (questionToAsk) setQuery(questionToAsk);

    try {
      const res = await aiAPI.askCulturalAssistant(q);
      if (res.success && res.data) {
        setResponse(res.data);
      } else {
        setError('Failed to receive response from cultural engine.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error connecting to Cultural AI Assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Restrained Cultural Guide Trigger */}
      {!isModalOpen && controlledIsOpen === undefined && (
        <button
          onClick={() => setIsOpenState(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#24170F] text-[#F5F0E7] border border-[#C9562D]/40 px-4 py-2.5 shadow-xl hover:bg-[#C9562D] transition-all duration-300 group rounded-sm"
          aria-label="Ask the Cultural Guide"
        >
          <Compass className="w-3.5 h-3.5 text-[#D9782A] group-hover:text-white transition-colors" />
          <span className="font-sans text-xs tracking-widest uppercase font-medium">Cultural Guide</span>
          <span className="text-[10px] font-mono tracking-wider opacity-60 ml-1 border-l border-white/20 pl-2">RAG</span>
        </button>
      )}

      {/* Modal Interface */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#24170F]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F5F0E7] text-[#2B211B] border border-[#D8CEBE] w-full max-w-2xl max-h-[88vh] shadow-2xl flex flex-col overflow-hidden rounded-sm animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Editorial Header */}
            <div className="p-5 bg-[#EFE7DA] border-b border-[#D8CEBE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-[#24170F] text-[#F5F0E7] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-[#D9782A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-medium text-[#24170F]">
                      CultureVerse Cultural Guide
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#C9562D]/10 text-[#C9562D] border border-[#C9562D]/20 rounded-sm">
                      Lineage Grounded
                    </span>
                  </div>
                  <p className="text-xs text-[#756B62] mt-0.5">
                    Strictly referencing verified custodian archives and oral transmissions
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleModal} className="text-[#24170F] hover:bg-black/5 rounded-sm">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1 p-5 overflow-y-auto">
              {/* Presets if no active conversation */}
              {!response && !loading && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EFE7DA] border border-[#D8CEBE] text-xs text-[#756B62] flex gap-3 items-start rounded-sm">
                    <ShieldCheck className="w-4 h-4 text-[#C9562D] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-serif text-sm font-medium text-[#24170F] mb-1">Our Cultural Grounding Guarantee</p>
                      <p className="leading-relaxed">
                        This assistant only synthesizes approved knowledge contributed by traditional custodians. If a topic lacks verified community provenance, it will transparently inform you rather than fabricating cultural facts.
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-[#756B62] mb-2.5">
                      Explore Living Traditions
                    </p>
                    <div className="grid gap-2">
                      {samplePrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAsk(p)}
                          className="text-left p-3 border border-[#D8CEBE] bg-white/60 hover:border-[#C9562D] hover:bg-white text-xs text-[#2B211B] transition flex items-center justify-between group rounded-sm"
                        >
                          <span className="font-serif text-[13px]">{p}</span>
                          <Send className="w-3.5 h-3.5 text-[#756B62] group-hover:text-[#C9562D] transition shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="w-8 h-8 border-2 border-[#C9562D] border-t-transparent rounded-full animate-spin" />
                  <p className="font-serif text-base text-[#24170F]">Consulting verified custodian records...</p>
                  <p className="text-xs text-[#756B62]">Retrieving provenance-backed oral lineages & perspectives</p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex gap-3 items-center rounded-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Response Display */}
              {response && !loading && (
                <div className="space-y-5 animate-in fade-in-50 duration-300">
                  {/* Grounded / Fallback Banner */}
                  {response.grounded ? (
                    <div className="flex items-center gap-2 text-xs text-[#24170F] bg-[#EFE7DA] border border-[#D8CEBE] px-3 py-1.5 rounded-sm w-fit">
                      <ShieldCheck className="w-4 h-4 text-[#C9562D]" />
                      <span className="font-medium">Grounded in {response.citations.length} verified custodian source(s)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#24170F] bg-[#EFE7DA] border border-[#D8CEBE] px-3 py-1.5 rounded-sm w-fit">
                      <HelpCircle className="w-4 h-4 text-[#D9782A]" />
                      <span>{response.fallbackNotice || 'Limited verified context'}</span>
                    </div>
                  )}

                  {/* Main Answer text */}
                  <div className="text-[#2B211B] text-sm leading-relaxed whitespace-pre-line bg-white/70 p-5 rounded-sm border border-[#D8CEBE] font-serif">
                    {response.answer}
                  </div>

                  {/* Citations / Provenance Badges */}
                  {response.citations && response.citations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#D8CEBE]">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-[#756B62] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#C9562D]" />
                        Verified Provenance Sources
                      </p>
                      <div className="grid gap-2">
                        {response.citations.map((cite, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white border border-[#D8CEBE] text-xs flex flex-col gap-1 rounded-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-medium text-sm text-[#24170F]">{cite.title}</span>
                              <span className="text-[10px] font-mono uppercase tracking-wider bg-[#EFE7DA] text-[#756B62] px-2 py-0.5 rounded-sm border border-[#D8CEBE]">
                                {cite.category.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[#756B62] text-[11px]">
                              Preserved by: <strong className="text-[#24170F]">{cite.custodianName}</strong> ({cite.culturalAffiliation})
                            </p>
                            <p className="text-[11px] text-[#C9562D] italic">
                              Provenance: {cite.sourceProvenance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi-perspective cards */}
                  {response.perspectives && response.perspectives.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#D8CEBE]">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-[#756B62]">
                        Coexisting Community Perspectives
                      </p>
                      <div className="grid gap-2">
                        {response.perspectives.map((p, idx) => (
                          <div key={idx} className="p-3 bg-[#EFE7DA]/60 border border-[#D8CEBE] text-xs rounded-sm">
                            <p className="font-medium text-[#24170F] mb-0.5">
                              {p.custodianName} ({p.community})
                            </p>
                            <p className="text-[#756B62] italic">"{p.perspective}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Footer */}
            <div className="p-4 bg-[#EFE7DA] border-t border-[#D8CEBE] flex gap-2 items-center">
              <Input
                placeholder="Ask about coastal rituals, crafts, dance-drama, sacred geography..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleAsk();
                  }
                }}
                className="text-xs sm:text-sm bg-white border-[#D8CEBE] rounded-sm text-[#2B211B] placeholder:text-[#756B62]"
              />
              <Button
                onClick={() => handleAsk()}
                disabled={loading || !query.trim()}
                className="bg-[#C9562D] hover:bg-[#B24722] text-white shrink-0 px-4 rounded-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
