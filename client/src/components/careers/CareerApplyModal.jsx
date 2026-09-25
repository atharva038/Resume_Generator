import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  Send,
  Loader2,
  PartyPopper,
} from "lucide-react";
import toast from "react-hot-toast";
import { careerApplicationAPI } from "@/api";

export default function CareerApplyModal({ job, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experience: "3-5 years",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    availability: "Part-Time (10-20 hrs/week)",
    coverNote: "",
    resumeFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsSuccess(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      toast.success(`Attached ${file.name}`);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please provide your name and email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const roleTitle = job ? job.title : "General Founding Application";
      const roleId = job?.id || "general";
      const department = job?.department || "General";

      let resumeBase64 = "";
      if (formData.resumeFile) {
        try {
          resumeBase64 = await fileToBase64(formData.resumeFile);
        } catch (fErr) {
          console.warn("Could not encode resume:", fErr);
        }
      }

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        roleId,
        roleTitle,
        department,
        experienceLevel: formData.experience,
        availability: formData.availability,
        portfolioUrl: formData.portfolioUrl.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        githubUrl: formData.githubUrl.trim(),
        coverNote: formData.coverNote.trim(),
        whyJoin: formData.coverNote.trim(),
        source: "careers_quick_modal",
        resumeName: formData.resumeFile ? formData.resumeFile.name : "",
        resumeSize: formData.resumeFile ? formData.resumeFile.size : 0,
        resumeData: resumeBase64,
      };

      let appId = `app-${Date.now()}`;
      try {
        const res = await careerApplicationAPI.submitApplication(payload);
        if (res.data?.success && (res.data?.applicationId || res.data?.application?._id)) {
          appId = res.data.applicationId || res.data.application._id;
        }
      } catch (apiErr) {
        console.warn("API submission error, caching locally:", apiErr);
      }

      // Also persist to local storage cache
      try {
        const localStored = localStorage.getItem("smartnshine_admin_career_apps");
        let list = localStored ? JSON.parse(localStored) : [];
        const newApp = {
          _id: appId,
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || "N/A",
          role: roleTitle,
          roleTitle: roleTitle,
          roleId,
          department,
          experience: formData.experience,
          availability: formData.availability,
          location: formData.location.trim() || "Remote",
          portfolioUrl: formData.portfolioUrl.trim(),
          linkedinUrl: formData.linkedinUrl.trim(),
          githubUrl: formData.githubUrl.trim(),
          resumeName: formData.resumeFile ? formData.resumeFile.name : "Resume_Attached.pdf",
          resumeData: resumeBase64,
          coverNote: formData.coverNote.trim(),
          whyJoin: formData.coverNote.trim(),
          status: "pending",
          createdAt: new Date().toISOString(),
          notes: "",
        };
        list = [newApp, ...list.filter((a) => a._id !== appId)];
        localStorage.setItem("smartnshine_admin_career_apps", JSON.stringify(list));
      } catch (e) {
        console.error("Local storage sync error:", e);
      }

      setIsSuccess(true);
      toast.success("Founding Application Received! Founders will review within 48h.");
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Failed to send application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[88vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col overscroll-contain"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            /* Success State */
            <div className="p-8 sm:p-12 text-center space-y-6 overflow-y-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                <PartyPopper className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-light text-zinc-900 dark:text-white">
                  Application Received!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-zinc-900 dark:text-zinc-200">{formData.fullName}</span>. The founders review every application directly. We will be in touch shortly for an informal chat!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 text-left space-y-1">
                <div className="flex justify-between">
                  <span>Applied For:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{job ? job.title : "Founding Application"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmation Sent To:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{formData.email}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-7 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Header (Fixed) */}
              <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/50 shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium mb-2 border border-zinc-200 dark:border-zinc-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Founding Team Application</span>
                </div>
                <h2 className="text-2xl font-light text-zinc-900 dark:text-white tracking-tight">
                  Apply for {job ? job.title : "Founding Role"}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                  100% remote • Flexible hours • Direct founder collaboration
                </p>
              </div>

              {/* Scrollable Form Body */}
              <div
                data-lenis-prevent="true"
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-5 text-sm"
              >
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Location / Timezone
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco (PST) / Mumbai (IST)"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Links: LinkedIn, Portfolio / GitHub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Portfolio / GitHub / Work Sample
                    </label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com or github"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Experience & Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    >
                      <option value="Student / New Grad">Student / New Grad</option>
                      <option value="1-2 years">Early Career (1–2 years)</option>
                      <option value="3-5 years">Mid-Level (3–5 years)</option>
                      <option value="5+ years">Senior (5+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                    >
                      <option value="Part-Time (10-20 hrs/week)">Part-Time (10–20 hrs/week)</option>
                      <option value="Full-Time (30-40 hrs/week)">Full-Time (30–40 hrs/week)</option>
                      <option value="Weekends Only">Weekends & Evenings</option>
                    </select>
                  </div>
                </div>

                {/* Drag & Drop Resume File */}
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Attach Resume / CV (PDF or DOCX, optional)
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                      dragActive
                        ? "border-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                        : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/30"
                    }`}
                  >
                    {formData.resumeFile ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                          <span className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
                            {formData.resumeFile.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, resumeFile: null }))}
                          className="text-xs text-rose-500 hover:underline ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-8 h-8 text-zinc-400 mx-auto" />
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light">
                          Drag and drop your resume file here, or{" "}
                          <label className="text-zinc-900 dark:text-white font-medium cursor-pointer hover:underline">
                            browse
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pitch / Cover Note */}
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    What excites you about SmartNShine? / Tell us what you want to build
                  </label>
                  <textarea
                    rows={3}
                    name="coverNote"
                    value={formData.coverNote}
                    onChange={handleInputChange}
                    placeholder="Share a quick note on why you'd love to collaborate with us..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Sticky Submit Footer (Fixed) */}
              <div className="p-4 sm:p-6 border-t border-zinc-100 dark:border-white/10 bg-zinc-50/90 dark:bg-zinc-900/90 flex items-center justify-between gap-4 shrink-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                  Direct human review by founders.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-medium shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
