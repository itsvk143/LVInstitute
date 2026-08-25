import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

export function getGradeColor(grade: string) {
  const colors: Record<string, string> = {
    "A+": "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    A: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    "B+": "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    B: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    C: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
    D: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    F: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
  };
  return colors[grade] || "text-slate-600 bg-slate-50";
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    completed: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    in_progress: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    not_started: "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    pending: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    present: "text-emerald-700 bg-emerald-50",
    absent: "text-red-700 bg-red-50",
    late: "text-amber-700 bg-amber-50",
    leave: "text-blue-700 bg-blue-50",
    revised: "text-emerald-700 bg-emerald-50",
  };
  return colors[status] || "text-slate-600 bg-slate-50";
}

export function getStatusEmoji(status: string) {
  const emojis: Record<string, string> = {
    completed: "✅",
    in_progress: "🔄",
    not_started: "⏳",
    pending: "⏳",
    revised: "✅",
    present: "✅",
    absent: "❌",
    late: "⚠️",
    leave: "📋",
  };
  return emojis[status] || "—";
}

export function getDaysUntil(date: Date | string) {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
