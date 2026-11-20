import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { bookingAPI, Booking } from '@/lib/api';
import { Mail, Calendar, Heart, Clock, HeartHandshake, ArrowRight } from 'lucide-react';
import { temples } from '@/data/temples';
import { toast } from 'sonner';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyBookings();
    }
  }, [isAuthenticated]);

  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await bookingAPI.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await bookingAPI.cancel(bookingId);
      if (res.success) {
        toast.success('Booking cancelled and refund processed.');
        fetchMyBookings();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E7]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C9562D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-mono text-xs text-[#756B62]">Loading pilgrim dossier...</p>
        </div>
      </div>
    );
  }

  // Get favorite temples from local data
  const favoriteTemples = user.favorites
    ? temples.filter((temple) => user.favorites?.includes(temple.id))
    : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />
      <div className="pt-28 pb-20 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Profile Header */}
          <div className="border border-[#D8CEBE] bg-white p-8 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#24170F] rounded-sm flex items-center justify-center text-[#F5F0E7] font-serif text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-light text-[#24170F]">{user.name}</h1>
                  <p className="flex items-center gap-2 mt-1 text-xs text-[#756B62] font-mono">
                    <Mail className="h-3.5 w-3.5 text-[#C9562D]" />
                    {user.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#EFE7DA] text-[#24170F] border border-[#D8CEBE] rounded-sm">
                      Role: {user.role || 'Traveller'}
                    </span>
                    {user.role === 'custodian' && (
                      <Link to="/custodian/dashboard">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#24170F] text-[#F5F0E7] rounded-sm hover:bg-[#C9562D] transition-colors">
                          Open Custodian Studio →
                        </span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#24170F] text-[#F5F0E7] rounded-sm hover:bg-[#C9562D] transition-colors">
                          Open Governance Console →
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="border border-[#D8CEBE] hover:border-[#24170F] text-[#24170F] text-xs px-4 py-2 rounded-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Booked Authentic Experiences */}
          <div className="border border-[#D8CEBE] bg-white p-8 rounded-sm shadow-sm space-y-6">
            <div className="border-b border-[#D8CEBE] pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-light text-[#24170F] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#C9562D]" />
                  <span>My Experience Reservations ({bookings.length})</span>
                </h2>
                <p className="text-xs text-[#756B62] font-mono mt-0.5">
                  Direct bookings backed by 85% custodian preservation remuneration
                </p>
              </div>
            </div>

            <div>
              {loadingBookings ? (
                <div className="py-12 text-center text-xs font-mono text-[#756B62]">
                  Consulting booking ledger...
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#D8CEBE] p-6 bg-[#F5F0E7]/40 rounded-sm">
                  <Calendar className="w-8 h-8 text-[#756B62] mx-auto mb-2 opacity-60" />
                  <p className="font-serif text-lg text-[#24170F]">No cultural experiences reserved yet</p>
                  <p className="text-xs text-[#756B62] mt-1 mb-6">
                    Discover masterclasses, sacred grove walks, and temple culinary traditions.
                  </p>
                  <Link to="/experiences">
                    <button className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm transition-colors">
                      Explore Cultural Immersions
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b._id}
                      className="p-6 bg-[#F5F0E7]/40 border border-[#D8CEBE] rounded-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-medium text-lg text-[#24170F]">
                              {b.experienceId?.title || 'Cultural Experience'}
                            </h4>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#EFE7DA] text-[#24170F] border border-[#D8CEBE] rounded-sm">
                              {b.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#C9562D] font-serif italic mt-0.5">
                            Mentored by {b.custodianId?.name} ({b.custodianId?.culturalAffiliation})
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-serif text-xl text-[#24170F]">
                            ₹{b.totalAmount}
                          </span>
                          <p className="text-[10px] text-[#756B62] font-mono">
                            Ref: {b.bookingNumber}
                          </p>
                        </div>
                      </div>

                      {/* Details Bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[#756B62] pt-3 border-t border-[#D8CEBE]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C9562D]" />
                          <span>Date: {new Date(b.bookingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C9562D]" />
                          <span>Slot: {b.slotTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>Guests: {b.numberOfPeople} person(s)</span>
                        </div>
                      </div>

                      {/* Transparent Economic Breakdown Receipt */}
                      <div className="p-3.5 bg-[#EFE7DA] border border-[#D8CEBE] text-xs font-mono flex flex-col sm:flex-row justify-between gap-2 rounded-sm">
                        <div className="flex items-center gap-1.5 text-[#24170F]">
                          <HeartHandshake className="w-4 h-4 text-[#C9562D]" />
                          <span>Custodian Lineage Share: <strong>₹{b.custodianShare} (85%)</strong></span>
                        </div>
                        <div className="text-[#756B62] text-[11px]">
                          Platform Preservation Archive: ₹{b.platformCommission} (15%)
                        </div>
                      </div>

                      {b.status === 'CONFIRMED' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="text-xs text-red-700 hover:underline font-mono"
                          >
                            Cancel Reservation
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Favorites Section */}
          <div className="border border-[#D8CEBE] bg-white p-8 rounded-sm shadow-sm space-y-6">
            <div className="border-b border-[#D8CEBE] pb-4">
              <h2 className="font-serif text-2xl font-light text-[#24170F] flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#C9562D]" />
                <span>Saved Shrines ({favoriteTemples.length})</span>
              </h2>
            </div>

            <div>
              {favoriteTemples.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteTemples.map((temple) => (
                    <Link
                      key={temple.id}
                      to={`/temple/${temple.id}`}
                      className="flex items-start gap-4 p-4 border border-[#D8CEBE] bg-[#F5F0E7]/50 hover:bg-[#EFE7DA] transition-colors rounded-sm group"
                    >
                      <img
                        src={temple.image}
                        alt={temple.name}
                        className="w-16 h-16 rounded-sm object-cover border border-[#D8CEBE]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base text-[#24170F] group-hover:text-[#C9562D] transition-colors truncate">
                          {temple.name}
                        </h4>
                        <p className="text-xs font-mono text-[#756B62] mt-0.5">{temple.location}</p>
                        <span className="text-[10px] font-mono text-[#C9562D] uppercase tracking-wider block mt-1">
                          {temple.region}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#756B62] group-hover:text-[#24170F] mt-1 shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-[#756B62] text-center py-8">
                  No shrines saved to your pilgrimage ledger yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default ProfilePage;
