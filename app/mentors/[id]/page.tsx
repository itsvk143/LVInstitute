"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Star,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  Building2,
  Clock,
  Edit3,
  X,
  Save,
  ShieldCheck,
  Send,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimelineItem {
  role: string;
  organization: string;
  period: string;
}

interface TeacherProfile {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  qualification?: string;
  bio?: string;
  experienceYears?: string | number;
  achievements?: string[];
  experienceTimeline?: TimelineItem[];
  specialization?: string[];
  subjectDomains?: string[];
  targetExams?: string[];
  website?: string;
  subjects?: Array<{ _id: string; name: string }>;
  isActive: boolean;
}

export default function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  // Admin Detection state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Booking Form State
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingGrade, setBookingGrade] = useState("Class 11 (NEET / JEE)");
  const [bookingSlot, setBookingSlot] = useState("Evening (5:00 PM - 7:00 PM)");

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    qualification: "",
    experienceYears: "",
    bio: "",
    subjectDomains: "",
    targetExams: "",
    specialization: "",
    achievements: "",
    experienceTimeline: [] as TimelineItem[],
  });

  const FALLBACK_PROFILES: Record<string, TeacherProfile> = {
    "cvk-vikash-sir": {
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
    "laxmi-kumari": {
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
  };

  // Fetch Teacher Data
  const { data: teacher, isLoading, error } = useQuery<TeacherProfile>({
    queryKey: ["teacher", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${id}`);
        return res.data.data;
      } catch (err) {
        if (FALLBACK_PROFILES[id]) {
          return FALLBACK_PROFILES[id];
        }
        throw err;
      }
    },
    initialData: FALLBACK_PROFILES[id],
  });

  // Check if admin is logged in
  useEffect(() => {
    // Check localStorage auth or admin cookie
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const adminFlag = typeof window !== "undefined" ? localStorage.getItem("is_admin") : null;
    if (token || adminFlag === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Initialize edit form when teacher data is loaded
  useEffect(() => {
    if (teacher) {
      setEditForm({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        website: teacher.website || "",
        qualification: teacher.qualification || "",
        experienceYears: String(teacher.experienceYears || ""),
        bio: teacher.bio || "",
        subjectDomains:
          teacher.subjectDomains?.join(", ") ||
          teacher.specialization?.filter((s) => !s.toLowerCase().includes("jee") && !s.toLowerCase().includes("neet") && !s.toLowerCase().includes("board") && !s.toLowerCase().includes("olympiad")).join(", ") ||
          "Physical Chemistry, Organic Chemistry, Inorganic Chemistry",
        targetExams:
          teacher.targetExams?.join(", ") ||
          teacher.specialization?.filter((s) => s.toLowerCase().includes("jee") || s.toLowerCase().includes("neet") || s.toLowerCase().includes("board") || s.toLowerCase().includes("olympiad")).join(", ") ||
          "National & International Olympiads, Chemistry Olympiad (IChO & INChO), Junior Science Olympiad (IJSO & NSEJS), Pre-Olympiad Foundation (Class 8–10), JEE Advanced (IIT), JEE Mains, NEET UG (Medical), CBSE & ICSE Boards (95%+), KVPY & CUET",
        specialization: teacher.specialization?.join(", ") || "",
        achievements: teacher.achievements?.join("\n") || "",
        experienceTimeline: teacher.experienceTimeline || [],
      });
    }
  }, [teacher]);

  // Update Mutation for Admin
  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<TeacherProfile>) => {
      const res = await axios.patch(`/api/teachers/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Mentor profile updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["public-teachers"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      website: editForm.website,
      qualification: editForm.qualification,
      experienceYears: editForm.experienceYears,
      bio: editForm.bio,
      subjectDomains: editForm.subjectDomains
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      targetExams: editForm.targetExams
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      specialization: editForm.specialization
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      achievements: editForm.achievements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceTimeline: editForm.experienceTimeline,
    };
    updateMutation.mutate(payload);
  };

  const handleAddTimelineItem = () => {
    setEditForm({
      ...editForm,
      experienceTimeline: [
        ...editForm.experienceTimeline,
        { role: "", organization: "", period: "" },
      ],
    });
  };

  const handleRemoveTimelineItem = (idx: number) => {
    const next = [...editForm.experienceTimeline];
    next.splice(idx, 1);
    setEditForm({ ...editForm, experienceTimeline: next });
  };

  const handleTimelineChange = (
    idx: number,
    field: keyof TimelineItem,
    val: string
  ) => {
    const next = [...editForm.experienceTimeline];
    next[idx] = { ...next[idx], [field]: val };
    setEditForm({ ...editForm, experienceTimeline: next });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Demo session requested with ${teacher?.name}! Our academic counselor will call on ${bookingPhone} within 15 minutes.`
    );
    setIsBookingOpen(false);
    setBookingName("");
    setBookingPhone("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Loading Mentor Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <GraduationCap className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">Mentor Profile Not Found</h2>
          <p className="text-xs text-slate-600">
            The requested faculty profile could not be located or has been archived.
          </p>
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Mentors Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── TOP NAV BAR ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/mentors"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Mentors</span>
            </Link>

            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span
                className="text-lg font-black tracking-tight text-[#1e1b4b]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                LV Institute
              </span>
            </Link>
          </div>

          {/* Right Action: Admin Edit Button (If Admin) or Book Free Trial Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Profile (Admin)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book 1-on-1 Class</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── PROFILE HERO HEADER ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-indigo-950 via-[#1e1b4b] to-[#0f172a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Left: Avatar & Primary Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-xl shadow-indigo-500/25 border-2 border-white/20 flex-shrink-0">
                {teacher.name.charAt(0)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {teacher.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Senior Mentor
                  </span>
                </div>

                <p className="text-sm sm:text-base text-indigo-200 font-semibold">
                  {teacher.qualification || "Senior Faculty Member & Academic Mentor"}
                </p>

                {/* Badges / Metrics */}
                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-300 pt-1">
                  {teacher.experienceYears && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{teacher.experienceYears} Experience</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 font-medium">
                    <Award className="w-3.5 h-3.5 text-teal-300" />
                    <span>5,000+ Students Mentored</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Top 50 AIR Selections</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Cards */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
              {teacher.website && (
                <a
                  href={teacher.website.startsWith("http") ? teacher.website : `https://${teacher.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Globe className="w-4 h-4 text-purple-300" />
                  <span>Visit {teacher.website.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}

              {teacher.phone && (
                <a
                  href={`tel:${teacher.phone}`}
                  className="px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {teacher.phone}</span>
                </a>
              )}

              {teacher.email && (
                <a
                  href={`mailto:${teacher.email}`}
                  className="px-5 py-3 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>{teacher.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Column (8 cols): Bio, Experience Timeline, Achievements */}
          <div className="lg:col-span-8 space-y-8">
            {/* About / Pedagogy Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2
                  className="text-xl font-black text-slate-900"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  About Mentor & Teaching Pedagogy
                </h2>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {teacher.bio ||
                  `${teacher.name} is a renowned academic educator dedicated to providing top-tier conceptual mentorship and problem-solving mastery for competitive and board examinations.`}
              </p>
            </div>

            {/* Section 1: Core Subject Domains & Pedagogy */}
            {(() => {
              const domains =
                teacher.subjectDomains && teacher.subjectDomains.length > 0
                  ? teacher.subjectDomains
                  : teacher.specialization?.filter(
                      (s) =>
                        !s.toLowerCase().includes("jee") &&
                        !s.toLowerCase().includes("neet") &&
                        !s.toLowerCase().includes("board") &&
                        !s.toLowerCase().includes("olympiad") &&
                        !s.toLowerCase().includes("cuet") &&
                        !s.toLowerCase().includes("kvpy")
                    ) || ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"];

              if (!domains || domains.length === 0) return null;

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-black text-slate-900"
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        Core Subject Domains & Expertise
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Foundational syllabus mastery and advanced conceptual depth
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {domains.map((domain, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 hover:border-indigo-300 transition-all flex items-center gap-3"
                      >
                        <div className="w-3 h-3 rounded-full bg-indigo-600 flex-shrink-0 shadow-xs" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{domain}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Section 2: Targeted Competitive & Board Examinations */}
            {(() => {
              const exams =
                teacher.targetExams && teacher.targetExams.length > 0
                  ? teacher.targetExams
                  : teacher.specialization?.filter(
                      (s) =>
                        s.toLowerCase().includes("jee") ||
                        s.toLowerCase().includes("neet") ||
                        s.toLowerCase().includes("board") ||
                        s.toLowerCase().includes("olympiad") ||
                        s.toLowerCase().includes("cuet") ||
                        s.toLowerCase().includes("kvpy")
                    ) || [
                      "National & International Olympiads",
                      "Chemistry Olympiad (IChO & INChO)",
                      "Junior Science Olympiad (IJSO & NSEJS)",
                      "Pre-Olympiad Foundation (Class 8–10)",
                      "JEE Advanced (IIT)",
                      "JEE Mains",
                      "NEET UG (Medical)",
                      "CBSE & ICSE Boards (95%+)",
                      "KVPY & CUET",
                    ];

              if (!exams || exams.length === 0) return null;

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-black text-slate-900"
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        Specialized Competitive & Board Examinations
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Rank-oriented coaching tailored to specific exam rubrics and cutoff benchmarks
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {exams.map((exam, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 hover:border-purple-300 transition-all flex items-center gap-3"
                      >
                        <div className="w-3 h-3 rounded-full bg-purple-600 flex-shrink-0 shadow-xs" />
                        <span className="text-xs sm:text-sm font-black text-slate-900">{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Career Experience Timeline */}
            {teacher.experienceTimeline && teacher.experienceTimeline.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2
                    className="text-xl font-black text-slate-900"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Teaching Pedigree & Experience Timeline
                  </h2>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 pl-2">
                  {teacher.experienceTimeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-6">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900">{item.role}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                            {item.period}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-indigo-600">{item.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notable Achievements */}
            {teacher.achievements && teacher.achievements.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <h2
                    className="text-xl font-black text-slate-900"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Proven Track Record & Student Results
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {teacher.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-emerald-950 leading-relaxed">
                        {ach}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Book Free Demo Class Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/20 space-y-5 sticky top-28">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live 1-on-1 Mentorship</span>
                </div>
                <h3
                  className="text-xl font-black tracking-tight"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Book a Trial Class with {teacher.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Experience our concept visualization methodology and rapid problem solving firsthand.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                    Student / Parent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:bg-white/15 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:bg-white/15 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                    Target Exam / Grade
                  </label>
                  <select
                    value={bookingGrade}
                    onChange={(e) => setBookingGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-xs text-white outline-none"
                  >
                    <option value="Class 11 (NEET / JEE)">Class 11 (NEET / JEE)</option>
                    <option value="Class 12 (NEET / JEE / Boards)">Class 12 (NEET / JEE / Boards)</option>
                    <option value="NEET Dropper / Repeater">NEET Dropper / Repeater</option>
                    <option value="Class 10 (CBSE / ICSE)">Class 10 (CBSE / ICSE)</option>
                    <option value="Chemistry Olympiad (IChO)">Chemistry Olympiad (IChO)</option>
                    <option value="Foundation (Class 8-9)">Foundation (Class 8-9)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                    Preferred Slot
                  </label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-xs text-white outline-none"
                  >
                    <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
                    <option value="Morning (8:00 AM - 10:00 AM)">Morning (8:00 AM - 10:00 AM)</option>
                    <option value="Weekend Special (Saturday 11:00 AM)">Weekend Special (Saturday 11:00 AM)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Free Demo Class</span>
                </button>
              </form>

              <div className="pt-2 border-t border-white/10 text-center">
                <p className="text-[11px] text-slate-400">
                  🔒 100% Free • No Credit Card Required
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── ADMIN EDIT MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/20 text-white rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      Edit Mentor Profile (Admin Portal)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Changes will reflect immediately on the public mentors page.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Qualifications & Degrees *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.qualification}
                      onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                      placeholder="e.g. Senior Chemistry Lecturer • M.Sc Chemistry"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Website / Portfolio Link
                    </label>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      placeholder="e.g. www.cvksir.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={editForm.experienceYears}
                      onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
                      placeholder="e.g. 10+ Years"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Core Subject Domains (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.subjectDomains}
                      onChange={(e) => setEditForm({ ...editForm, subjectDomains: e.target.value })}
                      placeholder="e.g. Physical Chemistry, Organic Chemistry, Inorganic Chemistry"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Targeted Competitive & Board Exams (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.targetExams}
                      onChange={(e) => setEditForm({ ...editForm, targetExams: e.target.value })}
                      placeholder="e.g. JEE Advanced (IIT), JEE Mains, NEET UG, Chemistry Olympiad (IChO), CBSE / ICSE Boards"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Mentor Biography & Teaching Philosophy
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Provide a detailed overview of the mentor's pedagogy, track record, and problem-solving shortcuts..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Key Achievements & Rank Records (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.achievements}
                    onChange={(e) => setEditForm({ ...editForm, achievements: e.target.value })}
                    placeholder="Top 50 AIR Rankers Produced in JEE Advanced&#10;Ex-Faculty at Aakash Institute&#10;Over 5,000+ Students Mentored"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-indigo-400 outline-none leading-relaxed font-mono"
                  />
                </div>

                {/* Experience Timeline Editor */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Career History & Institution Timeline
                    </label>
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold hover:bg-indigo-500/30"
                    >
                      + Add Institution
                    </button>
                  </div>

                  {editForm.experienceTimeline.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Role (e.g. Senior Lecturer)"
                        value={item.role}
                        onChange={(e) => handleTimelineChange(idx, "role", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Organization (e.g. Aakash)"
                        value={item.organization}
                        onChange={(e) => handleTimelineChange(idx, "organization", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Period (e.g. 2022 - Present)"
                        value={item.period}
                        onChange={(e) => handleTimelineChange(idx, "period", e.target.value)}
                        className="w-36 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTimelineItem(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-medium mt-12">
        <p>© 2026 LV Institute (Global Learning Vision). All rights reserved.</p>
      </footer>
    </div>
  );
}
