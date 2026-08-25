"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { School as SchoolIcon, Plus, Search, MapPin, Sparkles } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function SchoolsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", city: "", state: "", country: "India" });

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["schools", search],
    queryFn: async () => {
      const res = await axios.get(`/api/schools?search=${search}`);
      return res.data.data;
    },
  });

  const createSchool = useMutation({
    mutationFn: async () => axios.post("/api/schools", formData),
    onSuccess: () => {
      toast.success("School branch added successfully!");
      setShowModal(false);
      setFormData({ name: "", code: "", city: "", state: "", country: "India" });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add school");
    },
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Student Schools & Locations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-indigo-300 font-bold">{schools.length}</span> schools attended by enrolled tuition students
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add School & Location
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by school name, city, code..."
          style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
          className="w-full py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl glass-panel" />
          ))
        ) : schools.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 rounded-3xl glass-panel">
            <SchoolIcon className="mx-auto h-10 w-10 text-indigo-400/50" />
            <p className="mt-3 text-sm font-semibold text-white">No schools found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or register a new affiliate branch</p>
          </div>
        ) : (
          schools.map((school: { _id: string; name: string; code?: string; city?: string; state?: string; country?: string }) => (
            <motion.div
              key={school._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass-panel p-6 shadow-xl card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 border border-white/20">
                    <SchoolIcon className="h-6 w-6" />
                  </div>
                  {school.code && (
                    <span className="font-mono text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-semibold text-cyan-300">
                      {school.code}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-base text-white">{school.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  {[school.city, school.state, school.country].filter(Boolean).join(", ") || "Location not set"}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add School Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/15">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Add School Branch</h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">School Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Delhi Public School" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Code (Optional)</label>
                <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="DPS-ND" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">City</label>
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="New Delhi" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Country</label>
                  <input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="India" className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button onClick={() => setShowModal(false)} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => createSchool.mutate()} disabled={createSchool.isPending} className="rounded-xl btn-gradient px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer">Save School</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
