import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { custodianAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CulturalAIAssistant } from '@/components/CulturalAIAssistant';

const ApplyCustodianPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('folk_performer');
  const [culturalAffiliation, setCulturalAffiliation] = useState('');
  const [traditionPractice, setTraditionPractice] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [city, setCity] = useState('Mangalore');
  const [region, setRegion] = useState('Coastal Karnataka');
  const [languages, setLanguages] = useState('kn, en');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in or register before applying.');
      navigate('/login');
      return;
    }

    if (!name || !phone || !culturalAffiliation || !traditionPractice || !bio) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await custodianAPI.apply({
        name,
        phone,
        category,
        culturalAffiliation,
        traditionPractice,
        bio,
        experienceYears: Number(experienceYears),
        city,
        region,
        languages: languages.split(',').map((l) => l.trim())
      });

      if (res.success) {
        setSubmitted(true);
        toast.success('Application submitted for cultural review!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#2B211B]">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9562D] block">
              Living Heritage Preservation
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#24170F]">
              Join the CultureVerse Custodian Registry
            </h1>
            <p className="text-sm text-[#756B62] max-w-xl mx-auto leading-relaxed">
              Are you a temple archak, master craftsperson, Yakshagana artist, or oral historian? Share your living lineage, host authentic immersions, and receive 85% direct remuneration.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white border border-[#C9562D] p-8 sm:p-10 text-center space-y-4 rounded-sm shadow-sm animate-in fade-in-50 duration-300">
              <div className="w-12 h-12 rounded-sm bg-[#C9562D]/10 text-[#C9562D] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-[#24170F]">
                Application Submitted for Verification
              </h3>
              <p className="text-xs sm:text-sm text-[#756B62] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your lineage affiliation (<em>{culturalAffiliation}</em>) has been entered into the community verification queue. Once verified by our heritage panel, your public dossier and experience studio will go live.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => navigate('/custodian/dashboard')}
                  className="bg-[#24170F] hover:bg-[#C9562D] text-[#F5F0E7] text-xs px-6 py-2.5 rounded-sm transition-colors"
                >
                  Access Custodian Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#D8CEBE] p-6 sm:p-10 rounded-sm shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Guru Sanjeeva Suvarna"
                      className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Phone / WhatsApp</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Cultural Tradition</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs rounded-sm border border-[#D8CEBE] bg-[#F5F0E7] px-3 h-10 text-[#2B211B]"
                    >
                      <option value="folk_performer">Folk Performer (Yakshagana, Dance-Drama)</option>
                      <option value="artisan">Sacred Artisan / Craftsman (Kaavi Art, Carving)</option>
                      <option value="temple_custodian">Temple Priest / Archak</option>
                      <option value="historian">Oral Historian / Folklorist</option>
                      <option value="storyteller">Traditional Storyteller</option>
                      <option value="knowledge_holder">Traditional Knowledge Holder</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Years in Lineage / Practice</Label>
                    <Input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Cultural Affiliation / Guild / Lineage</Label>
                  <Input
                    value={culturalAffiliation}
                    onChange={(e) => setCulturalAffiliation(e.target.value)}
                    placeholder="e.g. Thenku Thittu Yakshagana Kalanikethana, Udupi Matha Lineage"
                    className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Tradition & Liturgical Statement</Label>
                  <Textarea
                    rows={3}
                    value={traditionPractice}
                    onChange={(e) => setTraditionPractice(e.target.value)}
                    placeholder="Describe the cultural lineage or sacred practice you uphold..."
                    className="text-xs leading-relaxed bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Short Biography</Label>
                  <Textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Your background, teachers, apprentices, and community contributions..."
                    className="text-xs leading-relaxed bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">City</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Region</Label>
                    <Input
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Languages Spoken</Label>
                    <Input
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="kn, en, tcy"
                      className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#C9562D] hover:bg-[#B24722] text-white text-xs px-8 py-3 rounded-sm transition-colors flex items-center gap-2 font-medium"
                  >
                    <span>{submitting ? 'Submitting Application...' : 'Submit Cultural Application'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <CulturalAIAssistant />
      <Footer />
    </div>
  );
};

export default ApplyCustodianPage;
