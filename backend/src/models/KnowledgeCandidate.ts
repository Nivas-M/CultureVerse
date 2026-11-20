import mongoose, { Document, Schema } from 'mongoose';

export type CandidateSourceType =
  | 'openstreetmap'
  | 'wikimedia'
  | 'official_archive'
  | 'public_heritage_portal'
  | 'community_nomination';

export type CandidateEntityType =
  | 'place'
  | 'tradition'
  | 'craft'
  | 'folk_performance'
  | 'festival'
  | 'sacred_grove'
  | 'oral_story';

export type CandidateReviewStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED_DISCOVERY'
  | 'REJECTED'
  | 'PROMOTED_TO_CUSTODIAN_KNOWLEDGE';

export interface IKnowledgeCandidate extends Document {
  title: string;
  sourceType: CandidateSourceType;
  sourceName: string;
  sourceUrl: string;
  licenseAttribution?: string;
  retrievedAt: Date;
  entityType: CandidateEntityType;
  externalId?: string; // e.g. OSM Node ID or Wikidata ID
  summary: string;
  rawContent: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    address?: string;
    city?: string;
    region?: string;
  };
  tags: string[];
  reviewStatus: CandidateReviewStatus;
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  promotedKnowledgeId?: mongoose.Types.ObjectId;
  assignedCustodianId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeCandidateSchema = new Schema<IKnowledgeCandidate>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    sourceType: {
      type: String,
      enum: [
        'openstreetmap',
        'wikimedia',
        'official_archive',
        'public_heritage_portal',
        'community_nomination'
      ],
      required: true
    },
    sourceName: {
      type: String,
      required: true
    },
    sourceUrl: {
      type: String,
      required: true
    },
    licenseAttribution: {
      type: String,
      default: 'Open Data / Public Domain / CC-BY-SA'
    },
    retrievedAt: {
      type: Date,
      default: Date.now
    },
    entityType: {
      type: String,
      enum: [
        'place',
        'tradition',
        'craft',
        'folk_performance',
        'festival',
        'sacred_grove',
        'oral_story'
      ],
      default: 'place'
    },
    externalId: {
      type: String
    },
    summary: {
      type: String,
      required: true
    },
    rawContent: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [74.856, 12.9141]
      },
      address: String,
      city: String,
      region: String
    },
    tags: [String],
    reviewStatus: {
      type: String,
      enum: [
        'PENDING_REVIEW',
        'APPROVED_DISCOVERY',
        'REJECTED',
        'PROMOTED_TO_CUSTODIAN_KNOWLEDGE'
      ],
      default: 'PENDING_REVIEW'
    },
    reviewNotes: String,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    promotedKnowledgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Knowledge'
    },
    assignedCustodianId: {
      type: Schema.Types.ObjectId,
      ref: 'Custodian'
    }
  },
  {
    timestamps: true
  }
);

knowledgeCandidateSchema.index({ reviewStatus: 1 });
knowledgeCandidateSchema.index({ sourceType: 1, externalId: 1 });
knowledgeCandidateSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IKnowledgeCandidate>('KnowledgeCandidate', knowledgeCandidateSchema);
