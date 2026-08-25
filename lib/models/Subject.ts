import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code?: string;
  class: Types.ObjectId;
  board?: Types.ObjectId;
  school?: Types.ObjectId; // Optional: tied to a specific school branch or null for all schools
  description?: string;
  color?: string; // for UI display
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true, index: true },
    code: { type: String, trim: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board', index: true },
    school: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    description: { type: String },
    color: { type: String, default: '#4F46E5' },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubjectSchema.index({ school: 1, class: 1, board: 1 });

export const Subject = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
