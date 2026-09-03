"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Search,
  BookOpen,
  Atom,
  Stethoscope,
  Trophy,
  Globe,
  Award,
  CheckCircle2,
  Users,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  Star,
  Activity,
  Compass,
  FlaskConical,
  Dna,
  Code2,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  ChevronDown,
  Building,
  Check,
  Flame,
  Clock,
  Laptop,
  Lightbulb,
  FileText,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  Play,
  Video,
  PlaySquare,
  Binary,
  Send,
  X,
  Target,
  TrendingUp,
  Landmark,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── OLYMPIADS DATA ───────────────────────────────────────────────────────────
const OLYMPIADS_DATA = [
  {
    id: "imo",
    category: "math",
    tag: "IMO / IOQM",
    badge: "18 Medals Won in 2025",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "International Mathematical Olympiad",
    sub: "Pure & Applied Mathematics",
    desc: "Advanced combinatorics, number theory, Euclidean geometry, and functional equations with Olympiad gold medalists.",
    highlights: ["Stage-by-Stage Proof Techniques", "Combinatorics & Number Theory Mastery", "1,500+ Non-Routine Problem Drills"],
    roadmap: "IOQM → RMO → INMO → IMOTC → IMO",
    coverage: "Stage 1 (IOQM) to Stage 5 (IMO)",
    icon: Binary,
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    accentColor: "border-indigo-200 hover:border-indigo-400 group-hover:shadow-indigo-500/10",
    active: true,
  },
  {
    id: "ioaa",
    category: "physics",
    tag: "IOAA / NSEA",
    badge: "Global Rank 4 Producer",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "Astronomy & Astrophysics Olympiad",
    sub: "Astronomy, Physics & Sky Observation",
    desc: "Celestial mechanics, stellar evolution, spherical trigonometry, and observational data analysis.",
    highlights: ["Celestial Mechanics & Keplerian Orbits", "Observational Sky Chart Simulations", "Telescopic Error Analysis Drills"],
    roadmap: "NSEA → INAO → OCSC → PDT → IOAA",
    coverage: "NSEA to International Finals",
    icon: Compass,
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    accentColor: "border-purple-200 hover:border-purple-400 group-hover:shadow-purple-500/10",
    active: true,
  },
  {
    id: "hbcse",
    category: "science",
    tag: "HBCSE Junior Science",
    badge: "45+ OCSC Camp Selects",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "HBCSE National Science Olympiads",
    sub: "Physics, Chemistry, Biology & Junior Science",
    desc: "Pinnacle science camp preparation mentored by former HBCSE faculty and national coaches.",
    highlights: ["Integrated PCB Advanced Concepts", "Experimental Lab Data Interpretation", "National Rank Benchmark Tests"],
    roadmap: "NSEJS → INJSO → OCSC → IJSO",
    coverage: "NSEJS / INJSO / OCSC",
    icon: Atom,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    accentColor: "border-emerald-200 hover:border-emerald-400 group-hover:shadow-emerald-500/10",
    active: false,
  },
  {
    id: "ipho",
    category: "physics",
    tag: "IPhO / NSEP",
    badge: "6 Gold Medals in 3 Years",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "International Physics Olympiad",
    sub: "Theoretical & Experimental Physics",
    desc: "Calculus-based electrodynamics, relativistic mechanics, thermodynamics, and experimental error analysis.",
    highlights: ["Lagrangian & Relativistic Dynamics", "Advanced Wave Optics & Quantum Intro", "Experimental Rig Design & Error Bounds"],
    roadmap: "NSEP → INPhO → OCSC → PDT → IPhO",
    coverage: "NSEP to IPhO World Stage",
    icon: Atom,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    accentColor: "border-blue-200 hover:border-blue-400 group-hover:shadow-blue-500/10",
    active: false,
  },
  {
    id: "icho",
    category: "bio-chem",
    tag: "IChO / NSEC",
    badge: "98% Qualification Rate",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "International Chemistry Olympiad",
    sub: "Organic, Inorganic & Physical Chemistry",
    desc: "Spectroscopy, stereochemistry, chemical kinetics, and quantum orbital calculations.",
    highlights: ["Advanced Reaction Stereochemistry", "Spectroscopic NMR & IR Problem Sets", "Chemical Thermodynamics Modeling"],
    roadmap: "NSEC → INChO → OCSC → IChO",
    coverage: "NSEC to IChO",
    icon: FlaskConical,
    iconColor: "text-teal-600 bg-teal-50 border-teal-200",
    accentColor: "border-teal-200 hover:border-teal-400 group-hover:shadow-teal-500/10",
    active: false,
  },
  {
    id: "inbo",
    category: "bio-chem",
    tag: "INBO / NSEB",
    badge: "Top 50 All-India Ranks",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "National Biology Olympiad",
    sub: "Genetics, Biochemistry & Physiology",
    desc: "Molecular genetics, plant physiology, ecology models, and biochemical pathways.",
    highlights: ["Biochemical Pathway Modeling", "Advanced Mendelian & Non-Mendelian Genetics", "Cellular & Systems Physiology"],
    roadmap: "NSEB → INBO → OCSC → IBO",
    coverage: "NSEB to IBO",
    icon: Dna,
    iconColor: "text-rose-600 bg-rose-50 border-rose-200",
    accentColor: "border-rose-200 hover:border-rose-400 group-hover:shadow-rose-500/10",
    active: true,
  },
  {
    id: "nco",
    category: "cyber",
    tag: "NCO / Cyber",
    badge: "100% Perfect Scores",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "National Cyber Olympiad",
    sub: "Algorithms, Data Structures & Logic",
    desc: "Logical reasoning, Python programming, computer architecture, and algorithm optimization.",
    highlights: ["Algorithm Time & Space Complexity", "Boolean Algebra & Circuit Logic", "Competitive Coding Fundamentals"],
    roadmap: "Stage 1 (School) → Stage 2 (National)",
    coverage: "Grades 6–12 Nationwide",
    icon: Lightbulb,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    accentColor: "border-amber-200 hover:border-amber-400 group-hover:shadow-amber-500/10",
    active: false,
  },
  {
    id: "ioi",
    category: "cyber",
    tag: "IOI / ZIO / INOI",
    badge: "IOI Camp Finalists",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "International Informatics Olympiad (IOI)",
    sub: "Competitive Programming & Graph Theory",
    desc: "C++ algorithm design, dynamic programming, tree traversals, and computational complexity.",
    highlights: ["Advanced Dynamic Programming", "Graph Traversals (Dijkstra, Flows)", "Segment Trees & Fenwick Trees"],
    roadmap: "ZIO / ZCO → INOI → IOITC → IOI",
    coverage: "ZIO / ZCO / INOI / IOI",
    icon: Code2,
    iconColor: "text-violet-600 bg-violet-50 border-violet-200",
    accentColor: "border-violet-200 hover:border-violet-400 group-hover:shadow-violet-500/10",
    active: false,
  },
];

