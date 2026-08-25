import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document { name: string; grade: number; isActive: boolean; }
const ClassSchema = new Schema<IClass>({ name: { type: String, required: true, trim: true }, grade: { type: Number, required: true, min: 3, max: 12, index: true }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export const Class = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export interface IBoard extends Document { name: string; code: string; description?: string; isActive: boolean; }
const BoardSchema = new Schema<IBoard>({ name: { type: String, required: true, trim: true }, code: { type: String, required: true, trim: true, unique: true }, description: { type: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export const Board = mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);

export interface ICountry extends Document { name: string; code: string; flag?: string; timezone?: string; currency?: string; isActive: boolean; }
const CountrySchema = new Schema<ICountry>({ name: { type: String, required: true, trim: true }, code: { type: String, required: true, trim: true, unique: true, uppercase: true }, flag: { type: String }, timezone: { type: String }, currency: { type: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export const Country = mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);

export interface IBatch extends Document { name: string; year: number; school?: mongoose.Types.ObjectId; class?: mongoose.Types.ObjectId; timing?: string; isActive: boolean; }
const BatchSchema = new Schema<IBatch>({ name: { type: String, required: true, trim: true }, year: { type: Number, required: true }, school: { type: Schema.Types.ObjectId, ref: 'School' }, class: { type: Schema.Types.ObjectId, ref: 'Class' }, timing: { type: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export const Batch = mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);

export interface ICourse extends Document { name: string; code: string; description?: string; targetExam?: string; duration?: string; isActive: boolean; }
const CourseSchema = new Schema<ICourse>({ name: { type: String, required: true, trim: true }, code: { type: String, required: true, trim: true, unique: true }, description: { type: String }, targetExam: { type: String }, duration: { type: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
