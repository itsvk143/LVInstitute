import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChapter extends Document {
  name: string;
  chapterNumber: number;
  subject: Types.ObjectId;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours?: number;
  learningResources?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, required: true, trim: true },
    chapterNumber: { type: Number, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    description: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    estimatedHours: { type: Number },
    learningResources: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChapterSchema.index({ subject: 1, chapterNumber: 1 });

export const Chapter = mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);