// ── NEET UG & BOARD EXAMS DATA ───────────────────────────────────────────────
const NEET_BOARD_DATA = [
  {
    id: "neet-2yr",
    category: "neet",
    tag: "NEET UG • Class 11 & 12",
    badge: "94% GMC & AIIMS Rate",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    title: "NEET 2-Year Pinnacle Medical Program",
    sub: "Physics, Chemistry & Biology (Botany + Zoology)",
    desc: "NCERT line-by-line decoding, doctor faculty mentorship, 12,000+ clinical MCQs, and weekly OMR-based simulated drills.",
    highlights: ["100% NCERT Extract Question Bank", "Daily 1-on-1 Physics Doubt Clearing", "AIIMS & Top GMC Alumnus Mentorship"],
    roadmap: "NCERT Deep Dive → Daily DPPs → Minor OMR Tests → Major NEET Mocks",
    coverage: "Complete Class 11 + 12 PCB + 30-Yr PYQ Bank",
    icon: Stethoscope,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    accentColor: "border-emerald-200 hover:border-emerald-400 group-hover:shadow-emerald-500/10",
    active: true,
  },
  {
    id: "neet-dropper",
    category: "neet",
    tag: "NEET Dropper / Repeater",
    badge: "+180 Avg Score Jump",
    badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
    title: "NEET Dropper & Repeater Apex Batch",
    sub: "Intensive 1-Year Rank Booster",
    desc: "Rigorous daily structured regime with real-time weak topic diagnostics, error logs, and high-yield MCQ sessions.",
    highlights: ["Strict Error Log Tracking & Root-Cause Fixes", "180-Question Timed Speed Drills Every Alternate Day", "Special Physics Numerical Workshops"],
    roadmap: "Diagnostic Test → Concept Fixes → 60+ Full OMR Mocks → NEET Rank",
    coverage: "Full NEET UG Syllabus with Target 680+",
    icon: Flame,
    iconColor: "text-rose-600 bg-rose-50 border-rose-200",
    accentColor: "border-rose-200 hover:border-rose-400 group-hover:shadow-rose-500/10",
    active: false,
  },
  {
    id: "cbse-12",
    category: "class12",
    tag: "Class 12 CBSE / ISC",
    badge: "99.2% Highest School Score",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    title: "Class 12 Science Board Topper Masterclass",
    sub: "Physics, Chemistry, Maths / Biology & English",
    desc: "Step-by-step subjective answer writing masterclass with official CBSE marking scheme rubrics and derivation handbooks.",
    highlights: ["Detailed Step-Marking Board Rubric Training", "Handwritten Derivations & Flowchart Compendiums", "3-Tier Pre-Board Answer Sheet Evaluations"],
    roadmap: "NCERT Comprehensive → Chapter Tests → Pre-Board Drills → 95%+ Target",
    coverage: "CBSE / ISC Class 12 Boards",
    icon: BookOpen,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    accentColor: "border-blue-200 hover:border-blue-400 group-hover:shadow-blue-500/10",
    active: false,
  },
  {
    id: "cbse-10",
    category: "class10",
    tag: "Class 10 CBSE / ICSE",
    badge: "100% Pass Rate with 92% Avg",
    badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
    title: "Class 10 Board Accelerator Program",
    sub: "Mathematics, Science, Social Science & English",
    desc: "High-scoring conceptual clarity and presentation techniques designed to turn standard performers into 95%+ board toppers.",
    highlights: ["Maths NCERT Exemplar & Standard/Basic Drills", "Science Case-Study & Assertion-Reasoning Mastery", "Social Science Point-Wise Answer Structuring"],
    roadmap: "Concept Clarity → Mid-Term Blitz → Sample Papers → 98%+ Board Result",
    coverage: "Class 10 CBSE & ICSE Boards",
    icon: Award,
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    accentColor: "border-purple-200 hover:border-purple-400 group-hover:shadow-purple-500/10",
    active: true,
  },
  {
    id: "neet-bio-special",
    category: "neet",
    tag: "NEET Biology 360/360",
    badge: "Avg Score 348/360 in 2025",
    badgeColor: "text-teal-700 bg-teal-50 border-teal-200",
    title: "NEET Biology 360/360 Perfection Module",
    sub: "Botany & Zoology NCERT Mastery",
    desc: "Master every diagram, summary table, scientist note, and hidden sentence in NCERT biology with mnemonics and active recall.",
    highlights: ["Diagrammatic Labeling & Active Recall Flashcards", "Statement-Type & Match-the-Following Drills", "5,000+ NCERT-Extracted Unitwise Questions"],
    roadmap: "Line-by-Line Reading → Flashcard Quizzes → Full Bio 360 Tests",
    coverage: "38 Chapters (Class 11 & 12 Biology)",
    icon: Dna,
    iconColor: "text-teal-600 bg-teal-50 border-teal-200",
    accentColor: "border-teal-200 hover:border-teal-400 group-hover:shadow-teal-500/10",
    active: false,
  },
  {
    id: "neet-physics-special",
    category: "neet",
    tag: "NEET Physics 170+",
    badge: "Top Rank Differentiator",
    badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    title: "NEET Physics Speed & Numerical Mastery",
    sub: "Mechanics, Electrodynamics & Modern Physics",
    desc: "Overcome physics phobia with visualization-first problem solving, formula shortcuts, and 45-second calculation techniques.",
    highlights: ["45-Second Question Solving Tricks & Shortcuts", "Calculus & Vector Mechanics Made Frictionless", "Top 500 Most Expected NEET Problem Profiles"],
    roadmap: "Basic Math Tools → Concept Visualization → Speed Drills → 170+ Target",
    coverage: "Complete NEET Physics Syllabus",
    icon: Atom,
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    accentColor: "border-indigo-200 hover:border-indigo-400 group-hover:shadow-indigo-500/10",
    active: false,
  },
  {
    id: "neet-chemistry-special",
    category: "neet",
    tag: "NEET Chemistry 170+",
    badge: "100% NCERT Reaction Bank",
    badgeColor: "text-amber-800 bg-amber-50 border-amber-200",
    title: "NEET Chemistry 170+ Reaction & Numerical Mastery",
    sub: "Organic, Inorganic & Physical Chemistry",
    desc: "Master all named reactions, NCERT table trends, coordination mechanisms, and rapid physical chemistry formula shortcuts without rote memorization.",
    highlights: ["Mechanisms & Named Reaction Flowcharts (100% NCERT)", "Inorganic Exceptions & Periodic Trend Memory Maps", "Physical Chem 30-Second Calculation Shortcuts & PYQs"],
    roadmap: "NCERT Inorganics → Reaction Flowcharts → Physical Shortcuts → 175+ Target",
    coverage: "Complete NEET Chemistry (Class 11 + 12)",
    icon: FlaskConical,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    accentColor: "border-amber-200 hover:border-amber-400 group-hover:shadow-amber-500/10",
    active: true,
  },
  {
    id: "foundation-med",
    category: "foundation",
    tag: "Class 8 & 9 Foundation",
    badge: "Early Edge Builder",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "Pre-Medical & Science Foundation",
    sub: "Class 8–9 Integrated School + Entrance Prep",
    desc: "Builds deep scientific curiosity and strong analytical aptitude for future NEET, JEE, and Olympiad success without school burnout.",
    highlights: ["Advanced PCB Core Concepts for Higher Classes", "Scientific Reasoning & Mental Ability Modules", "Balanced Schedule Perfectly Syncing with School Exams"],
    roadmap: "School Syllabus Anchor → Advance Layering → Olympiad & NTSE Edge",
    coverage: "Class 8/9 School + Science Foundation",
    icon: Lightbulb,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    accentColor: "border-amber-200 hover:border-amber-400 group-hover:shadow-amber-500/10",
    active: false,
  },
  {
    id: "icse-10",
    category: "class10",
    tag: "Class 10 ICSE Pure Science",
    badge: "98.4% Batch Highest",
    badgeColor: "text-sky-700 bg-sky-50 border-sky-200",
    title: "ICSE Class 10 Board Excellence",
    sub: "Physics, Chemistry, Biology & Commercial Math",
    desc: "Tailored specifically to ICSE Council syllabus rigor with lab applications, concise question banks, and specimen paper analysis.",
    highlights: ["Specimen Paper Deep-Dive & Exact Keyword Training", "Practical Lab Numerical & Reaction Mechanics", "Past 10 Years Solved ICSE Board Papers"],
    roadmap: "Topic Deep-Dives → Prelim Simulation → Past 10-Yr Drills → Board Topper",
    coverage: "Complete Class 10 ICSE Board Syllabus",
    icon: FileText,
    iconColor: "text-sky-600 bg-sky-50 border-sky-200",
    accentColor: "border-sky-200 hover:border-sky-400 group-hover:shadow-sky-500/10",
    active: false,
  },
];

