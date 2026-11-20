import { Request, Response } from 'express';
import Custodian, { VerificationStatus } from '../models/Custodian.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Knowledge from '../models/Knowledge.js';
import Experience from '../models/Experience.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all custodian applications in verification queue
// @route   GET /api/admin/verifications
// @access  Private (Admin only)
export const getPendingVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { status } = req.query;
    const filter: any = {};
    if (status) {
      filter.verificationStatus = status;
    }

    const custodians = await Custodian.find(filter)
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: custodians.length,
      data: custodians
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update custodian verification status (Approve, Reject, Suspend)
// @route   PUT /api/admin/verify-custodian/:id
// @access  Private (Admin only)
export const updateCustodianVerification = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const { status, notes } = req.body;
    const allowedStatuses: VerificationStatus[] = ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid verification status. Allowed: ${allowedStatuses.join(', ')}`
      });
    }

    const custodian = await Custodian.findById(req.params.id);
    if (!custodian) {
      return res.status(404).json({ success: false, message: 'Custodian profile not found' });
    }

    custodian.verificationStatus = status;
    custodian.verificationNotes = notes || custodian.verificationNotes;
    if (status === 'VERIFIED') {
      custodian.verifiedAt = new Date();
      custodian.verifiedBy = user._id as any;

      // Activate custodian role on user
      await User.findByIdAndUpdate(custodian.userId, { role: 'custodian', custodianId: custodian._id });
    }

    await custodian.save();

    res.status(200).json({
      success: true,
      message: `Custodian verification status updated to ${status}`,
      data: custodian
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get system-wide platform trust overview
// @route   GET /api/admin/overview
// @access  Private (Admin only)
export const getPlatformOverview = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    const totalUsers = await User.countDocuments();
    const verifiedCustodians = await Custodian.countDocuments({ verificationStatus: 'VERIFIED' });
    const pendingCustodians = await Custodian.countDocuments({ verificationStatus: 'PENDING' });
    const approvedKnowledge = await Knowledge.countDocuments({ verificationStatus: 'APPROVED' });
    const activeExperiences = await Experience.countDocuments({ status: 'ACTIVE' });
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find({ status: { $ne: 'CANCELLED' } });
    const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPlatformCommission = bookings.reduce((sum, b) => sum + b.platformCommission, 0);
    const totalCustodianDisbursed = bookings.reduce((sum, b) => sum + b.custodianShare, 0);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          verifiedCustodians,
          pendingCustodians,
          approvedKnowledge,
          activeExperiences,
          totalBookings
        },
        financials: {
          totalGrossRevenue,
          totalPlatformCommission,
          totalCustodianDisbursed
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
