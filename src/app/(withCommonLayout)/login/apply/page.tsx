"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    School,
    Mail,
    User,
    Phone,
    Building,
    ArrowRight,
    ArrowLeft,
    FileText,
    Sparkles,
    ShieldCheck,
    EyeOff,
    Eye
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/footer/Footer";
import PageLoader from '@/components/shared/PageLoader';
import toast from 'react-hot-toast';
import { submitSchoolApplication } from '@/app/actions/application';
import { useLanguage } from '@/context/LanguageProvider';
import { TbLockPassword } from 'react-icons/tb';


const AdminApplyPage = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [submittedRef, setSubmittedRef] = useState<string>('');
    const [formData, setFormData] = useState({
        schoolName: '',
        adminName: '',
        email: '',
        phone: '',
        instituteCode: '',
        password: '',
        message: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setLoading(true);

        const result = await submitSchoolApplication({
          schoolName: formData.schoolName,
          adminName: formData.adminName,
          email: formData.email,
          phone: formData.phone,
          instituteCode: formData.instituteCode,
          password: formData.password,
          message: formData.message,
        });

        if (!result.success) {
          toast.error(result.error || (isAr ? 'فشل إرسال الطلب' : 'Failed to submit application'));
          return;
        }

        setSubmittedRef(result.applicationNo || '');
        setStep(3);
        toast.success(isAr ? 'تم تقديم الطلب بنجاح وهو قيد المراجعة!' : 'Application submitted successfully and is awaiting review!');

      } catch (err: any) {
        toast.error(err.message || (isAr ? 'فشل إرسال الطلب' : 'Failed to submit application'));
      } finally {
        setLoading(false);
      }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="flex flex-col min-h-screen bg-bg-page relative overflow-hidden text-text-primary">
            <Navbar />

            {/* Background Decor */}
            <div className="absolute top-0 start-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-[0.03] bg-emerald-600" />
                <div className="absolute bottom-[-10%] end-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
                <div className="w-full max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 || step === 2 ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-bg-card/80 backdrop-blur-3xl rounded-[2.5rem] border border-border-light shadow-2xl overflow-hidden"
                            >
                                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />

                                <div className="p-8 md:p-12">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[9px] uppercase tracking-[0.25em] mb-4">
                                                <Sparkles size={12} />
                                                {language === 'ar' ? 'انضمام المؤسسات التعليمية' : 'Institution Onboarding'}
                                            </div>
                                            <h1 className="text-3xl font-black tracking-tight">
                                                {language === 'ar' ? 'طلب انضمام مدرسة جديدة' : 'Admin Application'}
                                            </h1>
                                            <p className="text-text-muted font-bold text-sm mt-2 opacity-70">
                                                {language === 'ar' ? 'قدم طلبك لإدارة مؤسستك التعليمية بأحدث بنية تحتية رقمية عبر منصة مثقال تك.' : 'Apply to manage your school with our advanced infrastructure.'}
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                            <School size={32} />
                                        </div>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                    {language === 'ar' ? 'اسم المؤسسة التعليمية' : 'Institution Name'}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <Building size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="schoolName"
                                                        value={formData.schoolName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder={language === 'ar' ? "مثال: مدرسة الأمل النموذجية" : "e.g. Skyline Academy"}
                                                        className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                    {language === 'ar' ? 'اسم المسؤول بالكامل' : 'Admin Full Name'}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <User size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="adminName"
                                                        value={formData.adminName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder={language === 'ar' ? "محمد الأحمد" : "John Doe"}
                                                        className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                    {t('email') || (language === 'ar' ? 'البريد الإلكتروني المهني' : 'Business Email')}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <Mail size={16} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="admin@school.com"
                                                        className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                    {language === 'ar' ? 'رقم الهاتف' : 'Contact Number'}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <Phone size={16} />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="+966 50 000 0000"
                                                        className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                    {language === 'ar' ? 'رمز أو رقم الترخيص (اختياري)' : 'Institute / License Code (Optional)'}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <FileText size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="instituteCode"
                                                        value={formData.instituteCode}
                                                        onChange={handleChange}
                                                        placeholder={language === 'ar' ? "SCH-2026-XYZ" : "e.g. SCH-2026-XYZ"}
                                                        className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                    {t('password') || (language === 'ar' ? 'كلمة المرور' : 'Password')}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors">
                                                        <TbLockPassword size={16} />
                                                    </div>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="••••••••"
                                                        className="w-full h-12 ps-12 pe-12 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute end-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                                                {language === 'ar' ? 'رسالة أو ملاحظات إضافية (اختياري)' : 'Additional Notes / Message (Optional)'}
                                            </label>
                                            <textarea
                                                name="message"
                                                rows={3}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder={language === 'ar' ? "أية معلومات إضافية عن أعداد الطلاب أو البرامج المطلوبة..." : "Any additional information regarding your school size or requirements..."}
                                                className="w-full p-4 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group mt-4"
                                        >
                                            {language === 'ar' ? 'إرسال طلب الانضمام' : 'Submit Application'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <div className="text-center pt-4">
                                            <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
                                                <ArrowLeft size={14} /> {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-bg-card/80 backdrop-blur-3xl rounded-[2.5rem] border border-border-light shadow-2xl p-12 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                    <ShieldCheck size={40} />
                                </div>
                                <h1 className="text-3xl font-black tracking-tight mb-3">
                                    {language === 'ar' ? 'تم استلام طلبك بنجاح' : 'Application Received'}
                                </h1>
                                
                                {submittedRef && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-mono font-black text-sm tracking-wider mb-6">
                                        <span>{language === 'ar' ? 'رقم المرجع:' : 'Reference No:'}</span>
                                        <span>{submittedRef}</span>
                                    </div>
                                )}

                                <p className="text-text-muted font-bold text-sm max-w-md mx-auto mb-8 leading-relaxed">
                                    {language === 'ar' 
                                        ? 'تم حفظ طلب تسجيل مؤسستك في قاعدة البيانات المركزية بنجاح وهو الآن قيد مراجعة المشرف العام (Super Admin). يرجى الاحتفاظ برقم المرجع أعلاه لمتابعة حالة الطلب.'
                                        : 'Your school application has been saved to the database and is currently awaiting review by the Super Admin team. Please retain your reference number above for status tracking.'}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href="/login"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-600/20 transition-all"
                                    >
                                        <ArrowLeft size={16} />
                                        {language === 'ar' ? 'العودة لصفحة تسجيل الدخول' : 'Return to Login'}
                                    </Link>
                                    <Link
                                        href="/"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-2xl bg-bg-page border border-border-light font-black uppercase text-xs tracking-widest hover:border-primary/20 hover:text-primary transition-all shadow-sm"
                                    >
                                        {language === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminApplyPage;
