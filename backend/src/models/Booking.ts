import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PAID' | 'REFUNDED' | 'PENDING';
export type PayoutStatus = 'PENDING' | 'PROCESSED';

export interface IBooking extends Document {
  bookingNumber: string;
  travellerId: mongoose.Types.ObjectId;
  experienceId: mongoose.Types.ObjectId;
  custodianId: mongoose.Types.ObjectId;
  bookingDate: Date;
  slotTime: string;
  numberOfPeople: number;
  unitPrice: number;
  totalAmount: number;
  commissionRate: number; // e.g., 0.15 for 15%
  platformCommission: number; // totalAmount * commissionRate
  custodianShare: number; // totalAmount - platformCommission
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  payoutStatus: PayoutStatus;
  payoutDate?: Date;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true
    },
    travellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true
    },
    custodianId: {
      type: Schema.Types.ObjectId,
      ref: 'Custodian',
      required: true
    },
    bookingDate: {
      type: Date,
      required: true
    },
    slotTime: {
      type: String,
      required: true,
      default: '10:00 AM'
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    commissionRate: {
      type: Number,
      required: true,
      default: 0.15 // Configurable platform commission
    },
    platformCommission: {
      type: Number,
      required: true
    },
    custodianShare: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'CONFIRMED'
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'REFUNDED', 'PENDING'],
      default: 'PAID'
    },
    paymentId: {
      type: String
    },
    payoutStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSED'],
      default: 'PENDING'
    },
    payoutDate: {
      type: Date
    },
    contactName: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    specialRequests: String,
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ travellerId: 1, createdAt: -1 });
bookingSchema.index({ custodianId: 1, createdAt: -1 });
bookingSchema.index({ experienceId: 1, bookingDate: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
