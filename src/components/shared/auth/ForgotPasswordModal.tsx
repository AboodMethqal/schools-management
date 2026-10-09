"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, LockKeyhole, X, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

type Props = {
  showForgotModal: boolean;
  closeForgotModal: () => void;
  resetEmail: string;
  setResetEmail: React.Dispatch<React.SetStateAction<string>>;
  resetLoading: boolean;
  resetError: string;
  resetSuccess: boolean;
  handleSendResetLink: () => Promise<void>;
};

export default function ForgotPasswordModal({
  showForgotModal,
  closeForgotModal,
  resetEmail,
  setResetEmail,
  resetLoading,
  resetError,
  resetSuccess,
  handleSendResetLink,
}: Props) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  if (typeof window === "undefined") return null;
  if (!showForgotModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendResetLink();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeForgotModal}
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[92%] max-w-[420px] bg-bg-card rounded-[2rem] p-8 shadow-2xl border border-border-light"
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeForgotModal}
            className="absolute top-5 end-5 p-2 text-text-muted hover:bg-secondary rounded-full"
          >
            <X size={20} />
          </button>

          {!resetSuccess ? (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <LockKeyhole size={22} />
                </div>

                <h3 className="text-2xl font-black">
                  {isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"}
                </h3>
                <p className="text-sm text-text-muted font-bold mt-2 opacity-70">
                  {isAr
                    ? "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور."
                    : "Enter your email and we'll send a reset link."}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-1.5 mb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest ms-1">
                    {isAr ? "البريد الإلكتروني" : "Email Address"}
                  </label>

                  <div className="relative">
                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted">
                      <Mail size={16} />
                    </div>

                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="yourname@school.com"
                      className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light outline-none font-bold text-sm"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {resetError && (
                  <p className="text-rose-500 text-xs font-bold mb-4 ms-1">
                    {resetError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full h-12 rounded-2xl bg-primary text-white font-black uppercase flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      {isAr ? "إرسال رابط التعيين" : "Send Reset Link"}
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle size={36} />
              </div>

              <h3 className="text-2xl font-black">
                {isAr ? "تم إرسال الرابط!" : "Link Sent!"}
              </h3>

              <p className="text-sm text-text-muted font-bold mt-3">
                {isAr ? "تم إرسال رابط التعيين إلى " : "Reset link sent to "}
                <span className="text-primary font-black">{resetEmail}</span>
              </p>

              <button
                type="button"
                onClick={closeForgotModal}
                className="mt-8 px-8 py-3 rounded-2xl border-2 border-border-light font-black uppercase text-[10px]"
              >
                {isAr ? "العودة لتسجيل الدخول" : "Back to Login"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
