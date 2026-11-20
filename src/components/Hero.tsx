import { ArrowRight, Compass, ShieldCheck, Sparkles, BookOpen, Flame, Trees, Theater } from "lucide-react";
import heroImage from "@/assets/hero-temple.jpg";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { language } = useLanguage();

  const scrollToPlaces = () => {
    const placesSection = document.getElementById("places") || document.getElementById("temples");
    placesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#F5F0E7] text-[#2B211B] pt-24 lg:pt-28 pb-0 overflow-hidden border-b border-[#D8CEBE]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical Editorial Composition (58% / 42% Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[580px] lg:min-h-[640px]">
          
          {/* Main Cultural Narrative Block (7 cols ~ 58%) */}
          <div className="lg:col-span-7 relative flex flex-col justify-end p-6 sm:p-10 lg:p-14 overflow-hidden rounded-sm bg-[#24170F]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/28/Yakshagana_Performance_at_NINASAM_%28India_Theatre_Forum_Stuyd_Tour_May_2013%29_%288765323722%29.jpg"
              alt="Coastal Karnataka Living Culture"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-70 hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#24170F]/95 via-[#24170F]/60 to-transparent pointer-events-none" />

            {/* Content sitting within the image */}
            <div className="relative z-10 space-y-5 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#EFE7DA]/80 border-b border-[#EFE7DA]/30 pb-1">
                <span>Coastal Karnataka Biocultural Watershed</span>
                <span>·</span>
                <span>Dakshina Kannada · Udupi · Uttara Kannada</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-normal leading-[1.04] tracking-[-0.03em] text-white">
                {language === 'kn' ? (
                  <>
                    ಕರಾವಳಿ ಕರ್ನಾಟಕದ<br />
                    <span className="italic font-light text-[#EFE7DA]">ಪವಿತ್ರ ದೇವಾಲಯಗಳು ಮತ್ತು ಸಂಸ್ಕೃತಿ</span>
                  </>
                ) : (
                  <>
                    Sacred Shrines &<br />
                    <span className="italic font-light text-[#EFE7DA]">Living Culture</span>
                  </>
                )}
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#EFE7DA]/90 font-light max-w-xl leading-relaxed">
                {language === 'kn'
                  ? 'ಕರಾವಳಿ ಕರ್ನಾಟಕದ ಪವಿತ್ರ ದೇವಾಲಯಗಳು, ಯಕ್ಷಗಾನ, ದೈವಾರಾಧನೆ, ನಾಗಬನಗಳು ಮತ್ತು ಪಾರಂಪರಿಕ ಜ್ಞಾನ ರಕ್ಷಕರ ಜೀವಂತ ಜಾಲವನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಅನ್ವೇಷಿಸಿ.'
                  : 'Discover the unified cultural landscape of Coastal Karnataka — connecting ancient temple sanctums, hereditary ritual masters, Yakshagana theatre, and sacred groves.'}
              </p>

              {/* Multi-Door Exploration Entry Points */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/knowledge"
                  className="bg-[#C9562D] hover:bg-[#C9562D]/90 text-white font-sans text-xs uppercase tracking-wider font-semibold px-5 py-3.5 rounded-sm transition-all duration-150 inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Rituals & Traditions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/custodians"
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/25 font-sans text-xs uppercase tracking-wider font-medium px-4 py-3.5 rounded-sm transition-colors inline-flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 opacity-80" />
                  <span>Meet Custodians</span>
                </Link>

                <button
                  type="button"
                  onClick={scrollToPlaces}
                  className="bg-transparent hover:bg-white/10 text-[#EFE7DA] border border-[#EFE7DA]/40 font-sans text-xs uppercase tracking-wider font-medium px-4 py-3.5 rounded-sm transition-colors inline-flex items-center gap-2"
                >
                  <span>Sacred Anchors</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Terracotta Panel with Cultural Matrix (5 cols ~ 42%) */}
          <div className="lg:col-span-5 bg-[#C9562D] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden rounded-sm mt-4 lg:mt-0">
            {/* Subtle Textured Watermark */}
            <div className="absolute -right-12 -top-12 w-64 h-64 border border-white/10 rounded-full pointer-events-none" />
            <div className="absolute -right-6 -top-6 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />

            {/* Top Micro-Header */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.2em] text-white/80 border-b border-white/20 pb-3">
              <span>Living Ecosystem Nodes</span>
              <span>15 Validated Datasets</span>
            </div>

            {/* Quick Cultural Entry Cards Grid */}
            <div className="relative z-10 my-6 space-y-3">
              <div className="p-3 bg-white/10 rounded-sm border border-white/20 flex items-start gap-3">
                <Theater className="w-5 h-5 text-amber-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-white">Performing Arts</h4>
                  <p className="text-[11px] text-white/80 font-light">Badagu & Tenku Yakshagana, Talamaddale, Pili Vesha</p>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-sm border border-white/20 flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-white">Living Ritual Traditions</h4>
                  <p className="text-[11px] text-white/80 font-light">Bhoota Nema, Dakkebali, Nagamandala, Siri Jatre, Agni Keli</p>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-sm border border-white/20 flex items-start gap-3">
                <Trees className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-white">Sacred Ecology</h4>
                  <p className="text-[11px] text-white/80 font-light">Nagabanas, Devarakadu, Netravati & Aghanashini basins</p>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-sm border border-white/20 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-white">Oral Epics & Epigraphy</h4>
                  <p className="text-[11px] text-white/80 font-light">Siri Paddana, Koti-Chennaya Epic, Bappa Beary Pact</p>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
              <span className="font-serif italic">"Sanctums · Traditions · Custodians · Sacred Ecology"</span>
              <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded">LIVING ECOSYSTEM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
