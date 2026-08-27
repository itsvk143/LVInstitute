"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  School,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Clock,
  Layers,
  GraduationCap,
  MapPin,
  Building2,
  SlidersHorizontal,
  FileText,
  Zap,
  CheckCircle2,
  ListPlus,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChapterItem {
  _id: string;
  name: string;
  chapterNumber: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours?: number;
  description?: string;
}

interface SubjectItem {
  _id: string;
  name: string;
  code?: string;
  color?: string;
  description?: string;
  class?: string | { _id: string; name: string; grade?: number };
  board?: string | { _id: string; name: string; code: string };
  school?: string | { _id: string; name: string; code?: string; city?: string };
  chapters?: ChapterItem[];
}

interface SchoolItem {
  _id: string;
  name: string;
  code?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface ClassItem {
  _id: string;
  name: string;
  grade?: number;
}

interface BulkChapterRow {
  name: string;
  chapterNumber: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
}

export default function SubjectsPage() {
  const queryClient = useQueryClient();

  // Active School Selection: 'all', 'global', or school._id
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all");
  // Active Class Selection: '' (all active classes) or class._id
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  // Accordion state for expanded subjects
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // ── School Creation Modal State ───────────────────────────────────────────
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    city: "",
    state: "",
    country: "India",
  });

  // ── Subject Creation / Edit Modal State ────────────────────────────────────
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    school: "",
    class: "",
    board: "",
    color: "#6366F1",
    description: "",
    initialChapters: "", // Paste chapters during subject creation
  });

  // ── Single Chapter Creation / Edit Modal State ─────────────────────────────
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterItem | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState("");
  const [chapterForm, setChapterForm] = useState({
    name: "",
    chapterNumber: 1,
    difficulty: "medium" as "easy" | "medium" | "hard",
    estimatedHours: 10,
    description: "",
  });

  // ── Bulk Chapter Modal State (Add All at Once) ────────────────────────────
  const [showBulkChapterModal, setShowBulkChapterModal] = useState(false);
  const [bulkActiveSubject, setBulkActiveSubject] = useState<SubjectItem | null>(null);
  const [bulkPasteText, setBulkPasteText] = useState("");
  const [bulkDefaultHours, setBulkDefaultHours] = useState(8);
  const [bulkDefaultDifficulty, setBulkDefaultDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // ── Lookups Query ─────────────────────────────────────────────────────────
  const { data: lookups } = useQuery({
    queryKey: ["lookups"],
    queryFn: async () => (await axios.get("/api/lookups")).data.data,
  });

  const schools: SchoolItem[] = lookups?.schools || [];
  const classes: ClassItem[] = lookups?.classes || [];

  // ── Subjects Query ────────────────────────────────────────────────────────
  const { data: subjects = [], isLoading } = useQuery<SubjectItem[]>({
    queryKey: ["subjects", selectedSchoolId, selectedClassFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSchoolId && selectedSchoolId !== "all") {
        params.set("school", selectedSchoolId);
      }
      if (selectedClassFilter) params.set("class", selectedClassFilter);
      if (search) params.set("search", search);

      const res = await axios.get(`/api/subjects?${params.toString()}`);
      return res.data.data;
    },
  });

  // Helper functions for safe ID extraction
  const getClassId = (s: SubjectItem): string => {
    if (!s.class) return "";
    if (typeof s.class === "object" && s.class !== null) {
      return String(s.class._id || "");
    }
    return String(s.class);
  };

  const getClassName = (s: SubjectItem): string => {
    if (s.class && typeof s.class === "object" && s.class !== null && s.class.name) {
      return s.class.name;
    }
    const cId = getClassId(s);
    const found = classes.find((c) => String(c._id) === String(cId));
    return found?.name || (cId ? `Class ${cId}` : "Unassigned Class");
  };

  const getBoardCode = (s: SubjectItem): string => {
    if (s.board && typeof s.board === "object" && s.board !== null && s.board.code) {
      return s.board.code;
    }
    const bId = typeof s.board === "object" && s.board !== null ? String(s.board._id) : String(s.board || "");
    const found = lookups?.boards?.find((b: { _id: string; code: string }) => String(b._id) === String(bId));
    return found?.code || "CBSE";
  };

  const getSchoolInfo = (s: SubjectItem): { name: string; city?: string } | null => {
    if (s.school && typeof s.school === "object" && s.school !== null && s.school.name) {
      return s.school;
    }
    const sId = typeof s.school === "object" && s.school !== null ? String(s.school._id) : String(s.school || "");
    if (!sId) return null;
    const found = schools.find((sc) => String(sc._id) === String(sId));
    return found ? { name: found.name, city: found.city } : null;
  };

  // ── Helper: Parse Bulk Pasted Text into Clean Chapter List ─────────────────
  const parseBulkChapters = (text: string, startingNumber: number = 1): BulkChapterRow[] => {
    if (!text || !text.trim()) return [];

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return lines.map((line, idx) => {
      // Clean leading prefixes like "1.", "1)", "Chapter 1:", "Unit 1 -", "1 -", etc.
      let cleaned = line
        .replace(/^(chapter|unit|ch\.?|lesson|module)\s*\d+[\s:\-–—\.]+/i, "")
        .replace(/^\d+[\.\)\:\-–—\s]+\s*/, "")
        .replace(/^[\-\•\*\–\—\>]\s*/, "")
        .trim();

      if (!cleaned) cleaned = line; // fallback if regex stripped everything

      return {
        name: cleaned,
        chapterNumber: startingNumber + idx,
        difficulty: bulkDefaultDifficulty,
        estimatedHours: bulkDefaultHours,
      };
    });
  };

  // ── School Mutation ───────────────────────────────────────────────────────
  const createSchool = useMutation({
    mutationFn: async () => axios.post("/api/schools", schoolForm),
    onSuccess: (res) => {
      toast.success("School & Location created successfully!");
      setShowSchoolModal(false);
      const newSchoolId = res.data.data?._id;
      if (newSchoolId) {
        setSelectedSchoolId(newSchoolId);
        if (showSubjectModal) {
          setSubjectForm((prev) => ({ ...prev, school: newSchoolId }));
        }
      }
      setSchoolForm({ name: "", city: "", state: "", country: "India" });
      queryClient.invalidateQueries({ queryKey: ["lookups"] });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create school");
    },
  });

  // ── Subject Mutations ─────────────────────────────────────────────────────
  const saveSubject = useMutation({
    mutationFn: async () => {
      if (editingSubject) {
        return axios.put(`/api/subjects/${editingSubject._id}`, subjectForm);
      }
      const res = await axios.post("/api/subjects", subjectForm);
      
      // If initial chapters were pasted during creation, bulk add them immediately
      if (subjectForm.initialChapters?.trim() && res.data.data?._id) {
        const parsed = parseBulkChapters(subjectForm.initialChapters, 1);
        if (parsed.length > 0) {
          await axios.post("/api/chapters", {
            subject: res.data.data._id,
            chapters: parsed,
          });
        }
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(editingSubject ? "Subject updated successfully!" : "New subject & syllabus created!");
      setShowSubjectModal(false);
      
      // Auto-switch to created subject's class and expand it
      if (subjectForm.class) {
        setSelectedClassFilter(subjectForm.class);
      }
      if (res.data.data?._id) {
        setExpandedSubject(res.data.data._id);
      }

      setEditingSubject(null);
      setSubjectForm({
        name: "",
        code: "",
        school: "",
        class: "",
        board: "",
        color: "#6366F1",
        description: "",
        initialChapters: "",
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to save subject");
    },
  });

  const deleteSubject = useMutation({
    mutationFn: async (id: string) => axios.delete(`/api/subjects/${id}`),
    onSuccess: () => {
      toast.success("Subject and mapped chapters deleted");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: () => toast.error("Failed to delete subject"),
  });

  // ── Bulk Chapters Mutation (Save All at Once) ─────────────────────────────
  const saveBulkChapters = useMutation({
    mutationFn: async () => {
      if (!bulkActiveSubject) throw new Error("No subject selected");
      const startingNum = (bulkActiveSubject.chapters?.length || 0) + 1;
      const parsed = parseBulkChapters(bulkPasteText, startingNum);
      
      if (parsed.length === 0) {
        throw new Error("Please enter or paste at least one chapter name");
      }

      return axios.post("/api/chapters", {
        subject: bulkActiveSubject._id,
        chapters: parsed,
      });
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "All chapters added to syllabus!");
      setShowBulkChapterModal(false);
      setBulkPasteText("");
      if (bulkActiveSubject) {
        setExpandedSubject(bulkActiveSubject._id);
      }
      setBulkActiveSubject(null);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to add chapters");
    },
  });

  // ── Single Chapter Mutations ──────────────────────────────────────────────
  const saveChapter = useMutation({
    mutationFn: async () => {
      if (editingChapter) {
        return axios.put(`/api/chapters/${editingChapter._id}`, chapterForm);
      }
      return axios.post("/api/chapters", { ...chapterForm, subject: activeSubjectId });
    },
    onSuccess: () => {
      toast.success(editingChapter ? "Chapter updated successfully!" : "Chapter added to curriculum!");
      setShowChapterModal(false);
      setEditingChapter(null);
      setChapterForm({ name: "", chapterNumber: 1, difficulty: "medium", estimatedHours: 10, description: "" });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to save chapter");
    },
  });

  const deleteChapter = useMutation({
    mutationFn: async (id: string) => axios.delete(`/api/chapters/${id}`),
    onSuccess: () => {
      toast.success("Chapter removed");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: () => toast.error("Failed to delete chapter"),
  });

  // ── Modal Open Handlers ───────────────────────────────────────────────────
  const handleOpenAddSubject = (preselectedClassId?: string) => {
    setEditingSubject(null);
    setSubjectForm({
      name: "",
      code: "",
      school: selectedSchoolId !== "all" && selectedSchoolId !== "global" ? selectedSchoolId : "",
      class: preselectedClassId || selectedClassFilter || (classes[0]?._id ?? ""),
      board: lookups?.boards?.[0]?._id ?? "",
      color: "#6366F1",
      description: "",
      initialChapters: "",
    });
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (sub: SubjectItem) => {
    setEditingSubject(sub);
    const subSchoolId = typeof sub.school === "object" && sub.school !== null ? sub.school._id : String(sub.school || "");
    const subClassId = typeof sub.class === "object" && sub.class !== null ? sub.class._id : String(sub.class || "");
    const subBoardId = typeof sub.board === "object" && sub.board !== null ? sub.board._id : String(sub.board || "");

    setSubjectForm({
      name: sub.name,
      code: sub.code || "",
      school: subSchoolId,
      class: subClassId,
      board: subBoardId,
      color: sub.color || "#6366F1",
      description: sub.description || "",
      initialChapters: "",
    });
    setShowSubjectModal(true);
  };

  // Open Bulk Add Chapters Modal
  const handleOpenBulkAddChapters = (sub: SubjectItem) => {
    setBulkActiveSubject(sub);
    setBulkPasteText("");
    setShowBulkChapterModal(true);
  };

  const handleOpenAddChapter = (sub: SubjectItem) => {
    setActiveSubjectId(sub._id);
    setEditingChapter(null);
    const nextNum = (sub.chapters?.length || 0) + 1;
    setChapterForm({
      name: "",
      chapterNumber: nextNum,
      difficulty: "medium",
      estimatedHours: 10,
      description: "",
    });
    setShowChapterModal(true);
  };

  const handleOpenEditChapter = (subId: string, ch: ChapterItem) => {
    setActiveSubjectId(subId);
    setEditingChapter(ch);
    setChapterForm({
      name: ch.name,
      chapterNumber: ch.chapterNumber,
      difficulty: ch.difficulty || "medium",
      estimatedHours: ch.estimatedHours || 10,
      description: ch.description || "",
    });
    setShowChapterModal(true);
  };

  // ── Calculate count of subjects per class ────────────────────────────────
  const classSubjectCountMap = new Map<string, number>();
  for (const s of subjects) {
    const cId = getClassId(s);
    if (cId) {
      classSubjectCountMap.set(cId, (classSubjectCountMap.get(cId) || 0) + 1);
    }
  }

  // ── Organize subjects by class ───────────────────────────────────────────
  const subjectsByClass: Record<string, { classInfo: ClassItem; subjects: SubjectItem[] }> = {};

  for (const s of subjects) {
    const cId = getClassId(s);
    if (cId) {
      if (!subjectsByClass[cId]) {
        const found = classes.find((c) => String(c._id) === String(cId));
        subjectsByClass[cId] = {
          classInfo: {
            _id: cId,
            name: found?.name || getClassName(s),
            grade: found?.grade,
          },
          subjects: [],
        };
      }
      subjectsByClass[cId].subjects.push(s);
    }
  }

  if (selectedClassFilter && !subjectsByClass[selectedClassFilter]) {
    const found = classes.find((c) => String(c._id) === String(selectedClassFilter));
    if (found) {
      subjectsByClass[selectedClassFilter] = {
        classInfo: found,
        subjects: [],
      };
    }
  }

  // Filter available classes to ONLY those that have subjects in the current view/scope
  const visibleClassesForScope = classes.filter((c) => {
    const count = classSubjectCountMap.get(c._id) || 0;
    return count > 0 || selectedClassFilter === c._id;
  });

  const displayedClasses = visibleClassesForScope.length > 0 ? visibleClassesForScope : classes;

  const activeSchoolObj = schools.find((s) => String(s._id) === String(selectedSchoolId));
  const activeClassObj = classes.find((c) => String(c._id) === String(selectedClassFilter));

  const parsedBulkPreview = bulkActiveSubject
    ? parseBulkChapters(bulkPasteText, (bulkActiveSubject.chapters?.length || 0) + 1)
    : [];

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Tuition Curriculum & Syllabi
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 ml-1">
            Hierarchy: <span className="text-cyan-300 font-bold">School & Location</span> ➔{" "}
            <span className="text-indigo-300 font-bold">Class</span> ➔{" "}
            <span className="text-amber-300 font-bold">Subjects</span> ➔{" "}
            <span className="text-emerald-300 font-bold">Chapters</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSchoolModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 px-3.5 py-2.5 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-cyan-400" /> Add School & Location
          </button>

          <button
            onClick={() => handleOpenAddSubject(selectedClassFilter)}
            className="inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* ── Control Center: School Dropdown, Class Dropdown & Search ───────── */}
      <div className="rounded-3xl glass-panel p-5 shadow-xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span>Curriculum Scope & Hierarchy Controls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Student's School & Location Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. Student&apos;s School & Location</span>
            </label>
            <select
              value={selectedSchoolId}
              onChange={(e) => {
                if (e.target.value === "__NEW_SCHOOL__") {
                  setShowSchoolModal(true);
                } else {
                  setSelectedSchoolId(e.target.value);
                  setSelectedClassFilter(""); // Reset class filter to prevent stale 0-count view
                }
              }}
              className="w-full py-2.5 px-3.5 rounded-xl glass-input text-xs text-white font-medium cursor-pointer"
            >
              <option value="__NEW_SCHOOL__" className="font-bold text-cyan-400 bg-slate-900">
                ✨ + Add New School & Location...
              </option>
              <option value="all" className="bg-slate-900">
                📚 All Schools Combined
              </option>
              <option value="global" className="bg-slate-900">
                🌐 General / Shared Tuition Syllabus
              </option>
              {schools.map((s) => (
                <option key={s._id} value={s._id} className="bg-slate-900">
                  🏫 {s.name} {s.city ? `(${s.city})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Class Selector Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Select Class</span>
            </label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl glass-input text-xs text-white font-medium cursor-pointer"
            >
              <option value="" className="bg-slate-900">
                🎓 All Classes in this Program ({subjects.length} Subjects Total)
              </option>
              {displayedClasses.map((c) => {
                const count = classSubjectCountMap.get(c._id) || 0;
                return (
                  <option key={c._id} value={c._id} className="bg-slate-900">
                    {c.name} {count > 0 ? `(${count} subjects)` : "(0 subjects)"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 3. Search Bar */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search Subjects / Chapters</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects or chapters..."
                style={{ paddingLeft: "2.5rem", paddingRight: "1rem" }}
                className="w-full py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Fast-Switch Class Pills Bar */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>Direct Class Navigation Tabs:</span>
            {selectedClassFilter && (
              <button
                onClick={() => setSelectedClassFilter("")}
                className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
              >
                Clear filter (View all classes)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedClassFilter("")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all cursor-pointer border flex items-center gap-1.5",
                selectedClassFilter === ""
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <Sparkles className="w-3 h-3 text-indigo-300" />
              All Classes ({subjects.length})
            </button>

            {displayedClasses.map((c) => {
              const count = classSubjectCountMap.get(c._id) || 0;
              const isSelected = selectedClassFilter === c._id;
              return (
                <button
                  key={c._id}
                  onClick={() => setSelectedClassFilter(c._id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all cursor-pointer border flex items-center gap-1.5",
                    isSelected
                      ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                      : count > 0
                      ? "bg-white/5 text-slate-200 border-white/15 hover:bg-white/10"
                      : "bg-white/[0.02] text-slate-500 border-white/5 hover:text-slate-300"
                  )}
                >
                  <span>{c.name}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                      isSelected
                        ? "bg-black/30 text-cyan-200"
                        : count > 0
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-white/5 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Class & Subjects Cards Grid ────────────────────────────────────── */}
      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl glass-panel" />
          ))
        ) : Object.keys(subjectsByClass).length === 0 ? (
          <div className="py-16 text-center text-slate-400 rounded-3xl glass-panel shadow-xl">
            <GraduationCap className="mx-auto h-12 w-12 text-indigo-400/50" />
            <p className="mt-3 text-base font-bold text-white">
              {selectedClassFilter
                ? `No subjects created for ${activeClassObj?.name || "this class"} yet`
                : "No subjects found for this selection"}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click below to add a subject (e.g. English, Mathematics, Physics) to this class.
            </p>
            <button
              onClick={() => handleOpenAddSubject(selectedClassFilter)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Subject to {selectedClassFilter ? activeClassObj?.name || "Class" : "Curriculum"}
            </button>
          </div>
        ) : (
          Object.values(subjectsByClass).map(({ classInfo, subjects: classSubjects }) => {
            return (
              <div
                key={classInfo._id}
                className="rounded-3xl glass-panel p-5 sm:p-6 shadow-xl border border-white/10 space-y-4"
              >
                {/* Class Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                          {classInfo.name}
                        </h2>
                        <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          {classSubjects.length} {classSubjects.length === 1 ? "Subject" : "Subjects"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedSchoolId === "all"
                          ? `Tuition curriculum for ${classInfo.name}`
                          : `Syllabus for ${classInfo.name} students of ${activeSchoolObj?.name || "Selected School"}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAddSubject(classInfo._id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white border border-indigo-500/30 px-3.5 py-2 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Subject to {classInfo.name}
                  </button>
                </div>

                {/* Subjects Grid under this Class */}
                {classSubjects.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
                    <BookOpen className="mx-auto h-7 w-7 text-slate-600 mb-1" />
                    <p className="text-xs font-medium text-slate-300">No subjects added to {classInfo.name} yet.</p>
                    <button
                      onClick={() => handleOpenAddSubject(classInfo._id)}
                      className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      + Click here to add a subject to {classInfo.name}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {classSubjects.map((sub) => {
                      const isExpanded = expandedSubject === sub._id;
                      const chapters = sub.chapters || [];
                      const themeColor = sub.color || "#6366F1";
                      const schoolInfo = getSchoolInfo(sub);
                      const boardCode = getBoardCode(sub);

                      return (
                        <motion.div
                          key={sub._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl glass-panel shadow-md border border-white/10 overflow-hidden transition-all"
                        >
                          {/* Subject Header Row */}
                          <div
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
                            style={{ borderLeft: `5px solid ${themeColor}` }}
                            onClick={() => setExpandedSubject(isExpanded ? null : sub._id)}
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm shadow-md border border-white/20 flex-shrink-0"
                                style={{
                                  backgroundColor: themeColor,
                                  boxShadow: `0 6px 16px -4px ${themeColor}60`,
                                }}
                              >
                                <BookOpen className="h-5 w-5" />
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-bold text-lg text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                                    {sub.name}
                                  </h3>
                                  {sub.code && (
                                    <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-indigo-300 font-semibold">
                                      {sub.code}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                  <span className="font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                    {boardCode}
                                  </span>

                                  {schoolInfo ? (
                                    <span className="inline-flex items-center gap-1 font-medium text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                      <School className="w-3 h-3 text-cyan-400" />
                                      {schoolInfo.name} {schoolInfo.city ? `(${schoolInfo.city})` : ""}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                      <Sparkles className="w-3 h-3 text-emerald-400" />
                                      All Schools
                                    </span>
                                  )}

                                  <span className="text-slate-300 font-bold">• {chapters.length} Chapters</span>
                                </div>
                              </div>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap" onClick={(e) => e.stopPropagation()}>
                              {/* ⚡ Quick Add All Chapters at Once */}
                              <button
                                onClick={() => handleOpenBulkAddChapters(sub)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer hover:scale-105 transition-all"
                                title="Paste all chapters for this subject at once"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span>Paste All Chapters</span>
                              </button>

                              <button
                                onClick={() => handleOpenAddChapter(sub)}
                                className="inline-flex items-center gap-1 rounded-xl btn-gradient px-3 py-1.5 text-xs font-bold text-white shadow cursor-pointer hover:scale-105 transition-transform"
                                title="Add Single Chapter"
                              >
                                <Plus className="w-3.5 h-3.5" /> +1 Chapter
                              </button>

                              <button
                                onClick={() => handleOpenEditSubject(sub)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                title="Edit Subject"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete subject "${sub.name}" and all ${chapters.length} chapters?`)) {
                                    deleteSubject.mutate(sub._id);
                                  }
                                }}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                                title="Delete Subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setExpandedSubject(isExpanded ? null : sub._id)}
                                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Level 4: Expanded Chapters Grid */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="border-t border-white/10 bg-slate-950/40 p-4 sm:p-5"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-indigo-400" />
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                      Chapters under {sub.name} ({chapters.length})
                                    </h4>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleOpenBulkAddChapters(sub)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer"
                                    >
                                      <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                      + Paste Multiple Chapters
                                    </button>

                                    <button
                                      onClick={() => handleOpenAddChapter(sub)}
                                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> +1 Chapter
                                    </button>
                                  </div>
                                </div>

                                {chapters.length === 0 ? (
                                  <div className="py-8 text-center text-slate-400 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
                                    <FileText className="mx-auto h-8 w-8 text-slate-600" />
                                    <div>
                                      <p className="text-xs font-bold text-white">No chapters added yet to this subject.</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        You can paste your entire syllabus list at once or add chapters one by one.
                                      </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 pt-1">
                                      <button
                                        onClick={() => handleOpenBulkAddChapters(sub)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer hover:opacity-95"
                                      >
                                        <Zap className="w-4 h-4 fill-white" />
                                        ⚡ Paste Entire Syllabus at Once
                                      </button>
                                      <button
                                        onClick={() => handleOpenAddChapter(sub)}
                                        className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs font-bold text-slate-300 cursor-pointer"
                                      >
                                        + Add Single Chapter
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                    {chapters.map((ch) => (
                                      <div
                                        key={ch._id}
                                        className="flex items-center justify-between rounded-xl glass-panel p-3 shadow-xs hover:border-indigo-500/40 transition-all group"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-indigo-300">
                                            {ch.chapterNumber}
                                          </span>
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition-colors">
                                              {ch.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span
                                                className={cn(
                                                  "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                                                  ch.difficulty === "easy"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : ch.difficulty === "hard"
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                )}
                                              >
                                                {ch.difficulty || "medium"}
                                              </span>
                                              {ch.estimatedHours && (
                                                <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                                  <Clock className="w-2.5 h-2.5" /> {ch.estimatedHours}h
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() => handleOpenEditChapter(sub._id, ch)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                            title="Edit Chapter"
                                          >
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (confirm(`Remove chapter "${ch.name}"?`)) {
                                                deleteChapter.mutate(ch._id);
                                              }
                                            }}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Delete Chapter"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL: ⚡ BULK ADD / PASTE ALL CHAPTERS AT ONCE ─────────────────── */}
      {showBulkChapterModal && bulkActiveSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/15 my-8 space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Zap className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                    Quick Add All Chapters at Once
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Subject: <span className="text-indigo-300 font-bold">{bulkActiveSubject.name}</span> •{" "}
                    Class: <span className="text-cyan-300 font-bold">{getClassName(bulkActiveSubject)}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBulkChapterModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Tip */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">Copy & Paste your chapter list directly below.</strong> You can paste from a PDF, WhatsApp, or textbook list (e.g. <em>1. Real Numbers</em> or <em>Polynomials</em>, one per line). Numbering will be cleaned and auto-indexed automatically!
              </p>
            </div>

            {/* Paste Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 block">
                  Paste Chapter Names (One per line) *
                </label>
                <span className="text-[11px] font-bold text-amber-400">
                  {parsedBulkPreview.length} {parsedBulkPreview.length === 1 ? "Chapter" : "Chapters"} detected
                </span>
              </div>
              
              <textarea
                value={bulkPasteText}
                onChange={(e) => setBulkPasteText(e.target.value)}
                placeholder={`1. Real Numbers\n2. Polynomials\n3. Pair of Linear Equations in Two Variables\n4. Quadratic Equations\n5. Arithmetic Progressions\n6. Triangles\n7. Coordinate Geometry\n8. Introduction to Trigonometry\n9. Some Applications of Trigonometry\n10. Circles\n11. Areas Related to Circles\n12. Surface Areas and Volumes\n13. Statistics\n14. Probability`}
                rows={8}
                className="w-full rounded-2xl glass-input p-4 text-xs sm:text-sm text-white font-mono placeholder:font-sans placeholder:text-slate-500 resize-y border border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {/* Defaults Configuration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Default Estimated Hours (per chapter)
                </label>
                <input
                  type="number"
                  value={bulkDefaultHours}
                  onChange={(e) => setBulkDefaultHours(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl glass-input px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Default Difficulty Level
                </label>
                <select
                  value={bulkDefaultDifficulty}
                  onChange={(e) => setBulkDefaultDifficulty(e.target.value as "easy" | "medium" | "hard")}
                  className="w-full rounded-xl glass-input px-3 py-2 text-xs text-white cursor-pointer"
                >
                  <option value="easy" className="bg-slate-900">Easy</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="hard" className="bg-slate-900">Hard</option>
                </select>
              </div>
            </div>

            {/* Live Parsed Preview */}
            {parsedBulkPreview.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-200">Parsed Chapters Live Preview:</span>
                  <span>Will be mapped starting from Chapter #{(bulkActiveSubject.chapters?.length || 0) + 1}</span>
                </div>

                <div className="max-h-40 overflow-y-auto rounded-xl bg-slate-950/60 p-2.5 border border-white/10 space-y-1.5 scrollbar-thin">
                  {parsedBulkPreview.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/[0.03] border border-white/5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                          {ch.chapterNumber}
                        </span>
                        <span className="text-white font-medium truncate">{ch.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{ch.estimatedHours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowBulkChapterModal(false)}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => saveBulkChapters.mutate()}
                disabled={saveBulkChapters.isPending || parsedBulkPreview.length === 0}
                className="rounded-xl btn-gradient px-6 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {saveBulkChapters.isPending
                    ? "Saving All Chapters..."
                    : `Save All (${parsedBulkPreview.length}) Chapters`}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: Create New School & Location ──────────────────────────────── */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-7 shadow-2xl border border-white/15"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Create School & Location
                </h3>
                <p className="text-xs text-slate-400">
                  Add student&apos;s school with campus location
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">School Name *</label>
                <input
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  placeholder="e.g. The Mother's International School"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">City / Campus Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                      value={schoolForm.city}
                      onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                      placeholder="e.g. New Delhi"
                      style={{ paddingLeft: "2.25rem" }}
                      className="w-full rounded-xl glass-input py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">State / Region</label>
                  <input
                    value={schoolForm.state}
                    onChange={(e) => setSchoolForm({ ...schoolForm, state: e.target.value })}
                    placeholder="e.g. Delhi NCR"
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Country</label>
                <input
                  value={schoolForm.country}
                  onChange={(e) => setSchoolForm({ ...schoolForm, country: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={() => setShowSchoolModal(false)}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => createSchool.mutate()}
                disabled={createSchool.isPending || !schoolForm.name}
                className="rounded-xl btn-gradient px-5 py-2 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {createSchool.isPending ? "Creating..." : "Save School & Location"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: Create / Edit Subject (With One-Click Initial Chapters) ──── */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/15 my-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {editingSubject ? "Edit Subject & Mapping" : "Create New Subject"}
                </h3>
                <p className="text-xs text-slate-400">
                  Map under: <span className="text-cyan-300 font-semibold">School</span> ➔{" "}
                  <span className="text-indigo-300 font-semibold">Class</span> ➔{" "}
                  <span className="text-white font-semibold">Subject</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Step 1: School & Location Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    1. Select Student&apos;s School & Location
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSchoolModal(true)}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    + Add New School
                  </button>
                </div>
                <select
                  value={subjectForm.school}
                  onChange={(e) => {
                    if (e.target.value === "__NEW_SCHOOL__") {
                      setShowSchoolModal(true);
                    } else {
                      setSubjectForm({ ...subjectForm, school: e.target.value });
                    }
                  }}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer"
                >
                  <option value="__NEW_SCHOOL__" className="font-bold text-cyan-400 bg-slate-900">
                    ✨ + Add New School & Location...
                  </option>
                  <option value="" className="bg-slate-900">
                    🌐 All Schools (General / Shared Tuition Syllabus)
                  </option>
                  {schools.map((s) => (
                    <option key={s._id} value={s._id} className="bg-slate-900">
                      🏫 {s.name} {s.city ? `(${s.city})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Class & Board Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">2. Class *</label>
                  <select
                    value={subjectForm.class}
                    onChange={(e) => setSubjectForm({ ...subjectForm, class: e.target.value })}
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">Select Class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id} className="bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">3. Board *</label>
                  <select
                    value={subjectForm.board}
                    onChange={(e) => setSubjectForm({ ...subjectForm, board: e.target.value })}
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">Select Board</option>
                    {lookups?.boards?.map((b: { _id: string; name: string; code: string }) => (
                      <option key={b._id} value={b._id} className="bg-slate-900">
                        {b.code} ({b.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Subject Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">4. Subject Name *</label>
                  <input
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Subject Code</label>
                  <input
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    placeholder="01"
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white uppercase"
                  />
                </div>
              </div>

              {/* Step 4: Accent Color */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">5. Theme Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={subjectForm.color}
                    onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                    className="w-12 h-10 rounded-xl border border-white/20 bg-transparent p-1 cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#06B6D4", "#8B5CF6", "#3B82F6"].map((hex) => (
                      <button
                        type="button"
                        key={hex}
                        onClick={() => setSubjectForm({ ...subjectForm, color: hex })}
                        style={{ backgroundColor: hex }}
                        className="w-6 h-6 rounded-full border border-white/30 cursor-pointer transition-transform hover:scale-110"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional: Add all chapters right now during creation */}
              {!editingSubject && (
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Quick Add Chapters (Optional - Paste list one per line)</span>
                  </label>
                  <textarea
                    value={subjectForm.initialChapters}
                    onChange={(e) => setSubjectForm({ ...subjectForm, initialChapters: e.target.value })}
                    placeholder="1. Real Numbers&#10;2. Polynomials&#10;3. Quadratic Equations..."
                    rows={4}
                    className="w-full rounded-xl glass-input p-3 text-xs text-white placeholder-slate-500 font-mono resize-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-7 flex justify-end gap-2.5">
              <button
                onClick={() => setShowSubjectModal(false)}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => saveSubject.mutate()}
                disabled={saveSubject.isPending || !subjectForm.name || !subjectForm.class || !subjectForm.board}
                className="rounded-xl btn-gradient px-5 py-2 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {saveSubject.isPending ? "Saving..." : editingSubject ? "Update Subject" : "Create Subject & Chapters"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: Single Chapter Create / Edit ─────────────────────────────── */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/15"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {editingChapter ? "Edit Chapter Details" : "Add Chapter to Curriculum"}
                </h3>
                <p className="text-xs text-slate-400">
                  Instantly mapped to all matching student dashboards
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Chapter Title *</label>
                <input
                  value={chapterForm.name}
                  onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                  placeholder="e.g. Quadratic Equations & Roots"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Chapter Number *</label>
                  <input
                    type="number"
                    value={chapterForm.chapterNumber}
                    onChange={(e) =>
                      setChapterForm({ ...chapterForm, chapterNumber: parseInt(e.target.value) || 1 })
                    }
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Difficulty Level</label>
                  <select
                    value={chapterForm.difficulty}
                    onChange={(e) =>
                      setChapterForm({
                        ...chapterForm,
                        difficulty: e.target.value as "easy" | "medium" | "hard",
                      })
                    }
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="easy" className="bg-slate-900">Easy</option>
                    <option value="medium" className="bg-slate-900">Medium</option>
                    <option value="hard" className="bg-slate-900">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Estimated Hours</label>
                <input
                  type="number"
                  value={chapterForm.estimatedHours}
                  onChange={(e) =>
                    setChapterForm({ ...chapterForm, estimatedHours: parseInt(e.target.value) || 1 })
                  }
                  placeholder="e.g. 10"
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Description / Key Notes</label>
                <textarea
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="Key concepts, syllabus focus, formulas..."
                  rows={3}
                  className="w-full rounded-xl glass-input px-3.5 py-2 text-xs text-white resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={() => setShowChapterModal(false)}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => saveChapter.mutate()}
                disabled={saveChapter.isPending || !chapterForm.name}
                className="rounded-xl btn-gradient px-5 py-2 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {editingChapter ? "Update Chapter" : "Save Chapter"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
