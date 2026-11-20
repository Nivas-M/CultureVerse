import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { adminAPI, ingestionAPI, Custodian, KnowledgeCandidate } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  DownloadCloud,
  Database,
  ExternalLink,
  Globe,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any | null>(null);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [candidates, setCandidates] = useState<KnowledgeCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Ingestion Controls State
  const [ingestingOSM, setIngestingOSM] = useState(false);
  const [wikiTopic, setWikiTopic] = useState('Yakshagana');
  const [ingestingWiki, setIngestingWiki] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<KnowledgeCandidate | null>(null);
  const [selectedCustodianId, setSelectedCustodianId] = useState('');
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const overviewRes = await adminAPI.getOverview();
      if (overviewRes.success) {
        setOverview(overviewRes.data);
      }

      const queryStatus = statusFilter === 'ALL' ? undefined : statusFilter;
      const verificationsRes = await adminAPI.getVerifications(queryStatus);
      if (verificationsRes.success) {
        setCustodians(verificationsRes.data);
        if (verificationsRes.data.length > 0 && !selectedCustodianId) {
          setSelectedCustodianId(verificationsRes.data[0]._id);
        }
      }

      const candidatesRes = await ingestionAPI.getCandidates();
      if (candidatesRes.success) {
        setCandidates(candidatesRes.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Admin API error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (custodianId: string, newStatus: string) => {
    try {
      const res = await adminAPI.updateVerification(custodianId, newStatus, `Updated by admin on ${new Date().toLocaleDateString()}`);
      if (res.success) {
        toast.success(`Custodian status updated to ${newStatus}`);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update verification status');
    }
  };

  // OpenStreetMap Ingestion
  const handleTriggerOSM = async () => {
    setIngestingOSM(true);
    try {
      const res = await ingestionAPI.fetchOSM('Coastal Karnataka');
      if (res.success) {
        toast.success(res.message);
        fetchData();
      }
    } catch (err: any) {
      toast.error('OSM Ingestion error: ' + err.message);
    } finally {
      setIngestingOSM(false);
    }
  };

  // Wikimedia Ingestion
  const handleTriggerWiki = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wikiTopic.trim()) return;
    setIngestingWiki(true);
    try {
      const res = await ingestionAPI.fetchWikimedia(wikiTopic.trim());
      if (res.success) {
        toast.success(res.message);
        setWikiTopic('');
        fetchData();
      }
    } catch (err: any) {
      toast.error('Wikimedia fetch error: ' + err.message);
    } finally {
      setIngestingWiki(false);
    }
  };

  // Candidate review
  const handleReviewCandidate = async (candidateId: string, status: string) => {
    try {
      const res = await ingestionAPI.reviewCandidate(candidateId, status);
      if (res.success) {
        toast.success(`Discovery candidate marked as ${status}`);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Promote candidate to living custodian knowledge
  const handlePromoteCandidate = async (candidateId: string) => {
    if (!selectedCustodianId) {
      toast.error('Please choose a verified custodian to attribute this knowledge to.');
      return;
    }
    setPromoting(true);
    try {
      const res = await ingestionAPI.promoteCandidate(candidateId, selectedCustodianId);
      if (res.success) {
        toast.success('Candidate successfully promoted into verified custodian knowledge corpus!');
        setSelectedCandidate(null);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                  Admin Trust & Provenance Console
                </Badge>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Cultural Governance & Open Discovery Pipeline
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review custodian applicants, govern open discovery ingestion, and promote candidate data to trusted knowledge.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={fetchData} className="flex items-center gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Platform Metrics Bar */}
          {overview && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
                <span className="text-xs text-muted-foreground">Total Verified Custodians</span>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {overview.counts.verifiedCustodians}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  {overview.counts.pendingCustodians} pending review
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
                <span className="text-xs text-muted-foreground">Approved Knowledge Records</span>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {overview.counts.approvedKnowledge}
                </p>
                <p className="text-[11px] text-muted-foreground">Active in RAG vector space</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
                <span className="text-xs text-muted-foreground">Discovery Candidates</span>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {candidates.length}
                </p>
                <p className="text-[11px] text-muted-foreground">OpenStreetMap & Wikimedia</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5 space-y-1">
                <span className="text-xs text-muted-foreground">Total Disbursed to Custodians</span>
                <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{overview.financials.totalCustodianDisbursed.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">85% direct community share</p>
              </div>
            </div>
          )}

          {/* Tabs: Custodian Verifications vs Ingestion Pipeline */}
          <Tabs defaultValue="verifications" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="verifications" className="text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Custodian Queue ({custodians.length})</span>
              </TabsTrigger>
              <TabsTrigger value="ingestion" className="text-xs flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>Open Discovery Pipeline ({candidates.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Custodian Verification Queue */}
            <TabsContent value="verifications">
              <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/70 pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      Custodian Verification Queue
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Review tradition statements and credentials. Only verified custodians can publish content.
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`text-xs px-3 py-1 rounded-lg border transition ${
                          statusFilter === st
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">Loading queue...</div>
                ) : custodians.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    No applicants matching filter {statusFilter}.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {custodians.map((c) => (
                      <div key={c._id} className="py-5 space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-base text-foreground">{c.name}</h4>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  c.verificationStatus === 'VERIFIED'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                    : c.verificationStatus === 'PENDING'
                                    ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                    : 'bg-destructive/10 text-destructive border-destructive/30'
                                }`}
                              >
                                {c.verificationStatus}
                              </Badge>
                              <span className="text-xs text-muted-foreground">({c.category.replace('_', ' ')})</span>
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                              {c.culturalAffiliation}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Location: {c.location.city}, {c.location.region} • Experience: {c.experienceYears} years
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {c.verificationStatus !== 'VERIFIED' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(c._id, 'VERIFIED')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify Custodian</span>
                              </Button>
                            )}

                            {c.verificationStatus !== 'REJECTED' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateStatus(c._id, 'REJECTED')}
                                className="text-xs h-8 flex items-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-xl border border-border/50 text-xs space-y-1">
                          <p className="font-semibold text-foreground">Lineage & Tradition Statement:</p>
                          <p className="text-muted-foreground leading-relaxed">{c.traditionPractice}</p>
                          <p className="text-muted-foreground pt-1 italic">{c.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: Open Discovery & Ingestion Pipeline */}
            <TabsContent value="ingestion" className="space-y-6">
              <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-6">
                <div className="border-b border-border/70 pb-4">
                  <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-600" />
                    <span>Open Data Ingestion Engine</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Ingest raw places, artisan quarters, and historical background from OpenStreetMap and Wikimedia. Ingested data enters the pipeline as <strong>KnowledgeCandidate</strong> (Discovery Only) and is strictly barred from the trusted RAG corpus until reviewed and attributed to a verified custodian.
                  </p>
                </div>

                {/* Ingestion Triggers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trigger 1: OpenStreetMap Overpass */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-600" />
                      <h4 className="font-semibold text-sm text-foreground">OpenStreetMap Heritage Query</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Queries places of worship, historic quarters, and shrines in Coastal Karnataka via Overpass API with ODbL attribution.
                    </p>
                    <Button
                      size="sm"
                      onClick={handleTriggerOSM}
                      disabled={ingestingOSM}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex items-center gap-1.5"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{ingestingOSM ? 'Fetching from OSM...' : 'Trigger OSM Coastal Ingest'}</span>
                    </Button>
                  </div>

                  {/* Trigger 2: Wikimedia API */}
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-sm text-foreground">Wikimedia Public History Ingest</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fetches documented historical summaries and references under CC-BY-SA 4.0 license.
                    </p>
                    <form onSubmit={handleTriggerWiki} className="flex gap-2">
                      <Input
                        value={wikiTopic}
                        onChange={(e) => setWikiTopic(e.target.value)}
                        placeholder="e.g. Yakshagana, Kaavi art, Tulu language"
                        className="text-xs h-8"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={ingestingWiki || !wikiTopic.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 shrink-0"
                      >
                        <span>{ingestingWiki ? 'Fetching...' : 'Ingest'}</span>
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Candidate Queue List */}
                <div className="space-y-4 pt-4 border-t border-border/70">
                  <h4 className="font-serif font-bold text-base text-foreground">
                    Discovery Candidates ({candidates.length})
                  </h4>

                  {candidates.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">
                      No open discovery candidates currently ingested. Use the triggers above to ingest.
                    </p>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {candidates.map((cand) => (
                        <div key={cand._id} className="py-4 space-y-2">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-foreground">{cand.title}</span>
                                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                  {cand.sourceType}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] ${
                                    cand.reviewStatus === 'PROMOTED_TO_CUSTODIAN_KNOWLEDGE'
                                      ? 'bg-emerald-500/10 text-emerald-600'
                                      : cand.reviewStatus === 'APPROVED_DISCOVERY'
                                      ? 'bg-blue-500/10 text-blue-600'
                                      : 'bg-amber-500/10 text-amber-700'
                                  }`}
                                >
                                  {cand.reviewStatus.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Source: <a href={cand.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-amber-600">{cand.sourceName}</a> • License: {cand.licenseAttribution}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                              {cand.reviewStatus !== 'APPROVED_DISCOVERY' && cand.reviewStatus !== 'PROMOTED_TO_CUSTODIAN_KNOWLEDGE' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewCandidate(cand._id, 'APPROVED_DISCOVERY')}
                                  className="text-xs h-7"
                                >
                                  Approve Discovery
                                </Button>
                              )}

                              {cand.reviewStatus !== 'PROMOTED_TO_CUSTODIAN_KNOWLEDGE' && (
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedCandidate(cand)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7"
                                >
                                  Promote to Custodian
                                </Button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {cand.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Promotion Modal to Link Candidate to Verified Custodian */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="font-serif font-bold text-lg text-foreground">
              Promote to Living Custodian Knowledge
            </h3>
            <p className="text-xs text-muted-foreground">
              Assigning this candidate to a verified cultural custodian validates the oral provenance and allows it to enter the trusted RAG corpus.
            </p>

            <div className="p-3 bg-muted/40 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-foreground">{selectedCandidate.title}</p>
              <p className="text-muted-foreground text-[11px]">{selectedCandidate.summary}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Verified Custodian</label>
              <select
                value={selectedCustodianId}
                onChange={(e) => setSelectedCustodianId(e.target.value)}
                className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                {custodians.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.culturalAffiliation})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={promoting}
                onClick={() => handlePromoteCandidate(selectedCandidate._id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{promoting ? 'Promoting...' : 'Promote & Index in RAG'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