// ── GLOBAL EXAMS DATA ────────────────────────────────────────────────────────
const GLOBAL_EXAMS_DATA = [
  {
    id: "ielts",
    flag: "🇬🇧",
    region: "UK / Australia / Canada",
    title: "IELTS Academic",
    sub: "Language Proficiency",
    desc: "Band 8+ training with 1-on-1 speaking interview simulations and native examiner writing feedback.",
    target: "Band 8.0+ Average",
    active: false,
  },
  {
    id: "toefl",
    flag: "🇺🇸",
    region: "USA / Global",
    title: "TOEFL iBT",
    sub: "Language Proficiency",
    desc: "Interactive AI-driven accent and vocabulary analysis for maximum scores on reading, listening, speaking, and writing.",
    target: "110+ Target",
    active: true,
  },
  {
    id: "igcse",
    flag: "🇬🇧",
    region: "United Kingdom",
    title: "Cambridge IGCSE",
    sub: "School Board",
    desc: "International curriculum mastery with Cambridge checkpoint tests, past papers, and examiner marking criteria.",
    target: "A* in all subjects",
    active: false,
  },
  {
    id: "a-levels",
    flag: "🇬🇧",
    region: "United Kingdom",
    title: "Cambridge A Levels",
    sub: "School Board",
    desc: "Advanced specialized subject learning tailored for admission to Oxford, Cambridge, Russell Group, and global universities.",
    target: "Straight A* / A",
    active: false,
  },
  {
    id: "o-levels",
    flag: "🌐",
    region: "Global / Singapore / UK",
    title: "Cambridge O Levels",
    sub: "School Board",
    desc: "Foundational secondary school qualifications recognized worldwide for academic rigor.",
    target: "Top Distinctions",
    active: false,
  },
  {
    id: "nus",
    flag: "🇸🇬",
    region: "Singapore",
    title: "NUS High Diploma",
    sub: "School Board",
    desc: "Specialized STEM curriculum training for Singapore's premier math & science institution admissions.",
    target: "High Distinction",
    active: false,
  },
  {
    id: "aeis",
    flag: "🇸🇬",
    region: "Singapore",
    title: "AEIS Singapore",
    sub: "Scholarship/Assessment",
    desc: "Admissions Exercise for International Students seeking entry into Singapore mainstream government schools.",
    target: "Primary & Secondary Entry",
    active: false,
  },
  {
    id: "pisa",
    flag: "🌐",
    region: "OECD / Global",
    title: "PISA Assessment Prep",
    sub: "Scholarship/Assessment",
    desc: "Critical thinking, scientific literacy, and mathematical reasoning benchmark tests for international standing.",
    target: "Global Top Tier",
    active: false,
  },
];

// ── ADVANTAGE CARDS DATA ─────────────────────────────────────────────────────
const ADVANTAGES = [
  {
    icon: Users,
    iconBg: "bg-purple-100 text-purple-600",
    title: "Personalized Learning",
    desc: "Adaptive curriculum tailored to your child's pace, strengths, and target competitive goals with 1-on-1 support.",
    highlighted: false,
  },
  {
    icon: Activity,
    iconBg: "bg-indigo-100 text-indigo-600",
    title: "AI-Powered Performance Analytics",
    desc: "Instant question-level error mapping, retention alerts, and predicted All-India ranks after every mock test.",
    highlighted: false,
  },
  {
    icon: Users,
    iconBg: "bg-blue-100 text-blue-600",
    title: "World-Class Experienced Faculty",
    desc: "Mentorship by top IITian rankers, PhD scholars, and Cambridge certified teachers with 12+ years avg experience.",
    highlighted: true,
  },
  {
    icon: Video,
    iconBg: "bg-emerald-100 text-emerald-600",
    title: "Live Interactive Classes",
    desc: "Small batch size (max 15-18 students) ensuring active two-way video discussions, instant live polls, and zero hesitation.",
    highlighted: false,
  },
  {
    icon: PlaySquare,
    iconBg: "bg-rose-100 text-rose-600",
    title: "HD Recorded Sessions & Notes",
    desc: "24/7 archive access with handwritten teacher annotations, chapter timestamps, and searchable video transcripts.",
    highlighted: false,
  },
  {
    icon: Calendar,
    iconBg: "bg-amber-100 text-amber-600",
    title: "Weekly Benchmark Assessments",
    desc: "Real exam simulated testing every Sunday with detailed sectional analysis and national rank leaderboard.",
    highlighted: false,
  },
];

