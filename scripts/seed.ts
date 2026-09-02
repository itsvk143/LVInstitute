/**
 * LV Institute — Database Seed Script
 * Run: npx ts-node --project tsconfig.json scripts/seed.ts
 * Or:  npm run seed
 *
 * Seeds: Admin, Countries, Boards, Classes, Schools, Courses, Batches,
 *        Teachers, Subjects, Chapters, 10 Students, Chapter Progress,
 *        Additional Topics, Marks, Attendance, Examinations, Notices
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  // Dynamic imports after connection
  const { User } = await import('../lib/models/User');
  const { Board, Class, Country, Batch, Course } = await import('../lib/models/Lookup');
  const { School } = await import('../lib/models/School');
  const { Teacher } = await import('../lib/models/Teacher');
  const { Subject } = await import('../lib/models/Subject');
  const { Chapter } = await import('../lib/models/Chapter');
  const { Student } = await import('../lib/models/Student');
  const { ChapterProgress } = await import('../lib/models/ChapterProgress');
  const { AdditionalTopic } = await import('../lib/models/AdditionalTopic');
  const { Mark } = await import('../lib/models/Mark');
  const { Attendance } = await import('../lib/models/Attendance');
  const { Examination } = await import('../lib/models/Examination');
  const { Notice } = await import('../lib/models/Notice');

  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Board.deleteMany({}), Class.deleteMany({}),
    Country.deleteMany({}), Batch.deleteMany({}), Course.deleteMany({}),
    School.deleteMany({}), Teacher.deleteMany({}), Subject.deleteMany({}),
    Chapter.deleteMany({}), Student.deleteMany({}), ChapterProgress.deleteMany({}),
    AdditionalTopic.deleteMany({}), Mark.deleteMany({}), Attendance.deleteMany({}),
    Examination.deleteMany({}), Notice.deleteMany({}),
  ]);

  // ── Admin user ───────────────────────────────────────────────────────────────
  console.log('👤 Creating admin...');
  const admin = await User.create({
    name: 'LV Institute Admin',
    email: 'admin@lvinstitute.com',
    password: 'Admin@123',
    role: 'superadmin',
  });

  // ── Boards ───────────────────────────────────────────────────────────────────
  console.log('📋 Creating boards...');
  const boards = await Board.insertMany([
    { name: 'Central Board of Secondary Education', code: 'CBSE' },
    { name: 'Indian Certificate of Secondary Education', code: 'ICSE' },
    { name: 'State Board', code: 'STATE' },
    { name: 'International Board', code: 'IB' },
  ]);
  const [cbse, icse] = boards;

  // ── Classes ──────────────────────────────────────────────────────────────────
  console.log('🏫 Creating classes...');
  const classes = await Class.insertMany(
    Array.from({ length: 10 }, (_, i) => ({ name: `Class ${i + 3}`, grade: i + 3 }))
  );
  const class10 = classes.find((c) => c.grade === 10)!;

  // ── Countries ────────────────────────────────────────────────────────────────
  console.log('🌍 Creating countries...');
  const countries = await Country.insertMany([
    { name: 'India', code: 'IN', flag: '🇮🇳', timezone: 'Asia/Kolkata', currency: 'INR' },
    { name: 'United States', code: 'US', flag: '🇺🇸', timezone: 'America/New_York', currency: 'USD' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', timezone: 'America/Toronto', currency: 'CAD' },
    { name: 'Singapore', code: 'SG', flag: '🇸🇬', timezone: 'Asia/Singapore', currency: 'SGD' },
    { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', timezone: 'Asia/Dubai', currency: 'AED' },
    { name: 'Qatar', code: 'QA', flag: '🇶🇦', timezone: 'Asia/Qatar', currency: 'QAR' },
    { name: 'Kuwait', code: 'KW', flag: '🇰🇼', timezone: 'Asia/Kuwait', currency: 'KWD' },
    { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', timezone: 'Asia/Riyadh', currency: 'SAR' },
    { name: 'Oman', code: 'OM', flag: '🇴🇲', timezone: 'Asia/Muscat', currency: 'OMR' },
    { name: 'Bahrain', code: 'BH', flag: '🇧🇭', timezone: 'Asia/Bahrain', currency: 'BHD' },
  ]);
  const india = countries[0];
  const uae = countries[4];

  // ── Schools ──────────────────────────────────────────────────────────────────
  console.log('🏫 Creating schools...');
  const schools = await School.insertMany([
    { name: 'Delhi Public School', code: 'DPS', city: 'New Delhi', state: 'Delhi', country: 'India' },
    { name: 'Kendriya Vidyalaya', code: 'KV', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { name: 'Ryan International School', code: 'RIS', city: 'Bangalore', state: 'Karnataka', country: 'India' },
    { name: 'GEMS Education', code: 'GEMS', city: 'Dubai', country: 'UAE' },
  ]);
  const dps = schools[0];
  const gems = schools[3];

  // ── Courses ──────────────────────────────────────────────────────────────────
  console.log('📚 Creating courses...');
  const courses = await Course.insertMany([
    { name: 'NEET Preparation', code: 'NEET', targetExam: 'NEET UG', duration: '2 years' },
    { name: 'JEE Preparation', code: 'JEE', targetExam: 'JEE Main & Advanced', duration: '2 years' },
    { name: 'Board Excellence', code: 'BOARD', targetExam: 'Class 10/12 Boards', duration: '1 year' },
    { name: 'Foundation Course', code: 'FOUND', duration: '3 years' },
    { name: 'Olympiad Training', code: 'OLYMP' },
  ]);
  const neet = courses[0];
  const board = courses[2];

  // ── Batches ──────────────────────────────────────────────────────────────────
  console.log('👥 Creating batches...');
  const batches = await Batch.insertMany([
    { name: 'Morning Batch A', year: 2025, timing: '7:00 AM - 9:00 AM', school: dps._id },
    { name: 'Evening Batch B', year: 2025, timing: '5:00 PM - 7:00 PM' },
    { name: 'NEET Weekend Batch', year: 2025, timing: 'Sat-Sun 8:00 AM - 2:00 PM' },
    { name: 'International Batch', year: 2025, timing: '6:00 PM IST (Online)' },
  ]);
  const morningBatch = batches[0];
  const intlBatch = batches[3];

  // ── Teachers ─────────────────────────────────────────────────────────────────
  console.log('👩‍🏫 Creating teachers...');
  const teachers = await Teacher.insertMany([
    {
      name: 'Ms. Laxmi Kumari',
      email: 'laxmeena01@gmail.com',
      phone: '9900346997',
      qualification: 'Senior Biology, Botany & Zoology Faculty • M.Sc Biotechnology (10+ Yrs Exp)',
      experienceYears: '10+ Years',
      bio: 'Senior Biology, Botany & Zoology Faculty with over 10 years of dedicated experience in preparing students for Medical Entrance Examinations (NEET UG Target 360/360, PMT, State Medical Entrances) and 10+2 Boards. Comprehensive expertise spanning Botany (Plant Physiology & Anatomy), Zoology (Human Physiology & Reproduction), Biotechnology, Genetics, and NCERT line-by-line decoding. Proven pedagogical track record at premier national institutes including Aakash Institute (Bhubaneswar), Narayana E-Techno, and Concept Education.',
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
        'Pre-Medical PMT & Foundation',
      ],
      specialization: ['Botany', 'Zoology', 'Biology', 'Biotechnology'],
      achievements: [
        'Mentored hundreds of medical aspirants achieving 340+ in NEET Biology (Botany + Zoology)',
        'Senior Botany & Biology Faculty at Aakash Institute, Bhubaneswar (March 2022 - Present)',
        'Ex-Faculty at Narayana E-Techno (Guwahati) & Narayana PU College (Bengaluru)',
        'Ex-Faculty at Potential and Concept Education & A.S. Study Circle (Mysore)',
        'M.Sc Biotechnology Degree from University of Mysore',
      ],
      experienceTimeline: [
        { role: 'Botany Faculty', organization: 'Aakash Institute, Bhubaneswar', period: 'March 2022 - Present' },
        { role: 'Biology Faculty', organization: 'Narayana E-Techno, Guwahati', period: 'July 2021 - Feb 2022' },
        { role: 'Biology Faculty', organization: 'Potential and Concept Education', period: '2018 - 2021' },
        { role: 'Biology Faculty', organization: 'Narayana PU College, Bengaluru', period: '2015 - 2018' },
        { role: 'Biology Faculty', organization: 'A.S. Study Circle, Mysore', period: '2013 - 2015' },
      ],
      isActive: true,
    },
    {
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
      isActive: true,
    },
  ]);
  const laxmi = teachers[0];
  const vikash = teachers[1];

  // ── Subjects ─────────────────────────────────────────────────────────────────
  console.log('📖 Creating subjects...');
  const subjects = await Subject.insertMany([
    { name: 'Mathematics', code: 'MATH', class: class10._id, board: cbse._id, color: '#6366f1' },
    { name: 'Physics', code: 'PHY', class: class10._id, board: cbse._id, color: '#8b5cf6' },
    { name: 'Chemistry', code: 'CHEM', class: class10._id, board: cbse._id, color: '#ec4899' },
    { name: 'Biology', code: 'BIO', class: class10._id, board: cbse._id, color: '#10b981' },
    { name: 'English', code: 'ENG', class: class10._id, board: cbse._id, color: '#f59e0b' },
    { name: 'Social Science', code: 'SST', class: class10._id, board: cbse._id, color: '#06b6d4' },
  ]);
  const [math, physics, chemistry, biology, english] = subjects;

  // ── Chapters: Mathematics ────────────────────────────────────────────────────
  console.log('📑 Creating chapters...');
  const mathChapters = await Chapter.insertMany([
    { name: 'Real Numbers', chapterNumber: 1, subject: math._id, difficulty: 'easy' },
    { name: 'Polynomials', chapterNumber: 2, subject: math._id, difficulty: 'medium' },
    { name: 'Pair of Linear Equations', chapterNumber: 3, subject: math._id, difficulty: 'medium' },
    { name: 'Quadratic Equations', chapterNumber: 4, subject: math._id, difficulty: 'hard' },
    { name: 'Arithmetic Progressions', chapterNumber: 5, subject: math._id, difficulty: 'medium' },
    { name: 'Triangles', chapterNumber: 6, subject: math._id, difficulty: 'medium' },
    { name: 'Coordinate Geometry', chapterNumber: 7, subject: math._id, difficulty: 'easy' },
    { name: 'Introduction to Trigonometry', chapterNumber: 8, subject: math._id, difficulty: 'hard' },
    { name: 'Some Applications of Trigonometry', chapterNumber: 9, subject: math._id, difficulty: 'hard' },
    { name: 'Circles', chapterNumber: 10, subject: math._id, difficulty: 'medium' },
    { name: 'Areas Related to Circles', chapterNumber: 11, subject: math._id, difficulty: 'medium' },
    { name: 'Surface Areas and Volumes', chapterNumber: 12, subject: math._id, difficulty: 'easy' },
    { name: 'Statistics', chapterNumber: 13, subject: math._id, difficulty: 'medium' },
    { name: 'Probability', chapterNumber: 14, subject: math._id, difficulty: 'easy' },
  ]);

  // Physics chapters
  const physicsChapters = await Chapter.insertMany([
    { name: 'Light - Reflection and Refraction', chapterNumber: 1, subject: physics._id, difficulty: 'medium' },
    { name: 'The Human Eye and the Colourful World', chapterNumber: 2, subject: physics._id, difficulty: 'easy' },
    { name: 'Electricity', chapterNumber: 3, subject: physics._id, difficulty: 'hard' },
    { name: 'Magnetic Effects of Electric Current', chapterNumber: 4, subject: physics._id, difficulty: 'hard' },
    { name: 'Sources of Energy', chapterNumber: 5, subject: physics._id, difficulty: 'easy' },
  ]);

  // Chemistry chapters
  const chemChapters = await Chapter.insertMany([
    { name: 'Chemical Reactions and Equations', chapterNumber: 1, subject: chemistry._id, difficulty: 'easy' },
    { name: 'Acids, Bases and Salts', chapterNumber: 2, subject: chemistry._id, difficulty: 'medium' },
    { name: 'Metals and Non-metals', chapterNumber: 3, subject: chemistry._id, difficulty: 'medium' },
    { name: 'Carbon and its Compounds', chapterNumber: 4, subject: chemistry._id, difficulty: 'hard' },
    { name: 'Periodic Classification of Elements', chapterNumber: 5, subject: chemistry._id, difficulty: 'medium' },
  ]);

  // ── Students ─────────────────────────────────────────────────────────────────
  console.log('🎓 Creating students...');
  const studentData = [
    { admissionNumber: 'LV-2025-0001', name: 'Arjun Sharma', gender: 'male', parentName: 'Rajesh Sharma', parentContact: '9998887770', phone: '9998887771', school: dps._id, class: class10._id, section: 'A', board: cbse._id, country: india._id, batch: morningBatch._id, course: board._id, teacher: vikash._id, joiningDate: new Date('2024-04-01') },
    { admissionNumber: 'LV-2025-0002', name: 'Priya Nair', gender: 'female', parentName: 'Suresh Nair', parentContact: '9998887772', phone: '9998887773', school: dps._id, class: class10._id, section: 'A', board: cbse._id, country: india._id, batch: morningBatch._id, course: neet._id, teacher: laxmi._id, joiningDate: new Date('2024-04-01') },
    { admissionNumber: 'LV-2025-0003', name: 'Zara Ahmed', gender: 'female', parentName: 'Hassan Ahmed', parentContact: '9998887774', phone: '9998887775', school: gems._id, class: class10._id, section: 'B', board: cbse._id, country: uae._id, batch: intlBatch._id, course: board._id, teacher: vikash._id, joiningDate: new Date('2024-06-01') },
    { admissionNumber: 'LV-2025-0004', name: 'Rohit Patel', gender: 'male', parentName: 'Amit Patel', parentContact: '9998887776', school: dps._id, class: class10._id, section: 'B', board: icse._id, country: india._id, batch: morningBatch._id, course: neet._id, teacher: laxmi._id, joiningDate: new Date('2024-04-10') },
    { admissionNumber: 'LV-2025-0005', name: 'Fatima Al-Rashid', gender: 'female', parentName: 'Mohammed Al-Rashid', parentContact: '9998887778', school: gems._id, class: class10._id, section: 'A', board: cbse._id, country: uae._id, batch: intlBatch._id, course: board._id, teacher: vikash._id, joiningDate: new Date('2024-07-01') },
  ];
  const students = await Student.insertMany(studentData);
  const [arjun, priyaStudent, zara] = students;

  // ── Chapter Progress for Arjun ────────────────────────────────────────────────
  console.log('📊 Creating chapter progress...');
  const today = new Date();
  const d = (daysAgo: number) => new Date(today.getTime() - daysAgo * 86400000);

  await ChapterProgress.insertMany([
    // Math chapters
    { student: arjun._id, chapter: mathChapters[0]._id, subject: math._id, status: 'completed', startDate: d(90), completionDate: d(80), revisions: [{ revisionNumber: 1, date: d(60), status: 'completed', remarks: 'Good understanding' }], teacherNotes: 'Excellent grasp of Euclid\'s algorithm' },
    { student: arjun._id, chapter: mathChapters[1]._id, subject: math._id, status: 'completed', startDate: d(79), completionDate: d(68), revisions: [{ revisionNumber: 1, date: d(50), status: 'completed' }, { revisionNumber: 2, date: d(20), status: 'pending' }] },
    { student: arjun._id, chapter: mathChapters[2]._id, subject: math._id, status: 'completed', startDate: d(67), completionDate: d(55), revisions: [{ revisionNumber: 1, date: d(40), status: 'completed' }] },
    { student: arjun._id, chapter: mathChapters[3]._id, subject: math._id, status: 'completed', startDate: d(54), completionDate: d(40), revisions: [{ revisionNumber: 1, date: d(25), status: 'pending' }], teacherNotes: 'Needs more practice on discriminant' },
    { student: arjun._id, chapter: mathChapters[4]._id, subject: math._id, status: 'in_progress', startDate: d(15), revisions: [] },
    { student: arjun._id, chapter: mathChapters[5]._id, subject: math._id, status: 'not_started', revisions: [] },
    { student: arjun._id, chapter: mathChapters[6]._id, subject: math._id, status: 'not_started', revisions: [] },
    { student: arjun._id, chapter: mathChapters[7]._id, subject: math._id, status: 'not_started', revisions: [] },
    // Physics chapters
    { student: arjun._id, chapter: physicsChapters[0]._id, subject: physics._id, status: 'completed', startDate: d(85), completionDate: d(72), revisions: [{ revisionNumber: 1, date: d(55), status: 'completed' }] },
    { student: arjun._id, chapter: physicsChapters[1]._id, subject: physics._id, status: 'completed', startDate: d(71), completionDate: d(60), revisions: [{ revisionNumber: 1, date: d(40), status: 'completed' }] },
    { student: arjun._id, chapter: physicsChapters[2]._id, subject: physics._id, status: 'in_progress', startDate: d(10), revisions: [] },
    { student: arjun._id, chapter: physicsChapters[3]._id, subject: physics._id, status: 'not_started', revisions: [] },
    // Chemistry chapters
    { student: arjun._id, chapter: chemChapters[0]._id, subject: chemistry._id, status: 'completed', startDate: d(88), completionDate: d(75), revisions: [{ revisionNumber: 1, date: d(58), status: 'completed' }] },
    { student: arjun._id, chapter: chemChapters[1]._id, subject: chemistry._id, status: 'completed', startDate: d(74), completionDate: d(62), revisions: [{ revisionNumber: 1, date: d(45), status: 'pending' }] },
    { student: arjun._id, chapter: chemChapters[2]._id, subject: chemistry._id, status: 'in_progress', startDate: d(20), revisions: [] },
  ]);

  // ── Additional Topics for Arjun ───────────────────────────────────────────────
  console.log('✨ Creating additional topics...');
  await AdditionalTopic.insertMany([
    { student: arjun._id, subject: math._id, name: 'Olympiad Algebra Problems', category: 'Olympiad Questions', dateTaught: d(50), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'revised', teacherNotes: 'Excellent performance in level 2 problems' },
    { student: arjun._id, subject: math._id, name: 'NCERT Exemplar - Quadratics', category: 'NCERT Exemplar', dateTaught: d(35), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'pending' },
    { student: arjun._id, subject: math._id, name: 'Previous Year Board Questions 2023', category: 'Previous Year Questions', dateTaught: d(20), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'pending' },
    { student: arjun._id, subject: math._id, name: 'HOTS - Mensuration', category: 'HOTS Questions', dateTaught: d(10), teacher: vikash._id, completionStatus: 'in_progress', revisionStatus: 'not_applicable' },
    { student: arjun._id, subject: physics._id, name: 'Advanced Numerical - Electricity', category: 'Advanced Numerical Problems', dateTaught: d(30), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'revised' },
    { student: arjun._id, subject: physics._id, name: 'Practical Applications - Light', category: 'Practical Applications', dateTaught: d(65), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'revised' },
    { student: arjun._id, subject: chemistry._id, name: 'Mental Ability - Chemical Equations', category: 'Mental Ability', dateTaught: d(45), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'pending' },
    { student: arjun._id, subject: chemistry._id, name: 'Competitive Exam MCQs - Acids & Bases', category: 'Competitive Exam Topics', dateTaught: d(25), teacher: vikash._id, completionStatus: 'completed', revisionStatus: 'not_applicable' },
    { student: arjun._id, subject: chemistry._id, name: 'Logical Reasoning - Periodic Table', category: 'Logical Reasoning', dateTaught: d(15), teacher: vikash._id, completionStatus: 'in_progress', revisionStatus: 'not_applicable' },
  ]);

  // ── Marks for Arjun ──────────────────────────────────────────────────────────
  console.log('📝 Creating marks...');
  await Mark.insertMany([
    { student: arjun._id, subject: math._id, testName: 'Unit Test 1 - Real Numbers & Polynomials', examType: 'unit_test', maxMarks: 50, obtainedMarks: 46, examDate: d(70), teacherRemarks: 'Excellent! Keep it up.' },
    { student: arjun._id, subject: math._id, testName: 'Mid-term Examination', examType: 'mid_term', maxMarks: 100, obtainedMarks: 88, examDate: d(45) },
    { student: arjun._id, subject: math._id, testName: 'Unit Test 2 - Quadratic Equations', examType: 'unit_test', maxMarks: 50, obtainedMarks: 41, examDate: d(25), teacherRemarks: 'Good, practice more on complex problems' },
    { student: arjun._id, subject: physics._id, testName: 'Unit Test 1 - Light', examType: 'unit_test', maxMarks: 50, obtainedMarks: 44, examDate: d(65) },
    { student: arjun._id, subject: physics._id, testName: 'Mid-term Examination', examType: 'mid_term', maxMarks: 100, obtainedMarks: 82, examDate: d(45) },
    { student: arjun._id, subject: chemistry._id, testName: 'Unit Test 1 - Chemical Reactions', examType: 'unit_test', maxMarks: 50, obtainedMarks: 47, examDate: d(68) },
    { student: arjun._id, subject: chemistry._id, testName: 'Mid-term Examination', examType: 'mid_term', maxMarks: 100, obtainedMarks: 90, examDate: d(45), teacherRemarks: 'Outstanding performance!' },
    { student: arjun._id, subject: biology._id, testName: 'Unit Test 1', examType: 'unit_test', maxMarks: 50, obtainedMarks: 43, examDate: d(60) },
    { student: arjun._id, subject: english._id, testName: 'Unit Test 1', examType: 'unit_test', maxMarks: 50, obtainedMarks: 39, examDate: d(55) },
  ]);

  // ── Attendance for Arjun (last 30 days) ──────────────────────────────────────
  console.log('📅 Creating attendance...');
  const attendanceData = [];
  for (let i = 1; i <= 30; i++) {
    const rand = Math.random();
    attendanceData.push({
      student: arjun._id,
      date: d(i),
      status: rand < 0.85 ? 'present' : rand < 0.92 ? 'late' : rand < 0.97 ? 'absent' : 'leave',
    });
  }
  await Attendance.insertMany(attendanceData);

  // ── Examinations ──────────────────────────────────────────────────────────────
  console.log('📅 Creating examinations...');
  const adminId = admin._id;
  await Examination.insertMany([
    { name: 'Unit Test 3 - Mathematics', examType: 'unit_test', date: new Date(today.getTime() + 7 * 86400000), time: '10:00 AM', duration: 90, subjects: [math._id], isPublished: true, createdBy: adminId },
    { name: 'Chemistry Mid-Year Test', examType: 'unit_test', date: new Date(today.getTime() + 14 * 86400000), time: '11:00 AM', duration: 60, subjects: [chemistry._id], isPublished: true, createdBy: adminId },
    { name: 'Quarterly Examination 2025', examType: 'mid_term', date: new Date(today.getTime() + 21 * 86400000), time: '9:00 AM', duration: 180, subjects: subjects.map((s) => s._id), isPublished: true, createdBy: adminId, chaptersCorved: 'All chapters covered till date' },
    { name: 'NEET Mock Test 1', examType: 'mock', date: new Date(today.getTime() + 30 * 86400000), time: '8:00 AM', duration: 180, subjects: [physics._id, chemistry._id, biology._id], isPublished: true, createdBy: adminId },
  ]);

  // ── Notices ───────────────────────────────────────────────────────────────────
  console.log('📢 Creating notices...');
  await Notice.insertMany([
    { title: '🎯 Unit Test 3 Schedule Announced', content: 'Unit Test 3 for Mathematics will be held on ' + formatDateStr(new Date(today.getTime() + 7 * 86400000)) + '. Syllabus: Chapters 5–8. Students are advised to revise all concepts thoroughly.', category: 'exam_notice', visibility: ['public', 'students', 'parents'], isPinned: true, isPublished: true, publishedAt: new Date(), createdBy: adminId },
    { title: '🏆 Quarterly Examination Results Available', content: 'The results for Unit Test 2 have been updated on the student portal. Students can view their marks and teacher remarks by logging into their profile.', category: 'exam_notice', visibility: ['public', 'students', 'parents'], isPinned: false, isPublished: true, publishedAt: d(5), createdBy: adminId },
    { title: '📚 New Batch Starting for JEE 2026', content: 'A new batch for JEE Mains 2026 preparation is starting from next month. Early bird registration is open. Batches available on weekends.', category: 'institute_news', visibility: ['public'], isPinned: false, isPublished: true, publishedAt: d(3), createdBy: adminId },
    { title: '🏖️ Holiday Notice — Independence Day', content: 'The institute will remain closed on 15th August 2025 on account of Independence Day. Classes will resume on 16th August as per regular schedule.', category: 'holiday', visibility: ['public', 'students', 'parents', 'teachers'], isPinned: false, isPublished: true, publishedAt: d(10), createdBy: adminId },
    { title: '📝 NEET Mock Test Series Registration', content: 'Registration open for NEET Mock Test Series. Full syllabus tests every weekend. Performance analysis and detailed solutions provided.', category: 'neet_update', visibility: ['public', 'students'], isPinned: false, isPublished: true, publishedAt: d(2), createdBy: adminId },
  ]);

  console.log('\n✅ Seed completed successfully!');
  console.log('─'.repeat(50));
  console.log('📧 Admin:    admin@lvinstitute.com');
  console.log('🔑 Password: Admin@123');
  console.log('─'.repeat(50));
  console.log('🔗 Public portal demo:');
  console.log(`   /student/LV-2025-0001  (${arjun.name})`);
  console.log(`   /student/LV-2025-0002  (${priyaStudent.name})`);
  console.log(`   /student/LV-2025-0003  (${zara.name})`);
  console.log('─'.repeat(50));

  await mongoose.disconnect();
  process.exit(0);
}

function formatDateStr(date: Date) {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
