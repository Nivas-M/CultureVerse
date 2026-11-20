import { Request, Response } from 'express';
import Knowledge, { IKnowledge } from '../models/Knowledge.js';
import Custodian from '../models/Custodian.js';
import { AuthRequest } from '../middleware/auth.js';
import { aiService, generateEmbedding } from '../services/aiService.js';

// @desc    Get all approved public knowledge records
// @route   GET /api/knowledge
// @access  Public
export const getPublicKnowledge = async (req: Request, res: Response) => {
  try {
    const { category, region, custodianId, search, language } = req.query;

    const query: any = {
      verificationStatus: 'APPROVED',
      visibility: 'PUBLIC'
    };

    if (category) {
      query.culturalCategory = category;
    }
    if (region) {
      query['location.region'] = region;
    }
    if (custodianId) {
      query.custodianId = custodianId;
    }
    if (language) {
      query.language = language;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { summary: { $regex: search as string, $options: 'i' } },
        { content: { $regex: search as string, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const items = await Knowledge.find(query)
      .populate('custodianId', 'name category culturalAffiliation profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get single knowledge item with full provenance & perspectives
// @route   GET /api/knowledge/:id
// @access  Public
export const getKnowledgeById = async (req: Request, res: Response) => {
  try {
    const item = await Knowledge.findById(req.params.id)
      .populate('custodianId', 'name category culturalAffiliation bio profileImage location')
      .populate('perspectives.custodianId', 'name culturalAffiliation profileImage');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cultural knowledge record not found' });
    }

    // Permission check for restricted content
    if (item.visibility === 'RESTRICTED') {
      return res.status(403).json({
        success: false,
        message: 'This cultural knowledge record is restricted by its custodian and requires special community permissions.'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create a draft knowledge record (Custodian only)
// @route   POST /api/knowledge/draft
// @access  Private (Custodian)
export const createDraftKnowledge = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(403).json({ success: false, message: 'Only registered custodians can submit knowledge' });
    }

    const {
      title,
      summary,
      content,
      language,
      originalLanguage,
      culturalCategory,
      sourceType,
      sourceDetails,
      mediaUrls,
      visibility,
      tags,
      region,
      coordinates
    } = req.body;

    if (!title || !summary || !content || !culturalCategory || !sourceDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: title, summary, content, culturalCategory, sourceDetails'
      });
    }

    // Generate embedding for semantic retrieval
    const textForEmbedding = `${title}. ${summary}. ${content}`;
    const embedding = await generateEmbedding(textForEmbedding);

    const knowledge = await Knowledge.create({
      title,
      summary,
      content,
      language: language || 'en',
      originalLanguage: originalLanguage || 'en',
      culturalCategory,
      custodianId: custodian._id,
      sourceType: sourceType || 'living_practice',
      sourceDetails,
      mediaUrls: mediaUrls || [],
      verificationStatus: 'DRAFT',
      visibility: visibility || 'PUBLIC',
      tags: tags || [],
      embedding,
      location: {
        type: 'Point',
        coordinates: coordinates || custodian.location.coordinates || [74.856, 12.9141],
        region: region || custodian.location.region || 'Coastal Karnataka'
      },
      approvalHistory: [
        {
          action: 'SUBMIT',
          performedBy: user._id,
          role: 'custodian',
          timestamp: new Date(),
          notes: 'Initial draft contributed by custodian'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Knowledge record created in DRAFT state. You can review and approve it when ready.',
      data: knowledge
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Structure raw field notes or oral narrative using AI helper
// @route   POST /api/knowledge/structure-ai
// @access  Private (Custodian)
export const structureKnowledgeWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    const custodianName = custodian?.name || user.name;

    const { rawNotes, categoryHint } = req.body;
    if (!rawNotes || rawNotes.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide raw notes or transcript to structure' });
    }

    const structured = await aiService.structureRawContribution(rawNotes, custodianName, categoryHint);

    res.status(200).json({
      success: true,
      data: structured
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Approve and publish a draft knowledge record (Custodian explicit sign-off)
// @route   PUT /api/knowledge/:id/approve
// @access  Private (Custodian)
export const approveKnowledge = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(403).json({ success: false, message: 'Custodian profile required' });
    }

    const item = await Knowledge.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Knowledge record not found' });
    }

    // Ensure custodian owns this knowledge item
    if (item.custodianId.toString() !== (custodian._id as any).toString()) {
      return res.status(403).json({ success: false, message: 'You can only approve your own knowledge records' });
    }

    item.verificationStatus = 'APPROVED';
    item.approvalHistory.push({
      action: 'APPROVE',
      performedBy: user._id as any,
      role: 'custodian',
      timestamp: new Date(),
      notes: req.body.notes || 'Explicitly approved and verified by custodian'
    });

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Cultural knowledge record is now APPROVED and active in the knowledge corpus.',
      data: item
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Add alternative community perspective to an existing knowledge topic
// @route   POST /api/knowledge/:id/perspective
// @access  Private (Custodian)
export const addPerspective = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(403).json({ success: false, message: 'Only verified custodians can add perspectives' });
    }

    const { interpretation, historicalContext } = req.body;
    if (!interpretation) {
      return res.status(400).json({ success: false, message: 'Please provide interpretation text' });
    }

    const item = await Knowledge.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Knowledge item not found' });
    }

    item.perspectives.push({
      custodianId: custodian._id as any,
      custodianName: custodian.name,
      community: custodian.culturalAffiliation || custodian.location.region,
      interpretation,
      historicalContext,
      recordedAt: new Date()
    });

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Perspective recorded successfully without overwriting existing traditions.',
      data: item
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