interface CountryPhoneConfig {
  id: string;
  name: string;
  dialCode: string;
  flag: string;
  digits: number;
  placeholder: string;
  format: (raw: string) => string;
}

const COUNTRY_CONFIGS: Record<string, CountryPhoneConfig> = {
  "India (+91)": {
    id: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    digits: 10,
    placeholder: "98765 43210",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 10);
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5)}`;
    },
  },
  "UAE (+971)": {
    id: "AE",
    name: "UAE",
    dialCode: "+971",
    flag: "🇦🇪",
    digits: 9,
    placeholder: "50 123 4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 9);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    },
  },
  "USA (+1)": {
    id: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    digits: 10,
    placeholder: "(555) 123-4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 10);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    },
  },
  "UK (+44)": {
    id: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    digits: 10,
    placeholder: "7911 123456",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 10);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4)}`;
    },
  },
  "Singapore (+65)": {
    id: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    digits: 8,
    placeholder: "8123 4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 8);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4)}`;
    },
  },
  "Canada (+1)": {
    id: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    digits: 10,
    placeholder: "(555) 123-4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 10);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    },
  },
  "Australia (+61)": {
    id: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    digits: 9,
    placeholder: "412 345 678",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 9);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
    },
  },
  "Qatar (+974)": {
    id: "QA",
    name: "Qatar",
    dialCode: "+974",
    flag: "🇶🇦",
    digits: 8,
    placeholder: "3312 3456",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 8);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4)}`;
    },
  },
  "Saudi Arabia (+966)": {
    id: "SA",
    name: "Saudi Arabia",
    dialCode: "+966",
    flag: "🇸🇦",
    digits: 9,
    placeholder: "50 123 4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 9);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    },
  },
  "Kuwait (+965)": {
    id: "KW",
    name: "Kuwait",
    dialCode: "+965",
    flag: "🇰🇼",
    digits: 8,
    placeholder: "9123 4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 8);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4)}`;
    },
  },
  "Oman (+968)": {
    id: "OM",
    name: "Oman",
    dialCode: "+968",
    flag: "🇴🇲",
    digits: 8,
    placeholder: "9123 4567",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 8);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4)}`;
    },
  },
  "Bahrain (+973)": {
    id: "BH",
    name: "Bahrain",
    dialCode: "+973",
    flag: "🇧🇭",
    digits: 8,
    placeholder: "3912 3456",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 8);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4)}`;
    },
  },
  "Germany (+49)": {
    id: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    digits: 11,
    placeholder: "151 12345678",
    format: (val) => {
      const d = val.replace(/\D/g, "").slice(0, 11);
      if (d.length <= 3) return d;
      return `${d.slice(0, 3)} ${d.slice(3)}`;
    },
  },
  "Other (+Global)": {
    id: "OTHER",
    name: "International",
    dialCode: "+",
    flag: "🌐",
    digits: 12,
    placeholder: "1234567890",
    format: (val) => val.replace(/[^\d\s-+]/g, "").slice(0, 16),
  },
};

