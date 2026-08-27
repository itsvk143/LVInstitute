/**
 * Clean up NEET curriculum to strictly link to Class 12 only
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

async function cleanupNeetClasses() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected');

  const { Class, Board } = await import('../lib/models/Lookup');
  const { School } = await import('../lib/models/School');
  const { Subject } = await import('../lib/models/Subject');
  const { Chapter } = await import('../lib/models/Chapter');

  // 1. Get Class 12
  const class12 = await Class.findOne({ grade: 12 });
  if (!class12) {
    console.error('❌ Class 12 not found');
    process.exit(1);
  }

  // 2. Get NEET School
  const neetSchool = await School.findOne({ $or: [{ code: 'NEET' }, { name: /^NEET/i }] });
  if (!neetSchool) {
    console.error('❌ NEET School not found');
    process.exit(1);
  }

  console.log(`🎯 NEET School ID: ${neetSchool._id}`);
  console.log(`🎯 Class 12 ID: ${class12._id}`);

  // 3. Find all subjects currently linked to NEET school
  const allNeetSubjects = await Subject.find({ school: neetSchool._id });
  console.log(`Found ${allNeetSubjects.length} subjects currently under NEET school:`);
  for (const s of allNeetSubjects) {
    console.log(` - ${s.name} (Class ID: ${s.class})`);
  }

  // 4. Ensure the 4 core NEET subjects are assigned strictly to Class 12 and NEET school
  const neetSubjectNames = ['NEET Physics', 'NEET Chemistry', 'NEET Botany', 'NEET Zoology'];
  
  for (const subName of neetSubjectNames) {
    const sub = await Subject.findOne({ name: subName });
    if (sub) {
      sub.school = neetSchool._id;
      sub.class = class12._id;
      await sub.save();
      const count = await Chapter.countDocuments({ subject: sub._id, isActive: true });
      console.log(`✅ Set ${sub.name} -> Class 12 & NEET School (${count} chapters)`);
    }
  }

  // 5. If there are any other subjects linked to NEET school that are NOT in Class 12, unlink or remove them
  const otherSubjectsUnderNeet = await Subject.find({
    school: neetSchool._id,
    class: { $ne: class12._id },
  });

  if (otherSubjectsUnderNeet.length > 0) {
    console.log(`Removing ${otherSubjectsUnderNeet.length} non-Class 12 subjects from NEET...`);
    for (const sub of otherSubjectsUnderNeet) {
      console.log(` - Unlinking ${sub.name} from NEET school`);
      sub.school = undefined;
      await sub.save();
    }
  } else {
    console.log('✅ No non-Class 12 subjects under NEET.');
  }

  // 6. Verify final state under NEET school
  const finalNeetSubjects = await Subject.find({ school: neetSchool._id }).populate('class', 'name grade');
  console.log(`\n🎉 Final State under NEET School (${finalNeetSubjects.length} subjects):`);
  for (const s of finalNeetSubjects) {
    const className = (s.class as any)?.name || s.class;
    console.log(`   📚 ${s.name} -> ${className}`);
  }

  await mongoose.disconnect();
}

cleanupNeetClasses().catch((err) => {
  console.error('❌ Error cleaning up NEET classes:', err);
  process.exit(1);
});
