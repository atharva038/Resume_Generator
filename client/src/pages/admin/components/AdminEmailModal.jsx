import {useState, useEffect} from "react";
import {
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Gift,
  HelpCircle,
  FileText,
  X,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye,
  Edit3,
} from "lucide-react";
import toast from "react-hot-toast";
import {sendCustomAdminEmail} from "@/api/admin.api";

// Built-in high quality email templates
export const EMAIL_TEMPLATES = [
  {
    id: "service_resolution",
    name: "Service Resolution & Upgrade",
    icon: Sparkles,
    badgeColor: "emerald",
    subject: "Update: AI Resume Scanner is Fully Operational - SmartNShine",
    badgeText: "SERVICE UPDATE & RESOLUTION",
    heading: "AI Services Upgraded & Ready",
    bodyMessage:
      "We noticed you experienced a temporary issue while running an AI ATS Resume scan on SmartNShine recently. We sincerely apologize for any inconvenience this caused.\n\nOur engineering team has resolved the model routing issue and fully upgraded our core AI engine to OpenAI GPT-4o.",
    cardTitle: "✅ High Speed & Maximum Accuracy",
    cardMessage:
      "The ATS Resume Scanner, Bullet Point Enhancer, and AI Mock Interviewer are now running at full capacity with enhanced speed and accuracy.",
    buttonText: "Scan Your Resume Now",
    buttonUrl: "https://smartnshine.app/ats-analyzer",
    noteBox:
      "📩 Need Assistance? You can reach out directly via our Contact page or reply to this email, and our support team will assist you right away.",
  },
  {
    id: "festive_bonus",
    name: "Festive Promo & AI Credits",
    icon: Gift,
    badgeColor: "orange",
    subject: "🎁 Special Festive Offer: Flat 82% OFF + Pro ATS Resume Boost!",
    badgeText: "LIMITED FESTIVE SPECIAL",
    heading: "Unlock Your ATS-Crushing Pro Resume Deal",
    bodyMessage:
      "Celebrate with an ATS-optimized professional resume at flat 82% OFF!\n\nBoost your job search with GPT-4o bullet rewriting, full access to all 11 certified templates, and 1-click live portfolio deployment.",
    cardTitle: "✨ Pro Tier Benefits Included",
    cardMessage:
      "• Dedicated 21-day single resume boost\n• Deep ATS compatibility scans\n• 1-Click live public portfolio website",
    buttonText: "Claim ₹9 Deal Now",
    buttonUrl: "https://smartnshine.app/pricing",
    noteBox:
      "💡 Limited-time offer. Lock in your discounted pricing today before the promotion ends!",
  },
  {
    id: "personal_support",
    name: "Support Follow-up",
    icon: HelpCircle,
    badgeColor: "blue",
    subject: "Support Follow-up regarding your SmartNShine account",
    badgeText: "CUSTOMER SUPPORT",
    heading: "Regarding Your Recent Inquiry",
    bodyMessage:
      "Thank you for contacting SmartNShine support. We are following up regarding your account to ensure everything is running smoothly.\n\nPlease feel free to reply directly to this email or visit your dashboard if you need any further assistance.",
    cardTitle: "💬 Dedicated Assistance",
    cardMessage:
      "Our support engineers are standing by to help with resume parsing, ATS scoring, or subscription inquiries.",
    buttonText: "Open SmartNShine Dashboard",
    buttonUrl: "https://smartnshine.app/dashboard",
    noteBox:
      "You can also schedule a free 1-on-1 walkthrough with our team anytime.",
  },
  {
    id: "custom_blank",
    name: "Custom Blank Email",
    icon: Edit3,
    badgeColor: "purple",
    subject: "Important Notice from SmartNShine",
    badgeText: "SMARTNSHINE UPDATE",
    heading: "Update Regarding Your Account",
    bodyMessage:
      "Hello {name},\n\nWe are writing to share an important update regarding your SmartNShine account.",
    cardTitle: "",
    cardMessage: "",
    buttonText: "Visit SmartNShine",
    buttonUrl: "https://smartnshine.app",
    noteBox: "",
  },
];

