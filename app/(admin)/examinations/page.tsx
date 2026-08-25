"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock, BookOpen, Layers } from "lucide-react";
import axios from "axios";
import { formatDate, getDaysUntil, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ExaminationsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", examType: "unit_test", date: new Date().toISOString().split("T")[0], time: "10:00 AM", duration: 90, subjects: [] as string[] });

  const { data: lookups } = useQuery({
    queryKey: ["lookups"],
    queryFn: async () => (await axios.get("/api/lookups")).data.data,
  });

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["examinations"],
    queryFn: async () => (await axios.get("/api/examinations")).data.data,
  });

  const createExam = useMutation({
    mutationFn: async () => axios.post("/api/examinations", formData),
    onSuccess: () => {
      toast.success("Examination scheduled!");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
    },
    onError: () => toast.error("Failed to schedule exam"),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Examination Timetable</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage unit tests, quarterly, mock, and board exams</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Schedule Exam
        </button>
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))
        ) : exams.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground rounded-2xl border border-border bg-background">
            <Calendar className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No examinations scheduled</p>
          </div>
        ) : (
          exams.map((exam: { _id: string; name: string; examType: string; date: string; time?: string; duration?: number; subjects?: Array<{ _id: string; name: string }> }) => {
            const daysLeft = getDaysUntil(exam.date);
            return (
              <motion.div key={exam._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-background p-5 shadow-sm card-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-xs font-semibold uppercase">
                      {exam.examType.replace("_", " ")}
                    </span>
                    <div className={cn(
                      "rounded-lg px-2.5 py-1 text-center font-bold text-xs",
                      daysLeft <= 3 ? "bg-red-50 text-red-700" : daysLeft <= 7 ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
                    )}>
                      {daysLeft <= 0 ? "Today" : `${daysLeft}d left`}
                    </div>
                  </div>

                  <h3 className="mt-3 font-semibold text-foreground text-base">{exam.name}</h3>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {exam.subjects?.map((s) => (
                      <span key={s._id} className="rounded-md bg-slate-100 dark:bg-slate-800 text-muted-foreground px-2 py-0.5 text-[11px]">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(exam.date)}</span>
                  {exam.time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {exam.time}</span>}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Schedule Exam</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Exam Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Mathematics Pre-Board 1" className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Exam Type</label>
                <select value={formData.examType} onChange={(e) => setFormData({ ...formData, examType: e.target.value })} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm">
                  <option value="unit_test">Unit Test</option>
                  <option value="mid_term">Mid Term</option>
                  <option value="final">Final Exam</option>
                  <option value="mock">Mock Exam (NEET/JEE)</option>
                  <option value="olympiad">Olympiad</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Time</label>
                  <input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM" className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={() => createExam.mutate()} disabled={createExam.isPending} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">Schedule</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
