import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { custodianAPI, knowledgeAPI, experienceAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  BookOpen,
  PlusCircle,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  FileText,
  Send,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const CustodianDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Knowledge Capture State
  const [rawNotes, setRawNotes] = useState('');
  const [aiStructuring, setAiStructuring] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSummary, setDraftSummary] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftCategory, setDraftCategory] = useState('folk_art');
  const [draftSource, setDraftSource] = useState('');
  const [draftPublishing, setDraftPublishing] = useState(false);

  // Experience Creation State
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [expCulturalContext, setExpCulturalContext] = useState('');
  const [expCategory, setExpCategory] = useState('craft_workshop');
  const [expPrice, setExpPrice] = useState(1500);
  const [expDuration, setExpDuration] = useState(120);
  const [expCapacity, setExpCapacity] = useState(10);
  const [expAddress, setExpAddress] = useState('');
  const [expCity, setExpCity] = useState('Mangalore');
  const [expSchedule, setExpSchedule] = useState('Every Saturday 10:00 AM');
  const [expSubmitting, setExpSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await custodianAPI.getDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load custodian dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Human-assisted AI structuring
  const handleAIStructure = async () => {
    if (!rawNotes.trim()) {
      toast.error('Please input your field notes or spoken oral transcript.');
      return;
    }

    setAiStructuring(true);
    try {
      const res = await knowledgeAPI.structureWithAI(rawNotes, draftCategory);
      if (res.success && res.data) {
        setDraftTitle(res.data.title || '');
        setDraftSummary(res.data.summary || '');
        setDraftContent(res.data.structuredContent || '');
        setDraftCategory(res.data.culturalCategory || draftCategory);
        setDraftSource(res.data.sourceDetails || `Oral lineage transmitted through ${user?.name}`);
        toast.success('Notes structured by Cultural AI! You can now review, refine, and approve.');
      }
    } catch (err: any) {
      toast.error('AI structuring error: ' + err.message);
    } finally {
      setAiStructuring(false);
    }
  };

  // Submit & Approve Knowledge Record
  const handlePublishKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !draftSummary || !draftContent || !draftSource) {
      toast.error('Please complete all required fields.');
      return;
    }

    setDraftPublishing(true);
    try {
      // Step 1: Create draft
      const draftRes = await knowledgeAPI.createDraft({
        title: draftTitle,
        summary: draftSummary,
        content: draftContent,
        culturalCategory: draftCategory,
        sourceDetails: draftSource,
        sourceType: 'living_practice'
      });

      if (draftRes.success && draftRes.data) {
        // Step 2: Custodian explicit approval
        await knowledgeAPI.approve(draftRes.data._id, 'Approved and verified by custodian');
        toast.success('Knowledge record approved and published to the public cultural archive!');
        // Reset form
        setRawNotes('');
        setDraftTitle('');
        setDraftSummary('');
        setDraftContent('');
        setDraftSource('');
        fetchDashboard();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish knowledge record');
    } finally {
      setDraftPublishing(false);
    }
  };

  // Create Experience
  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpSubmitting(true);
    try {
      const res = await experienceAPI.create({
        title: expTitle,
        description: expDescription,
        culturalContext: expCulturalContext,
        category: expCategory,
        price: Number(expPrice),
        durationMinutes: Number(expDuration),
        capacity: Number(expCapacity),
        address: expAddress,
        city: expCity,
        availabilitySchedule: [expSchedule]
      });

      if (res.success) {
        toast.success('Experience published successfully!');
        setShowExpModal(false);
        fetchDashboard();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create experience');
    } finally {
      setExpSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const financials = dashboardData?.financials || {
    grossBookingValue: 0,
    custodianEarnings: 0,
    platformFees: 0,
    totalBookingsCount: 0
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                  Verified Custodian Portal
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {dashboardData?.custodian?.culturalAffiliation}
                </Badge>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {dashboardData?.custodian?.name || user?.name}'s Operational Hub
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage your living cultural knowledge, hosted experiences, and community revenue sharing.
              </p>
            </div>

            <Button
              onClick={() => setShowExpModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Experience</span>
            </Button>
          </div>

          {/* Financials Overview Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
              <span className="text-xs text-muted-foreground">Your Net Preservation Earnings</span>
              <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{financials.custodianEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">85% direct community revenue</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
              <span className="text-xs text-muted-foreground">Gross Bookings Value</span>
              <p className="font-serif text-2xl font-bold text-foreground">
                ₹{financials.grossBookingValue.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">Total traveller payments</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
              <span className="text-xs text-muted-foreground">CultureVerse Commission (15%)</span>
              <p className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400">
                ₹{financials.platformFees.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">Platform maintenance & RAG AI</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
              <span className="text-xs text-muted-foreground">Total Bookings Count</span>
              <p className="font-serif text-2xl font-bold text-foreground">
                {financials.totalBookingsCount}
              </p>
              <p className="text-[11px] text-muted-foreground">Traveller visits scheduled</p>
            </div>
          </div>

          {/* Main Operational Tabs */}
          <Tabs defaultValue="knowledge-studio" className="w-full">
            <TabsList className="grid w-full max-w-xl grid-cols-3 mb-6">
              <TabsTrigger value="knowledge-studio" className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Knowledge Studio</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2 text-xs">
                <Calendar className="w-4 h-4" />
                <span>Bookings ({dashboardData?.recentBookings?.length || 0})</span>
              </TabsTrigger>
              <TabsTrigger value="experiences" className="flex items-center gap-2 text-xs">
                <Users className="w-4 h-4" />
                <span>My Experiences ({dashboardData?.experiences?.items?.length || 0})</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Human-Assisted Knowledge Capture Studio */}
            <TabsContent value="knowledge-studio" className="space-y-6">
              <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-6">
                <div className="border-b border-border/70 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      Human-Assisted Cultural Knowledge Capture
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Paste raw field notes or oral narrative transcripts. The AI assistant will structure them into a formal cultural record for your review, edit, and approval.
                  </p>
                </div>

                {/* Step 1: Input raw text */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold">1. Spoken Transcript or Field Notes</Label>
                  <Textarea
                    rows={4}
                    placeholder="Example: In our Yakshagana lineage, the Maddale drum tempo changes during the battle sequence (Kandane). We use natural charcoal and zinc for face makeup..."
                    value={rawNotes}
                    onChange={(e) => setRawNotes(e.target.value)}
                    className="text-xs bg-muted/30 font-sans"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground">
                      AI will extract titles, summaries, categories, and guidelines preserving your voice.
                    </span>
                    <Button
                      type="button"
                      onClick={handleAIStructure}
                      disabled={aiStructuring || !rawNotes.trim()}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-9 flex items-center gap-2"
                    >
                      {aiStructuring ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>Structure with AI</span>
                    </Button>
                  </div>
                </div>

                {/* Step 2: Custodian Review & Publish Form */}
                <form onSubmit={handlePublishKnowledge} className="space-y-4 pt-4 border-t border-border/70">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    2. Custodian Review & Approval Verification
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Cultural Record Title</Label>
                      <Input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        placeholder="e.g. Rhythm Structures of Thenku Thittu Yakshagana"
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Cultural Category</Label>
                      <select
                        value={draftCategory}
                        onChange={(e) => setDraftCategory(e.target.value)}
                        className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                      >
                        <option value="folk_art">Yakshagana & Folk Performing Arts</option>
                        <option value="craft">Sacred Crafts & Architecture</option>
                        <option value="sacred_geography">Nagara Bana & Sacred Ecology</option>
                        <option value="temple_heritage">Temple Heritage & Liturgy</option>
                        <option value="oral_history">Oral Traditions & Paddanas</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Discovery Summary (2 Sentences)</Label>
                    <Input
                      value={draftSummary}
                      onChange={(e) => setDraftSummary(e.target.value)}
                      placeholder="Brief summary for discovery and citations..."
                      className="text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Structured Cultural Narrative</Label>
                    <Textarea
                      rows={5}
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Detailed structured narrative..."
                      className="text-xs leading-relaxed"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Provenance & Lineage Source Details</Label>
                    <Input
                      value={draftSource}
                      onChange={(e) => setDraftSource(e.target.value)}
                      placeholder="e.g. Transmitted orally through 4 generations of coastal artists"
                      className="text-xs"
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={draftPublishing || !draftTitle}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{draftPublishing ? 'Verifying & Publishing...' : 'Approve & Publish to Archive'}</span>
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* TAB 2: Bookings */}
            <TabsContent value="bookings" className="space-y-4">
              <div className="bg-card rounded-3xl border border-border p-6">
                <h3 className="font-serif font-bold text-lg text-foreground mb-4">
                  Upcoming Traveller Bookings
                </h3>

                {!dashboardData?.recentBookings || dashboardData.recentBookings.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No bookings received yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border/60">
                    {dashboardData.recentBookings.map((b: any) => (
                      <div key={b._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{b.contactName}</span>
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                              {b.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {b.experienceId?.title || 'Cultural Experience'} • {b.numberOfPeople} guests
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Date: <strong>{new Date(b.bookingDate).toLocaleDateString()}</strong> at <strong>{b.slotTime}</strong> • Tel: {b.contactPhone}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-serif font-bold text-emerald-600 text-sm">
                            +₹{b.custodianShare}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            Ref: {b.bookingNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3: Experiences */}
            <TabsContent value="experiences" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData?.experiences?.items?.map((exp: any) => (
                  <div key={exp._id} className="bg-card rounded-2xl border border-border p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {exp.category.replace('_', ' ')}
                      </Badge>
                      <span className="font-bold text-amber-700 text-sm">₹{exp.price} / guest</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-foreground">{exp.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{exp.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border">
                      <span>Schedule: {exp.availabilitySchedule?.[0]}</span>
                      <span>Total Bookings: {exp.totalBookings || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modal for Creating New Experience */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-3xl w-full max-w-xl max-h-[85vh] shadow-2xl p-6 overflow-y-auto space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="font-serif font-bold text-xl text-foreground">Create New Cultural Experience</h3>
            <form onSubmit={handleCreateExperience} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Experience Title</Label>
                <Input
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g. Masterclass in Traditional Laterite Sgraffito"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Cultural Context & Significance</Label>
                <Textarea
                  rows={2}
                  value={expCulturalContext}
                  onChange={(e) => setExpCulturalContext(e.target.value)}
                  placeholder="Why is this practice culturally important?"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Detailed Description</Label>
                <Textarea
                  rows={3}
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="What will travellers learn and do?"
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Price per Person (₹ INR)</Label>
                  <Input
                    type="number"
                    value={expPrice}
                    onChange={(e) => setExpPrice(Number(e.target.value))}
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Capacity</Label>
                  <Input
                    type="number"
                    value={expCapacity}
                    onChange={(e) => setExpCapacity(Number(e.target.value))}
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Location / Address</Label>
                  <Input
                    value={expAddress}
                    onChange={(e) => setExpAddress(e.target.value)}
                    placeholder="Studio or temple address"
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Availability Schedule</Label>
                  <Input
                    value={expSchedule}
                    onChange={(e) => setExpSchedule(e.target.value)}
                    placeholder="e.g. Saturday 10:00 AM"
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowExpModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={expSubmitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                  {expSubmitting ? 'Creating...' : 'Publish Experience'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustodianDashboardPage;
