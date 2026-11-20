import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { temples } from "@/data/temples";
import { templeDescriptions } from "@/data/translations/templeDescriptions";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TempleReviews from "@/components/TempleReviews";
import FavoriteButton from "@/components/FavoriteButton";
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Calendar,
  Share2,
  Navigation,
  ArrowRight,
  Compass
} from "lucide-react";
import templeImage1 from "@/assets/temple-card-1.jpg";
import templeImage2 from "@/assets/temple-card-2.jpg";
import { toast } from "sonner";
import { CulturalAIAssistant } from "@/components/CulturalAIAssistant";

const TempleDetail = () => {
  const { id } = useParams();
  const temple = temples.find((t) => t.id === id);
  const { language, translate } = useLanguage();

  // Memoize the full story to prevent recalculation on every render
  const fullStory = useMemo(() => {
    if (!temple) return '';

    // Map temple ID to description key
    const baseId = temple.id.replace('-temple', '').replace('-shri-', '').replace('shri-', '');
    const firstWord = baseId.split('-')[0];
    const descriptionKey = `temple.${firstWord}`;
    const fullStoryKey = `${descriptionKey}.full`;

    if (templeDescriptions[fullStoryKey]) {
      const story = templeDescriptions[fullStoryKey][language];
      if (story) return story;
    }

    return temple.description;
  }, [temple, language]);

  if (!temple) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-light text-[#24170F] mb-4">Temple Not Found</h1>
            <Link to="/">
              <button className="bg-[#24170F] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm hover:bg-[#C9562D] transition-colors">
                Return to Index
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const templeIndex = temples.findIndex((t) => t.id === id);
  const displayImage = temple.image && temple.image !== '/placeholder.svg'
    ? temple.image
    : (templeIndex % 2 === 0 ? templeImage1 : templeImage2);

  const nearbyTemples = temples
    .filter((t) => t.region === temple.region && t.id !== temple.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: temple.name,
        text: temple.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDirections = () => {
    toast.info("Opening directions in Google Maps...");
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(
        temple.name + " " + temple.location
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />

      {/* Editorial Temple Hero Banner */}
      <section className="relative h-[65vh] min-h-[460px] max-h-[640px] mt-16 md:mt-20 overflow-hidden bg-[#24170F]">
        <img
          src={displayImage}
          alt={temple.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#24170F] via-[#24170F]/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="max-w-7xl mx-auto space-y-4">
            <Link to="/">
              <button
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F5F0E7]/80 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sanctum Index</span>
              </button>
            </Link>

            <div className="space-y-3 max-w-4xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-[#C9562D] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-sm">
                  {temple.region}
                </span>
                <span className="text-xs font-mono tracking-wider uppercase text-[#D8CEBE] flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#D9782A]" />
                  <span>Presiding Deity: {temple.deity}</span>
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#F5F0E7] leading-tight">
                {temple.name}
              </h1>

              <div className="flex items-center gap-2 text-sm font-mono text-[#D8CEBE]">
                <MapPin className="h-4 w-4 text-[#C9562D]" />
                <span>{temple.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Editorial Content Spread */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Narrative Column (~65% width) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Action Toolbar */}
              <div className="flex gap-3 flex-wrap border-b border-[#D8CEBE] pb-6">
                <button
                  onClick={handleDirections}
                  className="bg-[#C9562D] hover:bg-[#B24722] text-white text-xs px-5 py-2.5 rounded-sm transition-colors inline-flex items-center gap-2 font-medium shadow-sm"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Pilgrimage Directions</span>
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white border border-[#D8CEBE] hover:border-[#24170F] text-[#24170F] text-xs px-4 py-2.5 rounded-sm transition-colors inline-flex items-center gap-2"
                >
                  <Share2 className="h-3.5 w-3.5 text-[#756B62]" />
                  <span>Share Chronicle</span>
                </button>
                <FavoriteButton
                  templeId={temple.id}
                  variant="outline"
                  size="default"
                  className="gap-2 rounded-sm border-[#D8CEBE] bg-white text-xs"
                />
              </div>

              {/* Main Architectural & Sacred Chronicle */}
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C9562D] block">
                  Sacred Chronicle & Historical Lineage
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#24170F]">
                  About {temple.name}
                </h2>
                <div className="text-base sm:text-lg text-[#2B211B] leading-relaxed font-serif whitespace-pre-line pt-2">
                  {fullStory}
                </div>
              </div>

              {/* Living Cultural Ecosystem & Connected Traditions Section */}
              <div className="border border-[#D8CEBE] bg-white p-8 rounded-sm space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D8CEBE] pb-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9562D]">
                    <Sparkles className="w-4 h-4" />
                    <span>Living Cultural Ecosystem</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#756B62]">Biocultural Anchor</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-[#F5F0E7] rounded-sm space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#756B62] block">Connected Ritual System</span>
                    <strong className="text-[#24170F] font-serif text-sm block">Living Liturgies & Rites</strong>
                    <p className="text-[11px] text-[#756B62] leading-tight pt-1">
                      Part of Coastal Karnataka's synchronized agro-ritual calendar and Daiva invocations.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#F5F0E7] rounded-sm space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#756B62] block">Sacred Hydrology</span>
                    <strong className="text-[#24170F] font-serif text-sm block">Protected River Basins</strong>
                    <p className="text-[11px] text-[#756B62] leading-tight pt-1">
                      Confluent with Western Ghats sacred springs, Nagabanas, and estuarine waters.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#F5F0E7] rounded-sm space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#756B62] block">Living Custodianship</span>
                    <strong className="text-[#24170F] font-serif text-sm block">Hereditary Guilds</strong>
                    <p className="text-[11px] text-[#756B62] leading-tight pt-1">
                      Preserved across generations by regional artisan, agricultural, and priestly lineages.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#D8CEBE]/60">
                  <span className="text-[#756B62]">Discover how this shrine connects with regional performing arts and oral epics:</span>
                  <Link
                    to="/knowledge"
                    className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-[#C9562D] hover:underline font-semibold"
                  >
                    <span>Explore Rituals & Traditions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Annual Festivals and Poojas Section */}
              <div className="border border-[#D8CEBE] bg-[#EFE7DA]/60 p-8 rounded-sm space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#C9562D]" />
                  <h3 className="font-serif text-2xl font-light text-[#24170F]">
                    Annual Observances & Special Poojas
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#756B62] leading-relaxed">
                  The sanctum follows coastal liturgical agamas with major celebrations during annual Rathotsavas, Deepotsavas, and seasonal Navaratri rituals. Consult our living festival calendar for specific lunar muhurthas.
                </p>
                <Link
                  to="/calendar"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9562D] hover:underline pt-2 font-medium"
                >
                  <span>Explore Living Calendar Cycle</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Reviews and Community Testimonies */}
              <div className="pt-8 border-t border-[#D8CEBE]">
                <TempleReviews templeId={temple.id} />
              </div>
            </div>

            {/* Right Telemetry & Regional Context Sidebar (~35% width, sticky) */}
            <div className="lg:col-span-4 sticky top-28 space-y-8">
              {/* Telemetry Card */}
              <div className="border border-[#D8CEBE] bg-white p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#756B62] block border-b border-[#D8CEBE] pb-3">
                  Epigraphic Telemetry
                </span>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-[#756B62] block">PRESIDING DEITY</span>
                    <strong className="text-[#24170F] text-sm font-serif font-normal block mt-1">
                      {translate(temple.deity)}
                    </strong>
                  </div>

                  <div className="pt-3 border-t border-[#D8CEBE]">
                    <span className="text-[#756B62] block">HISTORICAL REGION</span>
                    <strong className="text-[#24170F] text-sm block mt-1">
                      {translate(temple.region)}
                    </strong>
                  </div>

                  <div className="pt-3 border-t border-[#D8CEBE]">
                    <span className="text-[#756B62] block">PILGRIMAGE DESTINATION</span>
                    <strong className="text-[#24170F] text-sm block mt-1">
                      {translate(temple.location)}
                    </strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8CEBE]">
                  <button
                    onClick={handleDirections}
                    className="w-full bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Compass className="h-4 w-4 text-[#D9782A]" />
                    <span>Navigate Pilgrimage Route</span>
                  </button>
                </div>
              </div>

              {/* Nearby Shrines in Circuit */}
              {nearbyTemples.length > 0 && (
                <div className="border border-[#D8CEBE] bg-white p-6 rounded-sm shadow-sm space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#756B62] block border-b border-[#D8CEBE] pb-3">
                    Connected Circuit in {temple.region}
                  </span>

                  <div className="space-y-4">
                    {nearbyTemples.map((nearby) => (
                      <Link
                        key={nearby.id}
                        to={`/temple/${nearby.id}`}
                        className="group block p-3 bg-[#F5F0E7]/60 hover:bg-[#EFE7DA] border border-[#D8CEBE] rounded-sm transition-colors"
                      >
                        <h4 className="font-serif text-base text-[#24170F] group-hover:text-[#C9562D] transition-colors leading-tight">
                          {nearby.name}
                        </h4>
                        <span className="text-[11px] font-mono text-[#756B62] mt-1 block">
                          {nearby.location}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default TempleDetail;
