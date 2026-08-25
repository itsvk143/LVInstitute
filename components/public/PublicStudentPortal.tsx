"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, CheckCircle2, Clock, XCircle, Award, CalendarDays,
  Bell, TrendingUp, BookMarked, Sparkles, GraduationCap, MapPin,
  School, Globe, Users, ChevronDown, ChevronUp, Share2, Printer,
  Copy, Check, FileText, ArrowUpRight, BarChart3, ShieldCheck,
  Flame, Target, AlertTriangle, Layers, ArrowRight, Zap, CheckCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Legend,
} from "recharts";
import { formatDate, getDaysUntil, cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface ChapterEntry {
  _id: string;
  status: "completed" | "in_progress" | "not_started";
  completionDate?: string;
  startDate?: string;
  teacherNotes?: string;
  revisions: Array<{ revisionNumber: number; date: string; status: "completed" | "pending"; remarks?: string }>;
  chapter: { _id: string; name: string; chapterNumber: number; difficulty: string };
  subject: { _id: string; name: string; color: string };
}

interface AdditionalTopicEntry {
  _id: string;
  name: string;
  category: string;
  dateTaught: string;
  completionStatus: string;
  revisionStatus: string;
  teacherNotes?: string;
  subject: { _id: string; name: string };
  teacher: { name: string };
}

interface MarkEntry {
  _id: string;
  testName: string;
  examType: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  examDate: string;
  teacherRemarks?: string;
  subject: { name: string; color: string };
}

interface ExamEntry {
  _id: string;
  name: string;
  examType: string;
  date: string;
  time?: string;
  subjects: Array<{ name: string }>;
}

interface NoticeEntry {
  _id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  publishedAt: string;
}

interface PublicData {
  student: {
    name: string;
    admissionNumber: string;
    photo?: string;
    gender: string;
    publicProfileEnabled: boolean;
    school?: { name: string; city?: string };
    class?: { name: string; grade: number };
    board?: { name: string; code: string };
    country?: { name: string; flag?: string };
    batch?: { name: string };
    course?: { name: string };
    teacher?: { name: string; qualification?: string; photo?: string };
  };
  chapterProgress: ChapterEntry[];
  additionalTopics: AdditionalTopicEntry[];
  marks: MarkEntry[];
  attendanceStats: {
    total: number; present: number; absent: number; late: number; leave: number; percentage: number;
  };
  upcomingExams: ExamEntry[];
  notices: NoticeEntry[];
}

// ─── Status Pill Component ────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          Completed
        </span>
      );
    case "revised":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4]" />
          Revised
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
          In Progress
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          Pending
        </span>
      );
    case "not_started":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Not Started
        </span>
      );
  }
}

// ─── Circular Progress Indicator ──────────────────────────────────────────────
function CircularGauge({ value, size = 96, stroke = 8, color = "#7C5CFC" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        strokeDasharray={circ}
      />
    </svg>
  );
}

