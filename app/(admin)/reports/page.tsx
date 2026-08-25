"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Download, Printer, Users, Award, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import axios from "axios";

export default function ReportsPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ["reports-overview"],
    queryFn: async () => (await axios.get("/api/reports")).data.data,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Reports & Intelligence</h1>
          <p className="text-sm text-muted-foreground">Institute-wide academic performance, attendance, and syllabus metrics</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4" /> Print / Export PDF
        </button>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Enrolled Students</span>
          <p className="mt-2 text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            {report?.totalStudents || 0}
          </p>
          <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3" /> Active cohort
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Tests Conducted</span>
          <p className="mt-2 text-3xl font-bold text-indigo-600" style={{ fontFamily: "Outfit, sans-serif" }}>
            {report?.totalTestsConducted || 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Assessments evaluated</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Average Performance</span>
          <p className="mt-2 text-3xl font-bold text-violet-600" style={{ fontFamily: "Outfit, sans-serif" }}>
            {report?.averageMark || 0}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Mean aggregate score</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Average Attendance</span>
          <p className="mt-2 text-3xl font-bold text-emerald-600" style={{ fontFamily: "Outfit, sans-serif" }}>
            {report?.overallAttendanceRate || 0}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Session participation rate</p>
        </div>
      </div>

      {/* Available Report Types */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          Generate Printable Student Dossiers
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Monthly Student Academic Summary", desc: "Detailed syllabus completion, test scores, and teacher remarks for parents.", icon: Award },
            { title: "Attendance & Punctuality Audit", desc: "Monthly register with present, absent, and late breakdown across batches.", icon: CheckCircle2 },
            { title: "Competitive Exam Readiness Report", desc: "NEET & JEE preparation milestones and additional topic completion tracking.", icon: BookOpen },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/20 p-5 flex flex-col justify-between">
              <div>
                <item.icon className="h-6 w-6 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => window.print()}
                className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Download Report
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
