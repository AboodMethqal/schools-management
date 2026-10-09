"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageProvider';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(
        isAr
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        isAr
          ? 'كلمتا المرور غير متطابقتين.'
          : 'Passwords do not match.'
      );
      return;
    }

    setLoading(true);
    const { error: updateErr } = await updatePassword(password);
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message || (isAr ? 'فشل تحديث كلمة المرور.' : 'Failed to update password.'));
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-6 py-24 relative overflow-hidden text-text-primary">
      <div className="max-w-md w-full bg-bg-card/90 backdrop-blur-2xl border border-border-light rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <Lock size={30} />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-center mb-2">
          {isAr ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
        </h1>
        <p className="text-text-muted text-sm text-center font-medium mb-8">
          {isAr
            ? 'أدخل كلمة المرور الجديدة لحسابك لتسجيل الدخول.'
            : 'Enter your new account password to complete login.'}
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-black text-emerald-600 mb-2">
              {isAr ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!'}
            </h3>
            <p className="text-xs text-text-muted">
              {isAr ? 'جارٍ تحويلك إلى صفحة الدخول...' : 'Redirecting to login...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest ms-1">
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-5 pe-12 rounded-2xl bg-bg-page border border-border-light font-bold text-sm outline-none focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest ms-1">
                {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-5 rounded-2xl bg-bg-page border border-border-light font-bold text-sm outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-wider hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isAr ? 'حفظ كلمة المرور' : 'Save Password'}</span>
                  <ArrowRight size={16} className={isAr ? 'rotate-180' : ''} />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <Link
                href="/login"
                className="text-xs font-bold text-primary hover:underline"
              >
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
