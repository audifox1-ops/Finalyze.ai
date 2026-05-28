/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Star, 
  Image as ImageIcon, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  History, 
  Trash2,
  Mail,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useTranslation } from "../lib/i18n";

export interface FeedbackItem {
  id: string;
  type: "bug" | "feature" | "praise" | "other";
  rating: number;
  title: string;
  content: string;
  screenshot: string | null; // base64 string or file name simulation
  submittedAt: string;
  appVersion: string;
}

const STORAGE_FEEDBACK_KEY = "finalyze_ai_user_feedbacks";

export const FeedbackWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [formType, setFormType] = useState<FeedbackItem["type"]>("feature");
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showHistoryTab, setShowHistoryTab] = useState(false);

  // Load existing feedback logs from LocalStorage
  const loadFeedbacks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_FEEDBACK_KEY);
      if (stored) {
        setFeedbacks(JSON.parse(stored));
      } else {
        // Mock seed feedback to show history layout nicely if empty
        const initialSeed: FeedbackItem[] = [
          {
            id: "seed-fb-1",
            type: "feature",
            rating: 5,
            title: "DuPont analysis is super helpful!",
            content: "The dynamic visual decomposition of ROE into Profit Margin, Asset Turnover and Financial Leverage made audit work 10 times easier. Great job!",
            screenshot: null,
            submittedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            appVersion: "1.0.0"
          },
          {
            id: "seed-fb-2",
            type: "bug",
            rating: 4,
            title: "Missing specific text labels on high leverage charts",
            content: "Fixed asset turn ratios were overlap printing slightly on small screen sizes. Please adjust margins.",
            screenshot: "screen_leak_compressed.png",
            submittedAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
            appVersion: "1.0.0"
          }
        ];
        localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(initialSeed));
        setFeedbacks(initialSeed);
      }
    } catch (e) {
      console.error("Failed to load feedbacks from local state", e);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setScreenshotBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFeedbackHistory = () => {
    if (confirm("Are you sure you want to delete all saved feedback logs?")) {
      try {
        localStorage.removeItem(STORAGE_FEEDBACK_KEY);
        setFeedbacks([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both a title and detailed comments.");
      return;
    }

    setIsSubmitting(true);

    // Simulate standard mock delay
    setTimeout(() => {
      const newFeedback: FeedbackItem = {
        id: "fb-" + Math.random().toString(36).substring(2, 11) + "-" + Date.now(),
        type: formType,
        rating,
        title: title.trim(),
        content: content.trim(),
        screenshot: screenshotName || screenshotBase64,
        submittedAt: new Date().toISOString(),
        appVersion: "1.0.0"
      };

      try {
        const storedList = localStorage.getItem(STORAGE_FEEDBACK_KEY);
        const parsedList: FeedbackItem[] = storedList ? JSON.parse(storedList) : [];
        const updatedList = [newFeedback, ...parsedList];
        
        localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(updatedList));
        setFeedbacks(updatedList);
      } catch (storageError) {
        console.error("Storage write failure", storageError);
      }

      setIsSubmitting(false);
      setShowToast(true);

      // Trigger standard mailto dispatch simulation in another tab if chosen
      // window.location.href = `mailto:support@finalyze.ai?subject=[Feedback-${formType}] ${encodeURIComponent(title)}&body=${encodeURIComponent(content)}`;

      // Reset form controls
      setTitle("");
      setContent("");
      setRating(5);
      setFormType("feature");
      setScreenshotName(null);
      setScreenshotBase64(null);

      // Toast auto-closes
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 2000);

    }, 1200);
  };

  const getTypeLabel = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "bug": return { text: t("feedback.bugReport"), bg: "bg-rose-50 text-rose-600 border-rose-100" };
      case "feature": return { text: t("feedback.featureSuggest"), bg: "bg-blue-50 text-blue-600 border-blue-100" };
      case "praise": return { text: t("feedback.praiseAccent"), bg: "bg-emerald-50 text-emerald-600 border-emerald-100" };
      default: return { text: t("feedback.generalInquiry"), bg: "bg-slate-50 text-slate-500 border-slate-200" };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Dynamic Toast banner inside active layer */}
      {showToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-55 bg-indigo-950 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-indigo-900">
          <CheckCircle size={15} className="text-emerald-400" />
          <span>{t("feedback.toastSubmitted")}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Tab Header Selector */}
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistoryTab(false)}
              className={`pb-1 text-sm font-black border-b-2 transition-all ${!showHistoryTab ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              {t("feedback.title")}
            </button>
            <button 
              onClick={() => {
                setShowHistoryTab(true);
                loadFeedbacks();
              }}
              className={`pb-1 text-sm font-black border-b-2 transition-all flex items-center gap-1.5 ${showHistoryTab ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              <History size={13} />
              {t("feedback.historyTitle")} ({feedbacks.length})
            </button>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Panel Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {!showHistoryTab ? (
            /* ============================================================== */
            /* 1. SUBMIT FEEDBACK FORM VIEW                                   */
            /* ============================================================== */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star evaluater prompt */}
              <div className="text-center space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{t("feedback.appraisal")}</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starIdx) => {
                    const isLit = hoveredRating !== null ? starIdx <= hoveredRating : starIdx <= rating;
                    return (
                      <button
                        key={starIdx}
                        type="button"
                        onMouseEnter={() => setHoveredRating(starIdx)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => setRating(starIdx)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={28} 
                          className={`transition-colors ${isLit ? "fill-amber-400 text-amber-500" : "text-slate-200"}`} 
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-slate-500">
                  {rating === 5 && "Outstanding 5/5 Stars - Exceeds professional criteria"}
                  {rating === 4 && "Great 4/5 Stars - Very reliable and functional"}
                  {rating === 3 && "Standard 3/5 Stars - Average operational efficiency"}
                  {rating === 2 && "Fair 2/5 Stars - Needs major enhancements"}
                  {rating === 1 && "Poor 1/5 Stars - Critical bugs preventing work"}
                </p>
              </div>

              {/* Feedback classification segment */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">{t("feedback.classification")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "bug", label: t("feedback.bugReport"), sub: "bug" },
                    { id: "feature", label: t("feedback.featureSuggest"), sub: "suggest" },
                    { id: "praise", label: t("feedback.praiseAccent"), sub: "praise" },
                    { id: "other", label: t("feedback.generalInquiry"), sub: "other" }
                  ].map((cat) => (
                    <label 
                      key={cat.id}
                      className={`p-3.5 border rounded-2xl cursor-pointer flex flex-col text-center hover:bg-slate-50 transition-all ${
                        formType === cat.id 
                          ? "border-primary bg-primary-bg/25 text-primary ring-1 ring-primary/20" 
                          : "border-slate-200 text-slate-650"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="entry-category" 
                        value={cat.id} 
                        checked={formType === cat.id}
                        onChange={() => setFormType(cat.id as any)}
                        className="sr-only" 
                    />
                      <span className="text-xs font-bold">{cat.label}</span>
                      <span className="text-[9px] text-slate-400 font-medium mt-0.5">{cat.sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-black tracking-widest text-slate-400">
                    <label>{t("feedback.summaryTitle")}</label>
                    <span>{title.length}/50</span>
                  </div>
                  <input
                    type="text"
                    maxLength={50}
                    placeholder="Provide a quick title summary..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs font-semibold px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-black tracking-widest text-slate-400">
                    <label>{t("feedback.detailedDesc")}</label>
                    <span className={content.length > 450 ? "text-rose-500 font-black" : ""}>{content.length}/500</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={500}
                    placeholder={t("feedback.subtitle")}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-700 resize-none font-sans"
                    required
                  />
                </div>
              </div>

              {/* Optional custom Screenshot attachments simulation */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">{t("feedback.screenshotLabel")}</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 border border-slate-200">
                    <ImageIcon size={14} className="text-slate-500" />
                    <span>Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleScreenshotChange} 
                    />
                  </label>
                  
                  {screenshotName ? (
                    <span className="text-xs font-bold text-slate-500 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle size={12} className="text-emerald-500" />
                      {screenshotName}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-450 font-medium">No screen simulation attachment uploaded. (Optional)</span>
                  )}
                </div>
              </div>

              {/* Actions buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black text-slate-650 transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t("common.loading")}</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>{t("common.submit")}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* ============================================================== */
            /* 2. FEEDBACK LOGS HISTORY VIEW                                  */
            /* ============================================================== */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">Saved Local Feedback Items</h3>
                  <p className="text-[11px] text-slate-400">Offline audit history of evaluations and reports</p>
                </div>
                {feedbacks.length > 0 && (
                  <button 
                    onClick={handleClearFeedbackHistory}
                    className="p-1.5 text-[10px] text-rose-500 hover:bg-rose-50 rounded-lg font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Clear all log indexes</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className="p-12 border border-dashed border-slate-150 rounded-2xl text-center space-y-2">
                    <MessageSquare size={24} className="text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">No active feedback logs located.</p>
                    <p className="text-[10px] text-slate-350">Fill the submit section above to commit fresh local responses.</p>
                  </div>
                ) : (
                  feedbacks.map((fb) => {
                    const badge = getTypeLabel(fb.type);
                    return (
                      <div 
                        key={fb.id}
                        className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/50 space-y-2.5 hover:border-slate-200 transition-colors group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black leading-none px-2 py-1 rounded border ${badge.bg}`}>
                              {badge.text}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={11} 
                                  className={i < fb.rating ? "fill-amber-400 text-amber-500" : "text-slate-200"} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            {new Date(fb.submittedAt).toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-xs text-slate-800 tracking-tight">{fb.title}</h4>
                          <p className="text-[11px] text-slate-550 mt-1 leading-relaxed whitespace-pre-line font-medium">
                            {fb.content}
                          </p>
                        </div>

                        {fb.screenshot && (
                          <div className="pt-2 flex items-center gap-1">
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded flex items-center gap-1.5">
                              <ImageIcon size={10} />
                              <span>Screen reference attached: {fb.screenshot.startsWith("data:") ? "custom_screencap.png" : fb.screenshot}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Support lines */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-450 font-semibold">
          <p>Local Store feedback log compiled inside client browser index sandbox.</p>
          <div className="flex items-center gap-3">
            <a 
              href="mailto:support@finalyze.ai" 
              className="text-primary hover:underline flex items-center gap-0.5"
            >
              <Mail size={11} />
              <span>Contact Support</span>
            </a>
            <span className="text-slate-300">|</span>
            <span>Version {feedbacks[0]?.appVersion || "1.0.0"}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==============================================================
// 3. FLOATING ACTION BUTTON (FAB) FOR EASY ENGAGEMENT
// ==============================================================
export const FeedbackFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary-light text-white text-xs font-black px-4 py-3 rounded-full flex items-center gap-2 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <MessageSquare size={16} className="group-hover:rotate-12 transition-transform" />
        <span>{t("feedback.button")}</span>
      </button>

      <FeedbackWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
