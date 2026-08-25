"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCheck,
  BookMarked,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-indigo-400" },
    ],
  },
  {
    label: "People & Directory",
    items: [
      { href: "/students", label: "Students", icon: Users, color: "text-emerald-400" },
      { href: "/teachers", label: "Faculty & Mentors", icon: GraduationCap, color: "text-purple-400" },
      { href: "/schools", label: "School Branches", icon: School, color: "text-cyan-400" },
    ],
  },
  {
    label: "Academic Management",
    items: [
      { href: "/subjects", label: "Curriculum & Subjects", icon: BookOpen, color: "text-blue-400" },
      { href: "/progress", label: "Chapter Progress", icon: ClipboardList, color: "text-emerald-400" },
      { href: "/additional-topics", label: "Additional Topics", icon: Sparkles, color: "text-amber-400" },
      { href: "/marks", label: "Marks & Results", icon: Award, color: "text-rose-400" },
      { href: "/attendance", label: "Daily Attendance", icon: UserCheck, color: "text-teal-400" },
      { href: "/homework", label: "Homework & Tasks", icon: BookMarked, color: "text-indigo-400" },
    ],
  },
  {
    label: "Calendar & Notices",
    items: [
      { href: "/examinations", label: "Examinations", icon: Calendar, color: "text-amber-400" },
      { href: "/notices", label: "Notice Board", icon: Bell, color: "text-rose-400" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/reports", label: "Printable Reports", icon: FileText, color: "text-cyan-400" },
      { href: "/analytics", label: "Analytics Hub", icon: BarChart3, color: "text-violet-400" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 270 : 80 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-30 flex-shrink-0"
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  LV INSTITUTE
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                    Admin Portal
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md border border-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3.5 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {isOpen && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200",
                      isActive
                        ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5",
                      !isOpen && "justify-center px-2"
                    )}
                    title={!isOpen ? item.label : undefined}
                  >
                    <item.icon className={cn("w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : item.color)} />
                    {isOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isActive && isOpen && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-4 rounded-full bg-gradient-to-b from-indigo-400 to-purple-400 shadow-sm"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-xl p-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
