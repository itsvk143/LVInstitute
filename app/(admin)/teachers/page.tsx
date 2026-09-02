"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Search, Mail, Phone, Sparkles, Globe, ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function TeachersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", qualification: "", specialization: "" });

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers", search],
    queryFn: async () => {
      const res = await axios.get(`/api/teachers?search=${search}`);
      return res.data.data;
    },
  });

  const createTeacher = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        specialization: formData.specialization.split(",").map((s) => s.trim()).filter(Boolean),
      };
      return axios.post("/api/teachers", payload);
    },
    onSuccess: () => {
      toast.success("Teacher added successfully!");
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", qualification: "", specialization: "" });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add teacher");
    },
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Faculty & Mentors
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-indigo-300 font-bold">{teachers.length}</span> faculty members registered and guiding students
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, specialization..."
          style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
          className="w-full py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
        />
      </div>

      {/* Teacher Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl glass-panel" />
          ))
        ) : teachers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 rounded-3xl glass-panel">
            <GraduationCap className="mx-auto h-10 w-10 text-indigo-400/50" />
            <p className="mt-3 text-sm font-semibold text-white">No teachers found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or enroll a new faculty member</p>
          </div>
        ) : (
          teachers.map((teacher: { _id: string; name: string; email: string; phone: string; qualification?: string; specialization?: string[]; website?: string }) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass-panel p-6 shadow-xl card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 border border-white/20">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{teacher.name}</h3>
                      <p className="text-xs text-indigo-300 font-medium">{teacher.qualification || "Faculty Member"}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5">
                    Active
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-indigo-400" /> {teacher.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-teal-400" /> {teacher.phone}
                  </p>
                  {teacher.website && (
                    <p className="flex items-center gap-2">
                      <a
                        href={teacher.website.startsWith("http") ? teacher.website : `https://${teacher.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 hover:underline font-medium"
                      >
                        <Globe className="h-3.5 w-3.5 text-purple-400" />
                        <span>{teacher.website.replace(/^https?:\/\//, "")}</span>
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {teacher.specialization && teacher.specialization.length > 0 && (
                <div className="mt-5 border-t border-white/10 pt-3.5 flex flex-wrap gap-1.5">
                  {teacher.specialization.map((s: string, idx: number) => (
                    <span key={idx} className="rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  href={`/mentors/${teacher._id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>View Detailed Profile & Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/15">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Add New Teacher</h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Mr. Vikash Kumar (CVK Sir)" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Email Address *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="itsvikash143@gmail.com" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Phone Number *</label>
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 8457876843" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Website / Portfolio</label>
                <input value={(formData as any).website || ""} onChange={(e) => setFormData({ ...formData, ...( { website: e.target.value } as any) })} placeholder="e.g. www.cvksir.in" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Qualifications</label>
                <input value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} placeholder="e.g. Senior Chemistry Lecturer (10+ Yrs Exp, Ex-Aakash)" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Specializations (comma separated)</label>
                <input value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="Chemistry, Physical Chemistry, Organic Chemistry" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button onClick={() => setShowModal(false)} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => createTeacher.mutate()} disabled={createTeacher.isPending} className="rounded-xl btn-gradient px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer">Save Teacher</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
