import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, trim: true, index: true },
    code: { type: String, trim: true, unique: true, sparse: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    website: { type: String },
    logo: { type: String },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const School = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
