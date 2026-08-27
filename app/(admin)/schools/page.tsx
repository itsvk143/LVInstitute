"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  School as SchoolIcon,
  Plus,
  Search,
  MapPin,
  Sparkles,
  Pencil,
  Trash2,
  X,
  Building2,
  Globe,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface SchoolItem {
  _id: string;
  name: string;
  code?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default function SchoolsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    state: "",
    country: "India",
  });

  // Fetch Schools
  const { data: schools = [], isLoading } = useQuery<SchoolItem[]>({
    queryKey: ["schools", search],
    queryFn: async () => {
      const res = await axios.get(`/api/schools?search=${search}`);
      return res.data.data;
    },
  });

  // Create or Update School Mutation
  const saveSchool = useMutation({
    mutationFn: async () => {
      if (editingSchool) {
        return axios.put(`/api/schools/${editingSchool._id}`, formData);
      }
      return axios.post("/api/schools", formData);
    },
    onSuccess: (res) => {
      toast.success(
        editingSchool
          ? "School details updated successfully!"
          : "School branch registered successfully!"
      );
      setShowModal(false);
      setEditingSchool(null);
      setFormData({ name: "", code: "", city: "", state: "", country: "India" });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      queryClient.invalidateQueries({ queryKey: ["lookups"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to save school");
    },
  });

  // Delete School Mutation
  const deleteSchool = useMutation({
    mutationFn: async (id: string) => axios.delete(`/api/schools/${id}`),
    onSuccess: () => {
      toast.success("School branch removed");
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      queryClient.invalidateQueries({ queryKey: ["lookups"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to delete school");
    },
  });

  // Handlers
  const handleOpenAdd = () => {
    setEditingSchool(null);
    setFormData({ name: "", code: "", city: "", state: "", country: "India" });
    setShowModal(true);
  };

  const handleOpenEdit = (school: SchoolItem) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      code: school.code || "",
      city: school.city || "",
      state: school.state || "",
      country: school.country || "India",
    });
    setShowModal(true);
  };

  const handleDelete = (school: SchoolItem) => {
    if (
      confirm(
        `Are you sure you want to delete "${school.name}"? Any mapped syllabus can still be reassigned.`
      )
    ) {
      deleteSchool.mutate(school._id);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <SchoolIcon className="w-5 h-5" />
            </span>
            <h1
              className="text-3xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Student Schools & Locations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 ml-1">
            <span className="text-cyan-300 font-bold">{schools.length}</span> schools & target programs attended by enrolled tuition students
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all hover:scale-105"
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

      {/* Grid of School Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl glass-panel" />
          ))
        ) : schools.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 rounded-3xl glass-panel shadow-xl">
            <SchoolIcon className="mx-auto h-10 w-10 text-indigo-400/50" />
            <p className="mt-3 text-sm font-semibold text-white">No schools found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or register a new affiliate school
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl btn-gradient px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + Add School
            </button>
          </div>
        ) : (
          schools.map((school) => (
            <motion.div
              key={school._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass-panel p-6 shadow-xl card-hover flex flex-col justify-between border border-white/10 hover:border-cyan-500/40 transition-all group relative"
            >
              <div>
                {/* Card Top: Icon, Code Badge, and Edit/Delete Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 border border-white/20">
                    <SchoolIcon className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {school.code && (
                      <span className="font-mono text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-semibold text-cyan-300">
                        {school.code}
                      </span>
                    )}

                    {/* Edit School Button */}
                    <button
                      onClick={() => handleOpenEdit(school)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Edit School"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete School Button */}
                    <button
                      onClick={() => handleDelete(school)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                      title="Delete School"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-bold text-base text-white group-hover:text-cyan-200 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {school.name}
                </h3>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">
                    {[school.city, school.state, school.country].filter(Boolean).join(", ") || "Location not set"}
                  </span>
                </p>
              </div>

              {/* Bottom Details */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  {school.country || "India"}
                </span>

                <button
                  onClick={() => handleOpenEdit(school)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                >
                  Edit Details ➔
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── Add / Edit School Modal ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-7 shadow-2xl border border-white/15 my-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {editingSchool ? "Edit School & Location" : "Add School & Location"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingSchool ? "Update school branch metadata" : "Register a new student institution"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  School / Program Name *
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Delhi Public School"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Short Code / Abbreviation
                </label>
                <input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. DPS"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    City / Campus *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. New Delhi"
                      style={{ paddingLeft: "2.25rem" }}
                      className="w-full rounded-xl glass-input py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    State / Region
                  </label>
                  <input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Delhi NCR"
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Country</label>
                <input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveSchool.mutate()}
                disabled={saveSchool.isPending || !formData.name}
                className="rounded-xl btn-gradient px-5 py-2 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {saveSchool.isPending
                  ? "Saving..."
                  : editingSchool
                  ? "Update School"
                  : "Save School & Location"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
