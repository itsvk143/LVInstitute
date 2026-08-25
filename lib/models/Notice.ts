import mongoose, { Schema, Document, Types } from 'mongoose';

export type NoticeCategory =
  | 'class_update' | 'exam_notice' | 'homework' | 'assignment' | 'holiday'
  | 'fee_notice' | 'workshop' | 'competition' | 'parent_meeting' | 'emergency'
  | 'institute_news' | 'neet_update' | 'jee_update' | 'general';

export type NoticeVisibility =
  | 'public' | 'parents' | 'students' | 'teachers'
  | 'class_wise' | 'batch_wise' | 'school_wise' | 'country_wise' | 'individual';

export interface INotice extends Document {
  title: string;
  content: string;
  category: NoticeCategory;
  visibility: NoticeVisibility[];
  isPinned: boolean;
  isArchived: boolean;
  scheduledAt?: Date;
  publishedAt?: Date;
  isPublished: boolean;
  targetClass?: Types.ObjectId;
  targetBatch?: Types.ObjectId;
  targetSchool?: Types.ObjectId;
  targetCountry?: Types.ObjectId;
  targetStudents?: Types.ObjectId[];
  attachments?: string[];
  createdBy: Types.ObjectId;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['class_update', 'exam_notice', 'homework', 'assignment', 'holiday', 'fee_notice', 'workshop', 'competition', 'parent_meeting', 'emergency', 'institute_news', 'neet_update', 'jee_update', 'general'],
      required: true,
    },
    visibility: [{ type: String, enum: ['public', 'parents', 'students', 'teachers', 'class_wise', 'batch_wise', 'school_wise', 'country_wise', 'individual'] }],
    isPinned: { type: Boolean, default: false, index: true },
    isArchived: { type: Boolean, default: false },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false, index: true },
    targetClass: { type: Schema.Types.ObjectId, ref: 'Class' },
    targetBatch: { type: Schema.Types.ObjectId, ref: 'Batch' },
    targetSchool: { type: Schema.Types.ObjectId, ref: 'School' },
    targetCountry: { type: Schema.Types.ObjectId, ref: 'Country' },
    targetStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    attachments: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

NoticeSchema.index({ isPinned: -1, publishedAt: -1 });

export const Notice = mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
