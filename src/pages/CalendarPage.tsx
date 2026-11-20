import React from "react";
import Header from "@/components/Header";
import TempleCalendar from "@/components/TempleCalendar";
import Footer from "@/components/Footer";
import { CulturalAIAssistant } from "@/components/CulturalAIAssistant";
import { Sparkles, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const CalendarPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F0E7] text-[#2B211B]">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Editorial Calendar Header */}
        <section className="bg-[#EFE7DA]/80 border-b border-[#D8CEBE] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9562D] block">
                Seasonal Agro-Ritual Rhythm · Coastal Karnataka
              </span>
              <div className="flex items-center gap-2 text-xs font-mono bg-white/70 border border-[#D8CEBE] px-3 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9562D]" />
                <span>Synchronized with Lunar Muhurthas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#24170F] tracking-tight">
                  Sacred Jathre & Observance Calendar
                </h1>
                <p className="text-[#756B62] text-sm sm:text-base leading-relaxed max-w-2xl">
                  In Coastal Karnataka, festivals are synchronized with agrarian and ecological cycles: monsoon apotropaic rites (*Ati*), post-harvest dry-season chariots (*Suggi / Beshanta*), and biennial monastic transitions (*Paryaya*).
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link
                  to="/knowledge"
                  className="inline-flex items-center gap-2 bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-sm transition-all"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Rituals & Liturgy Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Core */}
        <TempleCalendar />
      </main>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default CalendarPage;
