import { Request, Response } from 'express';
import KnowledgeCandidate from '../models/KnowledgeCandidate.js';
import { ingestionService } from '../services/ingestionService.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Trigger OpenStreetMap Overpass heritage ingestion
// @route   POST /api/ingestion/fetch-osm
// @access  Private (Admin only)
export const triggerOSMIngestion = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { region } = req.body;
    const result = await ingestionService.ingestFromOpenStreetMap(region || 'Coastal Karnataka');

    res.status(200).json({
      success: true,
      message: `Ingested ${result.savedCount} new heritage candidates from OpenStreetMap`,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Fetch background context from Wikimedia with attribution
// @route   POST /api/ingestion/fetch-wikimedia
// @access  Private (Admin only)
export const triggerWikimediaIngestion = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Please specify a cultural topic to ingest' });
    }

    const candidate = await ingestionService.ingestFromWikimedia(topic);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Topic could not be found on public Wikimedia sources' });
    }

    res.status(200).json({
      success: true,
      message: 'Wikimedia background record ingested as candidate for community review.',
      data: candidate
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all ingested discovery candidates
// @route   GET /api/ingestion/candidates
// @access  Private (Admin only)
export const getCandidates = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { status, sourceType, entityType } = req.query;
    const filter: any = {};

    if (status) filter.reviewStatus = status;
    if (sourceType) filter.sourceType = sourceType;
    if (entityType) filter.entityType = entityType;

    const candidates = await KnowledgeCandidate.find(filter)
      .populate('assignedCustodianId', 'name culturalAffiliation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update candidate review status (Approve as Discovery / Reject)
// @route   PUT /api/ingestion/candidates/:id/review
// @access  Private (Admin only)
export const reviewCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { status, notes } = req.body;
    const allowed = ['APPROVED_DISCOVERY', 'REJECTED', 'PENDING_REVIEW'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid candidate status' });
    }

    const candidate = await KnowledgeCandidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate record not found' });
    }

    candidate.reviewStatus = status;
    candidate.reviewNotes = notes || candidate.reviewNotes;
    candidate.reviewedBy = user._id as any;
    await candidate.save();

    res.status(200).json({
      success: true,
      message: `Candidate review status updated to ${status}`,
      data: candidate
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Promote Candidate into Living Custodian Knowledge
// @route   POST /api/ingestion/candidates/:id/promote
// @access  Private (Admin only)
export const promoteCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { custodianId, refinedContent } = req.body;
    if (!custodianId) {
      return res.status(400).json({ success: false, message: 'A custodianId must be specified for attribution' });
    }

    const result = await ingestionService.promoteCandidateToKnowledge(
      req.params.id,
      custodianId,
      (user._id as any).toString(),
      refinedContent
    );

    res.status(200).json({
      success: true,
      message: 'Candidate successfully promoted into verified custodian knowledge corpus!',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
