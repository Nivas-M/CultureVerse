import { Request, Response } from 'express';
import Experience, { IExperience } from '../models/Experience.js';
import Custodian from '../models/Custodian.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all active public experiences
// @route   GET /api/experiences
// @access  Public
export const getPublicExperiences = async (req: Request, res: Response) => {
  try {
    const { category, region, custodianId, maxPrice, search } = req.query;

    const query: any = { status: 'ACTIVE' };

    if (category) {
      query.category = category;
    }
    if (region) {
      query['location.region'] = region;
    }
    if (custodianId) {
      query.custodianId = custodianId;
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { culturalContext: { $regex: search as string, $options: 'i' } }
      ];
    }

    const experiences = await Experience.find(query)
      .populate('custodianId', 'name category culturalAffiliation rating profileImage location verificationStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get single experience with details & custodian context
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id).populate(
      'custodianId',
      'name category culturalAffiliation bio rating totalReviews profileImage location languages verificationStatus'
    );

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create new experience (Custodian only)
// @route   POST /api/experiences
// @access  Private (Custodian)
export const createExperience = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(403).json({ success: false, message: 'Custodian profile required' });
    }

    const {
      title,
      description,
      culturalContext,
      category,
      durationMinutes,
      address,
      city,
      region,
      coordinates,
      capacity,
      price,
      languages,
      availabilitySchedule,
      culturalGuidelines,
      preparationRequirements,
      images
    } = req.body;

    if (!title || !description || !culturalContext || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: title, description, culturalContext, category, price'
      });
    }

    const experience = await Experience.create({
      title,
      description,
      culturalContext,
      custodianId: custodian._id,
      category,
      durationMinutes: durationMinutes || 120,
      location: {
        type: 'Point',
        coordinates: coordinates || custodian.location.coordinates || [74.856, 12.9141],
        address: address || custodian.location.address || 'Mangalore',
        city: city || custodian.location.city || 'Mangalore',
        region: region || custodian.location.region || 'Tulunadu'
      },
      capacity: capacity || 10,
      price,
      languages: languages || custodian.languages || ['en', 'kn'],
      availabilitySchedule: availabilitySchedule || ['Saturday 10:00 AM', 'Sunday 03:00 PM'],
      culturalGuidelines: culturalGuidelines || [
        'Respect sacred spaces and attire etiquette',
        'Follow custodian directives'
      ],
      preparationRequirements: preparationRequirements || ['Modest clothing'],
      images: images || ['/placeholder.svg'],
      status: 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      message: 'Experience created and published successfully.',
      data: experience
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update experience (Custodian only)
// @route   PUT /api/experiences/:id
// @access  Private (Custodian)
export const updateExperience = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(403).json({ success: false, message: 'Custodian profile required' });
    }

    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    if (experience.custodianId.toString() !== (custodian._id as any).toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own experiences' });
    }

    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
