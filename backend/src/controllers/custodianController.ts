import { Request, Response } from 'express';
import Custodian, { ICustodian } from '../models/Custodian.js';
import User from '../models/User.js';
import Knowledge from '../models/Knowledge.js';
import Experience from '../models/Experience.js';
import Booking from '../models/Booking.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Apply to join custodian network
// @route   POST /api/custodians/apply
// @access  Private (Traveller/User applying to become Custodian)
export const applyCustodian = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Check if already applied
    const existing = await Custodian.findOne({ userId: user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A custodian application already exists for this account',
        status: existing.verificationStatus,
        custodian: existing
      });
    }

    const {
      name,
      phone,
      category,
      culturalAffiliation,
      traditionPractice,
      bio,
      experienceYears,
      languages,
      city,
      address,
      state,
      region,
      coordinates
    } = req.body;

    if (!name || !phone || !culturalAffiliation || !traditionPractice || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, culturalAffiliation, traditionPractice, bio'
      });
    }

    const custodian = await Custodian.create({
      userId: user._id,
      name,
      email: user.email,
      phone,
      category: category || 'knowledge_holder',
      culturalAffiliation,
      traditionPractice,
      bio,
      experienceYears: experienceYears || 0,
      languages: languages || ['en', 'kn'],
      verificationStatus: 'PENDING',
      location: {
        type: 'Point',
        coordinates: coordinates || [74.856, 12.9141],
        address: address || '',
        city: city || 'Mangalore',
        state: state || 'Karnataka',
        region: region || 'Coastal Karnataka'
      }
    });

    // Update user role to custodian and link custodianId
    user.role = 'custodian';
    user.custodianId = custodian._id as any;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Custodian application submitted successfully. Pending cultural verification.',
      custodian
    });
  } catch (error: any) {
    console.error('Apply custodian error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get current custodian profile
// @route   GET /api/custodians/me
// @access  Private (Custodian)
export const getMyCustodianProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(404).json({
        success: false,
        message: 'No custodian profile associated with this account'
      });
    }

    res.status(200).json({
      success: true,
      data: custodian
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current custodian profile
// @route   PUT /api/custodians/me
// @access  Private (Custodian)
export const updateMyCustodianProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(404).json({ success: false, message: 'Custodian profile not found' });
    }

    const allowedFields = [
      'name',
      'phone',
      'bio',
      'experienceYears',
      'languages',
      'traditionPractice',
      'profileImage'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (custodian as any)[field] = req.body[field];
      }
    }

    if (req.body.location) {
      custodian.location = {
        ...custodian.location,
        ...req.body.location
      };
    }

    await custodian.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: custodian
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get operational dashboard stats for custodian
// @route   GET /api/custodians/me/dashboard
// @access  Private (Custodian)
export const getCustodianDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const custodian = await Custodian.findOne({ userId: user._id });
    if (!custodian) {
      return res.status(404).json({ success: false, message: 'Custodian profile not found' });
    }

    // Live bookings for this custodian
    const bookings = await Booking.find({ custodianId: custodian._id })
      .populate('experienceId', 'title category durationMinutes')
      .populate('travellerId', 'name email')
      .sort({ createdAt: -1 });

    const grossBookingValue = bookings.reduce((sum, b) => (b.status !== 'CANCELLED' ? sum + b.totalAmount : sum), 0);
    const custodianEarnings = bookings.reduce((sum, b) => (b.status !== 'CANCELLED' ? sum + b.custodianShare : sum), 0);
    const platformFees = bookings.reduce((sum, b) => (b.status !== 'CANCELLED' ? sum + b.platformCommission : sum), 0);

    // Experiences count
    const activeExperiences = await Experience.find({ custodianId: custodian._id, status: 'ACTIVE' });
    const allExperiences = await Experience.find({ custodianId: custodian._id });

    // Knowledge contributions count
    const knowledgeStats = await Knowledge.aggregate([
      { $match: { custodianId: custodian._id } },
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]);

    const knowledgeByVisibility = await Knowledge.aggregate([
      { $match: { custodianId: custodian._id } },
      { $group: { _id: '$visibility', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        custodian,
        verificationStatus: custodian.verificationStatus,
        financials: {
          grossBookingValue,
          custodianEarnings,
          platformFees,
          totalBookingsCount: bookings.length,
          completedPayouts: custodian.totalEarnings
        },
        experiences: {
          activeCount: activeExperiences.length,
          totalCount: allExperiences.length,
          items: allExperiences
        },
        knowledgeStats: {
          byStatus: knowledgeStats,
          byVisibility: knowledgeByVisibility
        },
        recentBookings: bookings.slice(0, 10)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Public list of verified custodians
// @route   GET /api/custodians
// @access  Public
export const getPublicCustodians = async (req: Request, res: Response) => {
  try {
    const { category, region, search } = req.query;

    const query: any = { verificationStatus: 'VERIFIED' };

    if (category) {
      query.category = category;
    }
    if (region) {
      query['location.region'] = region;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { culturalAffiliation: { $regex: search as string, $options: 'i' } },
        { traditionPractice: { $regex: search as string, $options: 'i' } }
      ];
    }

    const custodians = await Custodian.find(query).select('-documents -phone -email');

    res.status(200).json({
      success: true,
      count: custodians.length,
      data: custodians
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Public get custodian by ID with public knowledge & experiences
// @route   GET /api/custodians/:id
// @access  Public
export const getCustodianById = async (req: Request, res: Response) => {
  try {
    const custodian = await Custodian.findById(req.params.id).select('-documents -phone -email');

    if (!custodian) {
      return res.status(404).json({ success: false, message: 'Custodian not found' });
    }

    // Fetch approved & public knowledge
    const knowledge = await Knowledge.find({
      custodianId: custodian._id,
      verificationStatus: 'APPROVED',
      visibility: 'PUBLIC'
    });

    // Fetch active experiences
    const experiences = await Experience.find({
      custodianId: custodian._id,
      status: 'ACTIVE'
    });

    res.status(200).json({
      success: true,
      data: {
        ...custodian.toObject(),
        approvedKnowledge: knowledge,
        experiences
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
