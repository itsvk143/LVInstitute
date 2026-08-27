/**
 * Script to populate full curriculum for Class 10, Class 11, and Class 12
 * with all official subjects and complete chapters list.
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

const curriculumData = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CLASS 10 CURRICULUM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    grade: 10,
    className: 'Class 10',
    subjects: [
      {
        name: 'Mathematics',
        code: 'MATH-10',
        color: '#6366F1', // Indigo
        description: 'Complete Class 10 CBSE/NCERT Mathematics syllabus with algebra, geometry, trigonometry and statistics.',
        chapters: [
          'Real Numbers',
          'Polynomials',
          'Pair of Linear Equations in Two Variables',
          'Quadratic Equations',
          'Arithmetic Progressions',
          'Triangles (Similarity & Theorems)',
          'Coordinate Geometry',
          'Introduction to Trigonometry',
          'Some Applications of Trigonometry (Heights and Distances)',
          'Circles (Tangents to a Circle)',
          'Areas Related to Circles',
          'Surface Areas and Volumes',
          'Statistics (Mean, Median, Mode)',
          'Probability',
        ],
      },
      {
        name: 'Science',
        code: 'SCI-10',
        color: '#10B981', // Emerald
        description: 'Class 10 Science comprising Chemical Reactions, Life Processes, Light, Electricity and Natural Phenomena.',
        chapters: [
          'Chemical Reactions and Equations',
          'Acids, Bases and Salts',
          'Metals and Non-Metals',
          'Carbon and its Compounds',
          'Life Processes (Nutrition, Respiration, Transportation, Excretion)',
          'Control and Coordination',
          'How do Organisms Reproduce?',
          'Heredity and Evolution',
          'Light – Reflection and Refraction',
          'The Human Eye and the Colourful World',
          'Electricity (Ohm Law, Resistance, Heating Effect)',
          'Magnetic Effects of Electric Current',
          'Our Environment',
        ],
      },
      {
        name: 'English (Language & Literature)',
        code: 'ENG-10',
        color: '#EC4899', // Pink
        description: 'First Flight prose & poetry and Footprints without Feet supplementary reader.',
        chapters: [
          'A Letter to God (Prose)',
          'Dust of Snow & Fire and Ice (Poetry)',
          'Nelson Mandela: Long Walk to Freedom',
          'A Tiger in the Zoo (Poetry)',
          'Two Stories about Flying (His First Flight & Black Aeroplane)',
          'How to Tell Wild Animals & The Ball Poem',
          'From the Diary of Anne Frank',
          'Amanda! (Poetry)',
          'Glimpses of India (A Baker from Goa, Coorg, Tea from Assam)',
          'The Trees & Fog (Poetry)',
          'Mijbil the Otter',
          'Madam Rides the Bus',
          'The Tale of Custard the Dragon & For Anne Gregory',
          'The Sermon at Benares',
          'The Proposal (Play)',
          'A Triumph of Surgery (Supplementary)',
          'The Thief Story (Supplementary)',
          'The Midnight Visitor (Supplementary)',
          'A Question of Trust (Supplementary)',
          'Footprints without Feet (Supplementary)',
          'The Making of a Scientist (Supplementary)',
          'The Necklace (Supplementary)',
          'Bholi (Supplementary)',
          'The Book that Saved the Earth (Supplementary)',
        ],
      },
      {
        name: 'Social Science',
        code: 'SST-10',
        color: '#F59E0B', // Amber
        description: 'History (India & Contemporary World), Geography (Contemporary India), Political Science & Economics.',
        chapters: [
          'The Rise of Nationalism in Europe (History)',
          'Nationalism in India (History)',
          'The Making of a Global World (History)',
          'The Age of Industrialisation (History)',
          'Print Culture and the Modern World (History)',
          'Resources and Development (Geography)',
          'Forest and Wildlife Resources (Geography)',
          'Water Resources (Geography)',
          'Agriculture (Geography)',
          'Minerals and Energy Resources (Geography)',
          'Manufacturing Industries (Geography)',
          'Life Lines of National Economy (Geography)',
          'Power Sharing (Political Science)',
          'Federalism (Political Science)',
          'Gender, Religion and Caste (Political Science)',
          'Political Parties (Political Science)',
          'Outcomes of Democracy (Political Science)',
          'Development (Economics)',
          'Sectors of the Indian Economy (Economics)',
          'Money and Credit (Economics)',
          'Globalisation and the Indian Economy (Economics)',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASS 11 CURRICULUM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    grade: 11,
    className: 'Class 11',
    subjects: [
      {
        name: 'Mathematics (Class 11)',
        code: 'MATH-11',
        color: '#3B82F6',
        description: 'Class 11 Higher Mathematics including Sets, Trigonometry, Conic Sections, Calculus and Probability.',
        chapters: [
          'Sets',
          'Relations and Functions',
          'Trigonometric Functions',
          'Complex Numbers and Quadratic Equations',
          'Linear Inequalities',
          'Permutations and Combinations',
          'Binomial Theorem',
          'Sequences and Series',
          'Straight Lines',
          'Conic Sections (Circles, Parabola, Ellipse, Hyperbola)',
          'Introduction to Three Dimensional Geometry',
          'Limits and Derivatives',
          'Statistics',
          'Probability',
        ],
      },
      {
        name: 'Physics (Class 11)',
        code: 'PHY-11',
        color: '#06B6D4',
        description: 'Kinematics, Laws of Motion, Gravitation, Thermodynamics, Oscillations and Waves.',
        chapters: [
          'Units and Measurements',
          'Motion in a Straight Line',
          'Motion in a Plane',
          'Laws of Motion & Friction',
          'Work, Energy and Power',
          'System of Particles and Rotational Motion',
          'Gravitation',
          'Mechanical Properties of Solids',
          'Mechanical Properties of Fluids',
          'Thermal Properties of Matter',
          'Thermodynamics',
          'Kinetic Theory of Gases',
          'Oscillations',
          'Waves',
        ],
      },
      {
        name: 'Chemistry (Class 11)',
        code: 'CHEM-11',
        color: '#10B981',
        description: 'Physical Chemistry basics, Atomic Structure, Periodic Table, Chemical Bonding and Hydrocarbons.',
        chapters: [
          'Some Basic Concepts of Chemistry',
          'Structure of Atom',
          'Classification of Elements and Periodicity in Properties',
          'Chemical Bonding and Molecular Structure',
          'Chemical Thermodynamics',
          'Equilibrium',
          'Redox Reactions',
          'Organic Chemistry – Some Basic Principles and Techniques',
          'Hydrocarbons',
        ],
      },
      {
        name: 'Biology (Class 11)',
        code: 'BIO-11',
        color: '#059669',
        description: 'Diversity of living world, structural organization, cell biology, plant & human physiology.',
        chapters: [
          'The Living World',
          'Biological Classification',
          'Plant Kingdom',
          'Animal Kingdom',
          'Morphology of Flowering Plants',
          'Anatomy of Flowering Plants',
          'Structural Organisation in Animals',
          'Cell: The Unit of Life',
          'Biomolecules',
          'Cell Cycle and Cell Division',
          'Photosynthesis in Higher Plants',
          'Respiration in Plants',
          'Plant Growth and Development',
          'Breathing and Exchange of Gases',
          'Body Fluids and Circulation',
          'Excretory Products and their Elimination',
          'Locomotion and Movement',
          'Neural Control and Coordination',
          'Chemical Coordination and Integration',
        ],
      },
      {
        name: 'English Core (Class 11)',
        code: 'ENG-11',
        color: '#8B5CF6',
        description: 'Hornbill prose & poetry and Snapshots supplementary reader.',
        chapters: [
          'The Portrait of a Lady (Prose)',
          'A Photograph (Poem)',
          'We\'re Not Afraid to Die... if We Can All Be Together',
          'Discovering Tut: the Saga Continues',
          'The Laburnum Top (Poem)',
          'The Voice of the Rain (Poem)',
          'Childhood (Poem)',
          'The Adventure',
          'Silk Road',
          'Father to Son (Poem)',
          'The Summer of the Beautiful White Horse (Snapshots)',
          'The Address (Snapshots)',
          'Mother\'s Day (Snapshots)',
          'Birth (Snapshots)',
          'The Tale of Melon City (Snapshots)',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASS 12 CURRICULUM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    grade: 12,
    className: 'Class 12',
    subjects: [
      {
        name: 'Mathematics (Class 12)',
        code: 'MATH-12',
        color: '#3B82F6',
        description: 'Calculus (Differentiation & Integration), Matrices, Determinants, Vectors, 3D Geometry and Linear Programming.',
        chapters: [
          'Relations and Functions',
          'Inverse Trigonometric Functions',
          'Matrices',
          'Determinants',
          'Continuity and Differentiability',
          'Application of Derivatives',
          'Integrals (Indefinite & Definite)',
          'Application of Integrals (Area under Curves)',
          'Differential Equations',
          'Vector Algebra',
          'Three Dimensional Geometry',
          'Linear Programming',
          'Probability',
        ],
      },
      {
        name: 'Physics (Class 12)',
        code: 'PHY-12',
        color: '#06B6D4',
        description: 'Electrostatics, Magnetism, Electromagnetic Induction, Optics, Dual Nature, Atoms, Nuclei and Semiconductor Electronics.',
        chapters: [
          'Electric Charges and Fields',
          'Electrostatic Potential and Capacitance',
          'Current Electricity',
          'Moving Charges and Magnetism',
          'Magnetism and Matter',
          'Electromagnetic Induction',
          'Alternating Current',
          'Electromagnetic Waves',
          'Ray Optics and Optical Instruments',
          'Wave Optics',
          'Dual Nature of Radiation and Matter',
          'Atoms',
          'Nuclei',
          'Semiconductor Electronics: Materials, Devices and Simple Circuits',
        ],
      },
      {
        name: 'Chemistry (Class 12)',
        code: 'CHEM-12',
        color: '#10B981',
        description: 'Solutions, Electrochemistry, Kinetics, d & f block, Coordination Compounds and Organic Chemistry (Haloalkanes, Alcohols, Aldehydes, Amines, Biomolecules).',
        chapters: [
          'Solutions',
          'Electrochemistry',
          'Chemical Kinetics',
          'The d- and f-Block Elements',
          'Coordination Compounds',
          'Haloalkanes and Haloarenes',
          'Alcohols, Phenols and Ethers',
          'Aldehydes, Ketones and Carboxylic Acids',
          'Amines',
          'Biomolecules',
        ],
      },
      {
        name: 'Biology (Class 12)',
        code: 'BIO-12',
        color: '#059669',
        description: 'Reproduction, Genetics and Evolution, Biology in Human Welfare, Biotechnology and Ecology.',
        chapters: [
          'Sexual Reproduction in Flowering Plants',
          'Human Reproduction',
          'Reproductive Health',
          'Principles of Inheritance and Variation',
          'Molecular Basis of Inheritance',
          'Evolution',
          'Human Health and Disease',
          'Microbes in Human Welfare',
          'Biotechnology: Principles and Processes',
          'Biotechnology and its Applications',
          'Organisms and Populations',
          'Ecosystem',
          'Biodiversity and Conservation',
        ],
      },
      {
        name: 'English Core (Class 12)',
        code: 'ENG-12',
        color: '#8B5CF6',
        description: 'Flamingo (Prose & Poetry) and Vistas supplementary reader for Class 12 Board examinations.',
        chapters: [
          'The Last Lesson (Prose)',
          'Lost Spring (Prose)',
          'Deep Water (Prose)',
          'The Rattrap (Prose)',
          'Indigo (Prose)',
          'Poets and Pancakes (Prose)',
          'The Interview (Prose)',
          'Going Places (Prose)',
          'My Mother at Sixty-Six (Poem)',
          'Keeping Quiet (Poem)',
          'A Thing of Beauty (Poem)',
          'A Roadside Stand (Poem)',
          'Aunt Jennifer\'s Tigers (Poem)',
          'The Third Level (Vistas)',
          'The Tiger King (Vistas)',
          'Journey to the end of the Earth (Vistas)',
          'The Enemy (Vistas)',
          'On the Face of It (Vistas)',
          'Memories of Childhood (Vistas)',
        ],
      },
    ],
  },
];

async function addCurriculum() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected');

  const { Class, Board } = await import('../lib/models/Lookup');
  const { Subject } = await import('../lib/models/Subject');
  const { Chapter } = await import('../lib/models/Chapter');

  const cbseBoard = (await Board.findOne({ code: 'CBSE' })) || (await Board.findOne({}));

  for (const gradeGroup of curriculumData) {
    console.log(`\n==================================================`);
    console.log(`🎓 Setting up ${gradeGroup.className} (Grade ${gradeGroup.grade})...`);
    console.log(`==================================================`);

    let classDoc = await Class.findOne({ grade: gradeGroup.grade });
    if (!classDoc) {
      classDoc = await Class.create({
        name: gradeGroup.className,
        grade: gradeGroup.grade,
        isActive: true,
      });
      console.log(`✨ Created Class document for ${gradeGroup.className}`);
    }

    for (const subItem of gradeGroup.subjects) {
      console.log(`\n📚 Subject: ${subItem.name} (${subItem.code})...`);

      // Find or create subject for this class
      let subject = await Subject.findOne({
        name: subItem.name,
        class: classDoc._id,
      });

      if (!subject) {
        subject = await Subject.create({
          name: subItem.name,
          code: subItem.code,
          color: subItem.color,
          description: subItem.description,
          class: classDoc._id,
          board: cbseBoard?._id,
          isActive: true,
        });
        console.log(`   ✨ Created subject ${subItem.name}`);
      } else {
        subject.code = subItem.code;
        subject.color = subItem.color;
        subject.description = subItem.description;
        subject.board = cbseBoard?._id;
        await subject.save();
        console.log(`   ℹ️ Updated existing subject ${subItem.name}`);
      }

      // Add/update all chapters for this subject
      console.log(`   📑 Syncing ${subItem.chapters.length} chapters...`);
      for (let i = 0; i < subItem.chapters.length; i++) {
        const chTitle = subItem.chapters[i];
        const chNum = i + 1;

        const existingChapter = await Chapter.findOne({
          subject: subject._id,
          chapterNumber: chNum,
        });

        if (!existingChapter) {
          await Chapter.create({
            subject: subject._id,
            name: chTitle,
            chapterNumber: chNum,
            difficulty: 'medium',
            estimatedHours: 8,
            isActive: true,
          });
        } else {
          existingChapter.name = chTitle;
          existingChapter.isActive = true;
          await existingChapter.save();
        }
      }

      const activeCount = await Chapter.countDocuments({ subject: subject._id, isActive: true });
      console.log(`   ✅ ${activeCount} chapters active for ${subItem.name}`);
    }
  }

  console.log('\n🎉 ALL CHAPTERS & SUBJECTS FOR CLASS 10, 11, AND 12 SUCCESSFULLY ADDED TO MONGODB ATLAS!');
  await mongoose.disconnect();
}

addCurriculum().catch((err) => {
  console.error('❌ Error adding curriculum:', err);
  process.exit(1);
});
