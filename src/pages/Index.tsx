import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ExploreSection from "@/components/ExploreSection";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import TempleListView from "@/components/TempleListView";
import TempleDetailPanel from "@/components/TempleDetailPanel";
import { temples, Temple } from "@/data/temples";
import { ShieldCheck, BookOpen, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { custodianAPI, experienceAPI } from "@/lib/api";

const Index = () => {
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [custodians, setCustodians] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    // Load custodians & experiences to plot on the multi-domain cultural map
    custodianAPI
      .getAll({ verificationStatus: "VERIFIED" })
      .then((res) => {
        if (res.data) setCustodians(res.data);
      })
      .catch(() => {});

    experienceAPI
      .getAll({ status: "ACTIVE" })
      .then((res) => {
        if (res.data) setExperiences(res.data);
      })
      .catch(() => {});
  }, []);

  const nearbyTemples = useMemo(() => {
    if (!selectedTemple) return [];
    return temples
      .filter((t) => t.region === selectedTemple.region && t.id !== selectedTemple.id)
      .slice(0, 3);
  }, [selectedTemple]);

  // Featured temple for editorial highlight block
  const featuredTemple = temples.find((t) => t.id === "kadri-manjunatha-temple") || temples[0];

  const fallbackCustodians = [
    {
      _id: "sanjeeva",
      name: "Guru Bannanje Sanjeeva Suvarna",
      culturalAffiliation: "Yakshasanjeeva Yakshagana Kendra",
      profileImage: "/images/custodians/guru_sanjeeva.png",
      bio: "A celebrated master and guru of Badagutittu Yakshagana. Over 45 years preserving traditional repertoire and choreography.",
      roleTitle: "Yakshagana Master · Badagutittu"
    },
    {
      _id: "patla",
      name: "Patla Sathish Shetty",
      culturalAffiliation: "Pavanje Mela",
      profileImage: "/images/custodians/patla_sathish.jpg",
      bio: "Lead Bhagavatha and director representing the Tenkutittu Yakshagana tradition, driving high-pitched melodic narrations at regional melas.",
      roleTitle: "Lead Bhagavatha · Tenkutittu"
    },
    {
      _id: "babu_amin",
      name: "Bannanje Babu Amin",
      culturalAffiliation: "Tulu Folk Heritage Trust",
      profileImage: "/images/custodians/bannanje_babu.png",
      bio: "Veteran Tulu folk researcher and oral historian, custodian of Siri epic and Paad-dana oral recitations across coastal Tulunadu.",
      roleTitle: "Tulu Folk Historian · Siri Bard"
    },
    {
      _id: "dayananda",
      name: "Dayananda Kathalsar",
      culturalAffiliation: "Karnataka Tulu Sahitya Academy",
      profileImage: "/images/custodians/dayananda_kathalsar.png",
      bio: "Former President of Tulu Sahitya Academy, expert on Bootha Kola spirit worship, sacred groves, and indigenous folk traditions.",
      roleTitle: "Daiva Ritual Scholar · Folk Academic"
    }
  ];

  const displayedCustodians = custodians && custodians.length >= 4 ? custodians.slice(0, 4) : fallbackCustodians;

  return (
    <div className="min-h-screen bg-[#F5F0E7] text-[#2B211B]">
      <Header />
      <Hero />

      {/* ========================================================================= */}
      {/* 00. LIVING CULTURAL ECOSYSTEM GATEWAY: SACRED TAPESTRY                    */}
      {/* (Unified Pillars: Sacred Shrines, Living Rituals, Arts, Ecology & Guilds)  */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F5F0E7] text-[#2B211B] border-b border-[#D8CEBE]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#D8CEBE]">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#C9562D] block">
                Integrated Cultural Ecosystem
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B211B] tracking-tight">
                Sacred Shrines & Living Traditions
              </h2>
              <p className="text-xs sm:text-sm text-[#756B62] leading-relaxed font-light">
                Explore the interconnected spiritual and cultural continuum of Coastal Karnataka — where consecrated temple sanctums, living ritual systems, Yakshagana theatre, sacred groves, and hereditary bards unite as one living ecosystem.
              </p>
            </div>

            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 bg-[#C9562D] hover:bg-[#C9562D]/90 text-white font-sans text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-sm transition-all shrink-0 shadow-sm"
            >
              <span>Explore Cultural Archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Six Autonomous Cultural Pillars Grid with Visual Imagery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pillar 1: Sacred Shrines & Guthu Manors */}
            <a
              href="#temples"
              className="group bg-white hover:bg-white border border-[#D8CEBE] hover:border-[#C9562D] rounded-sm overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24170F]">
                  <img
                    src="/temples/udupi_krishna_real.jpg"
                    alt="Sacred Shrines & Temples"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    Sanctums
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#C9562D]">
                    <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Temples & Architecture</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2B211B] group-hover:text-[#C9562D] transition-colors">
                    Sacred Shrines & Guthu Manors
                  </h3>
                  <p className="text-xs text-[#756B62] leading-relaxed font-light">
                    Ancient stone and carved wood sanctums across Udupi, Mangalore, and Gokarna with daily puja and festival cycles.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/60 flex items-center justify-between text-xs text-[#C9562D] font-medium">
                <span>View Shrines Directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Pillar 2: Living Ritual Systems */}
            <Link
              to="/knowledge?tab=rituals"
              className="group bg-white hover:bg-white border border-[#D8CEBE] hover:border-[#C9562D] rounded-sm overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24170F]">
                  <img
                    src="https://imagesvs.oneindia.com/kn/img/2019/02/02-pic-1549784673.jpg"
                    alt="Living Ritual Traditions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    Sacred Rites
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#C9562D]">
                    <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Living Rites</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2B211B] group-hover:text-[#C9562D] transition-colors">
                    Living Ritual Traditions
                  </h3>
                  <p className="text-xs text-[#756B62] leading-relaxed font-light">
                    Nocturnal Daivaradhane (Bhoota Nema), serpentine Dakkebali & Nagamandala, and Kateel Agni Keli fire rites.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/60 flex items-center justify-between text-xs text-[#C9562D] font-medium">
                <span>Explore Living Rituals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 3: Performing Arts */}
            <Link
              to="/knowledge?tab=arts"
              className="group bg-white hover:bg-white border border-[#D8CEBE] hover:border-[#C9562D] rounded-sm overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24170F]">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Yakshagana_Artist.jpg"
                    alt="Yakshagana & Theatre"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    Performing Arts
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#C9562D]">
                    <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Classical Theatre</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2B211B] group-hover:text-[#C9562D] transition-colors">
                    Yakshagana & Theatre
                  </h3>
                  <p className="text-xs text-[#756B62] leading-relaxed font-light">
                    Northern Badagu and southern Tenku theatre styles, Talamaddale oral baithaks, and festive Pili Vesha tiger dances.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/60 flex items-center justify-between text-xs text-[#C9562D] font-medium">
                <span>Explore Arts & Instruments</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 4: Sacred Ecology */}
            <Link
              to="/knowledge?tab=ecology"
              className="group bg-white hover:bg-white border border-[#D8CEBE] hover:border-[#C9562D] rounded-sm overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24170F]">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87ya8q0_k9mBTjI65dlcSF20Jg4tnEpJsBTN77luxKA&s=10"
                    alt="Nagabanas &amp; Sacred Ecology"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    Sacred Ecology
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#C9562D]">
                    <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Climax Groves</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2B211B] group-hover:text-[#C9562D] transition-colors">
                    Nagabanas & River Sanctuaries
                  </h3>
                  <p className="text-xs text-[#756B62] leading-relaxed font-light">
                    Untouched rainforest serpent groves (Nagabanas), sacred fish rivers, and un-dammed coastal estuaries.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/60 flex items-center justify-between text-xs text-[#C9562D] font-medium">
                <span>Explore Sacred Ecology</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 5: Living Oral Epics */}
            <Link
              to="/knowledge?tab=stories"
              className="group bg-white hover:bg-white border border-[#D8CEBE] hover:border-[#C9562D] rounded-sm overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24170F]">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/74/%E0%B2%95%E0%B3%8B%E0%B2%9F%E0%B2%BF_%E0%B2%9A%E0%B3%86%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%AF.jpg"
                    alt="Paddanas & Living Epics"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    Oral Epics
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#C9562D]">
                    <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Oral Literature</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2B211B] group-hover:text-[#C9562D] transition-colors">
                    Paddanas & Living Epics
                  </h3>
                  <p className="text-xs text-[#756B62] leading-relaxed font-light">
                    The heroic epic of Koti-Chennaya, matrilineal Siri Darshana invocations, and syncretic historical lore.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/60 flex items-center justify-between text-xs text-[#C9562D] font-medium">
                <span>Read Living Epics</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 6: Living Custodians & Crafts */}
            <Link
              to="/custodians"
              className="group bg-white hover:bg-white border border-[#D8CEBE] hover:border-[#C9562D] rounded-sm overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24170F]">
                  <img
                    src="https://i.ytimg.com/vi/D3dkX7UFDgg/maxresdefault.jpg"
                    alt="Hereditary Lineages & Crafts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                    Lineage Guardians
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#C9562D]">
                    <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Guilds & Lineages</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2B211B] group-hover:text-[#C9562D] transition-colors">
                    Hereditary Custodians & Crafts
                  </h3>
                  <p className="text-xs text-[#756B62] leading-relaxed font-light">
                    Hereditary archaks, Kaavi muralists, headdress sculptors, and community elders preserving oral heritage.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-[#D8CEBE]/60 flex items-center justify-between text-xs text-[#C9562D] font-medium">
                <span>Meet Lineage Keepers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 01. EDITORIAL INTRODUCTION: THE FOUR PILLARS AS A MIXED COMPOSITION     */}
      {/* (Pale Parchment Background #EFE7DA — Section 10 & 26 rhythm)             */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#EFE7DA] border-b border-[#D8CEBE]" id="places">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Two-Column Editorial Thesis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 pb-12 border-b border-[#D8CEBE]">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#C9562D] block">
                Living Heritage Ecosystem
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.08] text-[#2B211B] tracking-tight">
                More than Monuments:<br />
                <span className="italic text-[#756B62]">Living Culture & Traditions</span>
              </h2>
            </div>
            
            <div className="lg:col-span-6 flex flex-col justify-end space-y-4 text-[#756B62] font-sans text-sm sm:text-base leading-relaxed font-light">
              <p>
                In Coastal Karnataka, a temple is never merely a stone relic of the past. It is an active cultural ecosystem where centuries-old rituals, classical rhythm codes, sacred metallurgy, and oral histories are kept alive daily by traditional custodians.
              </p>
              <p>
                CultureVerse unites sacred shrines, verified practitioners, and authentic studio masterclasses into a single, practitioner-governed cultural discovery platform.
              </p>
            </div>
          </div>

          {/* Mixed Editorial Composition (1 Large Image Feature + 2 Quiet Text Features + 1 Supporting Story Tile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 1. Large Image-Led Feature: Sacred Temples (7 cols) */}
            <div className="lg:col-span-7 bg-[#F5F0E7] border border-[#D8CEBE] rounded-sm overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#24170F]">
                <img
                  src="/temples/udupi_krishna_real.jpg"
                  alt="Sacred Temples & Sanctums"
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24170F]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 bg-[#24170F]/80 backdrop-blur-sm px-3 py-1 rounded-sm text-white text-[11px] font-sans uppercase tracking-wider">
                  01 · Sanctum Registry
                </div>
              </div>
              
              <div className="p-8 sm:p-10 space-y-4">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#2B211B]">
                  Sacred Temples & Architectural Topography
                </h3>
                <p className="font-sans text-sm text-[#756B62] leading-relaxed font-light">
                  Discover over 15 classical pilgrimage centers spanning Mangalore, Udupi, and Kundapura. Explore consecrated sanctums, daily puja and darshan schedules, and historical vastu architecture.
                </p>
                <a
                  href="#temples"
                  className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider font-semibold text-[#C9562D] hover:text-[#C9562D]/80 transition-colors pt-2"
                >
                  <span>Explore Temple Shrines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2 & 4. Two Quiet Text Features + 1 Supporting Story Tile (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              
              {/* Feature A: Living Custodians */}
              <div className="bg-[#F5F0E7] border border-[#D8CEBE] p-8 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#C9562D] font-medium">
                    02 · Lineage Keepers
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#C9562D]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#2B211B]">
                  Living Cultural Custodians
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#756B62] leading-relaxed font-light">
                  Connect with hereditary archaks, Yakshagana gurus, bronze sculptors, and community elders preserving unbroken coastal traditions without commercial brokers.
                </p>
                <Link
                  to="/custodians"
                  className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider font-medium text-[#2B211B] hover:text-[#C9562D] transition-colors pt-1"
                >
                  <span>Meet the Custodians</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C9562D]" />
                </Link>
              </div>

              {/* Feature B: Supporting Artisan/Experience Tile */}
              <div className="bg-[#C9562D] text-white p-8 rounded-sm space-y-4 relative overflow-hidden flex-1 flex flex-col justify-between shadow-sm">
                <div className="space-y-3 relative z-10">
                  <span className="text-[11px] font-sans uppercase tracking-widest text-white/80 font-medium block">
                    03 · Authentic Immersion
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-white">
                    Masterclasses & Living Experiences
                  </h3>
                  <p className="font-sans text-xs text-white/90 leading-relaxed font-light">
                    Participate in intimate Yakshagana mineral banna sessions, Kaavi sgraffito workshops, and sacred grove botanical walks hosted inside authentic master studios.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-sans text-white relative z-10">
                  <Link
                    to="/experiences"
                    className="text-white hover:underline uppercase tracking-wider font-semibold inline-flex items-center gap-1"
                  >
                    <span>Browse Experiences</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] text-white/70 uppercase">Capped Capacity</span>
                </div>
              </div>

              {/* Feature C: Verified Knowledge */}
              <div className="bg-[#F5F0E7] border border-[#D8CEBE] p-8 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#C9562D] font-medium">
                    04 · Oral Provenance
                  </span>
                  <BookOpen className="w-4 h-4 text-[#C9562D]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#2B211B]">
                  Verified Cultural Archive
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#756B62] leading-relaxed font-light">
                  Explore living oral traditions, sacred folklore, and ritual codes directly vetted by lineage guardians. Governed by zero-hallucination protocols.
                </p>
                <Link
                  to="/knowledge"
                  className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider font-medium text-[#2B211B] hover:text-[#C9562D] transition-colors pt-1"
                >
                  <span>Open Knowledge Archive</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C9562D]" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. TERRACOTTA FEATURE BAND: DIRECT PRESERVATION & GUARDIAN COVENANT     */}
      {/* (Burnt Terracotta Background #C9562D — Section 27 rhythm)                 */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#C9562D] text-white border-b border-[#3B291D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-white/80 font-medium block">
                Direct Cultural Preservation Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight">
                85% of every booking fee directly sustains traditional custodian lineages.
              </h2>
              <p className="font-sans text-sm sm:text-base text-white/90 font-light max-w-2xl leading-relaxed">
                When you reserve an authentic masterclass or explore traditional knowledge, your contribution directly finances custodian families, ritual materials, and indigenous guild trusts under transparent ledger scrutiny.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
              <Link to="/apply-custodian" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-[#24170F] hover:bg-[#24170F]/80 text-[#F5F0E7] font-sans text-xs uppercase tracking-wider font-semibold px-6 py-4 rounded-sm transition-colors shadow-sm text-center"
                >
                  Apply as Cultural Custodian →
                </button>
              </Link>
              
              <Link
                to="/custodians"
                className="font-sans text-xs uppercase tracking-wider text-white/85 hover:text-white underline underline-offset-4"
              >
                Meet Verified Guild Guardians ↗
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. FEATURED TEMPLE EDITORIAL SPREAD                                      */}
      {/* (Warm Ivory Background #F5F0E7 — Section 12 rhythm)                       */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#F5F0E7] text-[#2B211B] border-b border-[#D8CEBE]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#C9562D] block mb-2">
              Featured Sanctum Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B211B] tracking-tight">
              Kadri Manjunatha: Ten Centuries of Living Consecration
            </h2>
            <p className="font-sans text-sm text-[#756B62] mt-2 max-w-xl">
              Nestled on the slopes of Kadri Hills in Mangalore, this sacred sanctuary unites ancient Buddhist bronze sculpture, Natha pantha hermitage, and Shaivite pilgrimage.
            </p>
          </div>

          <div className="bg-[#EFE7DA] border border-[#D8CEBE] rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
            {/* Full-bleed Photo */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px] bg-[#24170F]">
              <img
                src="/temples/kadri.png"
                alt={featuredTemple.name}
                className="w-full h-full object-cover object-center grayscale contrast-110 hover:grayscale-0 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24170F]/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white text-xs font-sans">
                <div className="flex items-center gap-1.5 bg-[#24170F]/80 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#D9782A]" />
                  <span>Kadri Hills, Mangalore · Dakshina Kannada</span>
                </div>
                <span className="text-[#EFE7DA] bg-[#24170F]/80 backdrop-blur-sm px-2.5 py-1.5 rounded-sm uppercase tracking-wider text-[10px]">
                  10th Century CE
                </span>
              </div>
            </div>

            {/* Editorial Narrative */}
            <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C9562D] font-medium border-b border-[#D8CEBE] pb-2 flex items-center justify-between">
                  <span>Presiding Deity</span>
                  <span>Lord Manjunatha (Shiva)</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#2B211B] leading-tight">
                  {featuredTemple.name}
                </h3>

                <p className="font-sans text-sm text-[#756B62] leading-relaxed font-light">
                  Renowned for housing the celebrated bronze statue of Lokeshwara, cast in 968 CE under the Alupa monarch Kundavarma. Seven natural spring-fed water tanks (Gomukha) flow continuously from the hill into the temple courtyard, sustaining centuries of unbroken rites.
                </p>

                <div className="text-xs font-sans text-[#756B62] space-y-1.5 pt-3 border-t border-[#D8CEBE]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2B211B] font-medium">Sacred Tanks:</span>
                    <span>7 Natural Springs (Gomukha)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#2B211B] font-medium">Lineage Tradition:</span>
                    <span>Natha Pantha & Alupa Royal Heritage</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4 border-t border-[#D8CEBE]">
                <Link to={`/temple/${featuredTemple.id}`}>
                  <button
                    type="button"
                    className="bg-[#C9562D] hover:bg-[#C9562D]/90 text-white font-sans text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-sm transition-colors inline-flex items-center gap-2"
                  >
                    <span>View Sanctum Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                
                <a
                  href="#temples"
                  className="font-sans text-xs uppercase tracking-wider text-[#756B62] hover:text-[#2B211B] transition-colors"
                >
                  All Temples ↓
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. MAP TOPOGRAPHY & SANCTUM DIRECTORY                                    */}
      {/* (Warm Ivory Background #F5F0E7 — Section 16 rhythm)                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F5F0E7] text-[#2B211B] border-b border-[#D8CEBE]" id="temples">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-[#D8CEBE] gap-4">
            <div>
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#C9562D] block mb-1">
                Cartographic Registry
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B211B]">
                Coastal Shrines & Cultural Topography
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#756B62] max-w-md font-light">
              Toggle map layers to locate sacred shrines, verified artisan guilds, and active masterclass studios across Mangalore and Udupi.
            </p>
          </div>

          {/* Mobile view toggle */}
          <div className="flex justify-center gap-2 mb-4 md:hidden font-sans text-xs">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex-1 py-2 rounded-sm border transition-colors ${
                viewMode === "map"
                  ? "bg-[#24170F] text-[#F5F0E7] border-[#24170F] font-semibold"
                  : "bg-[#EFE7DA] text-[#756B62] border-[#D8CEBE]"
              }`}
            >
              Interactive Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex-1 py-2 rounded-sm border transition-colors ${
                viewMode === "list"
                  ? "bg-[#24170F] text-[#F5F0E7] border-[#24170F] font-semibold"
                  : "bg-[#EFE7DA] text-[#756B62] border-[#D8CEBE]"
              }`}
            >
              Sanctum Index
            </button>
          </div>

          {/* Desktop split view, Mobile stacked */}
          <div className="border border-[#D8CEBE] bg-[#EFE7DA] rounded-sm overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row h-[640px]">
              {/* Map View */}
              <div className={`${viewMode === "map" ? "block" : "hidden"} md:block md:w-[55%] h-full relative`}>
                <MapView
                  temples={temples}
                  selectedTemple={selectedTemple}
                  onTempleSelect={setSelectedTemple}
                  custodians={custodians}
                  experiences={experiences}
                />
              </div>

              {/* List View */}
              <div className={`${viewMode === "list" ? "block" : "hidden"} md:block md:w-[45%] h-full border-t md:border-t-0 md:border-l border-[#D8CEBE] bg-[#F5F0E7]`}>
                <TempleListView
                  temples={temples}
                  selectedTemple={selectedTemple}
                  onTempleSelect={setSelectedTemple}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. CUSTODIAN SPOTLIGHT: THE PEOPLE WHO KEEP CULTURE ALIVE                */}
      {/* (Cream Background #EFE7DA — Section 14 rhythm)                            */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#EFE7DA] border-b border-[#D8CEBE]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14">
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#C9562D] block mb-2">
              The People Who Keep Culture Alive
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B211B] tracking-tight">
              Meet the custodians behind living traditions.
            </h2>
            <p className="font-sans text-sm text-[#756B62] mt-2 max-w-xl font-light">
              Traditional knowledge in Coastal Karnataka survives through dedicated individuals—hereditary priests, master performers, indigenous artisans, and community bards.
            </p>
          </div>

          {/* Custodians Editorial Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedCustodians.map((c) => (
              <Link
                key={c._id || c.name}
                to={c._id && c._id.length === 24 ? `/custodians/${c._id}` : "/custodians"}
                className="bg-[#F5F0E7] border border-[#D8CEBE] rounded-sm p-5 space-y-4 hover:border-[#C9562D] transition-colors group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-square w-full overflow-hidden rounded-sm bg-[#24170F]">
                    <img
                      src={c.profileImage || "/images/custodians/generic_avatar.png"}
                      alt={c.name}
                      className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#C9562D] text-[11px] font-sans font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Custodian</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-[#2B211B] mt-1 group-hover:text-[#C9562D] transition-colors line-clamp-1">
                      {c.name}
                    </h3>
                    <p className="font-sans text-xs text-[#756B62] mt-0.5 line-clamp-1">
                      {c.culturalAffiliation || c.category?.replace('_', ' ')}
                    </p>
                  </div>
                  <p className="font-sans text-xs text-[#756B62] leading-relaxed font-light line-clamp-3">
                    {c.bio || c.traditionPractice}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D8CEBE] flex items-center justify-between text-xs font-sans text-[#C9562D] font-medium">
                  <span>View Lineage Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/custodians">
              <button
                type="button"
                className="bg-[#24170F] hover:bg-[#C9562D] text-white font-sans text-xs uppercase tracking-wider font-semibold px-8 py-3.5 rounded-sm transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Full Custodian Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. THE SANCTUM ORACLE (RANDOM DISCOVERY MOMENT — Section 17)             */}
      {/* ========================================================================= */}
      <ExploreSection />

      {/* ========================================================================= */}
      {/* 07. DARK EARTHY COLOPHON FOOTER (Section 32)                             */}
      {/* ========================================================================= */}
      <Footer />

      {/* Temple Detail Panel */}
      {selectedTemple && (
        <TempleDetailPanel
          temple={selectedTemple}
          onClose={() => setSelectedTemple(null)}
          nearbyTemples={nearbyTemples}
        />
      )}
    </div>
  );
};

export default Index;
