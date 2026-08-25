import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAdditionalTopic extends Document {
  student: Types.ObjectId;
  subject: Types.ObjectId;
  name: string;
  description?: string;
  category: string;  // Olympiad, HOTS, NCERT Exemplar, etc.
  dateTaught: Date;
  teacher: Types.ObjectId;
  resources?: string[];
  completionStatus: 'completed' | 'in_progress' | 'pending';
  revisionStatus: 'revised' | 'pending' | 'not_applicable';
  teacherNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdditionalTopicSchema = new Schema<IAdditionalTopic>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, trim: true },
    dateTaught: { type: Date, required: true, default: Date.now },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    resources: [{ type: String }],
    completionStatus: { type: String, enum: ['completed', 'in_progress', 'pending'], default: 'completed' },
    revisionStatus: { type: String, enum: ['revised', 'pending', 'not_applicable'], default: 'pending' },
    teacherNotes: { type: String },
  },
  { timestamps: true }
);

AdditionalTopicSchema.index({ student: 1, subject: 1 });

export const AdditionalTopic = mongoose.models.AdditionalTopic || mongoose.model<IAdditionalTopic>('AdditionalTopic', AdditionalTopicSchema);
