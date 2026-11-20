import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { experienceAPI, Experience } from '@/lib/api';
import { MapPin, Clock, Users, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

const experienceCategories: Record<string, string> = {
  all: 'All Traditions',
  folk_performance: 'Yakshagana & Dance',
  craft_workshop: 'Temple Crafts & Kaavi',
  heritage_walk: 'Sacred Groves & Trails',
  traditional_cuisine: 'Heritage Cuisine',
  storytelling: 'Oral Legends & Lore'
};

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, [selectedCategory]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await experienceAPI.getAll(params);
      if (res.success) {
        setExperiences(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExperiences();
  };

  const featuredExperience = experiences.length > 0 ? experiences[0] : null;
  const secondaryExperiences = experiences.length > 1 ? experiences.slice(1) : [];

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
                  Sacred Workshops & Immersive Traditions
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#24170F] tracking-tight leading-[1.08]">
                  Authentic Cultural Experiences
                </h1>
                <p className="text-[#756B62] max-w-2xl text-base sm:text-lg font-normal leading-relaxed pt-2">
                  Step beyond passive observation. Learn ancient Kaavi mural pigments, master the rhythm codes of Tenku Thittu Yakshagana, and taste centuries-old temple culinary lineages directly alongside hereditary guardians.
                </p>
              </div>

              <div className="lg:col-span-4 border-l border-[#D8CEBE] pl-6 py-2 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#24170F]">
                  <ShieldCheck className="w-4 h-4 text-[#C9562D]" />
                  <span>Custodian Co-Creation Protocol</span>
                </div>
                <p className="text-xs text-[#756B62] leading-relaxed">
                  Every experience is limited to intimate group sizes to protect sacred sanctity and guarantee personal mentorship from lineage masters.
                </p>
              </div>
            </div>

            {/* Filter and Search Band */}
            <div className="mt-12 pt-8 border-t border-[#D8CEBE] flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(experienceCategories).map(([key, label]) => (
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
                    placeholder="Search by craft, art form, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white border-[#D8CEBE] text-xs text-[#2B211B] rounded-sm placeholder:text-[#756B62]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#C9562D] hover:bg-[#B24722] text-white px-5 text-xs font-medium rounded-sm transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* LARGE FEATURED EXPERIENCE EDITORIAL SPREAD */}
        {featuredExperience && selectedCategory === 'all' && !searchTerm && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="border border-[#D8CEBE] bg-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
              <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[480px]">
                <img
                  src={featuredExperience.images?.[0] || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000'}
                  alt={featuredExperience.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#24170F] text-[#F5F0E7] text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                  Featured Immersion
                </div>
                <div className="absolute bottom-4 right-4 bg-[#C9562D] text-white font-serif text-lg px-4 py-1.5 shadow-md">
                  ₹{featuredExperience.price} <span className="font-sans text-xs opacity-80">/ person</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-[#F5F0E7]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-[#C9562D]">
                    <span>{experienceCategories[featuredExperience.category] || featuredExperience.category}</span>
                    <span>·</span>
                    <span className="text-[#756B62]">{featuredExperience.location.city}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#24170F] leading-tight">
                    {featuredExperience.title}
                  </h2>

                  <p className="text-sm text-[#756B62] leading-relaxed line-clamp-4">
                    {featuredExperience.description}
                  </p>

                  {/* Custodian tag */}
                  {featuredExperience.custodianId && (
                    <div className="flex items-center gap-3 p-3 bg-white border border-[#D8CEBE] rounded-sm">
                      <img
                        src={featuredExperience.custodianId.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                        alt={featuredExperience.custodianId.name}
                        className="w-10 h-10 rounded-sm object-cover border border-[#D8CEBE]"
                      />
                      <div className="text-xs">
                        <span className="text-[#756B62] block">Mentored by Hereditary Custodian</span>
                        <strong className="text-[#24170F]">{featuredExperience.custodianId.name}</strong>
                      </div>
                    </div>
                  )}

                  {/* Telemetry bar */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[#756B62] pt-3 border-t border-[#D8CEBE]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C9562D]" />
                      <span>{featuredExperience.durationMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#C9562D]" />
                      <span>Intimate Group ({featuredExperience.capacity} max)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#D8CEBE] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#756B62]">
                    ★ {featuredExperience.rating ? featuredExperience.rating.toFixed(1) : '5.0'} ({featuredExperience.totalReviews || 0} reviews)
                  </span>
                  <Link to={`/experiences/${featuredExperience._id}`}>
                    <button className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm transition-colors flex items-center gap-2">
                      <span>Reserve Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Experience Listing Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#D8CEBE]">
            <h3 className="font-serif text-2xl font-light text-[#24170F]">
              Curated Heritage Catalog
            </h3>
            <span className="font-mono text-xs text-[#756B62]">
              Showing {experiences.length} verified experiences
            </span>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#C9562D] border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-base text-[#24170F]">Loading authentic experiences...</p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-20 p-8 border border-[#D8CEBE] bg-white rounded-sm">
              <h4 className="font-serif text-2xl text-[#24170F]">No experiences found</h4>
              <p className="text-xs text-[#756B62] mt-2 mb-6">
                Try selecting a different cultural tradition or clear your search query.
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
              {(selectedCategory === 'all' && !searchTerm && secondaryExperiences.length > 0 ? secondaryExperiences : experiences).map((exp) => (
                <div
                  key={exp._id}
                  className="bg-white border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#24170F] transition-all group shadow-sm"
                >
                  <div>
                    {/* Image */}
                    <div className="h-52 relative overflow-hidden bg-[#EFE7DA]">
                      <img
                        src={exp.images?.[0] || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600'}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-[#24170F] text-[#F5F0E7] text-[10px] font-mono tracking-wider uppercase px-2.5 py-1">
                        {experienceCategories[exp.category] || exp.category.replace('_', ' ')}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-[#C9562D] text-white font-serif text-sm px-3 py-1 shadow-sm">
                        ₹{exp.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h4 className="font-serif font-medium text-lg text-[#24170F] group-hover:text-[#C9562D] transition-colors line-clamp-2">
                        {exp.title}
                      </h4>

                      <p className="text-xs text-[#756B62] line-clamp-2 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Custodian tag */}
                      {exp.custodianId && (
                        <div className="flex items-center gap-2 pt-2 text-xs text-[#756B62]">
                          <img
                            src={exp.custodianId.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                            alt={exp.custodianId.name}
                            className="w-5 h-5 rounded-sm object-cover border border-[#D8CEBE]"
                          />
                          <span className="truncate">
                            By <strong className="text-[#24170F]">{exp.custodianId.name}</strong>
                          </span>
                        </div>
                      )}

                      {/* Info Bar */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#D8CEBE] text-xs font-mono text-[#756B62]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C9562D]" />
                          <span>{exp.durationMinutes}m</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C9562D]" />
                          <span>{exp.location.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-[#EFE7DA]/50 border-t border-[#D8CEBE] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#756B62]">
                      ★ {exp.rating ? exp.rating.toFixed(1) : '5.0'} ({exp.totalReviews || 0})
                    </span>
                    <Link to={`/experiences/${exp._id}`}>
                      <button className="text-xs font-medium text-[#24170F] group-hover:text-[#C9562D] flex items-center gap-1 transition-colors">
                        <span>View & Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
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

export default ExperiencesPage;
