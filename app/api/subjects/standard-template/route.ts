import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Subject } from '@/lib/models/Subject';
import { Chapter } from '@/lib/models/Chapter';
import { Class, Board } from '@/lib/models/Lookup';
import { School } from '@/lib/models/School';
import { requireAdmin } from '@/lib/auth';

// Standard syllabus presets dictionary for instant 1-click loading
export const STANDARD_SYLLABUS_PRESETS: Record<
  string,
  {
    grade: number;
    className: string;
    subjects: Array<{
      name: string;
      code: string;
      color: string;
      description: string;
      chapters: string[];
    }>;
  }
> = {
  class10: {
    grade: 10,
    className: 'Class 10',
    subjects: [
      {
        name: 'Mathematics',
        code: 'MATH-10',
        color: '#6366F1',
        description: 'Complete NCERT/CBSE Class 10 Mathematics syllabus.',
        chapters: [
          'Real Numbers',
          'Polynomials',
          'Pair of Linear Equations in Two Variables',
          'Quadratic Equations',
          'Arithmetic Progressions',
          'Triangles',
          'Coordinate Geometry',
          'Introduction to Trigonometry',
          'Some Applications of Trigonometry',
          'Circles',
          'Areas Related to Circles',
          'Surface Areas and Volumes',
          'Statistics',
          'Probability',
        ],
      },
      {
        name: 'Science',
        code: 'SCI-10',
        color: '#10B981',
        description: 'Class 10 Science: Chemical Reactions, Life Processes, Light, Electricity & Environment.',
        chapters: [
          'Chemical Reactions and Equations',
          'Acids, Bases and Salts',
          'Metals and Non-Metals',
          'Carbon and its Compounds',
          'Life Processes',
          'Control and Coordination',
          'How do Organisms Reproduce?',
          'Heredity and Evolution',
          'Light – Reflection and Refraction',
          'The Human Eye and the Colourful World',
          'Electricity',
          'Magnetic Effects of Electric Current',
          'Our Environment',
        ],
      },
      {
        name: 'English (Language & Literature)',
        code: 'ENG-10',
        color: '#EC4899',
        description: 'First Flight & Footprints without Feet.',
        chapters: [
          'A Letter to God',
          'Dust of Snow & Fire and Ice',
          'Nelson Mandela: Long Walk to Freedom',
          'A Tiger in the Zoo',
          'Two Stories about Flying',
          'How to Tell Wild Animals & The Ball Poem',
          'From the Diary of Anne Frank',
          'Amanda!',
          'Glimpses of India',
          'The Trees & Fog',
          'Mijbil the Otter',
          'Madam Rides the Bus',
          'The Tale of Custard the Dragon',
          'The Sermon at Benares',
          'The Proposal',
          'A Triumph of Surgery',
          'The Thief Story',
          'The Midnight Visitor',
          'A Question of Trust',
          'Footprints without Feet',
          'The Making of a Scientist',
          'The Necklace',
          'Bholi',
          'The Book that Saved the Earth',
        ],
      },
      {
        name: 'Social Science',
        code: 'SST-10',
        color: '#F59E0B',
        description: 'History, Geography, Political Science & Economics for Class 10.',
        chapters: [
          'The Rise of Nationalism in Europe',
          'Nationalism in India',
          'The Making of a Global World',
          'The Age of Industrialisation',
          'Print Culture and the Modern World',
          'Resources and Development',
          'Forest and Wildlife Resources',
          'Water Resources',
          'Agriculture',
          'Minerals and Energy Resources',
          'Manufacturing Industries',
          'Life Lines of National Economy',
          'Power Sharing',
          'Federalism',
          'Gender, Religion and Caste',
          'Political Parties',
          'Outcomes of Democracy',
          'Development',
          'Sectors of the Indian Economy',
          'Money and Credit',
          'Globalisation and the Indian Economy',
        ],
      },
    ],
  },
  class11: {
    grade: 11,
    className: 'Class 11',
    subjects: [
      {
        name: 'Mathematics (Class 11)',
        code: 'MATH-11',
        color: '#3B82F6',
        description: 'Sets, Relations, Trigonometry, Calculus, Coordinate Geometry & Probability.',
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
          'Conic Sections',
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
        description: 'Kinematics, Laws of Motion, Work Energy, Gravitation, Thermodynamics & Waves.',
        chapters: [
          'Units and Measurements',
          'Motion in a Straight Line',
          'Motion in a Plane',
          'Laws of Motion',
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
        description: 'Physical Chemistry basics, Atomic Structure, Bonding, Equilibrium & Hydrocarbons.',
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
        description: 'Diversity, Cell Biology, Biomolecules, Plant & Human Physiology.',
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
        description: 'Hornbill & Snapshots for Class 11.',
        chapters: [
          'The Portrait of a Lady',
          'A Photograph',
          'We are Not Afraid to Die... if We Can All Be Together',
          'Discovering Tut: the Saga Continues',
          'The Laburnum Top',
          'The Voice of the Rain',
          'Childhood',
          'The Adventure',
          'Silk Road',
          'Father to Son',
          'The Summer of the Beautiful White Horse',
          'The Address',
          'Mother Day',
          'Birth',
          'The Tale of Melon City',
        ],
      },
    ],
  },
  class12: {
    grade: 12,
    className: 'Class 12',
    subjects: [
      {
        name: 'Mathematics (Class 12)',
        code: 'MATH-12',
        color: '#3B82F6',
        description: 'Calculus, Matrices, Determinants, Vectors, 3D Geometry & Probability.',
        chapters: [
          'Relations and Functions',
          'Inverse Trigonometric Functions',
          'Matrices',
          'Determinants',
          'Continuity and Differentiability',
          'Application of Derivatives',
          'Integrals',
          'Application of Integrals',
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
        description: 'Electrostatics, Magnetism, EMI, AC, Optics, Modern Physics & Semiconductor.',
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
        description: 'Solutions, Electrochemistry, Kinetics, Coordination Compounds & Organic Chemistry.',
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
        description: 'Reproduction, Genetics, Evolution, Human Health, Biotechnology & Ecology.',
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
        description: 'Flamingo & Vistas for Class 12.',
        chapters: [
          'The Last Lesson',
          'Lost Spring',
          'Deep Water',
          'The Rattrap',
          'Indigo',
          'Poets and Pancakes',
          'The Interview',
          'Going Places',
          'My Mother at Sixty-Six',
          'Keeping Quiet',
          'A Thing of Beauty',
          'A Roadside Stand',
          'Aunt Jennifer Tigers',
          'The Third Level',
          'The Tiger King',
          'Journey to the end of the Earth',
          'The Enemy',
          'On the Face of It',
          'Memories of Childhood',
        ],
      },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    void School;

    const body = await req.json();
    const { templateKey, schoolId } = body; // 'class10' | 'class11' | 'class12' | 'all'

    const cbseBoard = (await Board.findOne({ code: 'CBSE' })) || (await Board.findOne({}));

    const keysToProcess =
      templateKey === 'all'
        ? ['class10', 'class11', 'class12']
        : [templateKey];

    let totalSubjectsCreated = 0;
    let totalChaptersCreated = 0;

    for (const key of keysToProcess) {
      const preset = STANDARD_SYLLABUS_PRESETS[key];
      if (!preset) continue;

      let classDoc = await Class.findOne({ grade: preset.grade });
      if (!classDoc) {
        classDoc = await Class.create({ name: preset.className, grade: preset.grade, isActive: true });
      }

      for (const sub of preset.subjects) {
        const query: Record<string, unknown> = {
          name: sub.name,
          class: classDoc._id,
        };
        if (schoolId && schoolId !== 'global') {
          query.school = schoolId;
        } else {
          query.$or = [{ school: null }, { school: { $exists: false } }];
        }

        let subjectDoc = await Subject.findOne(query);
        if (!subjectDoc) {
          subjectDoc = await Subject.create({
            name: sub.name,
            code: sub.code,
            color: sub.color,
            description: sub.description,
            class: classDoc._id,
            board: cbseBoard?._id,
            school: schoolId && schoolId !== 'global' ? schoolId : undefined,
            isActive: true,
          });
          totalSubjectsCreated++;
        }

        for (let i = 0; i < sub.chapters.length; i++) {
          const chName = sub.chapters[i];
          const chNum = i + 1;

          const existingChapter = await Chapter.findOne({
            subject: subjectDoc._id,
            chapterNumber: chNum,
          });

          if (!existingChapter) {
            await Chapter.create({
              subject: subjectDoc._id,
              name: chName,
              chapterNumber: chNum,
              difficulty: 'medium',
              estimatedHours: 8,
              isActive: true,
            });
            totalChaptersCreated++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Standard syllabus successfully applied (${totalSubjectsCreated} subjects, ${totalChaptersCreated} chapters created).`,
    });
  } catch (error) {
    console.error('Standard template POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to apply standard template' }, { status: 500 });
  }
}
