import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { custodianAPI, Custodian } from '@/lib/api';
import { ShieldCheck, MapPin, BookOpen, Calendar, ArrowLeft, Clock, Users, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

const languageLabels: Record<string, string> = {
  kn: 'Kannada', tcy: 'Tulu', en: 'English', hi: 'Hindi',
  mr: 'Marathi', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam',
  kok: 'Konkani', ur: 'Urdu', sa: 'Sanskrit'
};
const formatLanguages = (langs: string[]): string =>
  langs.map(l => languageLabels[l] || l).join(', ');

const CustodianDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [custodian, setCustodian] = useState<Custodian | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustodian(id);
    }
  }, [id]);

  const fetchCustodian = async (custodianId: string) => {
    setLoading(true);
    try {
      const res = await custodianAPI.getById(custodianId);
      if (res.success && res.data) {
        setCustodian(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F0E7]">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9562D] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!custodian) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
        <Header />
        <main className="flex-1 pt-32 max-w-xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-[#24170F]">Custodian Dossier Not Found</h2>
          <p className="text-sm text-[#756B62] mt-2 mb-6">
            The requested cultural custodian record could not be retrieved from the verified registry.
          </p>
          <Link to="/custodians">
            <button className="bg-[#24170F] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm hover:bg-[#C9562D] transition-colors">
              Return to Custodians Directory
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link to="/custodians" className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#756B62] hover:text-[#24170F] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Living Custodians</span>
          </Link>
        </div>

        {/* Editorial Custodian Masthead */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="border border-[#D8CEBE] bg-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-[500px]">
              <img
                src={custodian.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800'}
                alt={custodian.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#24170F] text-[#F5F0E7] text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                Verified Cultural Guardian
              </div>
            </div>

            {/* Dossier Header Info */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-[#F5F0E7]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-wider uppercase text-[#756B62]">
                  <span className="text-[#C9562D] font-semibold">{custodian.category.replace('_', ' ')}</span>
                  <span>·</span>
                  <span>{custodian.experienceYears} Years Lineage</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C9562D]" />
                    <span>{custodian.location.city}, {custodian.location.region}</span>
                  </div>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#24170F] leading-[1.08]">
                  {custodian.name}
                </h1>

                <p className="font-serif text-lg sm:text-xl text-[#C9562D] italic">
                  {custodian.culturalAffiliation}
                </p>

                {/* Telemetry Bar */}
                <div className="py-4 border-y border-[#D8CEBE] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#756B62] block">LANGUAGES</span>
                    <strong className="text-[#24170F] mt-0.5 block">{formatLanguages(custodian.languages)}</strong>
                  </div>
                  <div>
                    <span className="text-[#756B62] block">COMMUNITY RATING</span>
                    <strong className="text-[#24170F] mt-0.5 block">★ {custodian.rating ? custodian.rating.toFixed(1) : '5.0'} ({custodian.totalReviews || 0})</strong>
                  </div>
                  <div>
                    <span className="text-[#756B62] block">VERIFICATION</span>
                    <strong className="text-[#C9562D] mt-0.5 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Provenance Approved
                    </strong>
                  </div>
                </div>

                {/* Cultural Biography */}
                <div className="pt-2 space-y-2">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                    Lineage Narrative
                  </h3>
                  <p className="text-sm sm:text-base text-[#2B211B] leading-relaxed font-normal">
                    {custodian.bio}
                  </p>
                </div>
              </div>

              {/* Economic Standard Callout */}
              <div className="mt-8 pt-6 border-t border-[#D8CEBE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#EFE7DA] p-4 rounded-sm">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#C9562D] block font-medium">
                    85% Direct Preservation Impact
                  </span>
                  <p className="text-xs text-[#756B62] mt-0.5">
                    Reservations directly fund {custodian.name}&apos;s household and apprentice preservation work.
                  </p>
                </div>
                {custodian.experiences && custodian.experiences.length > 0 && (
                  <a
                    href="#experiences-section"
                    className="bg-[#C9562D] hover:bg-[#B24722] text-white text-xs px-4 py-2 font-medium shrink-0 rounded-sm transition-colors"
                  >
                    View Experiences ({custodian.experiences.length})
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lineage Practice Detail Section */}
        {custodian.traditionPractice && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="border-l-2 border-[#C9562D] pl-6 sm:pl-8 py-2 max-w-4xl space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                Traditional Practice & Liturgy Codes
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#24170F] italic leading-relaxed">
                &ldquo;{custodian.traditionPractice}&rdquo;
              </p>
            </div>
          </section>
        )}

        {/* Hosted Experiences and Knowledge Archive */}
        <section id="experiences-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="experiences" className="w-full">
              <TabsList className="bg-transparent border-b border-[#D8CEBE] rounded-none p-0 h-auto gap-8 w-full justify-start mb-8 flex-wrap">
              <TabsTrigger
                value="experiences"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9562D] data-[state=active]:bg-transparent data-[state=active]:text-[#24170F] text-[#756B62] font-serif text-lg sm:text-xl pb-3 px-0 shadow-none"
              >
                Hosted Experiences ({custodian.experiences?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="knowledge"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9562D] data-[state=active]:bg-transparent data-[state=active]:text-[#24170F] text-[#756B62] font-serif text-lg sm:text-xl pb-3 px-0 shadow-none"
              >
                Approved Knowledge Corpus ({custodian.approvedKnowledge?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="ecosystem"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9562D] data-[state=active]:bg-transparent data-[state=active]:text-[#24170F] text-[#756B62] font-serif text-lg sm:text-xl pb-3 px-0 shadow-none"
              >
                Living Lineage & Rituals
              </TabsTrigger>
            </TabsList>

            {/* Experiences Tab Content */}
            <TabsContent value="experiences" className="space-y-6 mt-0">
              {!custodian.experiences || custodian.experiences.length === 0 ? (
                <div className="p-12 border border-[#D8CEBE] bg-white rounded-sm text-center text-sm text-[#756B62]">
                  No active public experiences currently listed for this custodian.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {custodian.experiences.map((exp) => (
                    <div
                      key={exp._id}
                      className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#24170F] transition-all group"
                    >
                      <div className="p-6 sm:p-8 space-y-4">
                        <div className="flex items-center justify-between gap-2 border-b border-[#D8CEBE] pb-3">
                          <span className="font-mono text-xs uppercase tracking-wider text-[#C9562D]">
                            {exp.category.replace('_', ' ')}
                          </span>
                          <span className="font-serif font-medium text-lg text-[#24170F]">
                            ₹{exp.price} <span className="font-sans text-xs text-[#756B62]">/ person</span>
                          </span>
                        </div>

                        <h4 className="font-serif text-xl sm:text-2xl font-light text-[#24170F] group-hover:text-[#C9562D] transition-colors">
                          {exp.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#756B62] line-clamp-3 leading-relaxed">
                          {exp.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#756B62] pt-4 border-t border-[#D8CEBE]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C9562D]" />
                            <span>{exp.durationMinutes} minutes</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#C9562D]" />
                            <span>Max {exp.capacity} guests</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#EFE7DA]/50 border-t border-[#D8CEBE] flex items-center justify-between">
                        <span className="text-xs font-mono text-[#756B62]">
                          {exp.availabilitySchedule?.[0] || 'Scheduled on request'}
                        </span>
                        <Link to={`/experiences/${exp._id}`}>
                          <button className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs px-4 py-2 rounded-sm transition-colors flex items-center gap-1.5">
                            <span>Reserve Experience</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Knowledge Tab Content */}
            <TabsContent value="knowledge" className="space-y-6 mt-0">
              {!custodian.approvedKnowledge || custodian.approvedKnowledge.length === 0 ? (
                <div className="p-12 border border-[#D8CEBE] bg-white rounded-sm text-center text-sm text-[#756B62]">
                  No public knowledge records published yet by this custodian.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {custodian.approvedKnowledge.map((k) => (
                    <div
                      key={k._id}
                      className="bg-white border border-[#D8CEBE] rounded-sm p-6 sm:p-8 space-y-4 hover:border-[#24170F] transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[#D8CEBE] pb-3">
                          <span className="font-mono text-xs uppercase tracking-wider text-[#C9562D]">
                            {k.culturalCategory.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#EFE7DA] text-[#756B62] rounded-sm">
                            {k.sourceType.replace('_', ' ')}
                          </span>
                        </div>

                        <h4 className="font-serif text-xl font-light text-[#24170F]">
                          {k.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#756B62] line-clamp-3 leading-relaxed">
                          {k.summary}
                        </p>

                        <p className="text-xs text-[#C9562D] italic pt-2 border-t border-[#D8CEBE]">
                          Provenance: {k.sourceDetails}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#D8CEBE] flex justify-end">
                        <Link to={`/knowledge`} className="text-xs font-medium text-[#24170F] hover:text-[#C9562D] flex items-center gap-1.5 transition-colors">
                          <span>Read In Knowledge Archive</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Living Lineage & Ecosystem Tab Content */}
            <TabsContent value="ecosystem" className="space-y-6 mt-0">
              <div className="bg-white border border-[#D8CEBE] rounded-sm p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CEBE] pb-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#C9562D]">
                      Ecosystem Role & Transmission Lineage
                    </span>
                    <h3 className="font-serif text-2xl text-[#24170F]">
                      Living Custodial Heritage
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-[#F5F0E7] border border-[#D8CEBE] px-3 py-1 rounded-sm text-[#756B62]">
                    Lineage: {custodian.experienceYears} Years Documented
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-[#F5F0E7] rounded-sm space-y-2 border border-[#D8CEBE]/50">
                    <span className="font-mono text-[10px] uppercase text-[#756B62] block">
                      Autonomous Tradition
                    </span>
                    <strong className="font-serif text-base text-[#24170F] block">
                      {custodian.category.replace('_', ' ').toUpperCase()}
                    </strong>
                    <p className="text-xs text-[#756B62] leading-relaxed">
                      Practicing within the verified regional lineage of {custodian.culturalAffiliation}.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F5F0E7] rounded-sm space-y-2 border border-[#D8CEBE]/50">
                    <span className="font-mono text-[10px] uppercase text-[#756B62] block">
                      Connected Ritual Matrix
                    </span>
                    <strong className="font-serif text-base text-[#24170F] block">
                      Coastal Agro-Ritual Codes
                    </strong>
                    <p className="text-xs text-[#756B62] leading-relaxed">
                      Preserving sacred invocations, tala rhythms, or sacred crafts tied to seasonal festivals.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F5F0E7] rounded-sm space-y-2 border border-[#D8CEBE]/50">
                    <span className="font-mono text-[10px] uppercase text-[#756B62] block">
                      Linguistic Transmission
                    </span>
                    <strong className="font-serif text-base text-[#24170F] block">
                      {formatLanguages(custodian.languages)}
                    </strong>
                    <p className="text-xs text-[#756B62] leading-relaxed">
                      Transmitting oral memories and vernacular liturgical terms without synthetic loss.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#EFE7DA]/60 border border-[#D8CEBE] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#756B62] space-y-0.5">
                    <strong className="text-[#24170F] block">Explore the wider regional ecosystem:</strong>
                    <span>Connect this custodian's lineage with living ritual traditions and sacred river basins.</span>
                  </div>
                  <Link
                    to="/knowledge"
                    className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs px-4 py-2 rounded-sm transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <span>Open Rituals & Traditions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default CustodianDetailPage;