export default function HomePage() {
  const router = useRouter();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [country, setCountry] = useState("India (+91)");
  const [learningMode, setLearningMode] = useState<"online" | "offline">("online");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [selectedSlot, setSelectedSlot] = useState("07:00 PM - 08:00 PM");
  const [olympiadFilter, setOlympiadFilter] = useState<"all" | "math" | "physics" | "science" | "bio-chem" | "cyber">("all");
  const [neetBoardFilter, setNeetBoardFilter] = useState<"all" | "neet" | "class12" | "class10" | "foundation">("all");
  const [studentName, setStudentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [grade, setGrade] = useState("Class 6 - 8 (Foundation)");
  const [targetGoal, setTargetGoal] = useState("JEE (Main & Advanced)");
  const [email, setEmail] = useState("");

  const currentCountryConfig = COUNTRY_CONFIGS[country] || COUNTRY_CONFIGS["India (+91)"];

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const cfg = COUNTRY_CONFIGS[newCountry] || COUNTRY_CONFIGS["India (+91)"];
    if (parentPhone) {
      setParentPhone(cfg.format(parentPhone));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cfg = currentCountryConfig;
    setParentPhone(cfg.format(e.target.value));
  };

  const handleOpenModal = (type?: string, examTitle?: string) => {
    setCountry("India (+91)");
    if (examTitle) {
      setTargetGoal(examTitle.includes("NEET") ? "NEET UG" : examTitle.includes("Math") || examTitle.includes("Olympiad") ? "Math/Science Olympiads" : examTitle.includes("SAT") || examTitle.includes("IELTS") || examTitle.includes("TOEFL") ? "Digital SAT / Study Abroad" : examTitle.includes("Cambridge") || examTitle.includes("IB") ? "IB DP / Cambridge A*" : "JEE (Main & Advanced)");
    }
    setModalOpen(true);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      return toast.error("Please provide Student's Full Name");
    }
    const rawDigits = parentPhone.replace(/\D/g, "");
    if (!rawDigits) {
      return toast.error("Please enter Parent's Phone Number");
    }
    if (currentCountryConfig.id !== "OTHER" && rawDigits.length < currentCountryConfig.digits) {
      return toast.error(
        `Please enter a valid ${currentCountryConfig.digits}-digit mobile number for ${currentCountryConfig.name} (${currentCountryConfig.dialCode})`
      );
    }
    const modeLabel = learningMode === "online" ? "Online Live Interactive" : "Offline Classroom / Center";
    toast.success(
      `🎉 Demo session booked for ${studentName} (${modeLabel}) on ${selectedDate} at ${selectedSlot}! WhatsApp invite sent to ${currentCountryConfig.dialCode} ${parentPhone}.`
    );
    setModalOpen(false);
    setStudentName("");
    setParentPhone("");
    setEmail("");
    setCountry("India (+91)");
    setLearningMode("online");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      return toast.error("Please enter a valid email address");
    }
    toast.success("Subscribed! Free academic cheat-sheets & notes have been sent to your inbox.");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* ── TOP HEADER / NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-[#6366f1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1e1b4b] block leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                LV Institute
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                GLOBAL LEARNING VISION
              </span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-slate-700">
            <Link href="/" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
              Home
            </Link>
            <a href="#programs" className="hover:text-indigo-600 transition-colors">
              Programs
            </a>
            <a href="#neet-boards" className="hover:text-emerald-600 transition-colors flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>NEET & Boards</span>
            </a>
            <a href="#olympiads" className="hover:text-indigo-600 transition-colors">
              Olympiads
            </a>
            <Link href="/mentors" className="hover:text-indigo-600 transition-colors flex items-center gap-1 text-indigo-700 font-bold bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-200">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mentors</span>
            </Link>
            <a href="#global-exams" className="hover:text-indigo-600 transition-colors">
              Global Exams
            </a>
            <a href="#advantage" className="hover:text-indigo-600 transition-colors">
              Advantage
            </a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle placeholder */}
            <button
              type="button"
              onClick={() => toast.info("Theme switched")}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              title="Toggle Theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <LogIn className="w-4 h-4 text-slate-600" />
              <span>Login</span>
            </Link>

            {/* Get Started */}
            <button
              type="button"
              onClick={() => handleOpenModal("demo")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-extrabold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION WITH SUBTLE GRID BACKGROUND ──────────────────────── */}
      <section
        id="programs"
        className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden bg-[#f8faff]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Subtitle & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Top Purple Pill Tag */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/90 text-purple-700 text-xs font-bold shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>India's #1 Personalized Academic & Entrance Institute</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-[36px] xl:text-[44px] font-black tracking-tight leading-tight text-[#111827]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Uncompromising{" "}
                <span className="text-[#6366f1]">Excellence</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg"
              >
                Personalized learning, world-class faculty, international curriculum, and proven academic success for students across India and abroad.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <button
                  type="button"
                  onClick={() => handleOpenModal("consult", "Academic Programs")}
                  className="px-6 py-3 rounded-2xl bg-[#5945f0] hover:bg-[#4b35e8] text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenModal("demo", "Free Demo")}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#5945f0] text-[#5945f0]" />
                  <span>Book Free Demo</span>
                </button>
              </motion.div>

              {/* Targeted Curriculums Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-3 space-y-2"
              >
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  TARGETED BOARD & ENTRANCE CURRICULUMS:
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setNeetBoardFilter("neet");
                      const el = document.getElementById("neet-boards");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100/90 hover:scale-105 active:scale-95 border border-emerald-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    NEET UG
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModal("consult", "JEE (Main & Advanced)")}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100/90 hover:scale-105 active:scale-95 border border-purple-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    JEE Main & Adv
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOlympiadFilter("all");
                      const el = document.getElementById("olympiads");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100/90 hover:scale-105 active:scale-95 border border-blue-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    Olympiads
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNeetBoardFilter("class12");
                      const el = document.getElementById("neet-boards");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100/90 hover:scale-105 active:scale-95 border border-sky-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    CBSE
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNeetBoardFilter("class10");
                      const el = document.getElementById("neet-boards");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100/90 hover:scale-105 active:scale-95 border border-amber-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    ICSE
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("global-exams");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100/90 hover:scale-105 active:scale-95 border border-rose-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    IB
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("global-exams");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100/90 hover:scale-105 active:scale-95 border border-teal-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    Cambridge
                  </button>
                </div>
              </motion.div>

              {/* Trust Checkmarks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs font-bold text-slate-700 pt-1"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Qualified & Experienced Faculty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1-on-1 AI Doubt Desk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Risk Free Trial</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Interactive Dashboard Widget Card */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              
              {/* Floating Top-Left Badge: 25,000+ Students Enrolled */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-4 left-0 sm:left-2 z-20 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">25,000+</p>
                  <p className="text-[9.5px] text-slate-500 font-bold">Students Enrolled</p>
                </div>
              </motion.div>

              {/* Floating Right Badge: 150+ Expert Faculty */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-1/2 -right-3 -translate-y-5 z-20 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-md hidden sm:flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-black text-slate-800">150+ Expert Faculty</span>
              </motion.div>

              {/* Floating Bottom-Right Badge: 98% Satisfaction */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-4 right-0 sm:right-2 z-20 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-900 leading-tight">98% Satisfaction</p>
                  <p className="text-[9px] text-slate-500 font-bold">Verified Parent Rating</p>
                </div>
              </motion.div>

              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[430px] rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xl space-y-4 relative z-10"
              >
                {/* Student Profile Header */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                        AS
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
                          Aryan Sharma
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-extrabold text-[9.5px] border border-purple-200">
                          Class 11 • JEE Apex
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                        ID: LVI-2026-889 • Next Class in 45 mins
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      LIVE SCORE
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-600 flex items-center justify-end gap-1 font-mono">
                      <TrendingUp className="w-3 h-3" />
                      98.4%ile
                    </span>
                  </div>
                </div>

                {/* 3 Metric Progress Boxes */}
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  {/* Attendance */}
                  <div className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <span className="text-[9.5px] text-slate-500 font-bold block">Attendance</span>
                    <p className="text-xs sm:text-sm font-black text-slate-900 font-mono">99.2%</p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[99%]" />
                    </div>
                  </div>

                  {/* Tests Completed */}
                  <div className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <span className="text-[9.5px] text-slate-500 font-bold block">Tests Done</span>
                    <p className="text-xs sm:text-sm font-black text-indigo-600 font-mono">48 / 50</p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[96%]" />
                    </div>
                  </div>

                  {/* National Rank */}
                  <div className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <span className="text-[9.5px] text-slate-500 font-bold block">National Rank</span>
                    <p className="text-xs sm:text-sm font-black text-amber-600 font-mono">#4 AIR</p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[92%]" />
                    </div>
                  </div>
                </div>

                {/* 3-Month Academic Trajectory Area Chart Simulation */}
                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                      <span>3-Month Academic Trajectory</span>
                    </div>
                    <span className="text-[9.5px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +26.4% Growth
                    </span>
                  </div>

                  {/* SVG Line / Area Gradient Curve */}
                  <div className="relative h-16 w-full pt-1">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 50 Q 75 42, 150 30 T 300 10 L 300 70 L 0 70 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M 0 50 Q 75 42, 150 30 T 300 10"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                      />
                    </svg>

                    {/* Timeline labels */}
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-0.5 font-mono">
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                      <span>Feb</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Gold Medalist Achievement Card */}
                <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 leading-tight">
                        Gold Medalist - Math Olympiad
                      </p>
                      <p className="text-[9.5px] text-slate-500 font-medium">
                        Awarded on Feb 26, 2026
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/student/LV-2025-0001"
                    className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Test Skills</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEET UG & BOARD EXAM MASTERY SECTION ─────────────────────────── */}
      <section id="neet-boards" className="py-20 bg-gradient-to-b from-[#f0fdf4]/40 via-[#f8faff] to-[#f8faff] border-t border-slate-200/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top NEET & Board Achievement Milestones Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">700+ Score Focus</p>
                <p className="text-[10px] text-slate-500 font-bold">94.8% Score 650+ in NEET</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 flex-shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">38+ Top 500 AIR</p>
                <p className="text-[10px] text-slate-500 font-bold">AIIMS & Top GMC Selections</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">98.6% Board 95%+</p>
                <p className="text-[10px] text-slate-500 font-bold">CBSE & ICSE City Toppers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">100% NCERT Core</p>
                <p className="text-[10px] text-slate-500 font-bold">30-Year PYQ Bank Integrated</p>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Medical Entrance & Board Toppers Academy (Class 8–12 & Droppers)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#111827] leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                NEET UG & <span className="text-[#059669]">Board Exam Mastery</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Comprehensive NCERT-anchored mastery, AIIMS doctor faculty mentorship, daily high-yield clinical MCQs, and rigorous subjective board answer writing rubrics.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal("consult", "NEET UG & Board Programs")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>Book NEET & Board Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pb-2">
            {[
              { id: "all", label: "All Programs (8)" },
              { id: "neet", label: "NEET UG (Medical)" },
              { id: "class12", label: "Class 12 Boards (Science)" },
              { id: "class10", label: "Class 10 Boards (CBSE / ICSE)" },
              { id: "foundation", label: "Foundation (Class 8–9)" },
            ].map((tab) => {
              const isActive = neetBoardFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setNeetBoardFilter(tab.id as any)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                    isActive
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* NEET & Boards 8-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEET_BOARD_DATA
              .filter((item) => neetBoardFilter === "all" || item.category === neetBoardFilter)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-3xl bg-white border p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group",
                      item.accentColor
                    )}
                  >
                    <div className="space-y-4">
                      {/* Top row: Icon & Top-right Badge */}
                      <div className="flex items-start justify-between">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs border", item.iconColor)}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-50/90 px-2.5 py-1 rounded-lg border border-emerald-200/80 shadow-2xs">
                          {item.badge}
                        </span>
                      </div>

                      {/* Tag & Titles */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          {item.tag}
                        </span>
                        <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-emerald-600 leading-tight">
                          {item.sub}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Curriculum Highlight Bullets */}
                      <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700 font-medium">
                        {item.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Roadmap & View Syllabus Button */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">STRUCTURED ROADMAP:</p>
                        <p className="text-[10.5px] font-bold text-slate-800 font-mono truncate">{item.roadmap}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenModal("consult", item.title)}
                        className={cn(
                          "w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                          item.active
                            ? "bg-[#059669] text-white shadow-md shadow-emerald-500/20 hover:bg-[#047857]"
                            : "border border-emerald-200 text-emerald-700 bg-emerald-50/40 hover:bg-emerald-100/70"
                        )}
                      >
                        <span>View Syllabus & Enrol</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bottom Diagnostic Banner for NEET & Board Parents */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-500/20">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free 1-on-1 Academic Counseling & Diagnostic</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Targeting 680+ in NEET UG or 95%+ in Class 10/12 Boards?
              </h4>
              <p className="text-xs sm:text-sm text-emerald-200">
                Get a customized chapter-wise preparation roadmap and weak-area score predictor session with senior doctors and master educators.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal("consult", "NEET & Board Personalized Strategy")}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-emerald-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span>Schedule Free Strategy Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── PRE-OLYMPIAD & OLYMPIAD TRAINING SECTION (ENHANCED & ATTRACTIVE) ─ */}
      <section id="olympiads" className="py-20 bg-[#f8faff] border-t border-slate-200/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Olympiad Achievement Milestones Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">24+ Medals</p>
                <p className="text-[10px] text-slate-500 font-bold">International Gold & Silver</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">120+ Qualifiers</p>
                <p className="text-[10px] text-slate-500 font-bold">National OCSC Camp Selects</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">98% Success</p>
                <p className="text-[10px] text-slate-500 font-bold">Stage-1 (IOQM / NSE) Rate</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">Elite Mentors</p>
                <p className="text-[10px] text-slate-500 font-bold">Former Olympiad Coaches</p>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Elite Talent Development (Grades 6–12)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#111827] leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Pre–Olympiad & <span className="text-[#6366f1]">Olympiad Training</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Transform high-aptitude talent into national camp qualifiers and global gold medalists through deep mathematical proofs, laboratory data analysis, and advanced problem-solving techniques.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal("diagnostic", "Olympiad Diagnostic")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#5945f0] hover:bg-[#4b35e8] text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>Take Olympiad Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pb-2">
            {[
              { id: "all", label: "All Olympiads (8)" },
              { id: "math", label: "Mathematics (IMO / IOQM)" },
              { id: "physics", label: "Physics & Space (IPhO / IOAA)" },
              { id: "science", label: "Junior Sciences (HBCSE)" },
              { id: "bio-chem", label: "Chemistry & Biology (IChO / INBO)" },
              { id: "cyber", label: "Informatics & Code (IOI / NCO)" },
            ].map((tab) => {
              const isActive = olympiadFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setOlympiadFilter(tab.id as any)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Olympiads 8-Card Grid with Rich Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OLYMPIADS_DATA
              .filter((item) => olympiadFilter === "all" || item.category === olympiadFilter)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-3xl bg-white border p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group",
                      item.accentColor
                    )}
                  >
                    <div className="space-y-4">
                      {/* Top row: Icon & Top-right Badge */}
                      <div className="flex items-start justify-between">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs border", item.iconColor)}>
                          {item.id === "imo" ? (
                            <div className="font-mono text-xs font-black leading-none text-center">
                              <div>01</div>
                              <div>10</div>
                            </div>
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>

                        <span className="text-[10.5px] font-extrabold text-amber-800 bg-amber-50/90 px-2.5 py-1 rounded-lg border border-amber-200/80 shadow-2xs">
                          {item.badge}
                        </span>
                      </div>

                      {/* Tag & Titles */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          {item.tag}
                        </span>
                        <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-indigo-600 leading-tight">
                          {item.sub}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Curriculum Highlight Bullets */}
                      <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700 font-medium">
                        {item.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Roadmap & View Syllabus Button */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">ROADMAP:</p>
                        <p className="text-[10.5px] font-bold text-slate-800 font-mono truncate">{item.roadmap}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenModal("consult", item.title)}
                        className={cn(
                          "w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                          item.active
                            ? "bg-[#5945f0] text-white shadow-md shadow-indigo-500/20 hover:bg-[#4b35e8]"
                            : "border border-indigo-200 text-indigo-700 bg-indigo-50/40 hover:bg-indigo-100/70"
                        )}
                      >
                        <span>View Syllabus & Prep</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bottom Diagnostic Banner for Parents & Students */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-[#1e1b4b] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/20">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free 15-Minute Aptitude Assessment</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Not sure which Olympiad matches your child's aptitude?
              </h4>
              <p className="text-xs sm:text-sm text-indigo-200">
                Get an objective diagnostic score mapping across Number Theory, Logical Reasoning & Physics Analysis.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal("diagnostic", "15-Minute Olympiad Diagnostic")}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span>Schedule Free Diagnostic Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── THE LV INSTITUTE ADVANTAGE SECTION ─────────────────────────────── */}
      <section id="advantage" className="py-20 bg-[#f8faff] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Pill Header */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-extrabold shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>The LV Institute Advantage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Card: Live Interactive Batch Showcase */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Image banner with live badges */}
              <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-900 aspect-video sm:aspect-4/3 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 via-slate-800/80 to-purple-900/80 flex items-center justify-center p-4">
                  <div className="text-center text-white space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <p className="text-sm font-black tracking-tight">Interactive Classroom Live</p>
                    <p className="text-[11px] text-slate-300 font-medium">Batch #14 • Grade 11 & 12 Advanced</p>
                  </div>
                </div>

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-md">
                  Interactive Live Batch #14
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Live Now</span>
                </div>
              </div>

              {/* Progress Mastery Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Live AI Topic Mastery Index</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    94% Mastery
                  </span>
                </div>

                {/* Progress bars */}
                <div className="space-y-3 text-xs font-bold">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span>Rotational Mechanics & Torque</span>
                      <span className="text-indigo-600">98% (AIR Top 1%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span>Organic Chemistry Syntheses</span>
                      <span className="text-teal-600">92% (High Yield)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span>Differential Calculus & Vectors</span>
                      <span className="text-amber-600">96% (Speed Focus)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[96%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => handleOpenModal("demo", "Free Live Class Experience")}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#5945f0] hover:bg-[#4b35e8] text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Experience Our Live Class (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Cards: 6-Grid Feature Pillars */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {ADVANTAGES.map((adv, idx) => {
                const Icon = adv.icon;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-3xl p-6 transition-all space-y-3",
                      adv.highlighted
                        ? "bg-white border-2 border-indigo-500 shadow-md shadow-indigo-500/10"
                        : "bg-white border border-slate-200 shadow-xs hover:shadow-sm"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", adv.iconBg)}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-black text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {adv.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {adv.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBAL EXAMS & INTERNATIONAL QUALIFICATIONS ──────────────────── */}
      <section id="global-exams" className="py-20 bg-[#f8faff] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827]" style={{ fontFamily: "Outfit, sans-serif" }}>
              Global Exams & International Qualifications
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Targeted coaching and standardized testing frameworks recognized across premier institutions worldwide.
            </p>
          </div>

          {/* Global Exams 8-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GLOBAL_EXAMS_DATA.map((exam) => (
              <div
                key={exam.id}
                className="rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Top Flag & Region */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{exam.flag}</span>
                    <span className="text-[11px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {exam.region}
                    </span>
                  </div>

                  {/* Title & Sub */}
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {exam.title}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 leading-tight">
                      {exam.sub}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exam.desc}
                  </p>
                </div>

                {/* Target & Consultation CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Target:</span>
                    <span className="font-extrabold text-slate-900">{exam.target}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenModal("consult", exam.title)}
                    className={cn(
                      "w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      exam.active
                        ? "bg-[#5945f0] text-white shadow-md shadow-indigo-500/20 hover:bg-[#4b35e8]"
                        : "border border-indigo-200 text-indigo-700 bg-indigo-50/40 hover:bg-indigo-100/70"
                    )}
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIG PURPLE ENROLL CTA BANNER ─────────────────────────────────── */}
      <section className="py-12 bg-[#f8faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#5945f0] via-[#6366f1] to-[#7c3aed] p-8 sm:p-14 text-center text-white shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleOpenModal("demo", "Enroll Now")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-indigo-700 hover:bg-slate-50 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenModal("demo", "Free Demo Class")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#3f2bd8]/60 hover:bg-[#3f2bd8] border border-white/20 text-white font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Book Free Demo Class</span>
              </button>
            </div>

            {/* Checkmark Features */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-indigo-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Free 100% Diagnostic Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Zero Risk Cancellation Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Small Batches (Max 15-18)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer id="contact" className="w-full bg-[#080c24] text-slate-400 text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            
            {/* Left Column: Brand & Newsletter */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#6366f1] flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-black text-white block leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                    LV Institute
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                    GLOBAL LEARNING VISION
                  </span>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-xs">
                Pioneering excellence in STEM, Board Exams, and International curriculum through personalized AI diagnostics, IIT/PhD mentors, and transformative pedagogy.
              </p>

              {/* Newsletter Subscribe */}
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  SUBSCRIBE FOR FREE ACADEMIC CHEAT-SHEETS & NOTES
                </p>

                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#5945f0] hover:bg-[#4b35e8] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Join</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Column 2: Company */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-white">
                COMPANY
              </p>
              <ul className="space-y-2 font-medium">
                <li><a href="#advantage" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#advantage" className="hover:text-indigo-400 transition-colors">Elite Faculty</a></li>
                <li><a href="#results" className="hover:text-indigo-400 transition-colors">Success Results</a></li>
                <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Careers @ LVI</Link></li>
                <li><button onClick={() => toast.info("Privacy Policy: Student data is 100% confidential and encrypted.")} className="hover:text-indigo-400 transition-colors">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Column 3: Programs */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-white">
                PROGRAMS
              </p>
              <ul className="space-y-2 font-medium">
                <li><a href="#olympiads" className="hover:text-indigo-400 transition-colors">CBSE Mastery (6-12)</a></li>
                <li><a href="#olympiads" className="hover:text-indigo-400 transition-colors">ICSE & ISC Track</a></li>
                <li><a href="#global-exams" className="hover:text-indigo-400 transition-colors">IB Diploma Programme</a></li>
                <li><a href="#olympiads" className="hover:text-indigo-400 transition-colors">National Olympiads</a></li>
                <li><a href="#olympiads" className="hover:text-indigo-400 transition-colors">JEE Main & Advanced</a></li>
                <li><a href="#olympiads" className="hover:text-indigo-400 transition-colors">NEET Medical UG</a></li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-xs font-black uppercase tracking-wider text-white">
                CONTACT & SUPPORT
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-300">
                    173, Prachi Enclave Rd, Prachi Enclave, District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <a
                      href="tel:+918457876843"
                      className="text-slate-100 hover:text-emerald-400 font-bold transition-colors block text-sm"
                    >
                      +91 8457876843
                    </a>
                    <span className="text-[11px] text-emerald-400/90 font-semibold block">
                      Indian Contact • Call & WhatsApp
                    </span>
                  </div>
                </div>

                <div>
                  <a
                    href="https://wa.me/918457876843?text=Hello%20LV%20Institute%2C%20I%20want%20to%20inquire%20about%20admissions%20and%20programs."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/50"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Us Directly</span>
                  </a>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <a href="mailto:admissions@lvinstitute.com" className="hover:text-white transition-colors">
                    admissions@lvinstitute.com
                  </a>
                </div>
              </div>

              {/* Social Icons */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-300">Connect With Us</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-white transition-colors cursor-pointer" title="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-white transition-colors cursor-pointer" title="Instagram">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-white transition-colors cursor-pointer" title="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-white transition-colors cursor-pointer" title="YouTube">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© 2026 LV Institute (LVI). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => toast.info("Terms of Service")} className="hover:text-indigo-400 transition-colors">
                Terms of Service
              </button>
              <span>•</span>
              <button onClick={() => toast.info("Security & Compliance")} className="hover:text-indigo-400 transition-colors">
                Security & Compliance
              </button>
              <span>•</span>
              <button onClick={() => toast.info("Sitemap")} className="hover:text-indigo-400 transition-colors">
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODAL POPUP FOR LIVE DEMO SESSION (EXACT MATCH) ──────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5 my-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>100% Free 1-on-1 Masterclass</span>
                </div>

                <h3 className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Book Your Live Demo Session
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Experience our interactive classroom, diagnostic AI analytics, and personalized guidance from IIT/PhD mentors.
                </p>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                
                {/* Row 1: Student Name & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Student's Full Name <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Advait Nair"
                        style={{ paddingLeft: "2.5rem" }}
                        className="w-full py-2.5 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-medium text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Country / Region <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        style={{ paddingLeft: "2.5rem" }}
                        className="w-full py-2.5 pr-8 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="India (+91)">🇮🇳 India (+91)</option>
                        <option value="UAE (+971)">🇦🇪 UAE (+971)</option>
                        <option value="USA (+1)">🇺🇸 United States (+1)</option>
                        <option value="UK (+44)">🇬🇧 United Kingdom (+44)</option>
                        <option value="Singapore (+65)">🇸🇬 Singapore (+65)</option>
                        <option value="Canada (+1)">🇨🇦 Canada (+1)</option>
                        <option value="Australia (+61)">🇦🇺 Australia (+61)</option>
                        <option value="Qatar (+974)">🇶🇦 Qatar (+974)</option>
                        <option value="Saudi Arabia (+966)">🇸🇦 Saudi Arabia (+966)</option>
                        <option value="Kuwait (+965)">🇰🇼 Kuwait (+965)</option>
                        <option value="Oman (+968)">🇴🇲 Oman (+968)</option>
                        <option value="Bahrain (+973)">🇧🇭 Bahrain (+973)</option>
                        <option value="Germany (+49)">🇩🇪 Germany (+49)</option>
                        <option value="Other (+Global)">🌐 Other / International</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Parent Phone */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 block">
                        Parent's Phone (WhatsApp) <span className="text-indigo-600">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {currentCountryConfig.digits} Digits
                      </span>
                    </div>
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all overflow-hidden">
                      <div className="flex items-center gap-1 px-3 bg-slate-100/90 border-r border-slate-200 text-xs font-bold text-slate-800 select-none flex-shrink-0">
                        <span>{currentCountryConfig.flag}</span>
                        <span>{currentCountryConfig.dialCode}</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={parentPhone}
                        onChange={handlePhoneChange}
                        placeholder={currentCountryConfig.placeholder}
                        className="w-full py-2.5 px-3 bg-transparent text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400 tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent.name@example.com"
                        style={{ paddingLeft: "2.5rem" }}
                        className="w-full py-2.5 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-medium text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Grade & Target Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Grade */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Current Grade / Class <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-medium text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option>Class 6 - 8 (Foundation)</option>
                        <option>Class 9 - 10 (Secondary & NTSE)</option>
                        <option>Class 11 (Senior Secondary)</option>
                        <option>Class 12 (Senior Secondary)</option>
                        <option>Class 12 Passed / Repeater</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Target Goal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Target Goal / Focus <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={targetGoal}
                        onChange={(e) => setTargetGoal(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-indigo-500 bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option>JEE (Main & Advanced)</option>
                        <option>NEET UG</option>
                        <option>CBSE / ICSE 95%+ Target</option>
                        <option>IB DP / Cambridge A*</option>
                        <option>Math/Science Olympiads</option>
                        <option>Digital SAT / Study Abroad</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 4: Mode of Session (Online or Offline) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Session Mode <span className="text-indigo-600">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choose Delivery</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLearningMode("online")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left cursor-pointer",
                        learningMode === "online"
                          ? "bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          learningMode === "online" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-200/70 text-slate-600"
                        )}
                      >
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-900 leading-tight">Online</p>
                          {learningMode === "online" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">Live 1-on-1 / Batch</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLearningMode("offline")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left cursor-pointer",
                        learningMode === "offline"
                          ? "bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          learningMode === "offline" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-200/70 text-slate-600"
                        )}
                      >
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 leading-tight">Offline</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">Center Classroom</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Row 5: Select Date, Then Select Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Select Date */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 block">
                        Select Date <span className="text-indigo-600">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        Step 1
                      </span>
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600 pointer-events-none" />
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ paddingLeft: "2.5rem" }}
                        className="w-full py-2.5 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  {/* Select Slot */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 block">
                        Select Slot <span className="text-indigo-600">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Step 2
                      </span>
                    </div>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600 pointer-events-none" />
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        style={{ paddingLeft: "2.5rem" }}
                        className="w-full py-2.5 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Morning)</option>
                        <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM (Mid-Day)</option>
                        <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM (Afternoon)</option>
                        <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM (Evening)</option>
                        <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM (Prime Time)</option>
                        <option value="08:30 PM - 09:30 PM">08:30 PM - 09:30 PM (Night Batch)</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5945f0] via-[#6366f1] to-[#7c3aed] hover:from-[#4b35e8] hover:to-[#6d28d9] text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Free 1-on-1 Demo</span>
                </button>

                {/* Disclaimer */}
                <p className="text-[11px] text-center text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-1">
                  <span>🔒</span>
                  <span>No credit card required. Free 45-minute live consultation & diagnostic trial.</span>
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
