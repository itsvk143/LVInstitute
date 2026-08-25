"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ClipboardList, Search, Eye } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { formatDate, cn } from "@/lib/utils";

export default function ProgressPage() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [search, setSearch] = useState("");

  const { data: studentsData } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => (await axios.get("/api/students?limit=50")).data,
  });

  const students = studentsData?.data || [];

  const { data: progress = [], isLoading } = useQuery({
    queryKey: ["progress", selectedStudent],
    queryFn: async () => {
      const url = selectedStudent ? `/api/progress?student=${selectedStudent}` : `/api/progress`;
      return (await axios.get(url)).data.data;
    },
  });

  const filteredProgress = progress.filter((p: { student?: { name: string }; chapter?: { name: string }; subject?: { name: string } }) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.student?.name?.toLowerCase().includes(term) ||
      p.chapter?.name?.toLowerCase().includes(term) ||
      p.subject?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          Chapter Progress Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor and update student syllabus completion, chapter milestones, and revision cycles
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, chapter, or subject..."
            style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
            className="w-full py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer w-full sm:w-auto"
        >
          <option value="">All Enrolled Students</option>
          {students.map((s: { _id: string; name: string; admissionNumber: string }) => (
            <option key={s._id} value={s._id}>{s.name} ({s.admissionNumber})</option>
          ))}
        </select>
      </div>

      {/* Progress Table */}
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
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Chapter</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-left">Start Date</th>
                <th className="px-5 py-4 text-left">Completion</th>
                <th className="px-5 py-4 text-right">Actions</th>
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
              ) : filteredProgress.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <ClipboardList className="mx-auto h-10 w-10 text-indigo-400/50" />
                    <p className="mt-3 text-sm font-semibold text-white">No progress records found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting student filter or search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredProgress.map((item: { _id: string; student?: { _id: string; name: string; admissionNumber: string }; subject?: { name: string; color: string }; chapter?: { name: string; chapterNumber: number }; status: string; startDate?: string; completionDate?: string }) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-medium">
                      {item.student ? (
                        <Link href={`/students/${item.student._id}`} className="hover:text-indigo-400 font-bold transition-colors">
                          <span className="text-white block">{item.student.name}</span>
                          <span className="block text-[11px] font-mono text-indigo-300/80 font-normal">{item.student.admissionNumber}</span>
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-xs text-slate-200">{item.subject?.name || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {item.chapter ? `${item.chapter.chapterNumber}. ${item.chapter.name}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold border capitalize",
                        item.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          item.status === "in_progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-slate-400 border-white/10"
                      )}>
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{item.startDate ? formatDate(item.startDate) : "—"}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">{item.completionDate ? formatDate(item.completionDate) : "—"}</td>
                    <td className="px-5 py-4 text-right">
                      {item.student && (
                        <Link
                          href={`/students/${item.student._id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                      )}
                    </td>
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
