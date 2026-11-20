import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Car, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { temples } from "@/data/temples";

const TravelBookingSection = () => {
  const { translate } = useLanguage();
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    templePreference: "",
    visitDate: "",
    numberOfPeople: "",
    serviceType: "guide"
  });

  // Cultural Planner State
  const [planRegion, setPlanRegion] = useState("all");
  const [planInterest, setPlanInterest] = useState("folk_art");
  const [planDuration, setPlanDuration] = useState("1_day");

  // Deterministic recommendations connecting temples, custodians, and experiences
  const culturalPlans: Record<string, any> = {
    folk_art: {
      title: "Coastal Dance-Theatre & Folk Narrative Trail",
      places: ["Kadri Manjunatha Temple", "Kateel Durgaparameshwari Temple"],
      custodian: "Guru Sanjeeva Suvarna (Thenku Thittu Yakshagana Guild)",
      custodianId: "6aaa0e49347a548ab6be52a4",
      experience: "Yakshagana Masterclass: Rhythms, Costume & Sacred Pirouettes",
      timing: "Morning temple visit + Evening 2.5h Yakshagana studio masterclass"
    },
    craft: {
      title: "Ancient Sgraffito Murals & Sacred Architecture Trail",
      places: ["Kudroli Gokarnanatheshwara Temple", "Udupi Car Street Shrines"],
      custodian: "Venkatesh Acharya (Kaavi Mural Heritage Lineage)",
      custodianId: "6aaa0e49347a548ab6be52a6",
      experience: "Kaavi Art Workshop: Hands-on Laterite Sgraffito on Terracotta",
      timing: "Full Day immersion into 400-year-old architectural pigment carving"
    },
    sacred_ecology: {
      title: "Sacred Groves & River Basin Ecological Guardianship",
      places: ["Polali Rajarajeshwari Temple", "Gurupura River Basin Banas"],
      custodian: "Dr. Indira Ballal (Tulunadu Folklore Archive)",
      custodianId: "6aaa0e49347a548ab6be52a8",
      experience: "Sacred River Basin Heritage Walk & Oral Folklore Trail",
      timing: "Dawn 2h guided sacred grove nature walk + Temple history exploration"
    },
    temple_ritual: {
      title: "Alupa 9th-Century Sanctum Liturgy & Food Tradition",
      places: ["Mangaladevi Temple", "Kadri Hills"],
      custodian: "Archak Narayana Bhat (Mangaladevi Nath Tradition)",
      custodianId: "6aaa0e49347a548ab6be52aa",
      experience: "Mangaladevi Sanctum Lore & Traditional Temple Food Experience",
      timing: "Midday sanctum walkthrough + Pure Satvik Ayurvedic Temple Prasadam"
    }
  };

  const activePlan = culturalPlans[planInterest] || culturalPlans.folk_art;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(translate("Thank you for your booking request! Our travel coordinator will contact you within 24 hours."));
    setBookingData({ 
      name: "", 
      email: "", 
      phone: "", 
      templePreference: "", 
      visitDate: "",
      numberOfPeople: "",
      serviceType: "guide"
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 spiritual-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Car className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-semibold">{translate("Travel Services")}</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {translate("Book Your Temple Journey")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {translate("Experience divine darshan with our expert guides and comfortable travel arrangements")}
            </p>
          </div>

          {/* Personalized Cultural Journey Planner */}
          <div className="mb-12 bg-card rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
                  <span>Personalized Cultural Visit Planner</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Connect sacred temples, preserving custodians, and authentic community workshops into a curated visit.
                </p>
              </div>
              <a
                href="/experiences"
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
              >
                Browse All Experiences →
              </a>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">1. Cultural Focus</label>
                <select
                  value={planInterest}
                  onChange={(e) => setPlanInterest(e.target.value)}
                  className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="folk_art">Yakshagana & Dance-Drama</option>
                  <option value="craft">Sacred Kaavi Art & Architecture</option>
                  <option value="sacred_ecology">Nagara Bana & Sacred Ecology</option>
                  <option value="temple_ritual">Sanctum Liturgy & Temple Cuisine</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">2. Coastal Region</label>
                <select
                  value={planRegion}
                  onChange={(e) => setPlanRegion(e.target.value)}
                  className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="all">Coastal Karnataka (All)</option>
                  <option value="mangalore">Mangalore & Gurupura</option>
                  <option value="udupi">Udupi & Car Street</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">3. Duration</label>
                <select
                  value={planDuration}
                  onChange={(e) => setPlanDuration(e.target.value)}
                  className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="half_day">Half-Day Immersion</option>
                  <option value="1_day">1-Day Complete Trail</option>
                  <option value="2_days">2-Day Living Heritage Retreat</option>
                </select>
              </div>
            </div>

            {/* Generated Plan Recommendation */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono font-semibold text-amber-700 dark:text-amber-400">
                  Recommended Itinerary: {activePlan.title}
                </span>
                <span className="text-xs text-muted-foreground">{activePlan.timing}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="bg-background/80 p-3 rounded-xl border border-border">
                  <span className="text-muted-foreground block text-[11px] mb-1">Recommended Shrines</span>
                  <p className="font-semibold text-foreground">{activePlan.places.join(" • ")}</p>
                </div>
                <div className="bg-background/80 p-3 rounded-xl border border-border">
                  <span className="text-muted-foreground block text-[11px] mb-1">Preserving Custodian</span>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">{activePlan.custodian}</p>
                </div>
                <div className="bg-background/80 p-3 rounded-xl border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-1">Bookable Community Workshop</span>
                    <p className="font-semibold text-foreground">{activePlan.experience}</p>
                  </div>
                  <a
                    href="/experiences"
                    className="text-xs font-bold text-emerald-600 hover:underline pt-2 block"
                  >
                    Reserve Slot (85% to Custodian) →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Options */}
            <div className="space-y-6">
              <Card className="border-border temple-shadow bg-card animate-scale-in">
                <CardContent className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    {translate("Our Services")}
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{translate("Expert Temple Guide")}</h4>
                          <p className="text-sm text-muted-foreground">
                            {translate("Knowledgeable local guides who share history, rituals, and significance")}
                          </p>
                          <p className="text-sm font-semibold text-primary mt-2">₹500-1500 {translate("per day")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{translate("Transportation Service")}</h4>
                          <p className="text-sm text-muted-foreground">
                            {translate("Comfortable AC vehicles with experienced drivers for temple visits")}
                          </p>
                          <p className="text-sm font-semibold text-primary mt-2">₹2000-4000 {translate("per day")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{translate("Complete Package")}</h4>
                          <p className="text-sm text-muted-foreground">
                            {translate("Guide + Transport + Multi-temple itinerary planning")}
                          </p>
                          <p className="text-sm font-semibold text-primary mt-2">₹3500-6000 {translate("per day")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <Card className="border-border temple-shadow bg-card animate-scale-in">
              <CardContent className="p-6">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  {translate("Request Booking")}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {translate("Your Name")}
                    </label>
                    <Input
                      name="name"
                      value={bookingData.name}
                      onChange={handleChange}
                      placeholder={translate("Your Name")}
                      required
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        {translate("Email")}
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={bookingData.email}
                        onChange={handleChange}
                        placeholder={translate("Email")}
                        required
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        {translate("Phone")}
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={handleChange}
                        placeholder={translate("Phone")}
                        required
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {translate("Temple Preference")}
                    </label>
                    <select
                      name="templePreference"
                      value={bookingData.templePreference}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-md border border-border bg-background focus:border-primary focus:ring-primary focus:outline-none"
                    >
                      <option value="">{translate("Select Temple")}</option>
                      {temples.map(temple => (
                        <option key={temple.id} value={temple.id}>
                          {temple.name} - {temple.location}
                        </option>
                      ))}
                      <option value="multiple">{translate("Multiple Temples Tour")}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {translate("Visit Date")}
                      </label>
                      <Input
                        name="visitDate"
                        type="date"
                        value={bookingData.visitDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {translate("Number of People")}
                      </label>
                      <Input
                        name="numberOfPeople"
                        type="number"
                        min="1"
                        max="50"
                        value={bookingData.numberOfPeople}
                        onChange={handleChange}
                        placeholder="1-50"
                        required
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" />
                      {translate("Service Type")}
                    </label>
                    <select
                      name="serviceType"
                      value={bookingData.serviceType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-md border border-border bg-background focus:border-primary focus:ring-primary focus:outline-none"
                    >
                      <option value="guide">{translate("Guide Only")}</option>
                      <option value="transport">{translate("Transport Only")}</option>
                      <option value="package">{translate("Complete Package")}</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg group"
                  >
                    <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    {translate("Request Booking")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {translate("Our team will contact you within 24 hours to confirm your booking and discuss the itinerary.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelBookingSection;
