"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, BookOpen, Award, CheckCircle2 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import axios from "axios";

const subjectAverages = [
  { subject: "Mathematics", score: 84 },
  { subject: "Physics", score: 79 },
  { subject: "Chemistry", score: 82 },
  { subject: "Biology", score: 88 },
  { subject: "English", score: 76 },
  { subject: "Social Science", score: 81 },
];

const batchAttendance = [
  { batch: "Morning A", rate: 94 },
  { batch: "Evening B", rate: 89 },
  { batch: "NEET Weekend", rate: 96 },
  { batch: "International", rate: 92 },
];

const gradeDistribution = [
  { name: "A+ (90%+)", value: 42, color: "#10b981" },
  { name: "A (80-89%)", value: 33, color: "#6366f1" },
  { name: "B+ (70-79%)", value: 15, color: "#f59e0b" },
  { name: "B (60-69%)", value: 7, color: "#8b5cf6" },
  { name: "C (Below 60%)", value: 3, color: "#ef4444" },
];

export default function AnalyticsPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await axios.get("/api/dashboard")).data.data,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Academic Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep dive into institute benchmarks, grade distributions, and trends</p>
      </div>

      {/* Row 1: Grade Distribution & Subject Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Cohort Grade Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Overall student performance tiers</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {gradeDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, "Students"]} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {gradeDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-semibold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Score Averages */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Subject-wise Mean Marks</h3>
          <p className="text-xs text-muted-foreground mb-4">Institute average test score per discipline</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectAverages} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="subject" type="category" tick={{ fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`, "Average Score"]} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2: Batch Attendance Benchmarks */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h3 className="font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Batch Attendance Benchmarks</h3>
        <p className="text-xs text-muted-foreground mb-4">Comparison of student presence across shifts and programs</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={batchAttendance} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="batch" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}%`, "Attendance Rate"]} contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="rate" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
