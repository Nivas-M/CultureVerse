import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'PAYMENT' | 'PAYOUT' | 'REFUND';
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface ITransaction extends Document {
  transactionNumber: string;
  bookingId: mongoose.Types.ObjectId;
  custodianId: mongoose.Types.ObjectId;
  travellerId: mongoose.Types.ObjectId;
  type: TransactionType;
  grossAmount: number;
  platformFee: number;
  custodianPayout: number;
  currency: string;
  status: TransactionStatus;
  paymentGatewayRef: string;
  provider: string; // e.g. 'MOCK_SANDBOX_GATEWAY', 'RAZORPAY_SANDBOX'
  breakdown: {
    baseFare: number;
    platformCommissionPercent: number;
    platformCommissionAmount: number;
    custodianNetAmount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    custodianId: {
      type: Schema.Types.ObjectId,
      ref: 'Custodian',
      required: true
    },
    travellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['PAYMENT', 'PAYOUT', 'REFUND'],
      default: 'PAYMENT'
    },
    grossAmount: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    custodianPayout: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'SUCCESS'
    },
    paymentGatewayRef: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      default: 'MOCK_SANDBOX_GATEWAY'
    },
    breakdown: {
      baseFare: { type: Number, required: true },
      platformCommissionPercent: { type: Number, required: true },
      platformCommissionAmount: { type: Number, required: true },
      custodianNetAmount: { type: Number, required: true }
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ bookingId: 1 });
transactionSchema.index({ custodianId: 1, createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
