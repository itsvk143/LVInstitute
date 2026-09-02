import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

async function addTeacher() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  const { Teacher } = await import('../lib/models/Teacher');
  const { Subject } = await import('../lib/models/Subject');

  const chemistrySubject = await Subject.findOne({ name: 'Chemistry' });

  const existingTeacher = await Teacher.findOne({ 
    $or: [
      { email: 'itsvikash143@gmail.com' },
      { name: { $regex: 'Vikash', $options: 'i' } }
    ] 
  });

  const vikashData = {
    name: 'Mr. Vikash Kumar (CVK Sir)',
    email: 'itsvikash143@gmail.com',
    phone: '8457876843',
    website: 'www.cvksir.in',
    qualification: 'Senior Chemistry Lecturer • M.Sc Chemistry (10+ Yrs Exp)',
    experienceYears: '10+ Years',
    bio: 'Senior Chemistry Educator with over 10 years of experience in mentoring students for National & State Level competitive exams like IIT-JEE (Mains & Advanced), NEET UG, CUET, CBSE/ICSE Boards, KVPY, and International Chemistry Olympiads (IChO). Guided numerous students from India and abroad to excel through strategic conceptual clarity, rapid reaction mechanisms, and result-oriented mentorship. Passionate about making Chemistry intuitive, visual, and scoring.',
    achievements: [
      'Top 50 AIR Rankers Produced in JEE Advanced & NEET UG',
      'Ex-Faculty at Aakash Institute (Bhubaneswar & Haldwani)',
      'Ex-Faculty at Narayana Institute & Resonance Edventures',
      'Over 5,000+ Students Mentored with 98%+ Qualification Rate',
      'Creator of 30-Second Physical Chemistry Calculation Shortcuts & Reaction Flowcharts',
    ],
    experienceTimeline: [
      { role: 'Senior Chemistry Lecturer', organization: 'Aakash Institute, Bhubaneswar', period: 'June 2022 - Present' },
      { role: 'Senior Chemistry Lecturer', organization: 'Narayana Institute', period: 'May 2021 - May 2022' },
      { role: 'Chemistry Lecturer', organization: 'Aakash Institute, Haldwani', period: 'Feb 2019 - March 2020' },
      { role: 'Chemistry Lecturer', organization: 'Resonance Edventures', period: 'June 2016 - Jan 2019' },
    ],
    subjectDomains: [
      'Physical Chemistry',
      'Organic Chemistry',
      'Inorganic Chemistry',
      'Reaction Mechanisms & Flowcharts',
      'Coordination & Chemical Bonding',
    ],
    targetExams: [
      'National & International Olympiads',
      'Chemistry Olympiad (IChO & INChO)',
      'Junior Science Olympiad (IJSO & NSEJS)',
      'Pre-Olympiad Foundation (Class 8–10)',
      'JEE Advanced (IIT)',
      'JEE Mains',
      'NEET UG (Medical)',
      'CBSE & ICSE Boards (95%+)',
      'KVPY & CUET',
    ],
    specialization: [
      'Physical Chemistry',
      'Organic Chemistry',
      'Inorganic Chemistry',
      'JEE Advanced',
      'NEET UG',
    ],
    subjects: chemistrySubject ? [chemistrySubject._id] : [],
    isActive: true,
  };

  if (existingTeacher) {
    Object.assign(existingTeacher, vikashData);
    await existingTeacher.save();
    console.log('✅ Updated full profile for: Mr. Vikash Kumar (CVK Sir)');
  } else {
    const newTeacher = await Teacher.create(vikashData);
    console.log('✅ Created new teacher profile: Mr. Vikash Kumar (CVK Sir)', newTeacher._id);
  }

  await mongoose.disconnect();
  console.log('👋 Disconnected');
}

addTeacher().catch((err) => {
  console.error('❌ Error adding teacher:', err);
  process.exit(1);
});
