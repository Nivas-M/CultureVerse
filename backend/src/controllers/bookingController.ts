import { Request, Response } from 'express';
import Booking, { IBooking } from '../models/Booking.js';
import Experience from '../models/Experience.js';
import Custodian from '../models/Custodian.js';
import Transaction from '../models/Transaction.js';
import { AuthRequest } from '../middleware/auth.js';
import { paymentService } from '../services/paymentService.js';

// @desc    Book an authentic cultural experience (Traveller)
// @route   POST /api/bookings
// @access  Private (Traveller)
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const {
      experienceId,
      bookingDate,
      slotTime,
      numberOfPeople,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests
    } = req.body;

    if (!experienceId || !bookingDate || !slotTime || !numberOfPeople || !contactName || !contactEmail || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all booking details: experienceId, bookingDate, slotTime, numberOfPeople, contactName, contactEmail, contactPhone'
      });
    }

    const experience = await Experience.findById(experienceId);
    if (!experience || experience.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'Experience not found or not active' });
    }

    // Capacity verification
    if (numberOfPeople > experience.capacity) {
      return res.status(400).json({
        success: false,
        message: `Maximum group capacity is ${experience.capacity} people.`
      });
    }

    const totalAmount = experience.price * numberOfPeople;
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.15');
    const platformCommission = Math.round(totalAmount * commissionRate * 100) / 100;
    const custodianShare = Math.round((totalAmount - platformCommission) * 100) / 100;

    const bookingNumber = `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create booking record
    const booking = await Booking.create({
      bookingNumber,
      travellerId: user._id,
      experienceId: experience._id,
      custodianId: experience.custodianId,
      bookingDate: new Date(bookingDate),
      slotTime,
      numberOfPeople,
      unitPrice: experience.price,
      totalAmount,
      commissionRate,
      platformCommission,
      custodianShare,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      payoutStatus: 'PENDING',
      contactName,
      contactEmail,
      contactPhone,
      specialRequests
    });

    // Execute Payment via PaymentService (creates auditable transaction)
    const paymentResult = await paymentService.chargeBooking({
      bookingId: (booking._id as any).toString(),
      amount: totalAmount,
      currency: 'INR',
      custodianId: (experience.custodianId as any).toString(),
      travellerId: (user._id as any).toString()
    });

    const transaction = await Transaction.create({
      transactionNumber: paymentResult.transactionId,
      bookingId: booking._id,
      custodianId: experience.custodianId,
      travellerId: user._id,
      type: 'PAYMENT',
      grossAmount: totalAmount,
      platformFee: platformCommission,
      custodianPayout: custodianShare,
      currency: 'INR',
      status: 'SUCCESS',
      paymentGatewayRef: paymentResult.paymentGatewayRef,
      provider: paymentResult.provider,
      breakdown: paymentResult.breakdown
    });

    booking.paymentId = transaction.paymentGatewayRef;
    await booking.save();

    // Increment experience bookings and custodian totals
    await Experience.findByIdAndUpdate(experience._id, { $inc: { totalBookings: 1 } });
    await Custodian.findByIdAndUpdate(experience.custodianId, { $inc: { totalEarnings: custodianShare } });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed and cultural slot reserved!',
      data: {
        booking,
        transaction,
        economicBreakdown: {
          totalPaid: totalAmount,
          custodianPreservationShare: custodianShare,
          platformCommission
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get current user's bookings (Traveller)
// @route   GET /api/bookings/my-bookings
// @access  Private (Traveller)
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const bookings = await Booking.find({ travellerId: user._id })
      .populate('experienceId')
      .populate('custodianId', 'name category culturalAffiliation profileImage location phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.travellerId.toString() !== (user._id as any).toString() && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
    }

    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and refund recorded',
      data: booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
