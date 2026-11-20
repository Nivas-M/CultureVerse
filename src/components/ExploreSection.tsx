import { useState } from "react";
import { temples, Temple } from "@/data/temples";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Compass, ArrowRight, MapPin } from "lucide-react";

const ExploreSection = () => {
  const { language } = useLanguage();
  // Default to a featured temple on load so it is immediately visual and image-led
  const [revealedTemple, setRevealedTemple] = useState<Temple>(
    temples.find((t) => t.id === "kollur-mookambika-temple") || temples[0]
  );

  const revealRandomTemple = () => {
    const remaining = temples.filter((t) => t.id !== revealedTemple.id);
    const randomIndex = Math.floor(Math.random() * remaining.length);
    setRevealedTemple(remaining[randomIndex]);
  };

  return (
    <section id="explore" className="py-24 bg-[#F5F0E7] text-[#2B211B] border-b border-[#D8CEBE]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#C9562D] block mb-2">
            The Sanctum Oracle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B211B] tracking-tight">
            {language === 'kn' ? 'ದೇವಾಲಯ ಆವಿಷ್ಕಾರ' : 'Serendipitous Heritage Discovery'}
          </h2>
          <p className="font-sans text-sm text-[#756B62] mt-2 max-w-xl">
            Draw a random consecrated sanctum from across Coastal Karnataka to explore its architectural origins, sacred legends, and living rituals.
          </p>
        </div>

        {/* Large Visual Discovery Moment (Image + Editorial Text Split) */}
        <div className="bg-[#EFE7DA] border border-[#D8CEBE] rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          
          {/* Large Temple Photograph (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px] bg-[#24170F] overflow-hidden">
            <img
              src={revealedTemple.image && revealedTemple.image !== '/placeholder.svg' ? revealedTemple.image : "/temples/kadri.png"}
              alt={revealedTemple.name}
              className="w-full h-full object-cover object-center grayscale contrast-110 hover:grayscale-0 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#24170F]/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white text-xs font-sans">
              <div className="flex items-center gap-1.5 bg-[#24170F]/80 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                <MapPin className="w-3.5 h-3.5 text-[#D9782A]" />
                <span>{revealedTemple.location} · {revealedTemple.region}</span>
              </div>
              <span className="text-white/75 bg-[#24170F]/80 backdrop-blur-sm px-2.5 py-1.5 rounded-sm uppercase tracking-wider text-[10px]">
                Active Sanctum
              </span>
            </div>
          </div>

          {/* Editorial Story & Discovery Action (5 cols) */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C9562D] font-medium border-b border-[#D8CEBE] pb-2 flex items-center justify-between">
                <span>Principal Deity</span>
                <span>{revealedTemple.deity}</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#2B211B] leading-tight">
                {revealedTemple.name}
              </h3>

              <p className="font-sans text-sm text-[#756B62] leading-relaxed">
                {revealedTemple.description}
              </p>

              {revealedTemple.openingHours && (
                <div className="pt-2 text-xs font-sans text-[#756B62] space-y-1 border-t border-[#D8CEBE] pt-3">
                  <span className="font-medium text-[#2B211B] uppercase tracking-wider text-[10px] block">Darshan Schedule</span>
                  <p>{revealedTemple.openingHours[0]?.hours || "6:00 AM – 12:30 PM & 5:30 PM – 8:00 PM"}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-[#D8CEBE]">
              <Link to={`/temple/${revealedTemple.id}`}>
                <button
                  type="button"
                  className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] font-sans text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-sm transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Sanctum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              <button
                type="button"
                onClick={revealRandomTemple}
                className="bg-transparent hover:bg-[#F5F0E7] text-[#C9562D] border border-[#C9562D]/40 font-sans text-xs uppercase tracking-wider font-medium px-4 py-3 rounded-sm transition-colors inline-flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover Another</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ExploreSection;
