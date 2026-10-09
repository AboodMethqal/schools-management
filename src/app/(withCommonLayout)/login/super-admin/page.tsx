"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight,
    ShieldCheck, ArrowLeft,
    Terminal,
    ShieldAlert,
    Cpu
} from 'lucide-react';
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/footer/Footer";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageProvider";

const SuperAdminLoginPage = () => {
    const router = useRouter();
    const { signIn } = useAuth();
    const { t, language } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message || (language === 'ar' ? 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.' : 'Authentication failed.'));
            setIsLoading(false);
        } else {
            router.push('/dashboard/super-admin');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-bg-page relative overflow-hidden">
            <Navbar />

            {/* Background Elements */}
            <div className="absolute top-0 start-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -start-[10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] -end-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
            </div>

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
                <div className="w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-bg-card/90 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-border-light shadow-[0_40px_80px_rgba(0,0,0,0.12)] relative overflow-hidden">
                            {/* Accent Bar */}
                            <div className="absolute top-0 start-0 w-full h-2 bg-rose-600 shadow-[0_2px_10px_rgba(225,29,72,0.3)]" />

                            <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-rose-600 font-bold transition-colors mb-8 text-sm group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform rtl:rotate-180" /> 
                                {language === 'ar' ? 'العودة لاختيار الدور' : 'Back to Role Selection'}
                            </Link>

                            <div className="mb-10">
                                <div className="inline-flex p-4 rounded-3xl bg-rose-600/10 text-rose-600 mb-6 shadow-inner">
                                    <ShieldCheck size={32} />
                                </div>
                                <h1 className="text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
                                    {language === 'ar' ? 'دخول المشرف العام' : 'Owner Access'} 
                                    <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                        {language === 'ar' ? 'التحكم المركزي' : 'Master Control'}
                                    </span>
                                </h1>
                                <p className="text-text-muted font-bold mt-2 leading-relaxed">
                                    {language === 'ar' ? 'بوابة خاصة للإدارة العليا والمالك لإدارة كامل منصة مثقال تك ومؤسساتها.' : 'Exclusive entry for the website owner to manage the entire ecosystem.'}
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[11px] font-black uppercase tracking-wider text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] ms-1">
                                        {language === 'ar' ? 'البريد الإلكتروني للمشرف العام' : 'Master Email Address'}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-rose-600 transition-colors">
                                            <Terminal size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="superadmin@methqal.tech"
                                            className="w-full h-14 ps-14 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-rose-600 focus:ring-4 focus:ring-rose-600/5 outline-none transition-all font-bold text-text-primary"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ms-1">
                                        <label className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">
                                            {language === 'ar' ? 'كلمة المرور الرئيسية' : 'Root Password'}
                                        </label>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-600/5 px-2 py-0.5 rounded-full">
                                            <ShieldAlert size={10} /> {language === 'ar' ? 'الحماية مفعلة' : 'MFA Active'}
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-rose-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-14 ps-14 pe-14 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-rose-600 focus:ring-4 focus:ring-rose-600/5 outline-none transition-all font-bold text-text-primary"
                                            disabled={isLoading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute end-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.25em] text-white shadow-2xl transition-all flex items-center justify-center gap-3 group active:scale-[0.98] mt-8 bg-rose-600 shadow-rose-600/30 hover:shadow-rose-600/40 relative overflow-hidden"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>{language === 'ar' ? 'تسجيل الدخول للنظام المركزي' : 'Authenticate Core'}</span>
                                            <Cpu size={20} className="group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-border-light bg-rose-600/[0.02] -mx-12 px-12 pb-2">
                                <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">
                                    {language === 'ar' ? 'بروتوكول الأمان العالي مثقال تك' : 'Security Protocol X-RAY'}
                                </p>
                                <p className="text-center text-[9px] font-bold text-text-muted leading-tight opacity-70">
                                    {language === 'ar' ? 'يتم تشفير وتوثيق جميع عمليات الوصول مركزياً لضمان سلامة بيانات المنصة.' : 'All access attempts are cryptographically logged. Unauthorized access to Level 0 systems is strictly prohibited.'}
                                </p>
                            </div>

                            <p className="text-center mt-8 text-text-muted font-bold text-sm border-t border-border-light/50 pt-8 opacity-50">
                                {language === 'ar' ? 'منصة مثقال تك لإدارة المدارس - النظام المركزي' : 'Methqal Tech School Management SaaS Platform'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SuperAdminLoginPage;
