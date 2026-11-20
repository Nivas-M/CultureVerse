import mongoose, { Document, Schema } from 'mongoose';

export type ExperienceCategory =
  | 'craft_workshop'
  | 'folk_performance'
  | 'heritage_walk'
  | 'storytelling'
  | 'temple_ritual'
  | 'traditional_cuisine'
  | 'community_gathering';

export type ExperienceStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE';

export interface IExperience extends Document {
  title: string;
  description: string;
  culturalContext: string;
  custodianId: mongoose.Types.ObjectId;
  category: ExperienceCategory;
  durationMinutes: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    address: string;
    city: string;
    region: string;
  };
  capacity: number;
  price: number; // in INR
  languages: string[];
  availabilitySchedule: string[]; // e.g., ["Every Saturday 10:00 AM", "Weekdays on request"]
  culturalGuidelines: string[];
  preparationRequirements: string[];
  images: string[];
  status: ExperienceStatus;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    title: {
      type: String,
      required: [true, 'Please provide experience title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide experience description']
    },
    culturalContext: {
      type: String,
      required: [true, 'Please explain the cultural significance of this experience']
    },
    custodianId: {
      type: Schema.Types.ObjectId,
      ref: 'Custodian',
      required: true
    },
    category: {
      type: String,
      enum: [
        'craft_workshop',
        'folk_performance',
        'heritage_walk',
        'storytelling',
        'temple_ritual',
        'traditional_cuisine',
        'community_gathering'
      ],
      required: true
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Please specify duration in minutes'],
      default: 120
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [74.856, 12.9141]
      },
      address: { type: String, required: true },
      city: { type: String, default: 'Mangalore' },
      region: { type: String, default: 'Tulunadu' }
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify max capacity'],
      min: 1,
      default: 10
    },
    price: {
      type: Number,
      required: [true, 'Please specify price per person in INR'],
      min: 0
    },
    languages: {
      type: [String],
      default: ['en', 'kn']
    },
    availabilitySchedule: {
      type: [String],
      default: ['Saturday 10:00 AM', 'Sunday 04:00 PM']
    },
    culturalGuidelines: {
      type: [String],
      default: [
        'Respect sacred boundaries and dress code',
        'Photography only where explicitly permitted by the custodian'
      ]
    },
    preparationRequirements: {
      type: [String],
      default: ['Comfortable walking attire', 'Modest clothing for sacred grounds']
    },
    images: {
      type: [String],
      default: ['/placeholder.svg']
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
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
    totalBookings: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

experienceSchema.index({ 'location.coordinates': '2dsphere' });
experienceSchema.index({ custodianId: 1, status: 1 });
experienceSchema.index({ category: 1, status: 1 });

export default mongoose.model<IExperience>('Experience', experienceSchema);
