import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IExamination extends Document {
  name: string;
  examType: 'unit_test' | 'mid_term' | 'final' | 'mock' | 'practice' | 'olympiad' | 'jee' | 'neet' | 'other';
  date: Date;
  time?: string;
  duration?: number;
  subjects: Types.ObjectId[];
  chaptersCorved?: string;
  venue?: string;
  instructions?: string;
  targetStudents?: {
    class?: Types.ObjectId;
    batch?: Types.ObjectId;
    school?: Types.ObjectId;
    course?: Types.ObjectId;
  };
  isPublished: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationSchema = new Schema<IExamination>(
  {
    name: { type: String, required: true, trim: true },
    examType: { type: String, enum: ['unit_test', 'mid_term', 'final', 'mock', 'practice', 'olympiad', 'jee', 'neet', 'other'], required: true },
    date: { type: Date, required: true, index: true },
    time: { type: String },
    duration: { type: Number },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    chaptersCorved: { type: String },
    venue: { type: String },
    instructions: { type: String },
    targetStudents: {
      class: { type: Schema.Types.ObjectId, ref: 'Class' },
      batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
      school: { type: Schema.Types.ObjectId, ref: 'School' },
      course: { type: Schema.Types.ObjectId, ref: 'Course' },
    },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Examination = mongoose.models.Examination || mongoose.model<IExamination>('Examination', ExaminationSchema);
