import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { custodianAPI, Custodian } from '@/lib/api';
import { ShieldCheck, MapPin, Search, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

const categoryLabels: Record<string, string> = {
  all: 'All Traditions',
  folk_performer: 'Folk Performers & Dance',
  artisan: 'Sacred Artisans & Crafts',
  historian: 'Oral Historians & Lineages',
  temple_custodian: 'Temple Priests & Archaks',
  knowledge_holder: 'Traditional Knowledge Keepers'
};

const languageLabels: Record<string, string> = {
  kn: 'Kannada',
  tcy: 'Tulu',
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kok: 'Konkani',
  ur: 'Urdu',
  sa: 'Sanskrit'
};

const formatLanguages = (langs: string[]): string =>
  langs.map(l => languageLabels[l] || l).join(', ');

const CustodiansPage = () => {
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustodians();
  }, [selectedCategory]);

  const fetchCustodians = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await custodianAPI.getAll(params);
      if (res.success) {
        setCustodians(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch custodians:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustodians();
  };

  const featuredCustodian = custodians.length > 0 ? custodians[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* Editorial Introduction Section */}
        <section className="border-b border-[#D8CEBE] bg-[#EFE7DA]/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8 space-y-4">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9562D] block">
                  The People Who Keep Culture Alive
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#24170F] tracking-tight leading-[1.08]">
                  Meet the custodians behind living traditions.
                </h1>
                <p className="text-[#756B62] max-w-2xl text-base sm:text-lg font-normal leading-relaxed pt-2">
                  Behind every temple sanctum, ritual cadence, and folk theater epic is a lineage keeper. CultureVerse provides direct provenance and fair economic remuneration to coastal Karnataka&apos;s hereditary practitioners.
                </p>
              </div>

              <div className="lg:col-span-4 border-l border-[#D8CEBE] pl-6 py-2 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#24170F]">
                  <ShieldCheck className="w-4 h-4 text-[#C9562D]" />
                  <span>85% Direct Remuneration Standard</span>
                </div>
                <p className="text-xs text-[#756B62] leading-relaxed">
                  All consultations, oral history archives, and private heritage experiences directly support the custodian&apos;s household and apprentices.
                </p>
                <div className="pt-2">
                  <Link
                    to="/apply-custodian"
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#C9562D] hover:underline"
                  >
                    <span>Register as a Heritage Practitioner</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Filter and Search Band */}
            <div className="mt-12 pt-8 border-t border-[#D8CEBE] flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
              {/* Category selector */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`text-xs px-4 py-2 border rounded-sm transition-colors ${
                      selectedCategory === key
                        ? 'bg-[#24170F] text-[#F5F0E7] border-[#24170F]'
                        : 'bg-white/60 text-[#756B62] border-[#D8CEBE] hover:border-[#24170F] hover:text-[#24170F]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#756B62]" />
                  <Input
                    placeholder="Search by name, lineage, tradition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white border-[#D8CEBE] text-xs text-[#2B211B] rounded-sm placeholder:text-[#756B62]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#C9562D] hover:bg-[#B24722] text-white px-5 text-xs font-medium rounded-sm transition-colors"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Custodian Story Spread (if any) */}
        {featuredCustodian && selectedCategory === 'all' && !searchTerm && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="border border-[#D8CEBE] bg-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
              <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-auto min-h-[320px]">
                <img
                  src={featuredCustodian.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800'}
                  alt={featuredCustodian.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#24170F] text-[#F5F0E7] text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                  Featured Hereditary Guardian
                </div>
              </div>

              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-[#F5F0E7]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#C9562D]">
                      {categoryLabels[featuredCustodian.category] || featuredCustodian.category}
                    </span>
                    <span className="text-[#D8CEBE]">·</span>
                    <span className="text-xs text-[#756B62] font-mono">
                      {featuredCustodian.location.city}, {featuredCustodian.location.region}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#24170F]">
                    {featuredCustodian.name}
                  </h2>

                  <p className="font-serif text-sm text-[#C9562D] italic">
                    {featuredCustodian.culturalAffiliation}
                  </p>

                  <p className="text-sm text-[#756B62] leading-relaxed line-clamp-4">
                    {featuredCustodian.bio}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#24170F] font-mono border-t border-[#D8CEBE]">
                    <span>Lineage: <strong>{featuredCustodian.experienceYears} Years</strong></span>
                    <span>·</span>
                    <span>Languages: <strong>{formatLanguages(featuredCustodian.languages)}</strong></span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#D8CEBE] flex items-center justify-between">
                  <span className="text-xs text-[#756B62]">
                    Community Rating: ★ {featuredCustodian.rating ? featuredCustodian.rating.toFixed(1) : '5.0'} ({featuredCustodian.totalReviews || 0} reviews)
                  </span>
                  <Link
                    to={`/custodians/${featuredCustodian._id}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#24170F] hover:text-[#C9562D] transition-colors"
                  >
                    <span>Read Dossier & Hosted Experiences</span>
                    <ArrowRight className="w-4 h-4 text-[#C9562D]" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Custodian Archive Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#D8CEBE]">
            <h3 className="font-serif text-2xl font-light text-[#24170F]">
              Practitioners Directory
            </h3>
            <span className="font-mono text-xs text-[#756B62]">
              Showing {custodians.length} verified custodians
            </span>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#C9562D] border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-base text-[#24170F]">Consulting verified custodian records...</p>
            </div>
          ) : custodians.length === 0 ? (
            <div className="text-center py-20 p-8 border border-[#D8CEBE] bg-white rounded-sm">
              <h4 className="font-serif text-2xl text-[#24170F]">No custodians found</h4>
              <p className="text-xs text-[#756B62] mt-2 mb-6">
                Try selecting another category or clear your search term.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                className="bg-[#24170F] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm hover:bg-[#C9562D] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'all' && !searchTerm && featuredCustodian ? custodians.slice(1) : custodians).map((c) => (
                <div
                  key={c._id}
                  className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#24170F] transition-all group"
                >
                  <div className="p-6">
                    <div className="flex gap-4 items-start">
                      <img
                        src={c.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                        alt={c.name}
                        className="w-16 h-16 rounded-sm object-cover border border-[#D8CEBE] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-serif font-medium text-lg text-[#24170F] truncate group-hover:text-[#C9562D] transition-colors">
                            {c.name}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C9562D] shrink-0" title="Verified Custodian" />
                        </div>
                        <p className="text-xs font-serif text-[#C9562D] truncate">
                          {c.culturalAffiliation}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#756B62] mt-1 font-mono">
                          <MapPin className="w-3 h-3" />
                          <span>{c.location.city}, {c.location.region}</span>
                          <span>·</span>
                          <span>{c.experienceYears}y</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#756B62] mt-4 line-clamp-3 leading-relaxed">
                      {c.bio}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#D8CEBE] flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#756B62]">
                        {categoryLabels[c.category] || c.category}
                      </span>
                      <span className="font-mono text-[#756B62]">
                        {formatLanguages(c.languages.slice(0, 2))}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 bg-[#EFE7DA]/50 border-t border-[#D8CEBE] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#756B62]">
                      ★ {c.rating ? c.rating.toFixed(1) : '5.0'} ({c.totalReviews || 0})
                    </span>
                    <Link
                      to={`/custodians/${c._id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#24170F] group-hover:text-[#C9562D] transition-colors"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default CustodiansPage;
