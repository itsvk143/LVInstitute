"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Sparkles, User, School, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { getPhoneConfig, validateAndFormatPhone, COUNTRY_PHONE_CONFIGS } from "@/lib/phone";
import { cn } from "@/lib/utils";

interface LookupData {
  schools: Array<{ _id: string; name: string }>;
  classes: Array<{ _id: string; name: string; grade?: number }>;
  boards: Array<{ _id: string; name: string; code: string }>;
  countries: Array<{ _id: string; name: string; code: string; flag?: string }>;
  batches: Array<{ _id: string; name: string }>;
  courses: Array<{ _id: string; name: string }>;
  teachers: Array<{ _id: string; name: string }>;
}

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    admissionNumber: "LV-2026-1002",
    name: "",
    gender: "male",
    dateOfBirth: "",
    email: "",
    phone: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
    school: "",
    class: "",
    section: "A",
    board: "",
    country: "",
    batch: "",
    course: "",
    teacher: "",
    joiningDate: new Date().toISOString().split("T")[0],
    notes: "",
    publicProfileEnabled: true,
  });

  const { data: lookups } = useQuery<LookupData>({
    queryKey: ["lookups"],
    queryFn: async () => (await axios.get("/api/lookups")).data.data,
  });

  // Find active country code from selected country
  const selectedCountryObj = useMemo(() => {
    if (!lookups?.countries || !formData.country) return null;
    return lookups.countries.find((c) => c._id === formData.country);
  }, [lookups, formData.country]);

  const phoneConfig = useMemo(() => {
    return getPhoneConfig(selectedCountryObj?.code || selectedCountryObj?.name || "IN");
  }, [selectedCountryObj]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "phone" || name === "parentContact") {
      // Allow only digits and limit to exact country length
      const onlyDigits = value.replace(/\D/g, "").slice(0, phoneConfig.digits);
      setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.admissionNumber.trim() || !formData.parentName.trim() || !formData.parentContact.trim()) {
      toast.error("Please fill all required student and parent fields");
      return;
    }

    if (!formData.school || !formData.class || !formData.board || !formData.country || !formData.course || !formData.teacher) {
      toast.error("Please select all academic mapping dropdowns");
      return;
    }

    // 1. Strict Parent Phone Validation
    const parentCheck = validateAndFormatPhone(formData.parentContact, phoneConfig.code);
    if (!parentCheck.isValid) {
      toast.error(`Parent Phone: ${parentCheck.error}`);
      return;
    }

    // 2. Strict Student Mobile Validation (if filled)
    if (formData.phone.trim()) {
      const studentCheck = validateAndFormatPhone(formData.phone, phoneConfig.code);
      if (!studentCheck.isValid) {
        toast.error(`Student Mobile: ${studentCheck.error}`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        parentContact: parentCheck.formatted,
        phone: formData.phone.trim() ? `${phoneConfig.dialCode} ${formData.phone.trim()}` : "",
      };

      const res = await axios.post("/api/students", payload);
      toast.success("Student enrolled successfully with full curriculum!");
      router.push(`/students/${res.data.data._id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const cleanParentDigits = formData.parentContact.replace(/\D/g, "");
  const cleanStudentDigits = formData.phone.replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/students"
          className="flex h-11 w-11 items-center justify-center rounded-2xl glass-card text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Enroll New Student
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Map student to school branch, grade, board, and faculty mentor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <User className="w-5 h-5" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: "Outfit, sans-serif" }}>
              1. Basic Profile Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Admission No *</label>
              <input
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Full Name *</label>
              <input
                name="name"
                placeholder="e.g. Arjun Sharma"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="male" className="bg-slate-900">Male</option>
                <option value="female" className="bg-slate-900">Female</option>
                <option value="other" className="bg-slate-900">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Student Email</label>
              <input type="email" name="email" placeholder="student@example.com" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white" />
            </div>

            {/* Student Mobile with Strict Country Code Prefix */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Student Mobile
                </label>
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  cleanStudentDigits.length === phoneConfig.digits ? "text-emerald-400" : "text-slate-400"
                )}>
                  {cleanStudentDigits.length} / {phoneConfig.digits} digits
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-400 pointer-events-none select-none border-r border-white/10 pr-2">
                  <span>{phoneConfig.flag}</span>
                  <span>{phoneConfig.dialCode}</span>
                </span>
                <input
                  name="phone"
                  placeholder={phoneConfig.example}
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={phoneConfig.digits}
                  style={{ paddingLeft: "4.75rem" }}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white font-mono placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Academic Classification */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-6 text-purple-400">
            <School className="w-5 h-5" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: "Outfit, sans-serif" }}>
              2. Academic & Branch Mapping
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">School / Branch *</label>
              <select name="school" value={formData.school} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select School</option>
                {lookups?.schools?.map((s) => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Class / Grade *</label>
              <select name="class" value={formData.class} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select Class</option>
                {lookups?.classes?.map((c) => <option key={c._id} value={c._id} className="bg-slate-900">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Education Board *</label>
              <select name="board" value={formData.board} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select Board</option>
                {lookups?.boards?.map((b) => <option key={b._id} value={b._id} className="bg-slate-900">{b.name} ({b.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Country *</label>
              <select name="country" value={formData.country} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select Country</option>
                {lookups?.countries?.map((c) => <option key={c._id} value={c._id} className="bg-slate-900">{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Course / Goal *</label>
              <select name="course" value={formData.course} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select Course</option>
                {lookups?.courses?.map((c) => <option key={c._id} value={c._id} className="bg-slate-900">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Batch *</label>
              <select name="batch" value={formData.batch} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select Batch</option>
                {lookups?.batches?.map((b) => <option key={b._id} value={b._id} className="bg-slate-900">{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Assigned Mentor *</label>
              <select name="teacher" value={formData.teacher} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white">
                <option value="" className="bg-slate-900">Select Faculty Mentor</option>
                {lookups?.teachers?.map((t) => <option key={t._id} value={t._id} className="bg-slate-900">{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Joining Date</label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Section</label>
              <input name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white" />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Parent Contact */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: "Outfit, sans-serif" }}>
              3. Parent / Guardian Details
            </h2>
            <span className="text-xs text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 font-semibold">
              Format: {phoneConfig.flag} {phoneConfig.dialCode} ({phoneConfig.digits} Digits)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Parent Name *</label>
              <input name="parentName" placeholder="e.g. Rajesh Sharma" value={formData.parentName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white" />
            </div>

            {/* Parent Phone with Strict Country Code Prefix */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Parent Phone *
                </label>
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  cleanParentDigits.length === phoneConfig.digits ? "text-emerald-400" : "text-amber-400"
                )}>
                  {cleanParentDigits.length} / {phoneConfig.digits} digits
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-400 pointer-events-none select-none border-r border-white/10 pr-2">
                  <span>{phoneConfig.flag}</span>
                  <span>{phoneConfig.dialCode}</span>
                </span>
                <input
                  name="parentContact"
                  placeholder={phoneConfig.example}
                  value={formData.parentContact}
                  onChange={handleChange}
                  maxLength={phoneConfig.digits}
                  required
                  style={{ paddingLeft: "4.75rem" }}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white font-mono placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Parent Email</label>
              <input type="email" name="parentEmail" placeholder="parent@example.com" value={formData.parentEmail} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white" />
            </div>
          </div>
        </motion.div>

        {/* Submit Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl glass-panel p-6 border border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="publicProfileEnabled"
              checked={formData.publicProfileEnabled}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-white/5 cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-white">Enable Public Progress Portal</span>
              <p className="text-xs text-slate-400">Generate public URL for student & parents without login</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl btn-gradient text-xs font-bold text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-105 transition-transform"
          >
            <Save className="w-4 h-4" />
            {loading ? "Enrolling Student..." : "Enroll Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
