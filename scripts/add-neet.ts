/**
 * Script to add comprehensive NEET Curriculum (Physics, Chemistry, Botany, Zoology) with all chapters
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

const neetCurriculum = [
  {
    name: 'NEET Physics',
    code: 'NEET-PHY',
    color: '#3B82F6', // Vibrant Blue
    description: 'Comprehensive NEET Physics syllabus covering Mechanics, Electromagnetism, Optics, Thermodynamics and Modern Physics.',
    chapters: [
      'Units and Measurements',
      'Motion in a Straight Line',
      'Motion in a Plane (Vectors & Projectile)',
      'Laws of Motion & Friction',
      'Work, Energy and Power',
      'System of Particles and Rotational Motion',
      'Gravitation & Planetary Motion',
      'Mechanical Properties of Solids (Elasticity)',
      'Mechanical Properties of Fluids (Hydrostatics & Hydrodynamics)',
      'Thermal Properties of Matter & Calorimetry',
      'Thermodynamics & Heat Engines',
      'Kinetic Theory of Gases',
      'Oscillations & Simple Harmonic Motion',
      'Waves & Doppler Effect',
      'Electric Charges and Fields (Electrostatics I)',
      'Electrostatic Potential and Capacitance (Electrostatics II)',
      'Current Electricity & Circuits',
      'Moving Charges and Magnetism',
      'Magnetism and Matter',
      'Electromagnetic Induction (EMI)',
      'Alternating Current (AC)',
      'Electromagnetic Waves',
      'Ray Optics and Optical Instruments',
      'Wave Optics (Interference & Diffraction)',
      'Dual Nature of Radiation and Matter (Photoelectric Effect)',
      'Atoms & Bohr Model',
      'Nuclei & Radioactivity',
      'Semiconductor Electronics: Materials, Devices and Simple Circuits',
      'Experimental Skills & Error Analysis in Physics',
    ],
  },
  {
    name: 'NEET Chemistry',
    code: 'NEET-CHEM',
    color: '#10B981', // Emerald Green
    description: 'Physical, Inorganic, and Organic Chemistry structured for NEET Medical entrance with reaction mechanisms and numericals.',
    chapters: [
      'Some Basic Concepts of Chemistry (Mole Concept & Stoichiometry)',
      'Structure of Atom & Quantum Numbers',
      'Classification of Elements and Periodicity in Properties',
      'Chemical Bonding and Molecular Structure (VSEPR & MOT)',
      'Chemical Thermodynamics & Energetics',
      'Equilibrium (Physical & Chemical Equilibrium)',
      'Ionic Equilibrium (pH, Buffers & Solubility Product)',
      'Redox Reactions & Oxidation States',
      'Solutions (Colligative Properties & Raoult Law)',
      'Electrochemistry & Nernst Equation',
      'Chemical Kinetics & Rate Laws',
      'The p-Block Elements (Group 13 to 18 Chemistry)',
      'The d- and f-Block Elements (Transition Elements & Lanthanoids)',
      'Coordination Compounds & Crystal Field Theory',
      'Purification and Characterisation of Organic Compounds',
      'General Organic Chemistry (GOC, Inductive, Resonance, Hyperconjugation)',
      'Isomerism in Organic Compounds (Structural & Stereoisomerism)',
      'Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic Compounds)',
      'Haloalkanes and Haloarenes (SN1 & SN2 Mechanisms)',
      'Alcohols, Phenols and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids',
      'Organic Compounds Containing Nitrogen (Amines & Diazonium Salts)',
      'Biomolecules (Carbohydrates, Amino Acids, Proteins, Nucleic Acids)',
      'Principles Related to Practical Chemistry (Salt Analysis & Functional Groups)',
    ],
  },
  {
    name: 'NEET Botany',
    code: 'NEET-BOT',
    color: '#059669', // Forest Green
    description: 'Plant biology, morphology, anatomy, physiology, plant genetics, biotechnology and ecology for NEET.',
    chapters: [
      'The Living World (Taxonomy & Systematics)',
      'Biological Classification (Monera, Protista, Fungi, Viruses)',
      'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms)',
      'Morphology of Flowering Plants (Roots, Stems, Leaves, Inflorescence, Flowers)',
      'Anatomy of Flowering Plants (Tissues & Secondary Growth)',
      'Cell: The Unit of Life (Cell Organelles & Membrane Structure)',
      'Cell Cycle and Cell Division (Mitosis, Meiosis & Cell Cycle Regulation)',
      'Photosynthesis in Higher Plants (Light Reaction, Dark Reaction, C3, C4 & CAM Pathways)',
      'Respiration in Plants (Glycolysis, Krebs Cycle & ETS)',
      'Plant Growth and Development (Plant Hormones & Photoperiodism)',
      'Sexual Reproduction in Flowering Plants (Microsporogenesis, Megasporogenesis & Double Fertilization)',
      'Principles of Inheritance and Variation (Mendelian Genetics & Linkage)',
      'Molecular Basis of Inheritance (DNA Replication, Transcription, Genetic Code & Translation)',
      'Microbes in Human Welfare (Biofertilizers, Biogas & Industrial Products)',
      'Biotechnology: Principles and Processes (Recombinant DNA Technology & PCR)',
      'Biotechnology and its Applications in Agriculture (Bt Crops & RNAi)',
      'Organisms and Populations (Adaptations, Population Growth & Interactions)',
      'Ecosystem (Energy Flow, Food Chains & Ecological Pyramids)',
      'Biodiversity and Conservation (Species-Area Relationship & Conservation Strategies)',
    ],
  },
  {
    name: 'NEET Zoology',
    code: 'NEET-ZOO',
    color: '#8B5CF6', // Royal Purple
    description: 'Human physiology, animal classification, animal tissues, reproduction, evolution, immunology and disease biology.',
    chapters: [
      'Animal Kingdom (Non-Chordates & Chordates Classification)',
      'Structural Organisation in Animals (Epithelial, Connective, Muscular & Neural Tissues)',
      'Biomolecules (Proteins, Enzymes, Lipids & Enzyme Kinetics)',
      'Breathing and Exchange of Gases (Respiratory Volumes & Transport of Gases)',
      'Body Fluids and Circulation (Blood, Heart Anatomy, ECG & Cardiac Cycle)',
      'Excretory Products and their Elimination (Nephron, Urine Formation & Counter-Current Mechanism)',
      'Locomotion and Movement (Skeletal System, Joints & Muscle Contraction Mechanism)',
      'Neural Control and Coordination (Neuron, Action Potential, Brain Anatomy & Reflex Arc)',
      'Chemical Coordination and Integration (Endocrine Glands, Hormones & Mechanism of Hormone Action)',
      'Human Reproduction (Male & Female Reproductive Systems, Gametogenesis & Menstrual Cycle)',
      'Reproductive Health (Contraceptive Methods, MTP, STIs & Assisted Reproductive Technologies)',
      'Evolution (Origin of Life, Theories of Evolution, Hardy-Weinberg Principle & Human Evolution)',
      'Human Health and Disease (Pathogens, Immunity, Vaccines, Cancer & AIDS)',
    ],
  },
];

async function addNeet() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB Atlas');

  const { Class, Board } = await import('../lib/models/Lookup');
  const { Subject } = await import('../lib/models/Subject');
  const { Chapter } = await import('../lib/models/Chapter');

  // Find or create Class 11 and Class 12
  let class11 = await Class.findOne({ grade: 11 });
  if (!class11) {
    class11 = await Class.create({ name: 'Class 11', grade: 11, isActive: true });
  }

  let class12 = await Class.findOne({ grade: 12 });
  if (!class12) {
    class12 = await Class.create({ name: 'Class 12', grade: 12, isActive: true });
  }

  let cbseBoard = await Board.findOne({ code: 'CBSE' });
  if (!cbseBoard) {
    cbseBoard = await Board.findOne({});
  }

  console.log(`Target Class: ${class12?.name || class11?.name}`);
  console.log(`Target Board: ${cbseBoard?.name || cbseBoard?.code}`);

  const targetClass = class12 || class11;
  const targetBoardId = cbseBoard?._id;

  for (const item of neetCurriculum) {
    console.log(`\n📚 Setting up subject: ${item.name}...`);
    
    // Check if subject already exists
    let subject = await Subject.findOne({ name: item.name });
    if (!subject) {
      subject = await Subject.create({
        name: item.name,
        code: item.code,
        color: item.color,
        description: item.description,
        class: targetClass._id,
        board: targetBoardId,
        isActive: true,
      });
      console.log(`   ✨ Created subject ${item.name} (_id: ${subject._id})`);
    } else {
      console.log(`   ℹ️ Found existing subject ${item.name} (_id: ${subject._id})`);
      // Update details
      subject.color = item.color;
      subject.description = item.description;
      subject.class = targetClass._id;
      if (targetBoardId) subject.board = targetBoardId;
      await subject.save();
    }

    // Add all chapters
    console.log(`   📑 Adding ${item.chapters.length} chapters...`);
    for (let i = 0; i < item.chapters.length; i++) {
      const chName = item.chapters[i];
      const chNum = i + 1;

      const existingChapter = await Chapter.findOne({
        subject: subject._id,
        chapterNumber: chNum,
      });

      if (!existingChapter) {
        await Chapter.create({
          subject: subject._id,
          name: chName,
          chapterNumber: chNum,
          difficulty: 'medium',
          estimatedHours: 8,
          isActive: true,
        });
      } else {
        existingChapter.name = chName;
        existingChapter.isActive = true;
        await existingChapter.save();
      }
    }

    const totalChapters = await Chapter.countDocuments({ subject: subject._id, isActive: true });
    console.log(`   ✅ ${totalChapters} chapters now active for ${item.name}`);
  }

  console.log('\n🎉 ALL NEET SUBJECTS & CHAPTERS ADDED SUCCESSFULLY TO MONGODB ATLAS!');
  await mongoose.disconnect();
}

addNeet().catch((err) => {
  console.error('❌ Error adding NEET curriculum:', err);
  process.exit(1);
});
