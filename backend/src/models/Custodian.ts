import mongoose, { Document, Schema } from 'mongoose';

export type CustodianCategory =
  | 'temple_custodian'
  | 'priest'
  | 'artisan'
  | 'folk_performer'
  | 'storyteller'
  | 'historian'
  | 'community_org'
  | 'knowledge_holder';

export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export interface ICustodian extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  category: CustodianCategory;
  culturalAffiliation: string; // e.g., "Thenku Thittu Yakshagana Guild", "Udupi Ashta Matha Lineage"
  traditionPractice: string; // Detailed description of the cultural practice
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  bio: string;
  experienceYears: number;
  languages: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    address: string;
    city: string;
    state: string;
    region: string;
  };
  profileImage?: string;
  documents?: string[];
  totalEarnings: number;
  rating: number;
  totalReviews: number;
  referralCode?: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const custodianSchema = new Schema<ICustodian>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Please provide custodian name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide contact email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number']
    },
    category: {
      type: String,
      enum: [
        'temple_custodian',
        'priest',
        'artisan',
        'folk_performer',
        'storyteller',
        'historian',
        'community_org',
        'knowledge_holder'
      ],
      required: true,
      default: 'knowledge_holder'
    },
    culturalAffiliation: {
      type: String,
      required: [true, 'Please state your cultural affiliation or tradition lineage']
    },
    traditionPractice: {
      type: String,
      required: [true, 'Please describe the cultural practice or knowledge you preserve']
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING'
    },
    verificationNotes: {
      type: String
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bio: {
      type: String,
      required: [true, 'Please provide a short biographical note']
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    languages: {
      type: [String],
      default: ['en', 'kn']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [74.856, 12.9141] // Mangalore default
      },
      address: { type: String, default: '' },
      city: { type: String, default: 'Mangalore' },
      state: { type: String, default: 'Karnataka' },
      region: { type: String, default: 'Coastal Karnataka' }
    },
    profileImage: {
      type: String,
      default: '/placeholder.svg'
    },
    documents: [String],
    totalEarnings: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    referralCode: {
      type: String
    },
    referredBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// PostGIS-equivalent 2dsphere index for geospatial queries
custodianSchema.index({ 'location.coordinates': '2dsphere' });
custodianSchema.index({ verificationStatus: 1 });
custodianSchema.index({ category: 1 });

export default mongoose.model<ICustodian>('Custodian', custodianSchema);
