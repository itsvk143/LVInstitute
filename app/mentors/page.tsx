"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Search,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  BookOpen,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Teacher {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  qualification?: string;
  bio?: string;
  experienceYears?: string | number;
  achievements?: string[];
  experienceTimeline?: Array<{ role: string; organization: string; period: string }>;
  specialization?: string[];
  subjectDomains?: string[];
  targetExams?: string[];
  website?: string;
  subjects?: Array<{ _id: string; name: string }>;
  isActive: boolean;
}

const DEFAULT_FALLBACK_TEACHERS: Teacher[] = [
  {
    _id: "cvk-vikash-sir",
    name: "Mr. Vikash Kumar (CVK Sir)",
    email: "itsvikash143@gmail.com",
    phone: "8457876843",
    website: "www.cvksir.in",
    qualification: "Senior Chemistry Lecturer • M.Sc Chemistry (10+ Yrs Exp)",
    experienceYears: "10+ Years",
    bio: "Senior Chemistry Educator with over 10 years of experience in mentoring students for National & State Level competitive exams like IIT-JEE (Mains & Advanced), NEET UG, CUET, CBSE/ICSE Boards, KVPY, and International Chemistry Olympiads (IChO). Guided numerous students from India and abroad to excel through strategic conceptual clarity, rapid reaction mechanisms, and result-oriented mentorship. Passionate about making Chemistry intuitive, visual, and scoring.",
    achievements: [
      "Top 50 AIR Rankers Produced in JEE Advanced & NEET UG",
      "Ex-Faculty at Aakash Institute (Bhubaneswar & Haldwani)",
      "Ex-Faculty at Narayana Institute & Resonance Edventures",
      "Over 5,000+ Students Mentored with 98%+ Qualification Rate",
      "Creator of 30-Second Physical Chemistry Calculation Shortcuts & Reaction Flowcharts",
    ],
    experienceTimeline: [
      { role: "Senior Chemistry Lecturer", organization: "Aakash Institute, Bhubaneswar", period: "June 2022 - Present" },
      { role: "Senior Chemistry Lecturer", organization: "Narayana Institute", period: "May 2021 - May 2022" },
      { role: "Chemistry Lecturer", organization: "Aakash Institute, Haldwani", period: "Feb 2019 - March 2020" },
      { role: "Chemistry Lecturer", organization: "Resonance Edventures", period: "June 2016 - Jan 2019" },
    ],
    subjectDomains: [
      "Physical Chemistry",
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Reaction Mechanisms & Flowcharts",
      "Coordination & Chemical Bonding",
    ],
    targetExams: [
      "National & International Olympiads",
      "Chemistry Olympiad (IChO & INChO)",
      "Junior Science Olympiad (IJSO & NSEJS)",
      "Pre-Olympiad Foundation (Class 8–10)",
      "JEE Advanced (IIT)",
      "JEE Mains",
      "NEET UG (Medical)",
      "CBSE & ICSE Boards (95%+)",
      "KVPY & CUET",
    ],
    specialization: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "JEE Advanced", "NEET UG"],
    isActive: true,
  },
  {
    _id: "laxmi-kumari",
    name: "Ms. Laxmi Kumari",
    email: "laxmeena01@gmail.com",
    phone: "9900346997",
    qualification: "Senior Biology, Botany & Zoology Faculty • M.Sc Biotechnology (10+ Yrs Exp)",
    experienceYears: "10+ Years",
    bio: "Senior Biology, Botany & Zoology Faculty with over 10 years of dedicated experience in preparing students for Medical Entrance Examinations (NEET UG Target 360/360, PMT, State Medical Entrances) and 10+2 Boards. Comprehensive expertise spanning Botany (Plant Physiology & Anatomy), Zoology (Human Physiology & Reproduction), Biotechnology, Genetics, and NCERT line-by-line decoding.",
    achievements: [
      "Mentored hundreds of medical aspirants achieving 340+ in NEET Biology (Botany + Zoology)",
      "Senior Botany & Biology Faculty at Aakash Institute, Bhubaneswar (March 2022 - Present)",
      "Ex-Faculty at Narayana E-Techno (Guwahati) & Narayana PU College (Bengaluru)",
      "Ex-Faculty at Potential and Concept Education & A.S. Study Circle (Mysore)",
      "M.Sc Biotechnology Degree from University of Mysore",
    ],
    experienceTimeline: [
      { role: "Botany Faculty", organization: "Aakash Institute, Bhubaneswar", period: "March 2022 - Present" },
      { role: "Biology Faculty", organization: "Narayana E-Techno, Guwahati", period: "July 2021 - Feb 2022" },
      { role: "Biology Faculty", organization: "Potential and Concept Education", period: "2018 - 2021" },
      { role: "Biology Faculty", organization: "Narayana PU College, Bengaluru", period: "2015 - 2018" },
      { role: "Biology Faculty", organization: "A.S. Study Circle, Mysore", period: "2013 - 2015" },
    ],
    subjectDomains: ["Botany", "Zoology", "Biology", "Biotechnology", "Human Physiology", "Genetics"],
    targetExams: [
      "NEET UG (Medical Target 360/360)",
      "Biology Olympiad (IBO & INBO)",
      "CBSE & ICSE Class 11/12 Boards (95%+)",
      "Junior Science Olympiad (IJSO & NSEJS)",
      "Pre-Medical PMT & Foundation",
    ],
    specialization: ["Botany", "Zoology", "Biology", "Biotechnology", "NEET UG"],
    isActive: true,
  },
];

