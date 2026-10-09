"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { changeInitialPassword } from '@/app/actions/password';
import { useLanguage } from '@/context/LanguageProvider';

export default function ChangePasswordPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!currentPassword) {
            setError(isAr ? 'يرجى إدخال كلمة المرور الحالية (المؤقتة).' : 'Please enter your current temporary password.');
            return;
        }

        if (newPassword.length < 6) {
            setError(isAr ? 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.' : 'New password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(isAr ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
            return;
        }

        if (newPassword === currentPassword) {
            setError(isAr ? 'يجب أن تختلف كلمة المرور الجديدة عن كلمة المرور المؤقتة.' : 'New password must differ from temporary password.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await changeInitialPassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            if (res.success) {
                setSuccess(true);
                const roleRoutes: Record<string, string> = {
                    super_admin: '/dashboard/super-admin',
                    admin: '/dashboard/principal',
                    teacher: '/dashboard/teacher',
                    student: '/dashboard/student',
                    parent: '/dashboard/parent',
                    accountant: '/dashboard/accountant',
                };
                const dest = (res.role && roleRoutes[res.role]) || '/dashboard';
                setTimeout(() => {
                    window.location.href = dest;
                }, 1500);
            } else {
                setError(res.error || (isAr ? 'فشل تغيير كلمة المرور.' : 'Failed to change password.'));
            }
        } catch (err: any) {
            setError(isAr ? 'حدث خطأ في الاتصال بالخادم.' : 'Server connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-page px-6 py-20 text-text-primary">
            <div className="max-w-md w-full bg-bg-card border border-border-light rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                    <ShieldAlert size={32} />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black tracking-tight">
                        {isAr ? 'تغيير كلمة المرور الإلزامي' : 'Mandatory Password Change'}
                    </h1>
                    <p className="text-xs text-text-muted leading-relaxed">
                        {isAr
                            ? 'لقد سجلت الدخول باستخدام كلمة مرور مؤقتة. لدواعي الأمان، يجب تعيين كلمة مرور جديدة وخاصة بك للمتابعة إلى لوحة التحكم.'
                            : 'You have logged in with a temporary password. For account security, you must set a new permanent password to access the dashboard.'}
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold leading-relaxed">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center py-6 space-y-3">
                        <CheckCircle2 size={48} className="text-emerald-500 mx-auto animate-bounce" />
                        <h3 className="text-lg font-black text-emerald-600">
                            {isAr ? 'تم تحديث كلمة المرور بنجاح!' : 'Password Updated Successfully!'}
                        </h3>
                        <p className="text-xs text-text-muted">
                            {isAr ? 'جارٍ تحويلك إلى لوحة التحكم الخاصة بك...' : 'Redirecting to your dashboard...'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current (Temporary) Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                {isAr ? 'كلمة المرور المؤقتة الحالية *' : 'Current Temporary Password *'}
                            </label>
                            <div className="relative">
                                <Input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    placeholder={isAr ? 'أدخل كلمة المرور الحالية' : 'Enter current temporary password'}
                                    className="h-12 rounded-xl pe-10 text-xs dark:bg-slate-950 dark:border-slate-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute inset-y-0 end-3 flex items-center text-text-muted hover:text-text-primary"
                                >
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                {isAr ? 'كلمة المرور الجديدة *' : 'New Password *'}
                            </label>
                            <div className="relative">
                                <Input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder={isAr ? '6 خانات على الأقل' : 'At least 6 characters'}
                                    className="h-12 rounded-xl pe-10 text-xs dark:bg-slate-950 dark:border-slate-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute inset-y-0 end-3 flex items-center text-text-muted hover:text-text-primary"
                                >
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                {isAr ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder={isAr ? 'أعد إدخال كلمة المرور الجديدة' : 'Re-enter new password'}
                                    className="h-12 rounded-xl pe-10 text-xs dark:bg-slate-950 dark:border-slate-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 end-3 flex items-center text-text-muted hover:text-text-primary"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg mt-2"
                        >
                            {isLoading
                                ? (isAr ? 'جارٍ الحفظ...' : 'Saving...')
                                : (isAr ? 'حفظ كلمة المرور ومتابعة' : 'Save Password & Continue')}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
