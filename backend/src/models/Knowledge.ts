import mongoose, { Document, Schema } from 'mongoose';

export type CulturalCategory =
  | 'temple_heritage'
  | 'ritual_tradition'
  | 'folk_art'
  | 'craft'
  | 'oral_history'
  | 'festival'
  | 'traditional_cuisine'
  | 'sacred_geography';

export type KnowledgeVisibility = 'PUBLIC' | 'COMMUNITY' | 'RESTRICTED';

export type KnowledgeStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface IPerspective {
  custodianId: mongoose.Types.ObjectId;
  custodianName: string;
  community: string;
  interpretation: string;
  historicalContext?: string;
  recordedAt: Date;
}

export interface IApprovalAction {
  action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'RESTRICT' | 'EDIT';
  performedBy: mongoose.Types.ObjectId;
  role: string;
  timestamp: Date;
  notes?: string;
}

export interface IKnowledge extends Document {
  title: string;
  summary: string;
  content: string;
  language: string; // 'en' | 'kn' | 'tcy' (Tulu) | 'kok' (Konkani)
  originalLanguage: string;
  culturalCategory: CulturalCategory;
  custodianId: mongoose.Types.ObjectId;
  sourceType: 'oral_lineage' | 'archival_manuscript' | 'living_practice' | 'temple_record';
  sourceDetails: string;
  mediaUrls: string[];
  verificationStatus: KnowledgeStatus;
  visibility: KnowledgeVisibility;
  perspectives: IPerspective[];
  approvalHistory: IApprovalAction[];
  tags: string[];
  embedding: number[]; // Vector embedding for semantic RAG search
  location?: {
    type: 'Point';
    coordinates: [number, number];
    region: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const perspectiveSchema = new Schema<IPerspective>(
  {
    custodianId: {
      type: Schema.Types.ObjectId,
      ref: 'Custodian',
      required: true
    },
    custodianName: {
      type: String,
      required: true
    },
    community: {
      type: String,
      required: true
    },
    interpretation: {
      type: String,
      required: true
    },
    historicalContext: String,
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const approvalActionSchema = new Schema<IApprovalAction>(
  {
    action: {
      type: String,
      enum: ['SUBMIT', 'APPROVE', 'REJECT', 'RESTRICT', 'EDIT'],
      required: true
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  },
  { _id: false }
);

const knowledgeSchema = new Schema<IKnowledge>(
  {
    title: {
      type: String,
      required: [true, 'Please provide knowledge title'],
      trim: true
    },
    summary: {
      type: String,
      required: [true, 'Please provide summary']
    },
    content: {
      type: String,
      required: [true, 'Please provide cultural content']
    },
    language: {
      type: String,
      default: 'en'
    },
    originalLanguage: {
      type: String,
      default: 'en'
    },
    culturalCategory: {
      type: String,
      enum: [
        'temple_heritage',
        'ritual_tradition',
        'folk_art',
        'craft',
        'oral_history',
        'festival',
        'traditional_cuisine',
        'sacred_geography'
      ],
      required: true
    },
    custodianId: {
      type: Schema.Types.ObjectId,
      ref: 'Custodian',
      required: true
    },
    sourceType: {
      type: String,
      enum: ['oral_lineage', 'archival_manuscript', 'living_practice', 'temple_record'],
      default: 'living_practice'
    },
    sourceDetails: {
      type: String,
      required: [true, 'Please describe source provenance (e.g. 5th generation oral transmission)']
    },
    mediaUrls: [String],
    verificationStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'DRAFT'
    },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'COMMUNITY', 'RESTRICTED'],
      default: 'PUBLIC'
    },
    perspectives: [perspectiveSchema],
    approvalHistory: [approvalActionSchema],
    tags: [String],
    embedding: {
      type: [Number],
      default: []
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
      region: {
        type: String,
        default: 'Tulunadu'
      }
    }
  },
  {
    timestamps: true
  }
);

knowledgeSchema.index({ verificationStatus: 1, visibility: 1 });
knowledgeSchema.index({ custodianId: 1 });
knowledgeSchema.index({ culturalCategory: 1 });
knowledgeSchema.index({ title: 'text', content: 'text', summary: 'text' });

export default mongoose.model<IKnowledge>('Knowledge', knowledgeSchema);
