import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  X
} from "lucide-react";
import { getFestivalsByMonth, templeFestivals, type TempleFestival } from "@/data/templeFestivals";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthNamesKannada = [
  "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesKannada = ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"];

interface TempleCalendarProps {
  onFestivalSelect?: (festival: TempleFestival) => void;
}

const TempleCalendar = ({ onFestivalSelect }: TempleCalendarProps) => {
  const { language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(0); // January (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedFestival, setSelectedFestival] = useState<TempleFestival | null>(null);

  const allVisibleFestivals = useMemo(() => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;

    return [
      ...getFestivalsByMonth(prevMonth),
      ...getFestivalsByMonth(currentMonth),
      ...getFestivalsByMonth(nextMonth)
    ];
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const monthIndex = currentDate.getMonth();
      const dateNum = currentDate.getDate();

      const dayFestivals = allVisibleFestivals.filter(
        festival => festival.day === dateNum && festival.month === monthIndex
      );

      days.push({
        date: new Date(currentDate),
        festivals: dayFestivals,
        isCurrentMonth,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [currentMonth, currentYear, allVisibleFestivals]);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleFestivalClick = (festival: TempleFestival) => {
    setSelectedFestival(festival);
    onFestivalSelect?.(festival);
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Prominent Featured Festival
  const featuredFestival = selectedFestival || (allVisibleFestivals.length > 0 ? allVisibleFestivals[0] : templeFestivals[0]);

  return (
    <div className="w-full bg-[#F5F0E7] text-[#2B211B] pb-24">
      {/* Editorial Calendar Masthead */}
      <section className="border-b border-[#D8CEBE] bg-[#EFE7DA]/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9562D] block">
                Ritual Cycles & Sacred Jatras
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#24170F] tracking-tight leading-[1.08]">
                Temple Festivals of Coastal Karnataka
              </h1>
              <p className="text-[#756B62] max-w-2xl text-base sm:text-lg font-normal leading-relaxed pt-2">
                Discover the sacred calendar of Udupi, Mangalore, and Dakshina Kannada. Track annual rathotsavas, lunar poojas, and heritage temple jatras preserved across millennia.
              </p>
            </div>

            <div className="lg:col-span-4 border-l border-[#D8CEBE] pl-6 py-2 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#24170F]">
                <Sparkles className="w-4 h-4 text-[#C9562D]" />
                <span>Living Astrological Reckoning</span>
              </div>
              <p className="text-xs text-[#756B62] leading-relaxed">
                Dates conform to regional coastal Panchanga calendars including Sauramana and Chandramana calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FESTIVAL EDITORIAL SPREAD (Section 20 of Brief) */}
      {featuredFestival && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="border border-[#D8CEBE] bg-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px]">
              <img
                src={featuredFestival.image || "/temples/udupi_krishna_real.jpg"}
                alt={featuredFestival.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/temples/kadri.png";
                  target.onerror = null;
                }}
              />
              <div className="absolute top-4 left-4 bg-[#24170F] text-[#F5F0E7] text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                Featured Sacred Celebration
              </div>
              <div className="absolute bottom-4 right-4 bg-[#C9562D] text-white font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 shadow-md">
                {featuredFestival.type} · {featuredFestival.duration}
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-[#F5F0E7]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9562D]">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{featuredFestival.date}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#24170F] leading-tight">
                  {featuredFestival.name}
                </h2>

                <div className="flex items-center gap-2 text-xs font-mono text-[#756B62]">
                  <MapPin className="w-3.5 h-3.5 text-[#C9562D]" />
                  <span>{featuredFestival.temple}, {featuredFestival.location}</span>
                </div>

                <p className="text-sm text-[#756B62] leading-relaxed pt-2">
                  {featuredFestival.description}
                </p>

                {/* Highlights */}
                {featuredFestival.highlights && featuredFestival.highlights.length > 0 && (
                  <div className="pt-3 border-t border-[#D8CEBE]">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#756B62] block mb-2">
                      Key Observances & Rituals
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredFestival.highlights.map((h, idx) => (
                        <span key={idx} className="text-xs bg-[#EFE7DA] border border-[#D8CEBE] px-2.5 py-1 rounded-sm text-[#24170F]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-[#D8CEBE] flex items-center justify-between">
                <span className="text-xs font-mono text-[#756B62]">
                  Shrine: {featuredFestival.temple}
                </span>
                {featuredFestival.templeId && (
                  <Link
                    to={`/temple/${featuredFestival.templeId}`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#24170F] hover:text-[#C9562D] transition-colors"
                  >
                    <span>View Temple Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Calendar Month Navigation & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month Selector Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D8CEBE]">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="w-9 h-9 border border-[#D8CEBE] bg-white rounded-sm flex items-center justify-center text-[#24170F] hover:border-[#24170F] transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-9 h-9 border border-[#D8CEBE] bg-white rounded-sm flex items-center justify-center text-[#24170F] hover:border-[#24170F] transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={jumpToToday}
              className="px-3 py-2 border border-[#D8CEBE] bg-white text-xs font-mono uppercase tracking-wider rounded-sm text-[#24170F] hover:border-[#24170F] transition-colors"
            >
              Today
            </button>
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#24170F]">
            {language === 'kn' ? monthNamesKannada[currentMonth] : monthNames[currentMonth]} {currentYear}
          </h3>

          <span className="text-xs font-mono text-[#756B62]">
            {allVisibleFestivals.length} Sacred Events In Cycle
          </span>
        </div>

        {/* Days Grid Container */}
        <div className="border border-[#D8CEBE] bg-white rounded-sm overflow-hidden shadow-sm">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#D8CEBE] bg-[#EFE7DA]">
            {dayNames.map((day, i) => (
              <div key={i} className="py-3 text-center text-xs font-mono uppercase tracking-wider text-[#756B62] border-r border-[#D8CEBE] last:border-r-0">
                {language === 'kn' ? dayNamesKannada[i] : day}
              </div>
            ))}
          </div>

          {/* 42-day calendar matrix */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const hasFestival = day.festivals.length > 0;
              const primaryFestival = day.festivals[0];

              return (
                <div
                  key={index}
                  onClick={() => hasFestival && handleFestivalClick(primaryFestival)}
                  className={`min-h-[110px] sm:min-h-[130px] p-2.5 border-b border-r border-[#D8CEBE] last:border-r-0 flex flex-col justify-between transition-colors ${
                    !day.isCurrentMonth ? 'bg-[#F5F0E7]/40 text-[#756B62]/40' : 'bg-white text-[#2B211B]'
                  } ${hasFestival ? 'cursor-pointer hover:bg-[#EFE7DA]/60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs ${day.isToday ? 'bg-[#C9562D] text-white px-1.5 py-0.5 rounded-sm font-bold' : 'font-medium'}`}>
                      {day.date.getDate()}
                    </span>
                    {hasFestival && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9562D]" />
                    )}
                  </div>

                  {hasFestival && (
                    <div className="mt-2 space-y-1">
                      <div className="bg-[#EFE7DA] border border-[#D8CEBE] p-1.5 rounded-sm">
                        <span className="text-[10px] font-mono text-[#C9562D] uppercase block truncate">
                          {primaryFestival.type}
                        </span>
                        <h5 className="font-serif text-xs font-medium text-[#24170F] line-clamp-1 leading-tight">
                          {primaryFestival.name}
                        </h5>
                        <p className="text-[10px] text-[#756B62] truncate">
                          {primaryFestival.temple}
                        </p>
                      </div>
                    </div>
                  )}

                  {!hasFestival && <div />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Festival Modal Overlay */}
      {selectedFestival && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24170F]/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedFestival(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#F5F0E7] border border-[#D8CEBE] rounded-sm overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-64 relative">
              <img
                src={selectedFestival.image || "/temples/udupi_krishna_real.jpg"}
                alt={selectedFestival.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/temples/kadri.png";
                  target.onerror = null;
                }}
              />
              <button
                onClick={() => setSelectedFestival(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-[#24170F]/80 hover:bg-[#24170F] text-white rounded-sm flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 bg-[#C9562D] text-white font-mono text-xs uppercase tracking-wider px-3 py-1">
                {selectedFestival.type} · {selectedFestival.duration}
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C9562D]">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{selectedFestival.date}</span>
              </div>

              <h3 className="font-serif text-3xl font-light text-[#24170F]">
                {selectedFestival.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#756B62]">
                <MapPin className="w-3.5 h-3.5 text-[#C9562D]" />
                <span>{selectedFestival.temple}, {selectedFestival.location}</span>
              </div>

              <p className="text-sm text-[#756B62] leading-relaxed">
                {selectedFestival.description}
              </p>

              {selectedFestival.highlights && (
                <div className="pt-3 border-t border-[#D8CEBE]">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#756B62] block mb-2">
                    Key Highlights
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFestival.highlights.map((h, idx) => (
                      <span key={idx} className="text-xs bg-white border border-[#D8CEBE] px-2.5 py-1 rounded-sm text-[#24170F]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#D8CEBE] flex justify-end">
                {selectedFestival.templeId ? (
                  <Link to={`/temple/${selectedFestival.templeId}`}>
                    <button className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs px-5 py-2.5 rounded-sm transition-colors flex items-center gap-2">
                      <span>Explore Temple Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedFestival(null)}
                    className="bg-[#24170F] text-[#F5F0E7] text-xs px-5 py-2.5 rounded-sm"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempleCalendar;
