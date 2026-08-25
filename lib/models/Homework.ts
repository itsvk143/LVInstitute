import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHomework extends Document {
  student: Types.ObjectId;
  subject: Types.ObjectId;
  chapter?: Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  submissionStatus: 'pending' | 'submitted' | 'late' | 'not_submitted';
  submissionDate?: Date;
  teacherRemarks?: string;
  assignedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HomeworkSchema = new Schema<IHomework>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    submissionStatus: { type: String, enum: ['pending', 'submitted', 'late', 'not_submitted'], default: 'pending' },
    submissionDate: { type: Date },
    teacherRemarks: { type: String },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  },
  { timestamps: true }
);

HomeworkSchema.index({ student: 1, dueDate: -1 });

export const Homework = mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);
