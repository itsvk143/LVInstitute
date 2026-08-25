"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, Search } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { formatDate, cn } from "@/lib/utils";

export default function MarksPage() {
  const [search, setSearch] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");

  const { data: marks = [], isLoading } = useQuery({
    queryKey: ["marks", examTypeFilter],
    queryFn: async () => {
      const url = examTypeFilter ? `/api/marks?examType=${examTypeFilter}` : `/api/marks`;
      return (await axios.get(url)).data.data;
    },
  });

  const filteredMarks = marks.filter((m: { testName: string; student?: { name: string }; subject?: { name: string } }) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      m.testName.toLowerCase().includes(term) ||
      m.student?.name?.toLowerCase().includes(term) ||
      m.subject?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          Marks & Assessment Records
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive academic test evaluations, performance metrics, and subject grades
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search test name, student, or subject..."
            style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
            className="w-full py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        <select
          value={examTypeFilter}
          onChange={(e) => setExamTypeFilter(e.target.value)}
          className="rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer w-full sm:w-auto"
        >
          <option value="">All Exam Types</option>
          <option value="unit_test">Unit Test</option>
          <option value="mid_term">Mid Term</option>
          <option value="final">Final Exam</option>
          <option value="mock">Mock Test</option>
          <option value="olympiad">Olympiad</option>
        </select>
      </div>

      {/* Marks Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl glass-panel shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Test / Exam</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Score</th>
                <th className="px-5 py-4 text-center">Percentage</th>
                <th className="px-5 py-4 text-center">Grade</th>
                <th className="px-5 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Award className="mx-auto h-10 w-10 text-indigo-400/50" />
                    <p className="mt-3 text-sm font-semibold text-white">No mark records found</p>
                    <p className="text-xs text-slate-500 mt-1">Try changing search query or exam type filter</p>
                  </td>
                </tr>
              ) : (
                filteredMarks.map((m: { _id: string; testName: string; student?: { _id: string; name: string; admissionNumber: string }; subject?: { name: string }; obtainedMarks: number; maxMarks: number; percentage: number; grade: string; examDate: string }) => (
                  <tr key={m._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-medium">
                      {m.student ? (
                        <Link href={`/students/${m.student._id}`} className="hover:text-indigo-400 font-bold transition-colors">
                          <span className="text-white block">{m.student.name}</span>
                          <span className="block text-[11px] font-mono text-indigo-300/80 font-normal">{m.student.admissionNumber}</span>
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-white">{m.testName}</td>
                    <td className="px-5 py-4 text-slate-300 text-xs">{m.subject?.name || "—"}</td>
                    <td className="px-5 py-4 font-semibold text-slate-200">{m.obtainedMarks} / {m.maxMarks}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-100">{m.percentage}%</td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold border",
                        m.percentage >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          m.percentage >= 60 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            m.percentage >= 40 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        {m.grade}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{formatDate(m.examDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
