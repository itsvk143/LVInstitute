"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookMarked, Plus, Search, Calendar, User, BookOpen } from "lucide-react";
import axios from "axios";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HomeworkPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ student: "", subject: "", title: "", description: "", dueDate: new Date().toISOString().split("T")[0] });

  const { data: lookups } = useQuery({
    queryKey: ["lookups"],
    queryFn: async () => (await axios.get("/api/lookups")).data.data,
  });

  const { data: studentsData } = useQuery({
    queryKey: ["students-for-hw"],
    queryFn: async () => (await axios.get("/api/students?limit=50")).data,
  });

  const { data: homeworkList = [], isLoading } = useQuery({
    queryKey: ["homework"],
    queryFn: async () => (await axios.get("/api/homework")).data.data,
  });

  const createHomework = useMutation({
    mutationFn: async () => axios.post("/api/homework", formData),
    onSuccess: () => {
      toast.success("Homework assignment created!");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["homework"] });
    },
    onError: () => toast.error("Failed to create homework"),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Homework & Assignments</h1>
          <p className="text-sm text-muted-foreground">Assign, track and verify daily practice questions and worksheets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Assign Homework
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))
        ) : homeworkList.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground rounded-2xl border border-border bg-background">
            <BookMarked className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No homework assigned yet</p>
          </div>
        ) : (
          homeworkList.map((hw: { _id: string; title: string; description?: string; student?: { name: string; admissionNumber: string }; subject?: { name: string }; dueDate: string; status: string }) => (
            <motion.div key={hw._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-background p-5 shadow-sm card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-xs font-semibold">
                    {hw.subject?.name}
                  </span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                    hw.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}>
                    {hw.status || "Pending"}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-foreground text-sm">{hw.title}</h3>
                {hw.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{hw.description}</p>}
                {hw.student && (
                  <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> {hw.student.name} ({hw.student.admissionNumber})
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Due by {formatDate(hw.dueDate)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Homework Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Assign Homework</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Select Student *</label>
                <select value={formData.student} onChange={(e) => setFormData({ ...formData, student: e.target.value })} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm">
                  <option value="">Select Student</option>
                  {studentsData?.data?.map((s: { _id: string; name: string; admissionNumber: string }) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Select Subject *</label>
                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm">
                  <option value="">Select Subject</option>
                  {lookups?.subjects?.map((s: { _id: string; name: string }) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title / Assignment Name *</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Exercise 4.2 Problems 1 to 10" className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description / Instructions</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="Solve all sub-parts with neat steps" className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Due Date *</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={() => createHomework.mutate()} disabled={createHomework.isPending} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">Assign</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