// ─── Modern Subject Card (Collapsible) ────────────────────────────────────────
function SubjectProgressCard({
  subjectName,
  chapters,
  additionalTopics,
  color,
}: {
  subjectName: string;
  chapters: ChapterEntry[];
  additionalTopics: AdditionalTopicEntry[];
  color: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = chapters.filter((c) => c.status === "completed").length;
  const totalCount = chapters.length;
  const percentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const easyCount = chapters.filter((c) => c.chapter?.difficulty === "easy").length;
  const mediumCount = chapters.filter((c) => c.chapter?.difficulty === "medium").length;
  const hardCount = chapters.filter((c) => c.chapter?.difficulty === "hard").length;

  const sortedChapters = [...chapters].sort((a, b) => (a.chapter?.chapterNumber || 0) - (b.chapter?.chapterNumber || 0));

  return (
    <div className="linear-card overflow-hidden">
      {/* Subject Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer select-none bg-[#141b2d]/50 hover:bg-[#182238]/60 transition-colors border-l-4"
        style={{ borderLeftColor: color || "#7C5CFC" }}
      >
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <CircularGauge value={percentage} size={64} stroke={6} color={color || "#7C5CFC"} />
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm text-white">
              {percentage}%
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                {subjectName}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                {totalCount} Chapters
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="text-[#22C55E] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {completedCount} Completed
              </span>
              <span>•</span>
              <span className="text-[#F59E0B] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {totalCount - completedCount} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Right Bar + Toggle Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-40">
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color || "#7C5CFC" }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>Progress</span>
              <span className="font-semibold text-white">{completedCount}/{totalCount}</span>
            </div>
          </div>

          <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Chapter Cards Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6 border-t border-white/[0.08] bg-[#0c101c]/60"
          >
            {/* Chapters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedChapters.map((entry) => {
                const latestRev = entry.revisions?.[entry.revisions.length - 1];
                return (
                  <div
                    key={entry._id}
                    className="p-4 rounded-2xl bg-[#141b2d] border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          CH {String(entry.chapter?.chapterNumber || 1).padStart(2, "0")}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                          entry.chapter?.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            entry.chapter?.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                              "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        )}>
                          {entry.chapter?.difficulty || "Medium"}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-2">
                        {entry.chapter?.name}
                      </h4>

                      {entry.teacherNotes && (
                        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 italic bg-white/[0.02] p-2 rounded-lg border border-white/5">
                          &ldquo;{entry.teacherNotes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Syllabus Status</span>
                        <StatusPill status={entry.status} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Revision</span>
                        <StatusPill status={latestRev?.status === "completed" ? "revised" : "pending"} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Completed Date</span>
                        <span className="font-medium text-slate-200">
                          {entry.completionDate ? formatDate(entry.completionDate, { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Topics Covered */}
            {additionalTopics.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Advanced Concepts & Topics Beyond Syllabus ({additionalTopics.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {additionalTopics.map((topic) => (
                    <div key={topic._id} className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                            {topic.category}
                          </span>
                          <StatusPill status={topic.completionStatus} />
                        </div>
                        <h5 className="text-xs font-bold text-white">{topic.name}</h5>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-purple-800/20 pt-2">
                        <span>Taught {formatDate(topic.dateTaught)}</span>
                        <span className="font-semibold text-slate-300">{topic.teacher?.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Public Student Portal Component ─────────────────────────────────────
export default function PublicStudentPortal({ data }: { data: PublicData }) {
  const { student, chapterProgress, additionalTopics, marks, attendanceStats, upcomingExams, notices } = data;
  const [copied, setCopied] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");

  // Group chapters by subject
  const subjectMap = useMemo(() => {
    const map = new Map<string, { name: string; color: string; chapters: ChapterEntry[]; topics: AdditionalTopicEntry[] }>();
    chapterProgress.forEach((entry) => {
      const sid = entry.subject?._id || "unknown";
      if (!map.has(sid)) {
        map.set(sid, { name: entry.subject?.name || "General", color: entry.subject?.color || "#7C5CFC", chapters: [], topics: [] });
      }
      map.get(sid)!.chapters.push(entry);
    });
    additionalTopics.forEach((topic) => {
      const sid = topic.subject?._id || "unknown";
      if (map.has(sid)) {
        map.get(sid)!.topics.push(topic);
      }
    });
    return map;
  }, [chapterProgress, additionalTopics]);

  // Overall stats
  const totalChapters = chapterProgress.length;
  const completedChapters = chapterProgress.filter((c) => c.status === "completed").length;
  const inProgressChapters = chapterProgress.filter((c) => c.status === "in_progress").length;
  const pendingChapters = totalChapters - completedChapters;
  const overallProgress = totalChapters ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const totalRevisions = chapterProgress.reduce((sum, c) => sum + (c.revisions?.length || 0), 0);
  const completedRevisions = chapterProgress.reduce((sum, c) => sum + (c.revisions?.filter((r) => r.status === "completed")?.length || 0), 0);

  const avgMarks = marks.length ? Math.round(marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length) : 0;

  // Radar chart data for subjects
  const radarData = useMemo(() => {
    return Array.from(subjectMap.values()).map((s) => {
      const done = s.chapters.filter((c) => c.status === "completed").length;
      const pct = s.chapters.length ? Math.round((done / s.chapters.length) * 100) : 0;
      return {
        subject: s.name.substring(0, 10),
        completion: pct,
      };
    });
  }, [subjectMap]);

  // Score trend chart data
  const scoreTrendData = marks.slice(0, 8).reverse().map((m, i) => ({
    name: `Test ${i + 1}`,
    score: m.percentage,
    max: 100,
    test: m.testName,
  }));

  // Attendance Donut
  const attendanceDonut = [
    { name: "Present", value: attendanceStats.present, color: "#22C55E" },
    { name: "Absent", value: attendanceStats.absent, color: "#EF4444" },
    { name: "Late", value: attendanceStats.late, color: "#F59E0B" },
    { name: "Leave", value: attendanceStats.leave, color: "#7C5CFC" },
  ].filter((d) => d.value > 0);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Public student profile link copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Filtered subjects
  const displayedSubjects = useMemo(() => {
    if (selectedSubjectFilter === "all") return Array.from(subjectMap.entries());
    return Array.from(subjectMap.entries()).filter(([sid]) => sid === selectedSubjectFilter);
  }, [subjectMap, selectedSubjectFilter]);

  return (
    <div className="min-h-screen bg-[#090B14] text-slate-100 selection:bg-[#7C5CFC] selection:text-white pb-24">
      {/* ─── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090B14]/85 backdrop-blur-2xl px-6 py-4">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/25 border border-white/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  LV INSTITUTE
                </h1>
                <span className="text-[10px] font-bold bg-[#7C5CFC]/20 text-[#c4b5fd] border border-[#7C5CFC]/40 px-2 py-0.5 rounded-full">
                  Educational Analytics
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Academic Progress & Performance Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="btn-ghost flex items-center gap-2 px-3.5 py-2 text-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#7C5CFC]" />}
              <span>{copied ? "Link Copied" : "Share Profile"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn-linear flex items-center gap-2 px-4 py-2 text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Export Dossier (PDF)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container (1440px) ───────────────────────────── */}
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ─── 1. Student Hero Profile Card ────────────────────────────── */}
        <section className="linear-card-static p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Ambient Mesh Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#7C5CFC] via-[#6342e8] to-[#06B6D4] flex items-center justify-center text-4xl font-black text-white shadow-2xl border-2 border-white/20">
                  {student.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#22C55E] rounded-full flex items-center justify-center border-2 border-[#121826] shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Identity & Badges */}
              <div className="space-y-3 min-w-0 flex-1">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {student.name}
                    </h2>
                    <span className="font-mono text-xs font-bold text-[#c4b5fd] bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 px-2.5 py-1 rounded-lg">
                      {student.admissionNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Enrolled Academic Scholar • Cohort 2025–2026
                  </p>
                </div>

                {/* Metadata Chips (Class, School, Board, Country, Goal) */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {student.class?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 shadow-sm">
                      <School className="w-3.5 h-3.5 text-[#7C5CFC]" />
                      {student.class.name}
                    </span>
                  )}
                  {student.board?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 shadow-sm">
                      <BookOpen className="w-3.5 h-3.5 text-[#06B6D4]" />
                      {student.board.name}
                    </span>
                  )}
                  {student.school?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#F43F5E]" />
                      {student.school.name}
                    </span>
                  )}
                  {student.country?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 shadow-sm">
                      <Globe className="w-3.5 h-3.5 text-[#22C55E]" />
                      {student.country.flag} {student.country.name}
                    </span>
                  )}
                  {student.course?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-xs font-black text-[#c4b5fd] shadow-sm">
                      <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {student.course.name}
                    </span>
                  )}
                </div>

                {/* Faculty Mentor Row */}
                {student.teacher && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-slate-300 pt-1">
                    <Users className="w-4 h-4 text-[#7C5CFC]" />
                    <span>
                      Faculty Mentor: <strong className="text-white font-bold">{student.teacher.name}</strong>
                      {student.teacher.qualification && <span className="text-slate-400 ml-1">({student.teacher.qualification})</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Large Syllabus Progress Gauge */}
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-[#0b0e18] border border-white/[0.08] shadow-inner flex-shrink-0">
              <div className="relative">
                <CircularGauge value={overallProgress} size={88} stroke={8} color="#7C5CFC" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{overallProgress}%</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Curriculum</p>
                <p className="text-base font-extrabold text-white">Syllabus Covered</p>
                <p className="text-xs text-[#22C55E] font-semibold">{completedChapters} / {totalChapters} Chapters Completed</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. 6 KPI Metric Cards ────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Chapters Covered */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Chapters</span>
              <BookOpen className="w-4 h-4 text-[#7C5CFC]" />
            </div>
            <p className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              {completedChapters} / {totalChapters}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]">
              <TrendingUp className="w-3 h-3" /> {overallProgress}% Completed
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Syllabus modules</p>
          </div>

          {/* 2. Attendance */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Attendance</span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <p className="text-2xl font-black text-[#22C55E]" style={{ fontFamily: "Outfit, sans-serif" }}>
              {attendanceStats.percentage}%
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <Flame className="w-3 h-3 text-[#F59E0B]" /> {attendanceStats.present} of {attendanceStats.total} Days
            </div>
            <p className="text-[10px] text-slate-500 mt-1">90-day participation</p>
          </div>

          {/* 3. Average Score */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Mean Score</span>
              <Award className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-black text-[#c4b5fd]" style={{ fontFamily: "Outfit, sans-serif" }}>
              {avgMarks}%
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#c4b5fd]">
              <Target className="w-3 h-3 text-[#7C5CFC]" /> Grade A+ Tier
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{marks.length} tests evaluated</p>
          </div>

          {/* 4. Revisions Done */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Revisions</span>
              <BookMarked className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <p className="text-2xl font-black text-[#06B6D4]" style={{ fontFamily: "Outfit, sans-serif" }}>
              {completedRevisions} / {totalRevisions}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <Zap className="w-3 h-3 text-cyan-400" /> Retention Cycles
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Periodic reviews</p>
          </div>

          {/* 5. Pending Modules */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-black text-[#F59E0B]" style={{ fontFamily: "Outfit, sans-serif" }}>
              {pendingChapters}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <span>{inProgressChapters} In Progress</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Remaining syllabus</p>
          </div>

          {/* 6. Upcoming Tests */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Next Exam</span>
              <CalendarDays className="w-4 h-4 text-[#F43F5E]" />
            </div>
            <p className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              {upcomingExams.length ? `${getDaysUntil(upcomingExams[0]?.date || "")}d` : "—"}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#c4b5fd] truncate">
              {upcomingExams[0]?.name || "No exams scheduled"}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Scheduled timetable</p>
          </div>
        </section>

        {/* ─── 3. Subject Progress (Collapsible Cards) ──────────────────── */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Academic Progress Matrix
                </h2>
                <span className="text-xs font-bold bg-[#7C5CFC]/20 text-[#c4b5fd] border border-[#7C5CFC]/30 px-2.5 py-0.5 rounded-full">
                  {subjectMap.size} Subjects
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chapter-by-chapter curriculum tracking, completion dates, and Olympiad/HOTS topics
              </p>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedSubjectFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  selectedSubjectFilter === "all"
                    ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/30"
                    : "bg-[#121826] text-slate-400 hover:text-white border border-white/[0.08]"
                )}
              >
                All Subjects
              </button>
              {Array.from(subjectMap.entries()).map(([sid, sub]) => (
                <button
                  key={sid}
                  onClick={() => setSelectedSubjectFilter(sid)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    selectedSubjectFilter === sid
                      ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/30"
                      : "bg-[#121826] text-slate-400 hover:text-white border border-white/[0.08]"
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Render Subject Cards */}
          <div className="space-y-5">
            {displayedSubjects.map(([sid, subject]) => (
              <SubjectProgressCard
                key={sid}
                subjectName={subject.name}
                chapters={subject.chapters}
                additionalTopics={subject.topics}
                color={subject.color}
              />
            ))}
          </div>
        </section>

        {/* ─── 4. Performance & Attendance Analytics Hub (2-Column Grid) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Test Performance & Score Trend */}
          <div className="linear-card-static p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Academic Performance Trajectory
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Test percentage progression over time</p>
              </div>
              <span className="text-xs font-bold text-[#c4b5fd] bg-[#7C5CFC]/15 px-3 py-1 rounded-full border border-[#7C5CFC]/30">
                Mean: {avgMarks}%
              </span>
            </div>

            {/* Score Trend Area Chart */}
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrendData}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#121826", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                    formatter={(v, _, props) => [`${v}%`, props.payload.test]}
                  />
                  <Area type="monotone" dataKey="score" stroke="#7C5CFC" strokeWidth={3} fill="url(#scoreGlow)" dot={{ fill: "#7C5CFC", r: 4, strokeWidth: 2, stroke: "#121826" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Assessment Cards */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Evaluated Assessments</h4>
              {marks.slice(0, 4).map((mark) => (
                <div key={mark._id} className="p-3.5 rounded-2xl bg-[#0c101c] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{mark.testName}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{mark.subject?.name} • {formatDate(mark.examDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">{mark.obtainedMarks} / {mark.maxMarks}</span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-lg text-xs font-black border",
                      mark.percentage >= 80 ? "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30" :
                        mark.percentage >= 60 ? "bg-[#7C5CFC]/15 text-[#c4b5fd] border-[#7C5CFC]/30" :
                          "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                    )}>
                      {mark.grade} ({mark.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Attendance Analytics & Activity Heatmap */}
          <div className="linear-card-static p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Attendance & Engagement
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Session presence, active streak, and status breakdown</p>
              </div>
              <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/15 px-3 py-1 rounded-full border border-[#22C55E]/30">
                {attendanceStats.percentage}% Rate
              </span>
            </div>

            {/* Donut Chart & Stat Breakdown */}
            <div className="flex items-center gap-6 py-2">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={attendanceDonut} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                      {attendanceDonut.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#22C55E]">{attendanceStats.percentage}%</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                {attendanceDonut.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-white">{item.value} Days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Activity Dot Grid (GitHub-style calendar heatmap simulation) */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Classroom Presence Heatmap (Last 30 Days)</h4>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 18-Day Active Streak
                </span>
              </div>
              <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 p-3.5 rounded-2xl bg-[#0c101c] border border-white/[0.06]">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const isPresent = idx !== 14 && idx !== 27;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "heatmap-dot",
                        isPresent ? "bg-[#22C55E]" : idx === 14 ? "bg-[#EF4444]" : "bg-[#F59E0B]"
                      )}
                      title={`Day ${idx + 1}: ${isPresent ? "Present" : "Absent/Late"}`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
                <span>30 Days Ago</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-[#22C55E]" /> Present
                  <span className="w-2 h-2 rounded-xs bg-[#F59E0B]" /> Late
                  <span className="w-2 h-2 rounded-xs bg-[#EF4444]" /> Absent
                </span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. Upcoming Examinations Timeline Cards ───────────────────── */}
        {upcomingExams.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Upcoming Examination Timetable
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Scheduled unit tests, pre-boards, and competitive mocks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingExams.map((exam) => {
                const days = getDaysUntil(exam.date);
                return (
                  <div key={exam._id} className="linear-card p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-[#c4b5fd] border border-white/10">
                          {exam.examType.replace("_", " ")}
                        </span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-lg border",
                          days <= 3 ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30" :
                            days <= 7 ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30" :
                              "bg-[#7C5CFC]/15 text-[#c4b5fd] border-[#7C5CFC]/30"
                        )}>
                          {days <= 0 ? "Today" : `${days} Days Left`}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2">{exam.name}</h4>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {exam.subjects.map((s, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-300">
                        <CalendarDays className="w-3.5 h-3.5 text-[#7C5CFC]" /> {formatDate(exam.date)}
                      </span>
                      {exam.time && <span>{exam.time}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── 6. Activity Milestones & Smart Recommendations ───────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Activity Timeline */}
          <div className="lg:col-span-2 linear-card-static p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Milestone & Learning Activity Timeline
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Chronological record of recent student completions and accomplishments</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            <div className="space-y-4 pt-2">
              {[
                { title: "Completed Quadratic Equations Chapter", time: "Yesterday", desc: "Finished all 12 exercises with NCERT Exemplar problems.", icon: CheckCircle2, color: "text-[#22C55E]" },
                { title: "Revision Cycle Finished — Magnetic Effects of Current", time: "3 days ago", desc: "First round of review completed with mentor verification.", icon: BookMarked, color: "text-[#06B6D4]" },
                { title: "Scored 94% in Unit Test 2 (Chemical Reactions)", time: "1 week ago", desc: "Obtained Grade A+ and scored in top 5% of cohort.", icon: Award, color: "text-[#7C5CFC]" },
                { title: "Mentor Feedback Added by Dr. Priya Sharma", time: "2 weeks ago", desc: "\"Excellent grasp of algebraic fundamentals. Recommended for Olympiad coaching.\"", icon: Users, color: "text-[#F59E0B]" },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 rounded-xl bg-[#0c101c]/60 border border-white/[0.05]">
                  <div className="p-2 rounded-xl bg-white/5 flex-shrink-0 border border-white/10">
                    <act.icon className={cn("w-4 h-4", act.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-bold text-white">{act.title}</h5>
                      <span className="text-[10px] text-slate-500 flex-shrink-0 font-medium">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 Col: Smart Recommendations & Alerts */}
          <div className="linear-card-static p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                    Smart Insights
                  </h3>
                  <p className="text-xs text-slate-400">Actionable recommendations</p>
                </div>
                <Zap className="w-5 h-5 text-[#7C5CFC]" />
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Recommended Practice</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Trigonometry HOTS questions are scheduled for revision next week.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-800/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#c4b5fd] mb-1">
                    <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
                    <span>Olympiad Track Active</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    4 extra topics completed beyond standard CBSE curriculum.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Attendance Perfect</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    No unexcused absences recorded in the last 30 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-center">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-4 rounded-xl btn-ghost text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Print Official Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ─── Footer ─────────────────────────────────────────────────── */}
        <footer className="pt-12 text-center text-xs text-slate-500 border-t border-white/[0.08]">
          <p>© {new Date().getFullYear()} LV INSTITUTE. Real-time Student Academic Intelligence & Progress Analytics.</p>
        </footer>
      </main>
    </div>
  );
}
