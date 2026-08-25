"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, School, GraduationCap, BookOpen, TrendingUp,
  Calendar, Bell, CheckCircle2, Clock, AlertCircle,
  Activity, Award, Sparkles, ArrowUpRight, Plus, Eye,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import Link from "next/link";
import axios from "axios";
import { formatDate, getDaysUntil, cn } from "@/lib/utils";

// ── Demo chart datasets ────────────────────────────────────────────────────────
const attendanceTrend = [
  { month: "Mar", rate: 89 }, { month: "Apr", rate: 92 },
  { month: "May", rate: 86 }, { month: "Jun", rate: 84 },
  { month: "Jul", rate: 94 }, { month: "Aug", rate: 97 },
];

const subjectProgress = [
  { subject: "Maths", completed: 15, pending: 3 },
  { subject: "Physics", completed: 12, pending: 5 },
  { subject: "Chemistry", completed: 11, pending: 7 },
  { subject: "Biology", completed: 14, pending: 2 },
  { subject: "English", completed: 10, pending: 2 },
];

const progressPie = [
  { name: "Completed", value: 68, color: "#10b981" },
  { name: "In Progress", value: 22, color: "#6366f1" },
  { name: "Pending", value: 10, color: "#f59e0b" },
];

function StatCard({
  title, value, icon: Icon, change, subtitle, gradientClass, delay,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  subtitle?: string;
  gradientClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay || 0, duration: 0.4 }}
      className={`relative rounded-3xl p-6 shadow-xl overflow-hidden glass-card ${gradientClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            {value}
          </h3>
          {change && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> {change}
            </div>
          )}
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await axios.get("/api/dashboard")).data.data,
    refetchInterval: 60000,
  });

  const overview = stats?.overview || {
    totalStudents: 5, activeStudents: 5, avgAttendance: 92, avgMarks: 84,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Academic Control Hub
            </h1>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              Live Session
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time syllabus completion, examination schedules, and attendance metrics for LV Institute
          </p>
        </div>

        {/* Quick Enroll CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/students/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-gradient text-xs font-bold text-white shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Enroll New Student
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-slate-300 hover:text-white"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" /> Dossier Reports
          </Link>
        </div>
      </motion.div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={isLoading ? "..." : overview.totalStudents}
          icon={Users}
          gradientClass="stat-card-indigo"
          change="+100% active"
          delay={0}
        />
        <StatCard
          title="Avg Attendance"
          value={isLoading ? "..." : `${overview.avgAttendance}%`}
          icon={CheckCircle2}
          gradientClass="stat-card-emerald"
          subtitle="90-day aggregate"
          delay={0.08}
        />
        <StatCard
          title="Mean Test Score"
          value={isLoading ? "..." : `${overview.avgMarks}%`}
          icon={Award}
          gradientClass="stat-card-violet"
          change="Cohort Grade A"
          delay={0.16}
        />
        <StatCard
          title="Active Programs"
          value="CBSE / NEET"
          icon={GraduationCap}
          gradientClass="stat-card-amber"
          subtitle="Classes 3 to 12"
          delay={0.24}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-3xl glass-panel p-6 shadow-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
                Classroom Attendance Trajectory
              </h3>
              <p className="text-xs text-slate-400">Monthly presence percentage over the last 6 months</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Mean: 92%
            </span>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="attendanceGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", fontSize: "12px", color: "#fff" }}
                formatter={(v) => [`${v}%`, "Attendance"]}
              />
              <Area type="monotone" dataKey="rate" stroke="#818cf8" strokeWidth={3} fill="url(#attendanceGlow)" dot={{ fill: "#818cf8", r: 4, strokeWidth: 2, stroke: "#0f172a" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chapter Progress Pie */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl glass-panel p-6 shadow-xl border border-white/10 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-white text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
              Syllabus Completion
            </h3>
            <p className="text-xs text-slate-400 mb-4">Overall chapters covered vs pending</p>

            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={progressPie} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value">
                  {progressPie.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "10px", fontSize: "11px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-3 pt-3 border-t border-white/10 text-xs">
            {progressPie.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Subject-wise progress bar chart + Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-3xl glass-panel p-6 shadow-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
                Subject-wise Chapter Breakdown
              </h3>
              <p className="text-xs text-slate-400">Chapters completed vs remaining per subject</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectProgress} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Exams with Countdown Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-3xl glass-panel p-6 shadow-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
              Upcoming Exams
            </h3>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="space-y-3">
            {stats?.upcomingExams?.slice(0, 3).map((exam: { _id: string; name: string; examType: string; date: string }) => {
              const days = getDaysUntil(exam.date);
              return (
                <div key={exam._id} className="rounded-2xl bg-white/5 border border-white/10 p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-white">{exam.name}</h4>
                    <p className="text-[11px] text-slate-400 capitalize">{exam.examType.replace("_", " ")} • {formatDate(exam.date)}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-lg border",
                    days <= 3 ? "bg-rose-500/20 text-rose-300 border-rose-500/30" :
                      days <= 7 ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                        "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  )}>
                    {days <= 0 ? "Today" : `${days}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
