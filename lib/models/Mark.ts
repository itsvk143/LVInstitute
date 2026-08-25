import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMark extends Document {
  student: Types.ObjectId;
  subject: Types.ObjectId;
  testName: string;
  examType: 'unit_test' | 'mid_term' | 'final' | 'mock' | 'practice' | 'olympiad' | 'other';
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade?: string;
  rank?: number;
  teacherRemarks?: string;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MarkSchema = new Schema<IMark>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    testName: { type: String, required: true, trim: true },
    examType: { type: String, enum: ['unit_test', 'mid_term', 'final', 'mock', 'practice', 'olympiad', 'other'], required: true },
    maxMarks: { type: Number, required: true, min: 1 },
    obtainedMarks: { type: Number, required: true, min: 0 },
    percentage: { type: Number },
    grade: { type: String },
    rank: { type: Number },
    teacherRemarks: { type: String },
    examDate: { type: Date, required: true },
  },
  { timestamps: true }
);

function calculateGrade(pct: number): string {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 35) return 'D';
  return 'F';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
MarkSchema.pre('save', function (this: any) {
  this.percentage = Math.round((this.obtainedMarks / this.maxMarks) * 100 * 10) / 10;
  this.grade = calculateGrade(this.percentage);
});

MarkSchema.index({ student: 1, examDate: -1 });

export const Mark = mongoose.models.Mark || mongoose.model<IMark>('Mark', MarkSchema);
