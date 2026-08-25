import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  lastLogin?: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    avatar: { type: String },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bcryptModule = bcrypt as any;
  const salt = await bcryptModule.genSalt(12);
  this.password = await bcryptModule.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (bcrypt as any).compare(candidatePassword, this.password as string);
};

// Hide password from JSON output
UserSchema.set('toJSON', {
  transform: function (_doc, ret) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (ret as any).password;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
