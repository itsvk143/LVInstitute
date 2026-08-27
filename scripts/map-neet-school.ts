/**
 * Script to create NEET as a School/Program and map all NEET subjects to it
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

async function setupNeetSchool() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected');

  const { School } = await import('../lib/models/School');
  const { Subject } = await import('../lib/models/Subject');
  const { Chapter } = await import('../lib/models/Chapter');

  // 1. Find or create NEET School
  let neetSchool = await School.findOne({ $or: [{ code: 'NEET' }, { name: /^NEET/i }] });
  if (!neetSchool) {
    neetSchool = await School.create({
      name: 'NEET (Medical Entrance Program)',
      code: 'NEET',
      city: 'Target Batch / All Campuses',
      state: 'National Program',
      country: 'India',
      isActive: true,
    });
    console.log(`✨ Created NEET School & Program with _id: ${neetSchool._id}`);
  } else {
    neetSchool.name = 'NEET (Medical Entrance Program)';
    neetSchool.code = 'NEET';
    neetSchool.city = 'Target Batch / All Campuses';
    neetSchool.isActive = true;
    await neetSchool.save();
    console.log(`ℹ️ Updated NEET School & Program with _id: ${neetSchool._id}`);
  }

  // 2. Map NEET Physics, NEET Chemistry, NEET Botany, NEET Zoology to this NEET school
  const neetSubjectNames = ['NEET Physics', 'NEET Chemistry', 'NEET Botany', 'NEET Zoology'];
  
  for (const subName of neetSubjectNames) {
    const sub = await Subject.findOne({ name: subName });
    if (sub) {
      sub.school = neetSchool._id;
      await sub.save();
      const chapterCount = await Chapter.countDocuments({ subject: sub._id, isActive: true });
      console.log(`   🔗 Linked ${sub.name} (with ${chapterCount} chapters) to NEET School`);
    } else {
      console.log(`   ⚠️ Subject ${subName} not found`);
    }
  }

  console.log('\n🎉 NEET School & Curriculum mapping successfully updated in database!');
  await mongoose.disconnect();
}

setupNeetSchool().catch((err) => {
  console.error('❌ Error mapping NEET school:', err);
  process.exit(1);
});
