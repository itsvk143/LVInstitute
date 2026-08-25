import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChapterProgress extends Document {
  student: Types.ObjectId;
  chapter: Types.ObjectId;
  subject: Types.ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  startDate?: Date;
  completionDate?: Date;
  homeworkAssigned?: string;
  homeworkStatus?: 'pending' | 'submitted' | 'checked';
  teacherNotes?: string;
  revisions: {
    revisionNumber: number;
    date: Date;
    status: 'completed' | 'pending';
    remarks?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ChapterProgressSchema = new Schema<IChapterProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    startDate: { type: Date },
    completionDate: { type: Date },
    homeworkAssigned: { type: String },
    homeworkStatus: { type: String, enum: ['pending', 'submitted', 'checked'] },
    teacherNotes: { type: String },
    revisions: [
      {
        revisionNumber: { type: Number, required: true },
        date: { type: Date, required: true },
        status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
        remarks: { type: String },
      },
    ],
  },
  { timestamps: true }
);

ChapterProgressSchema.index({ student: 1, subject: 1 });
ChapterProgressSchema.index({ student: 1, chapter: 1 }, { unique: true });

export const ChapterProgress = mongoose.models.ChapterProgress || mongoose.model<IChapterProgress>('ChapterProgress', ChapterProgressSchema);
