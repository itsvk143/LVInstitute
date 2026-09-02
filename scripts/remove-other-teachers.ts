import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

async function cleanTeachers() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  const { Teacher } = await import('../lib/models/Teacher');
  const { Student } = await import('../lib/models/Student');
  const { AdditionalTopic } = await import('../lib/models/AdditionalTopic');

  const vikash = await Teacher.findOne({
    $or: [
      { email: 'itsvikash143@gmail.com' },
      { name: { $regex: 'Vikash', $options: 'i' } },
    ],
  });

  const laxmi = await Teacher.findOne({
    $or: [
      { email: 'laxmeena01@gmail.com' },
      { name: { $regex: 'Laxmi', $options: 'i' } },
    ],
  });

  if (!vikash || !laxmi) {
    console.error('❌ Could not find Vikash or Laxmi in database!');
  }

  const keepIds = [vikash?._id, laxmi?._id].filter(Boolean);

  // Delete all other teachers
  const deleteResult = await Teacher.deleteMany({
    _id: { $nin: keepIds },
  });
  console.log(`🗑️ Deleted ${deleteResult.deletedCount} other teacher(s)`);

  // Update students if they had old teacher reference
  if (vikash) {
    await Student.updateMany(
      { teacher: { $nin: keepIds } },
      { $set: { teacher: vikash._id } }
    );
    await AdditionalTopic.updateMany(
      { teacher: { $nin: keepIds } },
      { $set: { teacher: vikash._id } }
    );
  }

  // Print all remaining teachers
  const remaining = await Teacher.find({}, 'name email qualification specialization');
  console.log('📋 Remaining active teachers:');
  remaining.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name} (${t.email})`);
  });

  await mongoose.disconnect();
  console.log('👋 Disconnected');
}

cleanTeachers().catch((err) => {
  console.error('❌ Error during teacher cleanup:', err);
  process.exit(1);
});
