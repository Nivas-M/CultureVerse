import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#24170F] text-[#F5F0E7] border-t border-[#3B291D] pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Colophon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Manifesto (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-sm bg-[#C9562D] text-white flex items-center justify-center font-serif text-lg font-normal">
                ॐ
              </div>
              <span className="font-serif text-2xl font-normal tracking-tight text-white">
                CultureVerse
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#EFE7DA]/75 max-w-sm leading-relaxed font-light">
              An independent cultural publication and discovery platform documenting the sacred sanctums, hereditary archaks, classical Yakshagana dance-drama, and living traditions of Coastal Karnataka.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D9782A]">
                Tulunadu Living Heritage
              </span>
            </div>
          </div>

          {/* Navigation Domains (2 cols) */}
          <div className="md:col-span-2 space-y-3 font-sans text-xs">
            <span className="text-white/40 uppercase tracking-widest font-medium block">
              Exploration
            </span>
            <ul className="space-y-2 text-[#EFE7DA]/80">
              <li>
                <Link to="/#temples" className="hover:text-[#C9562D] transition-colors">
                  Temple Shrines
                </Link>
              </li>
              <li>
                <Link to="/custodians" className="hover:text-[#C9562D] transition-colors">
                  Living Custodians
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-[#C9562D] transition-colors">
                  Authentic Experiences
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="hover:text-[#C9562D] transition-colors">
                  Cultural Knowledge
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-[#C9562D] transition-colors">
                  Festival Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Sacred Regions (2 cols) */}
          <div className="md:col-span-2 space-y-3 font-sans text-xs">
            <span className="text-white/40 uppercase tracking-widest font-medium block">
              Topography
            </span>
            <ul className="space-y-2 text-[#EFE7DA]/80">
              <li>Mangalore Sanctums</li>
              <li>Udupi Ashta Mathas</li>
              <li>Kundapura Coastal Belt</li>
              <li>Netravati River Basin</li>
              <li>Western Ghats Foot</li>
            </ul>
          </div>

          {/* Custodian Council & Governance (3 cols) */}
          <div className="md:col-span-3 space-y-3 font-sans text-xs">
            <span className="text-white/40 uppercase tracking-widest font-medium block">
              Preservation Model
            </span>
            <p className="text-[#EFE7DA]/75 text-xs leading-relaxed font-light">
              85% of all cultural experience bookings are disbursed directly to custodian families and living heritage trusts under verified ledger scrutiny.
            </p>
            <div className="pt-2">
              <Link
                to="/apply-custodian"
                className="text-[#C9562D] hover:underline uppercase text-[11px] font-medium tracking-wider block"
              >
                Apply as Cultural Custodian →
              </Link>
              <Link
                to="/admin/dashboard"
                className="text-white/40 hover:text-white/80 uppercase text-[10px] tracking-wider mt-1.5 block"
              >
                Trust & Verification Console ↗
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Telemetry & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans text-white/40">
          <div>
            © {currentYear} CultureVerse · Sacred Heritage of Coastal Karnataka · All Rights Reserved
          </div>
          <div className="flex items-center gap-4">
            <span>Coordinates: 13°05′N · 74°59′E</span>
            <span>·</span>
            <span className="text-white/70">Verified Grounded Truth</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
