import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAttendance extends Document {
  student: Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'leave';
  subject?: Types.ObjectId;
  remarks?: string;
  markedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'leave'], required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    remarks: { type: String },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

AttendanceSchema.index({ student: 1, date: 1 });
AttendanceSchema.index({ student: 1, date: -1 });

export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
