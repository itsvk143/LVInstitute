import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  admissionNumber: string;
  rollNumber?: string;
  name: string;
  photo?: string;
  dateOfBirth?: Date;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  parentName: string;
  parentContact: string;
  parentEmail?: string;
  address?: { street?: string; city?: string; state?: string; pincode?: string; country: string; };
  school: Types.ObjectId;
  class: Types.ObjectId;
  section?: string;
  board: Types.ObjectId;
  country: Types.ObjectId;
  batch: Types.ObjectId;
  course: Types.ObjectId;
  teacher: Types.ObjectId;
  joiningDate: Date;
  isActive: boolean;
  notes?: string;
  publicProfileEnabled: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    admissionNumber: { type: String, required: true, unique: true, trim: true, index: true },
    rollNumber: { type: String, trim: true, sparse: true },
    name: { type: String, required: true, trim: true },
    photo: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    parentName: { type: String, required: true, trim: true },
    parentContact: { type: String, required: true, trim: true },
    parentEmail: { type: String, lowercase: true, trim: true },
    address: { street: String, city: String, state: String, pincode: String, country: String },
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    section: { type: String, trim: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true, index: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    joiningDate: { type: Date, required: true, default: Date.now },
    isActive: { type: Boolean, default: true, index: true },
    notes: { type: String },
    publicProfileEnabled: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

StudentSchema.index({ name: 'text', admissionNumber: 'text' });
StudentSchema.index({ deletedAt: 1 });
StudentSchema.index({ phone: 1 });

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
