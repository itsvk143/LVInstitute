"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Award,
  BookOpen,
  Trophy,
  Globe,
  Stethoscope,
  Atom,
  PenTool,
  Compass,
  Star,
  Hexagon,
  Flame,
  FlaskConical,
  Dna,
  Code2,
  MoreHorizontal,
  Building,
  CheckCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();

  // Tab State: "parent" | "faculty"
  const [activeTab, setActiveTab] = useState<"parent" | "faculty">("parent");

  // Parent Form State
  const [admissionNumber, setAdmissionNumber] = useState("LV-2025-0001");
  const [parentContact, setParentContact] = useState("9998887770");
  const [rememberMe, setRememberMe] = useState(true);
  const [loadingParent, setLoadingParent] = useState(false);

  // Faculty Form State
  const [email, setEmail] = useState("admin@lvinstitute.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPw, setShowPw] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  // Parent Login Handler
  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNumber.trim() || !parentContact.trim()) {
      return toast.error("Please enter Student Admission Number and Registered Mobile");
    }
    setLoadingParent(true);
    try {
      const res = await axios.post("/api/auth/parent-login", {
        identifier: admissionNumber.trim(),
        securityKey: parentContact.trim(),
      });
      toast.success(res.data.message || "Parent login successful! Loading student dashboard...");
      router.push(res.data.data?.redirectUrl || `/student/${admissionNumber.trim()}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid admission number or registered mobile number");
    } finally {
      setLoadingParent(false);
    }
  };

  // Faculty Login Handler
  const handleFacultyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      return toast.error("Please enter email and password");
    }
    setLoadingFaculty(true);
    try {
      await axios.post("/api/auth/login", { email: email.trim(), password });
      toast.success("Welcome back! Redirecting to Admin Dashboard...");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoadingFaculty(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8faff] text-slate-900 flex flex-col justify-between select-none relative overflow-x-hidden font-sans">
      {/* ── TOP NAVIGATION BAR ─────────────────────────────────────────────── */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        {/* Left: Brand Identity Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationShieldIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1e1b4b] leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              LV Institute
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
              Academic Excellence Since 2006
            </p>
          </div>
        </Link>

        {/* Right: Quick Portals & Security Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            href="/student/LV-2025-0001"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold transition-colors shadow-xs"
          >
            <span>Live Student Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </header>

      {/* ── MAIN BODY: TWO-TONE SPLIT LAYOUT ───────────────────────────────── */}
      <main className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 relative">
        
        {/* ══════════════════════════════════════════════════════════════════════
            LEFT COLUMN (7 cols): ACADEMIC SHOWCASE & ACCREDITATIONS
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between space-y-6 relative bg-gradient-to-br from-white via-[#fcfdff] to-[#f4f7ff]">
          
          {/* Subtle World Map Watermark Background */}
          <div className="absolute right-0 top-1/4 w-3/4 h-3/4 opacity-[0.035] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="space-y-6 relative z-10">
            {/* Main Hero Headline */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black tracking-tight text-[#0f172a] leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Uncompromising{" "}
                <span className="bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>

              {/* Gold Ornament Divider Centered */}
              <div className="flex items-center gap-2.5 pt-1 w-full max-w-xl">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-400/20 via-amber-400 to-amber-400" />
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="h-[2px] flex-1 bg-gradient-to-l from-amber-400/20 via-amber-400 to-amber-400" />
              </div>

              <p className="text-slate-600 text-[11px] sm:text-xs xl:text-[13px] font-semibold leading-relaxed whitespace-nowrap">
                Personalized learning • Outstanding faculty • Global outlook • Proven academic success
              </p>
            </div>

            {/* ── SECTION 1: EXCELLENCE IN MAJOR EXAMINATIONS ──────────────── */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1e1b4b]">
                <div className="h-[2px] w-7 bg-indigo-600" />
                <span>Excellence in Major Examinations</span>
                <div className="h-[1.5px] flex-1 bg-indigo-200" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
                <MajorExamCard icon={Stethoscope} title="NEET" sub="Medical" sub2="Entrance" color="text-teal-700" bg="bg-teal-100/70" border="border-teal-300" />
                <MajorExamCard icon={Atom} title="JEE" sub="Engineering" sub2="Entrance" color="text-blue-700" bg="bg-blue-100/70" border="border-blue-300" />
                <MajorExamCard icon={BookOpen} title="CBSE" sub="India" color="text-cyan-700" bg="bg-cyan-100/70" border="border-cyan-300" />
                <MajorExamCard icon={PenTool} title="ICSE" sub="India" color="text-amber-700" bg="bg-amber-100/70" border="border-amber-300" />
                <MajorExamCard icon={Globe} title="IB" sub="International" sub2="Baccalaureate" color="text-indigo-700" bg="bg-indigo-100/70" border="border-indigo-300" />
                <MajorExamCard icon={Trophy} title="OLYMPIAD" sub="Science, Maths," sub2="Cyber & More" color="text-purple-700" bg="bg-purple-100/70" border="border-purple-300" />
              </div>
            </div>

            {/* ── SECTION 2: GLOBAL EXAMS WE PREPARE FOR ───────────────────── */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1e1b4b]">
                <div className="h-[2px] w-7 bg-indigo-600" />
                <span>Global Exams We Prepare For</span>
                <div className="h-[1.5px] flex-1 bg-indigo-200" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <GlobalExamBadge badge="SAT" country="USA" title="Scholastic" desc="Assessment Test" badgeColor="bg-blue-600" />
                <GlobalExamBadge badge="ACT" country="USA" title="American College" desc="Testing" badgeColor="bg-sky-600" />
                <GlobalExamBadge badge="AP" country="USA" title="Advanced Placement" desc="Examinations" badgeColor="bg-emerald-600" />
                <GlobalExamBadge badge="PSAT" country="USA" title="Preliminary SAT" desc="Test" badgeColor="bg-indigo-600" />
                <GlobalExamBadge badge="TOEFL" country="USA" title="Test of English as a" desc="Foreign Language" badgeColor="bg-cyan-700" />
                <GlobalExamBadge badge="IELTS" country="Global" title="International English" desc="Language Testing" badgeColor="bg-rose-600" />

                <GlobalExamBadge badge="IGCSE" country="UK" title="Cambridge" desc="Assessment" badgeColor="bg-amber-600" />
                <GlobalExamBadge badge="A-Levels" country="UK" title="Advanced Level" desc="Qualifications" badgeColor="bg-red-600" />
                <GlobalExamBadge badge="O-Level" country="UK" title="Ordinary Level" desc="Qualifications" badgeColor="bg-amber-700" />
                <GlobalExamBadge badge="NUS High" country="Singapore" title="University Entrance" desc="Assessment" badgeColor="bg-blue-700" />
                <GlobalExamBadge badge="AEIS" country="Singapore" title="Admissions Exercise" desc="for Int'l Students" badgeColor="bg-rose-700" />
                <GlobalExamBadge badge="PISA" country="Global" title="Programme for" desc="Int'l Student Assess." badgeColor="bg-teal-700" />
              </div>
            </div>

            {/* ── SECTION 3: OLYMPIADS WE NURTURE ──────────────────────────── */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1e1b4b]">
                <div className="h-[2px] w-7 bg-indigo-600" />
                <span>Olympiads We Nurture</span>
                <div className="h-[1.5px] flex-1 bg-indigo-200" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                <OlympiadPill icon={Atom} title="IMO" sub="Maths" color="text-cyan-700" bg="bg-cyan-100" />
                <OlympiadPill icon={Star} title="IOAA" sub="Astronomy" color="text-indigo-700" bg="bg-indigo-100" />
                <OlympiadPill icon={Hexagon} title="HOMI" sub="Maths" color="text-amber-700" bg="bg-amber-100" />
                <OlympiadPill icon={Compass} title="IPhO" sub="Physics" color="text-purple-700" bg="bg-purple-100" />
                <OlympiadPill icon={FlaskConical} title="IChO" sub="Chemistry" color="text-teal-700" bg="bg-teal-100" />
                <OlympiadPill icon={Dna} title="INBO" sub="Biology" color="text-emerald-700" bg="bg-emerald-100" />
                <OlympiadPill icon={Code2} title="NCO" sub="Cyber" color="text-violet-700" bg="bg-violet-100" />
                <OlympiadPill icon={MoreHorizontal} title="•••" sub="& More" color="text-slate-800" bg="bg-slate-200" />
              </div>
            </div>

            {/* ── SECTION 4: GLOBAL PRESENCE FLAGS ─────────────────────────── */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1e1b4b]">
                <div className="h-[2px] w-7 bg-indigo-600" />
                <span>Global Presence, Trusted by Thousands</span>
                <div className="h-[1.5px] flex-1 bg-indigo-200" />
              </div>

              <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-0.5">
                <FlagBadge flag="🇮🇳" country="India" />
                <FlagBadge flag="🇺🇸" country="USA" />
                <FlagBadge flag="🇬🇧" country="UK" />
                <FlagBadge flag="🇸🇬" country="Singapore" />
                <FlagBadge flag="🇨🇦" country="Canada" />
                <FlagBadge flag="🇦🇺" country="Australia" />
                <FlagBadge flag="🇦🇪" country="UAE" />
                <FlagBadge flag="🇶🇦" country="Qatar" />
                <span className="text-xs font-bold text-indigo-700 px-2.5 py-1 rounded-lg bg-indigo-100/80 border border-indigo-300 flex-shrink-0">
                  & More
                </span>
              </div>
            </div>
          </div>

          {/* ── SECTION 5: BOTTOM STATS BAR ───────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <StatBox icon={Users} num="25,000+" label="Students" color="text-indigo-600" />
            <StatBox icon={Building} num="150+" label="Schools & Partners" color="text-purple-600" />
            <StatBox icon={Globe} num="15+" label="Countries" color="text-cyan-600" />
            <StatBox icon={Star} num="98%" label="Parent Satisfaction" color="text-amber-500" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (5 cols): DARK MIDNIGHT WRAPPER + FLOATING AUTH CARD
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 bg-[#0a0e27] p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center relative overflow-hidden text-white shadow-2xl">
          
          {/* Subtle Ambient Glow Blobs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          {/* Floating White Auth Card */}
          <div className="w-full max-w-[420px] rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/20 relative z-10">
            
            {/* Top Dual Tabs Switcher */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("parent")}
                className={cn(
                  "flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer",
                  activeTab === "parent"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <User className="w-4 h-4" />
                <span>Student / Parent Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("faculty")}
                className={cn(
                  "flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer",
                  activeTab === "faculty"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Faculty & Admin</span>
              </button>
            </div>

            {/* Central Icon & Welcome Title */}
            <div className="text-center space-y-1.5 mb-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                {activeTab === "parent" ? (
                  <Users className="w-6 h-6 text-indigo-600" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                )}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
                Welcome Back!
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {activeTab === "parent"
                  ? "Login to access student academic dashboard & progress"
                  : "Login to access institute administration"}
              </p>
            </div>

            {/* Form Area with Smooth Tab Transitions */}
            <AnimatePresence mode="wait">
              {activeTab === "parent" ? (
                <motion.form
                  key="parent-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleParentLogin}
                  className="space-y-4"
                >
                  {/* Student Admission Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Student Admission Number
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={admissionNumber}
                        onChange={(e) => setAdmissionNumber(e.target.value)}
                        placeholder="Enter admission number"
                        style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Registered Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={parentContact}
                        onChange={(e) => setParentContact(e.target.value)}
                        placeholder="Enter registered mobile number"
                        style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Remember me & Forgot helper */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => toast.info("Contact institute admin or check enrollment SMS for Admission ID.")}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline cursor-pointer"
                    >
                      Forgot admission number?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingParent}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loadingParent ? "Verifying..." : "Login to Dashboard"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="faculty-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleFacultyLogin}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Admin / Teacher Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@lvinstitute.com"
                        style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ paddingLeft: "2.75rem", paddingRight: "2.5rem" }}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Remember credentials</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => toast.info("Please contact Super Administrator to reset password.")}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingFaculty}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loadingFaculty ? "Signing in..." : "Login to Admin Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] text-slate-400 uppercase font-bold">
                <span className="bg-white px-2">or</span>
              </div>
            </div>

            {/* Explore as Guest Option */}
            <button
              type="button"
              onClick={() => {
                toast.success("Loading guest demo profile (Ananya Sharma)...");
                router.push("/student/LV-2025-0001");
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-slate-50/70 hover:bg-indigo-50/40 transition-colors flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    Explore as Guest
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    View sample live student dashboard
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Bottom Accreditation & Tagline under Card */}
          <div className="mt-6 text-center space-y-2 max-w-sm relative z-10">
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">
              <span>NEET</span> • <span>JEE</span> • <span>CBSE</span> • <span>ICSE</span> • <span>IB</span> • <span>OLYMPIAD</span>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] text-slate-400 font-medium">
              <span>SAT</span> • <span>ACT</span> • <span>AP</span> • <span>IELTS</span> • <span>TOEFL</span> • <span>PISA</span> • <span>& More</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-amber-400/40" />
              <p className="text-[11px] font-bold text-amber-400 tracking-wide">
                One Vision. Many Pathways. Limitless Future.
              </p>
              <div className="h-[1px] w-8 bg-amber-400/40" />
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER BAR ─────────────────────────────────────────────────────── */}
      <footer className="w-full px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 bg-white border-t border-slate-200/80 z-20 gap-2">
        <p>© 2025 LV Institute. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <button onClick={() => toast.info("Privacy Policy: All student records are confidential and encrypted.")} className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => toast.info("Terms of Use: Educational platform for registered students and guardians.")} className="hover:text-indigo-600 transition-colors">
            Terms of Use
          </button>
          <span>•</span>
          <button onClick={() => toast.info("Support Helpline: +91 99988 87770 | support@lvinstitute.com")} className="hover:text-indigo-600 transition-colors">
            Support
          </button>
        </div>
      </footer>
    </div>
  );
}

// ── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function GraduationShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      <path d="M7 10l5-3 5 3-5 3-5-3z" />
      <path d="M10 12.5v3c0 .8.9 1.5 2 1.5s2-.7 2-1.5v-3" />
    </svg>
  );
}

function MajorExamCard({
  icon: Icon,
  title,
  sub,
  sub2,
  color,
  bg,
  border,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  sub2?: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={cn("p-3 rounded-2xl bg-white border-2 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-2", border)}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border border-current/20 shadow-2xs", bg, color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[13px] font-black text-slate-950 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          {title}
        </p>
        <p className="text-[11px] text-slate-700 font-bold leading-tight mt-0.5">{sub}</p>
        {sub2 && <p className="text-[10px] text-slate-600 font-semibold leading-tight">{sub2}</p>}
      </div>
    </div>
  );
}

function GlobalExamBadge({
  badge,
  country,
  title,
  desc,
  badgeColor,
}: {
  badge: string;
  country: string;
  title: string;
  desc: string;
  badgeColor: string;
}) {
  return (
    <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-2xs hover:shadow-xs hover:border-indigo-400 transition-all space-y-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-[10px] font-black text-white px-1.5 py-0.5 rounded shadow-2xs", badgeColor)}>
          {badge}
        </span>
        <span className="text-[10px] font-extrabold text-slate-600">{country}</span>
      </div>
      <div>
        <p className="text-[11px] font-extrabold text-slate-900 leading-tight truncate">{title}</p>
        <p className="text-[10px] text-slate-600 font-semibold leading-tight truncate">{desc}</p>
      </div>
    </div>
  );
}

function OlympiadPill({
  icon: Icon,
  title,
  sub,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="p-2 rounded-xl bg-white border border-slate-300 shadow-2xs flex items-center gap-2">
      <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border border-current/20", bg, color)}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black text-slate-950 leading-tight">{title}</p>
        <p className="text-[9.5px] text-slate-700 font-bold leading-tight truncate">{sub}</p>
      </div>
    </div>
  );
}

function FlagBadge({ flag, country }: { flag: string; country: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 shadow-2xs hover:border-slate-400 transition-colors">
      <span className="text-sm">{flag}</span>
      <span className="text-[11px] font-extrabold">{country}</span>
    </div>
  );
}

function StatBox({
  icon: Icon,
  num,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  num: string;
  label: string;
  color: string;
}) {
  return (
    <div className="p-2.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
      <div className={cn("w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          {num}
        </p>
        <p className="text-[10px] text-slate-500 font-medium truncate">{label}</p>
      </div>
    </div>
  );
}
