"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, Search, Plus, Eye, Trash2,
  ChevronLeft, ChevronRight, Globe,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Student {
  _id: string;
  admissionNumber: string;
  name: string;
  photo?: string;
  gender: string;
  school?: { name: string };
  class?: { name: string; grade: number };
  board?: { name: string; code: string };
  country?: { name: string; flag?: string };
  course?: { name: string };
  teacher?: { name: string };
  isActive: boolean;
  joiningDate: string;
}

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["students", page, debouncedSearch],
    queryFn: async () => {
      const res = await axios.get(`/api/students?page=${page}&limit=10&search=${debouncedSearch}`);
      return res.data;
    },
  });

  const students: Student[] = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1 };

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as Window & { _st?: ReturnType<typeof setTimeout> })._st);
    (window as Window & { _st?: ReturnType<typeof setTimeout> })._st = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student "${name}"? This action cannot be undone.`)) return;
    try {
      await axios.delete(`/api/students/${id}`);
      toast.success(`${name} removed`);
      refetch();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Student Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing <span className="text-indigo-300 font-bold">{meta.total}</span> enrolled students across schools, classes, and boards
          </p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Enroll New Student
        </Link>
      </div>

      {/* Toolbar Search + Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, admission no, phone..."
            style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
            className="w-full py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Luxury Glass Table */}
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
                <th className="px-5 py-4">Admission No</th>
                <th className="px-5 py-4">School</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Board</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-20 bg-white/5 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto opacity-30 mb-2" />
                    <p className="text-sm">No students found</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-white/5 transition-colors">
                    {/* Student Avatar + Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-md flex-shrink-0 border border-white/20">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/students/${student._id}`} className="font-bold text-white hover:text-indigo-300 transition-colors">
                            {student.name}
                          </Link>
                          <p className="text-[10px] text-slate-400 capitalize">{student.gender}</p>
                        </div>
                      </div>
                    </td>

                    {/* Admission Number */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] bg-white/5 text-indigo-300 px-2 py-0.5 rounded border border-white/10 font-medium">
                        {student.admissionNumber}
                      </span>
                    </td>

                    {/* School */}
                    <td className="px-5 py-4 text-slate-300">{student.school?.name || "—"}</td>

                    {/* Class */}
                    <td className="px-5 py-4">
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {student.class?.name || "—"}
                      </span>
                    </td>

                    {/* Board */}
                    <td className="px-5 py-4 text-slate-400 font-semibold">{student.board?.code || "—"}</td>

                    {/* Country */}
                    <td className="px-5 py-4 text-slate-300">
                      <span>{student.country?.flag} {student.country?.name || "—"}</span>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {student.course?.name || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                        student.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", student.isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400")} />
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/student/${student.admissionNumber}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-400 transition-colors"
                          title="Open Public Progress Portal"
                        >
                          <Globe className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/students/${student._id}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          title="View Full Profile Hub"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(student._id, student.name)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-white/10 px-5 py-3.5 flex items-center justify-between text-xs text-slate-400 bg-white/5">
          <p>
            Showing <span className="text-white font-bold">{students.length}</span> of <span className="text-white font-bold">{meta.total}</span> students
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg glass-card text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-white px-2">Page {page} of {meta.totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="p-1.5 rounded-lg glass-card text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