export default function AdminEmailModal({
  isOpen,
  onClose,
  initialEmail = "",
  initialName = "",
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("service_resolution");
  const [toEmail, setToEmail] = useState(initialEmail);
  const [userName, setUserName] = useState(initialName);
  const [subject, setSubject] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [heading, setHeading] = useState("");
  const [bodyMessage, setBodyMessage] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [noteBox, setNoteBox] = useState("");
  const [sendCopyAdmin, setSendCopyAdmin] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'mobile'

  // Apply selected template
  const applyTemplate = (tplId) => {
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    setSelectedTemplate(tplId);
    setSubject(tpl.subject);
    setBadgeText(tpl.badgeText);
    setHeading(tpl.heading);
    setBodyMessage(tpl.bodyMessage);
    setCardTitle(tpl.cardTitle);
    setCardMessage(tpl.cardMessage);
    setButtonText(tpl.buttonText);
    setButtonUrl(tpl.buttonUrl);
    setNoteBox(tpl.noteBox);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialEmail) setToEmail(initialEmail);
      if (initialName) setUserName(initialName);
      applyTemplate(selectedTemplate);
    }
  }, [isOpen, initialEmail, initialName]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!toEmail || !toEmail.includes("@")) {
      toast.error("Please enter a valid recipient email address");
      return;
    }
    if (!subject || !bodyMessage) {
      toast.error("Subject and Message Body are required");
      return;
    }

    try {
      setIsSending(true);
      const res = await sendCustomAdminEmail({
        toEmail,
        userName,
        subject,
        badgeText,
        heading,
        bodyMessage,
        cardTitle,
        cardMessage,
        buttonText,
        buttonUrl,
        noteBox,
        sendCopyAdmin,
      });

      if (res.data?.success) {
        toast.success(`Email successfully delivered to ${toEmail}!`);
        onClose();
      }
    } catch (err) {
      console.error("Failed to send email:", err);
      toast.error(err.response?.data?.message || "Failed to deliver email");
    } finally {
      setIsSending(false);
    }
  };

  // Variable replacement helper for preview
  const formatPreview = (text) =>
    (text || "")
      .replace(/{name}/g, userName || "Valued User")
      .replace(/{email}/g, toEmail || "user@example.com")
      .replace(/{app_url}/g, "https://smartnshine.app");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                1-Click Admin Email Dispatcher
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                  Live Preview Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose a pre-designed template, customize content, and dispatch branded emails in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns (Form & Live Preview) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Editor Form (7 cols) */}
          <div className="lg:col-span-6 p-6 overflow-y-auto space-y-5 border-r border-white/10 max-h-[calc(92vh-140px)]">
            {/* Template Selector Bar */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Email Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EMAIL_TEMPLATES.map((tpl) => {
                  const Icon = tpl.icon;
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => applyTemplate(tpl.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold truncate">{tpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Developer"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Subject Line & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Header Badge Pill
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="UPDATE"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Main Headline Banner
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Main email title..."
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Body Message */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Body Message Content * <span className="text-slate-500">(Use {"{name}"} for user's name)</span>
              </label>
              <textarea
                rows={4}
                value={bodyMessage}
                onChange={(e) => setBodyMessage(e.target.value)}
                placeholder="Enter email body..."
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 resize-y"
                required
              />
            </div>

            {/* Highlight Box (Card) */}
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Highlight Box (Optional)
              </label>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Card Header (e.g. ✅ Issue Resolved)"
                className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <textarea
                rows={2}
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder="Card details or bullet points..."
                className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* CTA Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Scan Your Resume"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CTA Button URL
                </label>
                <input
                  type="url"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://smartnshine.app/..."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Info / Note Box */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Footer Note / Support Contact
              </label>
              <input
                type="text"
                value={noteBox}
                onChange={(e) => setNoteBox(e.target.value)}
                placeholder="📩 Support note..."
                className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Admin Copy Toggle */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={sendCopyAdmin}
                onChange={(e) => setSendCopyAdmin(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-white/20"
              />
              <span>Send a copy to Admin Email (for verification in your inbox)</span>
            </label>
          </div>

          {/* Right Column: Live Responsive HTML Preview (6 cols) */}
          <div className="lg:col-span-6 bg-slate-950 p-6 flex flex-col justify-between max-h-[calc(92vh-140px)] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Email Preview</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                    previewDevice === "desktop"
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                    previewDevice === "mobile"
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
              </div>
            </div>

            {/* Simulated Email Canvas */}
            <div className="flex-1 overflow-y-auto py-4 flex justify-center">
              <div
                className={`bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all text-left text-xs ${
                  previewDevice === "mobile" ? "w-[320px]" : "w-full max-w-[480px]"
                }`}
              >
                {/* Email Header */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 text-center">
                  {badgeText && (
                    <div className="inline-block px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2">
                      {formatPreview(badgeText)}
                    </div>
                  )}
                  <h2 className="text-base font-extrabold tracking-tight m-0 text-white leading-tight">
                    {formatPreview(heading)}
                  </h2>
                </div>

                {/* Email Body */}
                <div className="p-5 space-y-3.5">
                  <p className="font-semibold text-slate-900 text-xs">
                    Hello {userName || "Valued User"},
                  </p>

                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                    {formatPreview(bodyMessage)}
                  </p>

                  {/* Card Preview */}
                  {(cardTitle || cardMessage) && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
                      {cardTitle && (
                        <h4 className="font-bold text-emerald-800 text-xs mb-1">
                          {formatPreview(cardTitle)}
                        </h4>
                      )}
                      {cardMessage && (
                        <p className="text-[11px] text-emerald-700 whitespace-pre-line leading-relaxed m-0">
                          {formatPreview(cardMessage)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Button Preview */}
                  {buttonText && (
                    <div className="text-center py-2">
                      <div className="inline-block px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-lg shadow-md text-xs">
                        {formatPreview(buttonText)} &rarr;
                      </div>
                    </div>
                  )}

                  {/* Note Preview */}
                  {noteBox && (
                    <div className="bg-slate-50 border-l-4 border-indigo-500 p-2.5 rounded-r-lg text-[11px] text-slate-600 leading-relaxed">
                      {formatPreview(noteBox)}
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                    Best regards,<br />
                    <strong className="text-slate-800">The SmartNShine Team</strong>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-3 text-center border-t border-slate-200 text-[10px] text-slate-400">
                  <p className="m-0 font-medium text-slate-500">
                    SmartNShine - AI-Powered Resume Platform
                  </p>
                  <p className="m-0">&copy; {new Date().getFullYear()} SmartNShine. All rights reserved.</p>
                </div>
              </div>
            </div>

            {/* Email Meta bar */}
            <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10 flex items-center justify-between">
              <span>To: {toEmail || "Not specified"}</span>
              <span>Subject: {subject || "No Subject"}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Delivering via configured SMTP: <span className="text-emerald-400 font-mono">atharvsjoshi2005@gmail.com</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? "animate-spin" : ""}`} />
              <span>{isSending ? "Delivering..." : "Send Email Now"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
