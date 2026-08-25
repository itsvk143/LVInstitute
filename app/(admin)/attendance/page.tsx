"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, "present" | "absent" | "late" | "leave">>({});

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["students-for-attendance"],
    queryFn: async () => (await axios.get("/api/students?limit=50")).data,
  });

  const students = studentsData?.data || [];

  const { data: existingAttendance = [] } = useQuery({
    queryKey: ["attendance-records", selectedDate],
    queryFn: async () => (await axios.get(`/api/attendance?date=${selectedDate}`)).data.data,
  });

  const saveAttendance = useMutation({
    mutationFn: async () => {
      const records = students.map((s: { _id: string }) => ({
        student: s._id,
        date: selectedDate,
        status: attendanceState[s._id] || "present",
      }));
      return axios.post("/api/attendance", records);
    },
    onSuccess: () => {
      toast.success("Attendance saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance-records", selectedDate] });
    },
    onError: () => toast.error("Failed to save attendance"),
  });

  const markAll = (status: "present" | "absent") => {
    const newState: Record<string, "present" | "absent" | "late" | "leave"> = {};
    students.forEach((s: { _id: string }) => {
      newState[s._id] = status;
    });
    setAttendanceState(newState);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Daily Attendance Register
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Record, verify, and manage daily classroom attendance across all batches
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl glass-input px-3.5 py-2 text-xs font-semibold text-white cursor-pointer"
          />
          <button
            onClick={() => saveAttendance.mutate()}
            disabled={saveAttendance.isPending}
            className="inline-flex items-center gap-2 rounded-xl btn-gradient px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save Register
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => markAll("present")}
          className="rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-400 transition-colors cursor-pointer"
        >
          Mark All Present
        </button>
        <button
          onClick={() => markAll("absent")}
          className="rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-1.5 text-xs font-bold text-rose-400 transition-colors cursor-pointer"
        >
          Mark All Absent
        </button>
      </div>

      {/* Student List */}
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
                <th className="px-5 py-4">Class & School</th>
                <th className="px-5 py-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {studentsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                students.map((student: { _id: string; name: string; admissionNumber: string; class?: { name: string }; school?: { name: string } }) => {
                  const existing = existingAttendance.find((a: { student: { _id: string } }) => a.student?._id === student._id);
                  const currentStatus = attendanceState[student._id] || existing?.status || "present";

                  return (
                    <tr key={student._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-bold text-white text-sm">{student.name}</td>
                      <td className="px-5 py-4 font-mono text-xs text-indigo-300">{student.admissionNumber}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{student.class?.name || "Standard Class"} • {student.school?.name || "Main Campus"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(["present", "absent", "late", "leave"] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => setAttendanceState((prev) => ({ ...prev, [student._id]: st }))}
                              className={cn(
                                "rounded-xl px-3 py-1 text-xs font-bold capitalize transition-all cursor-pointer",
                                currentStatus === st
                                  ? st === "present" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : st === "absent" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                                      : st === "late" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                        : "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
