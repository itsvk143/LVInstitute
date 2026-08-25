"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, Search, BookOpen, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { formatDate, cn } from "@/lib/utils";

export default function AdditionalTopicsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["additional-topics-all"],
    queryFn: async () => (await axios.get("/api/additional-topics")).data.data,
  });

  const categories = [
    "HOTS Questions",
    "NCERT Exemplar",
    "Previous Year Questions",
    "Olympiad Questions",
    "Advanced Numerical Problems",
    "Practical Applications",
    "Mental Ability",
    "Competitive Exam Topics",
  ];

  const filteredTopics = topics.filter((t: { name: string; category?: string; student?: { name: string }; subject?: { name: string } }) => {
    const matchesCategory = categoryFilter ? t.category === categoryFilter : true;
    if (!search) return matchesCategory;
    const term = search.toLowerCase();
    return (
      matchesCategory &&
      (t.name.toLowerCase().includes(term) ||
        t.student?.name?.toLowerCase().includes(term) ||
        t.subject?.name?.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          Additional Topics Beyond Syllabus
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track advanced concepts, competitive questions, Olympiad preparation, and HOTS problems taught
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topic, student, or subject..."
            style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
            className="w-full py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl glass-input px-3.5 py-2.5 text-xs text-white cursor-pointer w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl glass-panel" />
          ))
        ) : filteredTopics.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 rounded-3xl glass-panel">
            <Sparkles className="mx-auto h-10 w-10 text-amber-400/50" />
            <p className="mt-3 text-sm font-semibold text-white">No additional topics recorded</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting category filter or search query</p>
          </div>
        ) : (
          filteredTopics.map((topic: { _id: string; name: string; category: string; student?: { _id: string; name: string; admissionNumber: string }; subject?: { name: string }; teacher?: { name: string }; completionStatus: string; revisionStatus: string; dateTaught: string }) => (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass-panel p-6 shadow-xl card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 text-[11px] font-semibold">
                    {topic.category}
                  </span>
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize",
                    topic.completionStatus === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {topic.completionStatus}
                  </span>
                </div>

                <h3 className="mt-3.5 font-bold text-white text-sm line-clamp-2">{topic.name}</h3>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" /> {topic.subject?.name || "General"}
                  </p>
                  {topic.student && (
                    <p className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-teal-400" />
                      <Link href={`/students/${topic.student._id}`} className="hover:text-indigo-400 font-semibold text-slate-200 transition-colors">
                        {topic.student.name} <span className="text-indigo-300/80 font-mono text-[11px]">({topic.student.admissionNumber})</span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-3.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Taught on {formatDate(topic.dateTaught)}</span>
                <span className="font-bold text-indigo-300">{topic.teacher?.name}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
