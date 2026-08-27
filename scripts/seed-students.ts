/**
 * Seed realistic enrolled students across Class 10, Class 11, Class 12, and NEET
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

let uri = (process.env.MONGODB_URI || '').trim();
if (uri.startsWith('mmongodb')) {
  uri = uri.replace(/^mmongodb/, 'mongodb');
}

if (!uri) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

async function seedStudents() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected');

  const { Student } = await import('../lib/models/Student');
  const { School } = await import('../lib/models/School');
  const { Class, Board, Country, Course, Batch } = await import('../lib/models/Lookup');
  const { Teacher } = await import('../lib/models/Teacher');
  const { Subject } = await import('../lib/models/Subject');
  const { Chapter } = await import('../lib/models/Chapter');
  const { ChapterProgress } = await import('../lib/models/ChapterProgress');

  const class10 = await Class.findOne({ grade: 10 });
  const class11 = await Class.findOne({ grade: 11 });
  const class12 = await Class.findOne({ grade: 12 });

  const cbseBoard = (await Board.findOne({ code: 'CBSE' })) || (await Board.findOne({}));
  const indiaCountry = (await Country.findOne({ code: 'IN' })) || (await Country.findOne({}));

  const davSchool = (await School.findOne({ name: /DAV/i })) || (await School.findOne({}));
  const dpsSchool = (await School.findOne({ name: /Delhi Public/i })) || (await School.findOne({}));
  const neetSchool = (await School.findOne({ $or: [{ code: 'NEET' }, { name: /^NEET/i }] })) || (await School.findOne({}));

  let course = await Course.findOne({});
  if (!course) {
    course = await Course.create({ name: 'Regular Comprehensive Tuition', code: 'REG', isActive: true });
  }

  let neetCourse = await Course.findOne({ name: /NEET/i });
  if (!neetCourse) {
    neetCourse = await Course.create({ name: 'NEET Intensive Medical Entrance', code: 'NEET-MED', isActive: true });
  }

  let teacher = await Teacher.findOne({});
  if (!teacher) {
    teacher = await Teacher.create({
      name: 'Dr. Rajesh Verma',
      email: 'rajesh.verma@lvinstitute.com',
      phone: '+91 98765 43210',
      qualification: 'Ph.D. in Physics, IIT Delhi',
      specialization: 'Physics & NEET Mechanics',
      experienceYears: 12,
      isActive: true,
    });
  }

  let batch2026 = await Batch.findOne({ name: '2025-2026' });
  if (!batch2026) {
    batch2026 = await Batch.create({ name: '2025-2026', year: 2026, isActive: true });
  }

  const sampleStudents = [
    {
      name: 'Aarav Sharma',
      gender: 'male' as const,
      admissionNumber: 'LV-2026-001',
      rollNumber: '101',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98111 22334',
      parentName: 'Sunil Sharma',
      parentContact: '+91 98111 22335',
      parentEmail: 'sunil.sharma@gmail.com',
      school: davSchool?._id,
      class: class10?._id,
      board: cbseBoard?._id,
      country: indiaCountry?._id,
      course: course._id,
      batch: batch2026._id,
      teacher: teacher._id,
      joiningDate: new Date('2025-04-01'),
      isActive: true,
      publicProfileEnabled: true,
      deletedAt: null,
    },
    {
      name: 'Ananya Verma',
      gender: 'female' as const,
      admissionNumber: 'LV-2026-002',
      rollNumber: '102',
      email: 'ananya.verma@gmail.com',
      phone: '+91 98222 33445',
      parentName: 'Ramesh Verma',
      parentContact: '+91 98222 33446',
      parentEmail: 'ramesh.verma@gmail.com',
      school: dpsSchool?._id,
      class: class11?._id,
      board: cbseBoard?._id,
      country: indiaCountry?._id,
      course: course._id,
      batch: batch2026._id,
      teacher: teacher._id,
      joiningDate: new Date('2025-04-05'),
      isActive: true,
      publicProfileEnabled: true,
      deletedAt: null,
    },
    {
      name: 'Rohan Patel (NEET Target)',
      gender: 'male' as const,
      admissionNumber: 'LV-2026-003',
      rollNumber: '103',
      email: 'rohan.patel@gmail.com',
      phone: '+91 98333 44556',
      parentName: 'Mahesh Patel',
      parentContact: '+91 98333 44557',
      parentEmail: 'mahesh.patel@gmail.com',
      school: neetSchool?._id,
      class: class12?._id,
      board: cbseBoard?._id,
      country: indiaCountry?._id,
      course: neetCourse._id,
      batch: batch2026._id,
      teacher: teacher._id,
      joiningDate: new Date('2025-04-10'),
      isActive: true,
      publicProfileEnabled: true,
      deletedAt: null,
    },
    {
      name: 'Priya Nair',
      gender: 'female' as const,
      admissionNumber: 'LV-2026-004',
      rollNumber: '104',
      email: 'priya.nair@gmail.com',
      phone: '+91 98444 55667',
      parentName: 'Girish Nair',
      parentContact: '+91 98444 55668',
      parentEmail: 'girish.nair@gmail.com',
      school: davSchool?._id,
      class: class12?._id,
      board: cbseBoard?._id,
      country: indiaCountry?._id,
      course: course._id,
      batch: batch2026._id,
      teacher: teacher._id,
      joiningDate: new Date('2025-04-15'),
      isActive: true,
      publicProfileEnabled: true,
      deletedAt: null,
    },
  ];

  for (const sData of sampleStudents) {
    let student = await Student.findOne({ admissionNumber: sData.admissionNumber });
    if (!student) {
      student = await Student.create(sData);
      console.log(`✨ Enrolled student: ${student.name} (${student.admissionNumber})`);
    } else {
      Object.assign(student, sData);
      await student.save();
      console.log(`ℹ️ Updated student: ${student.name}`);
    }

    // Auto-create initial chapter progress records for matching subjects
    const subjects = await Subject.find({
      $or: [
        { school: student.school },
        { class: student.class, school: null },
      ],
      isActive: true,
    });

    for (const sub of subjects) {
      const chapters = await Chapter.find({ subject: sub._id, isActive: true }).limit(5);
      for (let i = 0; i < chapters.length; i++) {
        const ch = chapters[i];
        const exists = await ChapterProgress.findOne({ student: student._id, chapter: ch._id });
        if (!exists) {
          await ChapterProgress.create({
            student: student._id,
            subject: sub._id,
            chapter: ch._id,
            status: i === 0 ? 'completed' : i === 1 ? 'in_progress' : 'not_started',
            completedPercentage: i === 0 ? 100 : i === 1 ? 60 : 0,
            theoryCompleted: i <= 1,
            practiceCompleted: i === 0,
            testCompleted: i === 0,
            revisionCount: i === 0 ? 2 : 0,
            confidenceLevel: i === 0 ? 'high' : 'medium',
          });
        }
      }
    }
  }

  const finalStudents = await Student.find({ deletedAt: null }).populate('school').populate('class');
  console.log(`\n🎉 Total active students in Student Directory: ${finalStudents.length}`);
  finalStudents.forEach((s) => console.log(`   🎓 ${s.name} | ${s.admissionNumber} | ${(s.school as any)?.name} | ${(s.class as any)?.name}`));

  await mongoose.disconnect();
}

seedStudents().catch((err) => {
  console.error('❌ Error seeding students:', err);
  process.exit(1);
});
