import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  qualification?: string;
  specialization?: string[];
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
    specialization: [{ type: String }],
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
