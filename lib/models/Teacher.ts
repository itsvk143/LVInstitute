import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  qualification?: string;
  bio?: string;
  experienceYears?: number | string;
  achievements?: string[];
  experienceTimeline?: Array<{ role: string; organization: string; period: string }>;
  specialization?: string[];
  subjectDomains?: string[];
  targetExams?: string[];
  website?: string;
  subjects?: Types.ObjectId[];
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    photo: { type: String },
    qualification: { type: String },
    bio: { type: String },
    experienceYears: { type: Schema.Types.Mixed },
    achievements: [{ type: String }],
    experienceTimeline: [
      {
        role: { type: String },
        organization: { type: String },
        period: { type: String },
      },
    ],
    specialization: [{ type: String }],
    subjectDomains: [{ type: String }],
    targetExams: [{ type: String }],
    website: { type: String, trim: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
