import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { experienceAPI, bookingAPI, Experience } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Clock, Users, MapPin, ShieldCheck, ArrowLeft, CheckCircle2, HeartHandshake } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

const ExperienceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetchExperience(id);
    }
    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name);
      if (!contactEmail) setContactEmail(user.email);
    }
  }, [user]);

  const fetchExperience = async (expId: string) => {
    setLoading(true);
    try {
      const res = await experienceAPI.getById(expId);
      if (res.success && res.data) {
        setExperience(res.data);
        if (res.data.availabilitySchedule && res.data.availabilitySchedule.length > 0) {
          setSlotTime(res.data.availabilitySchedule[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = experience ? experience.price * numberOfPeople : 0;
  const platformFee = Math.round(totalAmount * 0.15);
  const custodianShare = totalAmount - platformFee;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in or register to reserve your cultural experience.');
      navigate('/login');
      return;
    }

    if (!experience) return;

    if (!bookingDate || !slotTime || !contactName || !contactEmail || !contactPhone) {
      toast.error('Please fill in all contact and scheduling details.');
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await bookingAPI.create({
        experienceId: experience._id,
        bookingDate,
        slotTime,
        numberOfPeople,
        contactName,
        contactEmail,
        contactPhone,
        specialRequests
      });

      if (res.success) {
        setBookingSuccess(res.data);
        toast.success('Experience reserved successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete booking');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F0E7]">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9562D] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
        <Header />
        <main className="flex-1 pt-32 max-w-xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-[#24170F]">Experience Not Found</h2>
          <Link to="/experiences" className="mt-4 inline-block">
            <button className="bg-[#24170F] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm hover:bg-[#C9562D] transition-colors">
              Return to Experiences
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link to="/experiences" className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#756B62] hover:text-[#24170F] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Cultural Experiences</span>
          </Link>
        </div>

        {/* Two-Column Editorial Spread: Dominant Story (Left) vs Compact Transaction (Right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT: DOMINANT STORY SECTION (~65% width) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Large Hero Imagery */}
              <div className="border border-[#D8CEBE] bg-white rounded-sm overflow-hidden shadow-sm">
                <div className="h-80 sm:h-[460px] relative">
                  <img
                    src={experience.images?.[0] || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200'}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#24170F] text-[#F5F0E7] text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                    {experience.category.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Title and Provenance Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono tracking-wider uppercase text-[#756B62]">
                  <span className="text-[#C9562D]">{experience.location.city}, Coastal Karnataka</span>
                  <span>·</span>
                  <span>Direct Hereditary Instruction</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#24170F] leading-[1.1]">
                  {experience.title}
                </h1>

                {/* Custodian Host Provenance Band */}
                {experience.custodianId && (
                  <div className="p-4 sm:p-5 bg-white border border-[#D8CEBE] rounded-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={experience.custodianId.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                        alt={experience.custodianId.name}
                        className="w-12 h-12 rounded-sm object-cover border border-[#D8CEBE]"
                      />
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#756B62] block">
                          Mentored by Hereditary Custodian
                        </span>
                        <Link to={`/custodians/${experience.custodianId._id}`} className="font-serif text-lg font-medium text-[#24170F] hover:text-[#C9562D] transition-colors">
                          {experience.custodianId.name}
                        </Link>
                        <p className="text-xs text-[#C9562D] font-serif italic">
                          {experience.custodianId.culturalAffiliation}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/custodians/${experience.custodianId._id}`}
                      className="hidden sm:inline-flex text-xs font-mono uppercase tracking-wider text-[#24170F] hover:text-[#C9562D] border-b border-[#24170F] pb-0.5"
                    >
                      View Dossier →
                    </Link>
                  </div>
                )}
              </div>

              {/* Telemetry Grid */}
              <div className="grid grid-cols-3 gap-4 p-5 bg-[#EFE7DA] border border-[#D8CEBE] rounded-sm text-xs font-mono">
                <div>
                  <span className="text-[#756B62] block">DURATION</span>
                  <strong className="text-[#24170F] mt-1 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C9562D]" /> {experience.durationMinutes} Minutes
                  </strong>
                </div>
                <div>
                  <span className="text-[#756B62] block">INTIMACY CAP</span>
                  <strong className="text-[#24170F] mt-1 block flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#C9562D]" /> Max {experience.capacity} Guests
                  </strong>
                </div>
                <div>
                  <span className="text-[#756B62] block">LOCATION</span>
                  <strong className="text-[#24170F] mt-1 block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9562D]" /> {experience.location.city}
                  </strong>
                </div>
              </div>

              {/* Cultural Significance Quote */}
              <div className="border-l-2 border-[#C9562D] pl-6 py-2 space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#756B62]">
                  Cultural Significance & Lineage Context
                </span>
                <p className="font-serif text-lg sm:text-xl text-[#24170F] italic leading-relaxed">
                  &ldquo;{experience.culturalContext}&rdquo;
                </p>
              </div>

              {/* Deep Narrative Description */}
              <div className="space-y-4 pt-4 border-t border-[#D8CEBE]">
                <h3 className="font-serif text-2xl font-light text-[#24170F]">
                  About This Sacred Immersion
                </h3>
                <div className="text-sm sm:text-base text-[#2B211B] leading-relaxed whitespace-pre-line space-y-4 font-normal">
                  {experience.description}
                </div>
              </div>

              {/* Guidelines & Etiquette */}
              <div className="space-y-4 pt-4 border-t border-[#D8CEBE]">
                <h3 className="font-serif text-xl font-light text-[#24170F]">
                  Sacred Etiquette & Custodian Protocols
                </h3>
                <div className="space-y-2">
                  {experience.culturalGuidelines?.map((g, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-[#2B211B] bg-white border border-[#D8CEBE] p-3.5 rounded-sm">
                      <ShieldCheck className="w-4 h-4 text-[#C9562D] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: COMPACT TRANSACTION MODULE (~35% width, sticky) */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              {bookingSuccess ? (
                <div className="bg-white border border-[#C9562D] p-6 shadow-sm space-y-4 rounded-sm animate-in fade-in-50 duration-300">
                  <div className="w-10 h-10 rounded-sm bg-[#C9562D]/10 text-[#C9562D] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif text-2xl font-light text-[#24170F]">Reservation Confirmed</h3>
                    <p className="text-xs font-mono text-[#756B62] mt-1">
                      Ref: <strong className="text-[#24170F]">{bookingSuccess.booking?.bookingNumber}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-[#EFE7DA] border border-[#D8CEBE] text-xs font-mono space-y-2 rounded-sm">
                    <div className="flex justify-between">
                      <span className="text-[#756B62]">Date & Slot:</span>
                      <span className="font-medium text-[#24170F]">{bookingDate} · {slotTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#756B62]">Guests:</span>
                      <span className="font-medium text-[#24170F]">{numberOfPeople} person(s)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#D8CEBE]">
                      <span className="text-[#756B62]">Total Amount:</span>
                      <span className="font-bold text-[#24170F]">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#C9562D] pt-1">
                      <span>Direct Custodian Share (85%):</span>
                      <span>₹{custodianShare}</span>
                    </div>
                  </div>

                  <Link to="/profile">
                    <button className="w-full bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs py-2.5 rounded-sm transition-colors mt-2">
                      View My Bookings & Receipts
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-[#D8CEBE] p-6 sm:p-7 shadow-sm space-y-6 rounded-sm">
                  {/* Price Banner */}
                  <div className="flex items-baseline justify-between border-b border-[#D8CEBE] pb-4">
                    <div>
                      <span className="text-[11px] font-mono text-[#756B62] uppercase block">Per Person Contribution</span>
                      <p className="font-serif text-3xl font-normal text-[#24170F]">₹{experience.price}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#EFE7DA] text-[#C9562D] border border-[#D8CEBE] rounded-sm">
                      Direct Provenance
                    </span>
                  </div>

                  <form onSubmit={handleBook} className="space-y-4">
                    {/* Date Selection */}
                    <div className="space-y-1">
                      <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Select Date</Label>
                      <Input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B]"
                        required
                      />
                    </div>

                    {/* Slot Picker */}
                    <div className="space-y-1">
                      <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Schedule Time Slot</Label>
                      <select
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        className="w-full text-xs rounded-sm border border-[#D8CEBE] bg-[#F5F0E7] px-3 py-2 text-[#2B211B] focus:outline-none focus:border-[#24170F]"
                        required
                      >
                        {experience.availabilitySchedule?.map((slot, idx) => (
                          <option key={idx} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    {/* Guest Counter */}
                    <div className="space-y-1">
                      <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Number of Guests</Label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                          className="w-8 h-8 border border-[#D8CEBE] bg-[#F5F0E7] text-xs font-bold rounded-sm hover:border-[#24170F]"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm w-6 text-center font-medium">{numberOfPeople}</span>
                        <button
                          type="button"
                          onClick={() => setNumberOfPeople(Math.min(experience.capacity, numberOfPeople + 1))}
                          className="w-8 h-8 border border-[#D8CEBE] bg-[#F5F0E7] text-xs font-bold rounded-sm hover:border-[#24170F]"
                        >
                          +
                        </button>
                        <span className="text-[11px] font-mono text-[#756B62] ml-auto">Max {experience.capacity}</span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3 pt-3 border-t border-[#D8CEBE]">
                      <div className="space-y-1">
                        <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Contact Name</Label>
                        <Input
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your Full Name"
                          className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-9"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Phone / WhatsApp</Label>
                        <Input
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-9"
                          required
                        />
                      </div>
                    </div>

                    {/* Transparent Economic Breakdown */}
                    <div className="p-3.5 bg-[#EFE7DA] border border-[#D8CEBE] text-xs font-mono space-y-1.5 rounded-sm">
                      <div className="flex justify-between text-[#756B62]">
                        <span>Base ({numberOfPeople} × ₹{experience.price})</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-[#C9562D] font-medium">
                        <span className="flex items-center gap-1">
                          <HeartHandshake className="w-3.5 h-3.5" />
                          To Custodian (85%):
                        </span>
                        <span>₹{custodianShare}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#756B62]">
                        <span>Platform Archive (15%):</span>
                        <span>₹{platformFee}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-[#D8CEBE] font-bold text-[#24170F] text-sm font-serif">
                        <span>Total Payable:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="w-full bg-[#C9562D] hover:bg-[#B24722] text-white font-medium text-xs py-3 rounded-sm shadow-sm transition-colors"
                    >
                      {bookingSubmitting ? 'Reserving...' : `Confirm & Reserve (₹${totalAmount})`}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default ExperienceDetailPage;