export default function PublicMentorsPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const { data: apiTeachers, isLoading } = useQuery<Teacher[]>({
    queryKey: ["public-teachers", search],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers?search=${search}`);
        return res.data.data;
      } catch {
        return [];
      }
    },
  });

  const teachers = (apiTeachers && apiTeachers.length > 0) ? apiTeachers : DEFAULT_FALLBACK_TEACHERS;

  const filteredTeachers = teachers.filter((t) => {
    if (selectedSubject === "all") return true;
    const query = selectedSubject.toLowerCase();
    const matchSpecialization = t.specialization?.some((s) => s.toLowerCase().includes(query));
    const matchDomains = t.subjectDomains?.some((s) => s.toLowerCase().includes(query));
    const matchExams = t.targetExams?.some((s) => s.toLowerCase().includes(query));
    const matchQualification = t.qualification?.toLowerCase().includes(query);
    const matchName = t.name?.toLowerCase().includes(query);
    return matchSpecialization || matchDomains || matchExams || matchQualification || matchName;
  });

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── HEADER NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#6366f1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span
                className="text-xl sm:text-2xl font-black tracking-tight text-[#1e1b4b] block leading-tight"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                LV Institute
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                FACULTY & MENTORS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/#neet-boards" className="hover:text-emerald-600 transition-colors">
              NEET & Boards
            </Link>
            <Link href="/#olympiads" className="hover:text-indigo-600 transition-colors">
              Olympiads
            </Link>
            <Link href="/mentors" className="text-indigo-600 font-bold">
              Mentors
            </Link>
            <Link href="/#contact" className="hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Admin Portal
            </Link>
            <Link
              href="/#programs"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-1.5"
            >
              <span>Book Free Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-indigo-900 via-[#1e1b4b] to-[#0f172a] text-white overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>World-Class Academic Faculty & Mentors</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Choose the Teacher.{" "}
            <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-teal-200 bg-clip-text text-transparent">
              Not the Brand.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Our faculty combines decades of teaching pedigree at premier national institutes (Aakash, Narayana, Resonance) with Olympiad-level mastery to guide your child to top percentiles.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-amber-300">10+ Yrs</p>
              <p className="text-[11px] text-slate-300 font-medium">Avg Faculty Experience</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-emerald-300">5,000+</p>
              <p className="text-[11px] text-slate-300 font-medium">Students Mentored</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-indigo-300">Top 50 AIR</p>
              <p className="text-[11px] text-slate-300 font-medium">JEE & NEET Selections</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-purple-300">4.9 / 5.0</p>
              <p className="text-[11px] text-slate-300 font-medium">Parent & Student Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENTORS DIRECTORY SECTION ──────────────────────────────────────── */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Subject Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name or topic..."
              style={{ paddingLeft: "2.5rem" }}
              className="w-full py-2.5 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {[
              { id: "all", label: "All Faculty" },
              { id: "chemistry", label: "Chemistry" },
              { id: "physics", label: "Physics" },
              { id: "mathematics", label: "Mathematics" },
              { id: "biology", label: "Biology" },
              { id: "english", label: "English & Social" },
            ].map((cat) => {
              const isSelected = selectedSubject === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedSubject(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-white border border-slate-200 animate-pulse" />
            ))
          ) : filteredTeachers.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-bold text-slate-800">No mentors match your search criteria</p>
              <p className="text-xs text-slate-500">Try clearing filters or search for another subject.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedSubject("all");
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Top row: Avatar, Name, Qualification */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20 flex-shrink-0">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3
                          className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          {teacher.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Verified Mentor
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 line-clamp-1">
                        {teacher.qualification || "Senior Faculty Member"}
                      </p>
                      {teacher.experienceYears && (
                        <p className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{teacher.experienceYears} of Mentorship Experience</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio snippet */}
                  {teacher.bio && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {teacher.bio}
                    </p>
                  )}

                  {/* Contact / Website info pills */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                    {teacher.phone && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {teacher.phone}
                      </span>
                    )}
                    {teacher.website && (
                      <a
                        href={teacher.website.startsWith("http") ? teacher.website : `https://${teacher.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <Globe className="w-3 h-3 text-indigo-600" />
                        {teacher.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>

                  {/* Subject Domains & Target Exams Pills */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {((teacher.subjectDomains && teacher.subjectDomains.length > 0) ? teacher.subjectDomains : teacher.specialization?.slice(0, 3)) && (
                      <div className="flex flex-wrap gap-1">
                        {((teacher.subjectDomains && teacher.subjectDomains.length > 0) ? teacher.subjectDomains : teacher.specialization?.slice(0, 3))?.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10.5px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {teacher.targetExams && teacher.targetExams.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {teacher.targetExams.slice(0, 3).map((exam, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold"
                          >
                            {exam}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/mentors/${teacher._id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:from-[#4f46e5] hover:to-[#6d28d9] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 group-hover:gap-2"
                  >
                    <span>View Complete Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* ── BOTTOM BANNER: BOOK TRIAL CLASS ──────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/20 mt-12">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized 1-on-1 Faculty Matching</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Want to take a live trial session with our Senior Faculty?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get matched with our expert mentors based on your current grade, syllabus target (NEET, JEE, Olympiad, CBSE/ICSE), and learning pace.
            </p>
          </div>

          <Link
            href="/#programs"
            className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-950 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Book 1-on-1 Free Demo Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 LV Institute (Global Learning Vision). All rights reserved.</p>
      </footer>
    </div>
  );
}
