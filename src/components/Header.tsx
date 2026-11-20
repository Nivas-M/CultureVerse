import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Languages, User, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isCalendarPage = location.pathname === '/calendar';
  const { language, toggleLanguage, translate } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Living Culture", path: "/" },
    { name: "Rituals & Traditions", path: "/knowledge" },
    { name: "Custodians of Knowledge", path: "/custodians" },
    { name: "Sacred Anchors", path: "/#places" },
    { name: "Community Experiences", path: "/experiences" },
    { name: "Sacred Calendar", path: "/calendar" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    // Check if it's a full route (starts with /) or a hash link
    if (path.startsWith("/#")) {
      return location.hash === path.replace("/", "");
    }
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#F5F0E7]/95 backdrop-blur-md border-b border-[#D8CEBE] shadow-[0_2px_12px_rgba(43,33,27,0.04)]"
          : "bg-gradient-to-b from-[#24170F]/70 via-[#24170F]/30 to-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors ${
              isScrolled ? "bg-[#C9562D] text-white" : "bg-white/10 backdrop-blur-sm border border-white/20 text-white group-hover:bg-[#C9562D]"
            }`}>
              <span className="font-serif text-xl font-normal">
                ॐ
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-2xl font-medium tracking-tight transition-colors ${
                isScrolled ? "text-[#2B211B]" : "text-white"
              }`}>
                CultureVerse
              </span>
              <span className={`text-[9px] uppercase tracking-[0.2em] font-sans -mt-1 ${
                isScrolled ? "text-[#756B62]" : "text-white/70"
              }`}>
                Coastal Karnataka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-xs font-sans font-medium uppercase tracking-wider transition-colors duration-150 relative ${
                  isActive(link.path)
                    ? isScrolled
                      ? "text-[#C9562D] after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[1.5px] after:bg-[#C9562D]"
                      : "text-white after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[1.5px] after:bg-white"
                    : isScrolled
                      ? "text-[#2B211B]/75 hover:text-[#C9562D]"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {translate(link.name)}
              </Link>
            ))}
          </nav>

          {/* Search, Language Toggle and Auth (Desktop) */}
          <div className="hidden md:flex items-center space-x-2.5">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-sm h-8 w-8 transition-colors ${
                isScrolled ? "text-[#2B211B] hover:bg-[#EFE7DA]" : "text-white hover:bg-white/10"
              }`}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <button
              type="button"
              className={`flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider px-2.5 py-1.5 rounded-sm border transition-colors ${
                isScrolled
                  ? "border-[#D8CEBE] text-[#2B211B] hover:border-[#C9562D] hover:text-[#C9562D]"
                  : "border-white/20 text-white hover:border-white/60"
              }`}
              onClick={toggleLanguage}
            >
              <Languages className="h-3.5 w-3.5 opacity-80" />
              <span>{language === 'en' ? 'ENG' : 'ಕನ್ನಡ'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === 'custodian' && (
                  <button
                    type="button"
                    onClick={() => navigate('/custodian/dashboard')}
                    className="text-xs font-sans uppercase tracking-wider bg-[#C9562D] text-white px-3 py-1.5 rounded-sm hover:bg-[#C9562D]/90 transition-colors"
                  >
                    Custodian Hub
                  </button>
                )}
                {user?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/dashboard')}
                    className="text-xs font-sans uppercase tracking-wider bg-[#24170F] text-[#F5F0E7] px-3 py-1.5 rounded-sm border border-[#D8CEBE]/30 hover:bg-[#24170F]/80 transition-colors"
                  >
                    Trust Console
                  </button>
                )}
                {user?.role !== 'custodian' && user?.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => navigate('/apply-custodian')}
                    className={`text-xs font-sans uppercase tracking-wider px-2.5 py-1.5 transition-colors ${
                      isScrolled ? "text-[#756B62] hover:text-[#C9562D]" : "text-white/80 hover:text-white"
                    }`}
                  >
                    Join as Custodian
                  </button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider px-2.5 py-1.5 rounded-sm border transition-colors ${
                        isScrolled
                          ? "border-[#D8CEBE] text-[#2B211B] hover:border-[#C9562D]"
                          : "border-white/30 text-white hover:border-white"
                      }`}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span className="max-w-[90px] truncate">{user?.name || "Account"}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#F5F0E7] border border-[#D8CEBE] text-[#2B211B]">
                    <DropdownMenuLabel>
                      <div className="font-serif text-base">{user?.name}</div>
                      <div className="text-[10px] text-[#756B62] uppercase tracking-wider font-sans">{user?.role || 'traveller'}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#D8CEBE]" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-[#EFE7DA] cursor-pointer text-xs">
                      <User className="h-3.5 w-3.5 mr-2" />
                      <span>{translate('Profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-[#EFE7DA] cursor-pointer text-xs">
                      <Heart className="h-3.5 w-3.5 mr-2" />
                      <span>{translate('Saved Temples')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#D8CEBE]" />
                    <DropdownMenuItem onClick={logout} className="hover:bg-[#EFE7DA] cursor-pointer text-xs text-red-600">
                      <LogOut className="h-3.5 w-3.5 mr-2" />
                      <span>{translate('Log Out')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className={`text-xs font-sans uppercase tracking-wider px-3 py-1.5 transition-colors ${
                    isScrolled ? "text-[#2B211B] hover:text-[#C9562D]" : "text-white hover:text-white/80"
                  }`}
                >
                  {translate('Log In')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-xs font-sans uppercase tracking-wider bg-[#C9562D] text-white px-3.5 py-1.5 rounded-sm hover:bg-[#C9562D]/90 transition-colors font-medium shadow-sm"
                >
                  {translate('Sign Up')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-smooth ${isScrolled
                ? 'text-foreground hover:bg-muted'
                : isCalendarPage
                  ? 'text-[hsl(var(--deep-coffee))] hover:bg-[hsl(var(--deep-coffee))/10]'
                  : 'text-white hover:bg-white/10'
              }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-smooth font-medium ${isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {translate(link.name)}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={translate("Search temples...")}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={toggleLanguage}
              >
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'Switch to ಕನ್ನಡ' : 'Switch to English'}</span>
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
