"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, Plus, Pin, Globe, Lock, Trash2, Calendar } from "lucide-react";
import axios from "axios";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", category: "exam_notice", isPinned: false, visibility: ["public", "students"] });

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => (await axios.get("/api/notices")).data.data,
  });

  const createNotice = useMutation({
    mutationFn: async () => axios.post("/api/notices", formData),
    onSuccess: () => {
      toast.success("Notice published!");
      setShowModal(false);
      setFormData({ title: "", content: "", category: "exam_notice", isPinned: false, visibility: ["public", "students"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: () => toast.error("Failed to publish notice"),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Notice Board</h1>
          <p className="text-sm text-muted-foreground">Publish and manage institute updates, exam alerts, and holiday announcements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Post Notice
        </button>
      </div>

      {/* Grid of Notices */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))
        ) : notices.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground rounded-2xl border border-border bg-background">
            <Bell className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No notices published yet</p>
          </div>
        ) : (
          notices.map((notice: { _id: string; title: string; content: string; category: string; isPinned: boolean; publishedAt: string }) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm flex items-start justify-between gap-4 card-hover"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-[11px] font-semibold">
                      <Pin className="h-3 w-3" /> Pinned
                    </span>
                  )}
                  <span className="rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[11px] font-semibold capitalize">
                    {notice.category.replace("_", " ")}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-base">{notice.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{notice.content}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                  <Calendar className="h-3 w-3" /> Published on {formatDate(notice.publishedAt)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Post New Notice</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title *</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Schedule for Pre-Board Examination" className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm">
                  <option value="exam_notice">Exam Notice</option>
                  <option value="institute_news">Institute News</option>
                  <option value="holiday">Holiday</option>
                  <option value="neet_update">NEET Update</option>
                  <option value="jee_update">JEE Update</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Notice Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={3} placeholder="Enter full announcement details" className="w-full rounded-xl border border-border bg-background p-2.5 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input type="checkbox" checked={formData.isPinned} onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })} className="rounded border-border" />
                Pin to top of public dashboard & notices
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={() => createNotice.mutate()} disabled={createNotice.isPending} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">Publish</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
