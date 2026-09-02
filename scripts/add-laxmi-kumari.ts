import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

async function addLaxmiKumari() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  const { Teacher } = await import('../lib/models/Teacher');
  const { Subject } = await import('../lib/models/Subject');

  const biologySubject = await Subject.findOne({ name: 'Biology' });

  const laxmiData = {
    name: 'Ms. Laxmi Kumari',
    email: 'laxmeena01@gmail.com',
    phone: '9900346997',
    qualification: 'Senior Biology, Botany & Zoology Faculty • M.Sc Biotechnology (10+ Yrs Exp)',
    experienceYears: '10+ Years',
    bio: 'Senior Biology, Botany & Zoology Faculty with over 10 years of dedicated experience in preparing students for Medical Entrance Examinations (NEET UG Target 360/360, PMT, State Medical Entrances) and 10+2 Boards. Comprehensive expertise spanning Botany (Plant Physiology & Anatomy), Zoology (Human Physiology & Reproduction), Biotechnology, Genetics, and NCERT line-by-line decoding. Proven pedagogical track record at premier national institutes including Aakash Institute (Bhubaneswar), Narayana E-Techno, and Concept Education. Passionate about diagrammatic memory mapping and active recall.',
    subjectDomains: [
      'Botany',
      'Zoology',
      'Biology',
      'Biotechnology',
    ],
    targetExams: [
      'NEET UG (Medical Target 360/360)',
      'Biology Olympiad (IBO & INBO)',
      'CBSE & ICSE Class 11/12 Boards (95%+)',
      'Junior Science Olympiad (IJSO & NSEJS)',
      'Pre-Medical Entrance & PMT',
    ],
    specialization: [
      'Botany',
      'Zoology',
      'Biology',
      'Biotechnology',
    ],
    achievements: [
      'Mentored hundreds of medical aspirants achieving 340+ in NEET Biology (Botany + Zoology)',
      'Senior Botany & Biology Faculty at Aakash Institute, Bhubaneswar (March 2022 - Present)',
      'Ex-Faculty at Narayana E-Techno (Guwahati) & Narayana PU College (Bengaluru)',
      'Ex-Faculty at Potential and Concept Education & A.S. Study Circle (Mysore)',
      'M.Sc Biotechnology Degree from University of Mysore',
      'M.Sc Research: Phylogenetic Analysis for Investigating Human Y-Chromosomal Variation',
    ],
    experienceTimeline: [
      { role: 'Botany & Biology Faculty', organization: 'Aakash Institute, Bhubaneswar', period: 'March 2022 - Present' },
      { role: 'Biology Faculty (Botany & Zoology)', organization: 'Narayana E-Techno, Guwahati', period: 'July 2021 - Feb 2022' },
      { role: 'Biology Faculty', organization: 'Potential and Concept Education', period: '2018 - 2021' },
      { role: 'Biology Faculty', organization: 'Narayana PU College, Bengaluru', period: '2015 - 2018' },
      { role: 'Biology Faculty', organization: 'A.S. Study Circle, Mysore', period: '2013 - 2015' },
    ],
    subjects: biologySubject ? [biologySubject._id] : [],
    isActive: true,
  };

  const existingTeacher = await Teacher.findOne({
    $or: [
      { email: 'laxmeena01@gmail.com' },
      { name: { $regex: 'Laxmi Kumari', $options: 'i' } },
    ],
  });

  if (existingTeacher) {
    Object.assign(existingTeacher, laxmiData);
    await existingTeacher.save();
    console.log('✅ Updated existing teacher profile: Ms. Laxmi Kumari', existingTeacher._id);
  } else {
    const newTeacher = await Teacher.create(laxmiData);
    console.log('✅ Created new teacher profile: Ms. Laxmi Kumari', newTeacher._id);
  }

  await mongoose.disconnect();
  console.log('👋 Disconnected');
}

addLaxmiKumari().catch((err) => {
  console.error('❌ Error adding teacher:', err);
  process.exit(1);
});
