"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, BookOpen, Award, CheckCircle2, Clock, Calendar,
  Globe, Sparkles, UserCheck, BookMarked, Printer, Plus,
  FileText, ShieldCheck, Mail, Phone, MapPin, School,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

interface StudentDetailProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: StudentDetailProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"progress" | "marks" | "attendance" | "topics" | "homework">("progress");

  // State for modals
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newMark, setNewMark] = useState({ subject: "", testName: "", examType: "unit_test", maxMarks: 50, obtainedMarks: 0, examDate: new Date().toISOString().split("T")[0] });
  const [newTopic, setNewTopic] = useState({ subject: "", name: "", category: "HOTS Questions", dateTaught: new Date().toISOString().split("T")[0], completionStatus: "completed", revisionStatus: "pending" });

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => (await axios.get(`/api/students/${id}`)).data.data,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["student-progress", id],
    queryFn: async () => (await axios.get(`/api/progress?student=${id}`)).data.data,
  });

  const { data: marks = [] } = useQuery({
    queryKey: ["student-marks", id],
    queryFn: async () => (await axios.get(`/api/marks?student=${id}`)).data.data,
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["student-attendance", id],
    queryFn: async () => (await axios.get(`/api/attendance?student=${id}`)).data.data,
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["student-topics", id],
    queryFn: async () => (await axios.get(`/api/additional-topics?student=${id}`)).data.data,
  });

  const { data: lookups } = useQuery({
    queryKey: ["lookups"],
    queryFn: async () => (await axios.get("/api/lookups")).data.data,
  });

  // Mutations
  const addMarkMutation = useMutation({
    mutationFn: async () => axios.post("/api/marks", { ...newMark, student: id }),
    onSuccess: () => {
      toast.success("Marks recorded!");
      setShowMarkModal(false);
      queryClient.invalidateQueries({ queryKey: ["student-marks", id] });
    },
    onError: () => toast.error("Failed to record marks"),
  });

  const addTopicMutation = useMutation({
    mutationFn: async () => axios.post("/api/additional-topics", { ...newTopic, student: id, teacher: student?.teacher?._id }),
    onSuccess: () => {
      toast.success("Additional topic added!");
      setShowTopicModal(false);
      queryClient.invalidateQueries({ queryKey: ["student-topics", id] });
    },
    onError: () => toast.error("Failed to add topic"),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-16 text-center text-slate-400">
        <p>Student profile not found</p>
        <Link href="/students" className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to directory
        </Link>
      </div>
    );
  }

  const completedChapters = progress.filter((p: { status: string }) => p.status === "completed").length;
  const progressPct = progress.length ? Math.round((completedChapters / progress.length) * 100) : 0;
  const presentDays = attendance.filter((a: { status: string }) => a.status === "present").length;
  const attendancePct = attendance.length ? Math.round((presentDays / attendance.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar with Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/students"
            className="flex h-11 w-11 items-center justify-center rounded-2xl glass-card text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                {student.name}
              </h1>
              <span className="font-mono text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                {student.admissionNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {student.class?.name} • {student.board?.name} • {student.school?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/student/${student.admissionNumber}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-indigo-300 transition-colors"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Public Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Dossier
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Syllabus Completion</span>
          <p className="mt-2 text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            {progressPct}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{completedChapters} of {progress.length} chapters covered</p>
        </div>

        <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance Rate</span>
          <p className="mt-2 text-2xl font-black text-emerald-400" style={{ fontFamily: "Outfit, sans-serif" }}>
            {attendancePct}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{presentDays} of {attendance.length} classes attended</p>
        </div>

        <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Extra Topics</span>
          <p className="mt-2 text-2xl font-black text-purple-400" style={{ fontFamily: "Outfit, sans-serif" }}>
            {topics.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">HOTS & Olympiad problems</p>
        </div>

        <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tests Evaluated</span>
          <p className="mt-2 text-2xl font-black text-amber-400" style={{ fontFamily: "Outfit, sans-serif" }}>
            {marks.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Assessments recorded</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-white/10 overflow-x-auto pb-2">
        {[
          { key: "progress", label: "Chapter Progress", icon: BookOpen },
          { key: "marks", label: "Marks & Results", icon: Award },
          { key: "attendance", label: "Attendance Log", icon: UserCheck },
          { key: "topics", label: "Additional Topics", icon: Sparkles },
          { key: "homework", label: "Homework & Tasks", icon: BookMarked },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
              activeTab === tab.key
                ? "bg-indigo-600/30 text-white border border-indigo-500/50 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4 text-indigo-400" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "progress" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl glass-panel p-6 shadow-xl border border-white/10">
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
              Chapter Completion Matrix
            </h3>
            {progress.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">No chapter records mapped for this student</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="px-4 py-3">Chapter</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Completion Date</th>
                      <th className="px-4 py-3">Mentor Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white">
                    {progress.map((p: { _id: string; chapter: { name: string; chapterNumber: number }; subject: { name: string }; status: string; completionDate?: string; teacherNotes?: string }) => (
                      <tr key={p._id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold">{p.chapter?.chapterNumber}. {p.chapter?.name}</td>
                        <td className="px-4 py-3 text-slate-300">{p.subject?.name}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize",
                            p.status === "completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                              p.status === "in_progress" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                                "bg-slate-500/20 text-slate-400 border-slate-500/30"
                          )}>
                            {p.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{p.completionDate ? formatDate(p.completionDate) : "—"}</td>
                        <td className="px-4 py-3 text-slate-400">{p.teacherNotes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "marks" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl glass-panel p-6 shadow-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                Assessment Records & Scores
              </h3>
              <button
                onClick={() => setShowMarkModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-gradient text-xs font-bold text-white shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Record Test Score
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="px-4 py-3">Test / Exam Title</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3 text-center">Percentage</th>
                    <th className="px-4 py-3 text-center">Grade</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {marks.map((m: { _id: string; testName: string; subject: { name: string }; obtainedMarks: number; maxMarks: number; percentage: number; grade: string; examDate: string }) => (
                    <tr key={m._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold">{m.testName}</td>
                      <td className="px-4 py-3 text-slate-300">{m.subject?.name}</td>
                      <td className="px-4 py-3 font-bold">{m.obtainedMarks} / {m.maxMarks}</td>
                      <td className="px-4 py-3 text-center font-bold text-indigo-300">{m.percentage}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                          {m.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(m.examDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "attendance" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl glass-panel p-6 shadow-xl border border-white/10">
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
              Attendance Register History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {attendance.slice(0, 30).map((a: { _id: string; date: string; status: string; remarks?: string }) => (
                    <tr key={a._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono">{formatDate(a.date)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize",
                          a.status === "present" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                            a.status === "late" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                              "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        )}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{a.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "topics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl glass-panel p-6 shadow-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                Extra Curriculum Concepts Taught
              </h3>
              <button
                onClick={() => setShowTopicModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-gradient text-xs font-bold text-white shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Topic
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="px-4 py-3">Topic Title</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Date Taught</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {topics.map((t: { _id: string; name: string; subject: { name: string }; category: string; completionStatus: string; dateTaught: string }) => (
                    <tr key={t._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold">{t.name}</td>
                      <td className="px-4 py-3 text-slate-300">{t.subject?.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">
                          {t.completionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(t.dateTaught)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "homework" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl glass-panel p-12 text-center text-slate-400">
            <BookMarked className="w-10 h-10 mx-auto opacity-30 mb-2" />
            <p className="text-xs">Homework and practice assignments assigned to this student</p>
          </motion.div>
        )}
      </div>

      {/* RECORD MARK MODAL */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/15">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Record Test Score</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase">Subject</label>
                <select value={newMark.subject} onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })} className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1">
                  <option value="" className="bg-slate-900">Select Subject</option>
                  {lookups?.subjects.map((s: { _id: string; name: string }) => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase">Test Title</label>
                <input value={newMark.testName} onChange={(e) => setNewMark({ ...newMark, testName: e.target.value })} placeholder="e.g. Unit Test 3" className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase">Obtained</label>
                  <input type="number" value={newMark.obtainedMarks} onChange={(e) => setNewMark({ ...newMark, obtainedMarks: parseFloat(e.target.value) || 0 })} className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase">Max</label>
                  <input type="number" value={newMark.maxMarks} onChange={(e) => setNewMark({ ...newMark, maxMarks: parseFloat(e.target.value) || 0 })} className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase">Exam Date</label>
                <input type="date" value={newMark.examDate} onChange={(e) => setNewMark({ ...newMark, examDate: e.target.value })} className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowMarkModal(false)} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">Cancel</button>
              <button onClick={() => addMarkMutation.mutate()} disabled={addMarkMutation.isPending} className="rounded-xl btn-gradient px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer">Save Score</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ADD TOPIC MODAL */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/15">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Add Extra Curriculum Topic</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase">Subject</label>
                <select value={newTopic.subject} onChange={(e) => setNewTopic({ ...newTopic, subject: e.target.value })} className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1">
                  <option value="" className="bg-slate-900">Select Subject</option>
                  {lookups?.subjects.map((s: { _id: string; name: string }) => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase">Topic Title</label>
                <input value={newTopic.name} onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })} placeholder="e.g. Olympiad Short Cuts" className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase">Category</label>
                <select value={newTopic.category} onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })} className="w-full rounded-xl glass-input p-2.5 text-xs text-white mt-1">
                  {["HOTS Questions", "NCERT Exemplar", "Previous Year Questions", "Olympiad Questions", "Advanced Numerical Problems", "Practical Applications", "Mental Ability", "Competitive Exam Topics"].map((c) => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowTopicModal(false)} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">Cancel</button>
              <button onClick={() => addTopicMutation.mutate()} disabled={addTopicMutation.isPending} className="rounded-xl btn-gradient px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer">Add Topic</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
