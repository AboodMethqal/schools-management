"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    UserPlus, Save, ChevronLeft, User, GraduationCap,
    Users, MapPin, CheckCircle2, AlertCircle,
    RefreshCcw, Trash2, Mail, Lock, ShieldCheck, Info
} from "lucide-react";
import { addStudent, getStudent, updateStudent, deleteStudent } from "@/app/actions/student";
import { useLanguage } from "@/context/LanguageProvider";

export default function StudentForm() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const router = useRouter();
    const params = useParams();
    const studentId = params?.id ? decodeURIComponent(params.id as string) : "";
    const isEdit = !!studentId;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        registrationNo: "", firstName: "", lastName: "",
        dateOfBirth: "", gender: "", bloodGroup: "",
        religion: "", currentClass: "", section: "",
        rollNo: "", session: "", fatherName: "",
        motherName: "", guardianPhone: "", emergencyContact: "",
        email: "", password: "",
        parentEmail: "", parentPassword: "",
        presentAddress: "", permanentAddress: "",
    });

    useEffect(() => {
        let active = true;
        if (isEdit && studentId) {
            const loadData = async () => {
                setLoading(true);
                try {
                    const result = await getStudent(studentId);
                    if (!active) return;
                    if (result.success && result.data) {
                        const d = result.data;
                        setForm({
                            registrationNo: d.registrationNo || "",
                            firstName: d.firstName || "",
                            lastName: d.lastName || "",
                            dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth).toISOString().split('T')[0] : "",
                            gender: d.gender || "",
                            bloodGroup: d.bloodGroup || "",
                            religion: d.religion || "",
                            currentClass: d.currentClass || "",
                            section: d.sectionName || "",
                            rollNo: d.rollNo ? String(d.rollNo) : "",
                            session: d.session || "",
                            fatherName: d.fatherName || "",
                            motherName: d.motherName || "",
                            guardianPhone: d.guardianPhone || "",
                            emergencyContact: d.emergencyContact || "",
                            email: d.email || "",
                            password: "",
                            parentEmail: d.parents?.[0]?.email || "",
                            parentPassword: "",
                            presentAddress: d.presentAddress || "",
                            permanentAddress: d.permanentAddress || "",
                        });
                    } else { setError(result.error || "Student record not found."); }
                } catch (err) { setError("Failed to load student data."); }
                finally { if (active) setLoading(false); }
            };
            loadData();
        } else { setLoading(false); }
        return () => { active = false; };
    }, [studentId, isEdit]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            const submissionData = { ...form, rollNo: Number(form.rollNo) || 0 };
            const result = isEdit ? await updateStudent(studentId!, submissionData) : await addStudent(submissionData);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => router.push("/dashboard/principal/students"), 2000);
            } else { setError(result.error || "An error occurred."); }
        } catch (err) { setError("Server connection failed."); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;
        const result = await deleteStudent(studentId!);
        if (result.success) router.push("/dashboard/principal/students");
        else alert(result.error);
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950 italic font-bold animate-pulse text-primary">
            {isAr ? 'جارٍ مزامنة بيانات الطالب...' : 'SYNCING STUDENT DATA...'}
        </div>
    );

    if (success) return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center bg-white dark:bg-slate-950">
            <CheckCircle2 size={80} className="text-emerald-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">{isAr ? 'تم بنجاح!' : 'Success!'}</h2>
            <p className="text-muted-foreground dark:text-slate-400 uppercase text-xs font-bold tracking-widest mt-2">{isAr ? 'تم تحديث قاعدة البيانات بنجاح' : 'Database Updated Successfully'}</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-bg-page/30 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${isEdit ? 'bg-blue-600' : 'bg-primary'} text-white shadow-lg`}>
                            {isEdit ? <RefreshCcw size={28} /> : <UserPlus size={28} />}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight dark:text-white">
                                {isEdit ? (isAr ? "تحديث بيانات الطالب" : "Update Student") : (isAr ? "تسجيل طالب جديد" : "New Enrollment")}
                            </h1>
                            <p className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-[0.2em]">
                                {isAr ? 'العام الدراسي 2024-25 • إدارة القبول والتسجيل' : 'Session 2024-25 • Admission Management'}
                            </p>
                        </div>



                    </div>
                    <Button variant="ghost" onClick={() => router.back()} className="w-fit text-[10px] font-black uppercase tracking-widest dark:text-slate-300 dark:hover:bg-slate-900">
                        <ChevronLeft className="me-2" size={14} /> {isAr ? "رجوع" : "Back"}
                    </Button>


                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push("/dashboard/principal/students/bulk-add")} className="w-fit text-[10px] font-black uppercase tracking-widest dark:text-slate-300 dark:hover:bg-slate-900">
                        <UserPlus className="me-2" size={14} /> {isAr ? "إضافة طلاب مجمعة" : "Add Bulk Students"}
                    </Button>
                </div>


                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: All Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-s-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-2 rounded-e-xl">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {/* Account Credentials */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-4">
                                <ShieldCheck className="text-primary dark:text-blue-400" size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{isAr ? 'بيانات تسجيل الدخول' : 'Login Credentials'}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground dark:text-slate-400 tracking-widest">{isAr ? 'البريد الإلكتروني *' : 'Email Address *'}</label>
                                    <Input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="student@school.com" className="h-12 rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground dark:text-slate-400 tracking-widest">{isAr ? 'كلمة المرور *' : 'Login Password *'}</label>
                                    <Input name="password" type="password" value={form.password} onChange={handleChange} required={!isEdit} placeholder={isEdit ? "••••••••" : (isAr ? "الافتراضي: Student@1234" : "Default: Student@1234")} className="h-12 rounded-xl dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-4">
                                <User className="text-blue-500 dark:text-blue-400" size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{isAr ? 'الملف الشخصي' : 'Personal Profile'}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase dark:text-slate-400">{isAr ? 'رقم القيد *' : 'Reg No *'}</label>
                                    <Input name="registrationNo" value={form.registrationNo} onChange={handleChange} required className="h-11 rounded-lg dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase dark:text-slate-400">{isAr ? 'الاسم الأول *' : 'First Name *'}</label>
                                    <Input name="firstName" value={form.firstName} onChange={handleChange} required className="h-11 rounded-lg dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase dark:text-slate-400">{isAr ? 'اسم العائلة *' : 'Last Name *'}</label>
                                    <Input name="lastName" value={form.lastName} onChange={handleChange} required className="h-11 rounded-lg dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase dark:text-slate-400">{isAr ? 'تاريخ الميلاد *' : 'Date of Birth *'}</label>
                                    <Input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required className="h-11 rounded-lg dark:bg-slate-950 dark:border-slate-800 dark:text-white [color-scheme:dark]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase dark:text-slate-400">{isAr ? 'الجنس *' : 'Gender *'}</label>
                                    <select name="gender" value={form.gender} onChange={handleChange} required className="w-full h-11 rounded-lg border dark:border-slate-800 px-3 text-sm font-medium bg-white dark:bg-slate-950 dark:text-white outline-none">
                                        <option value="">{isAr ? 'اختر' : 'Select'}</option>
                                        <option value="Male">{isAr ? 'ذكر' : 'Male'}</option>
                                        <option value="Female">{isAr ? 'أنثى' : 'Female'}</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase dark:text-slate-400">{isAr ? 'فصيلة الدم' : 'Blood Group'}</label>
                                    <Input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="h-11 rounded-lg dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Academic & Parents */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-tighter flex items-center gap-2 dark:text-blue-400"><GraduationCap size={16} /> {isAr ? 'المعلومات الأكاديمية' : 'Academic Info'}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <select name="currentClass" value={form.currentClass} onChange={handleChange} required className="h-11 rounded-lg border dark:border-slate-800 px-3 text-xs font-medium bg-white dark:bg-slate-950 dark:text-white outline-none">
                                        <option value="">{isAr ? 'اختر الفصل *' : 'Select Class *'}</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={`Class ${i + 1}`}>{isAr ? `الصف ${i + 1}` : `Class ${i + 1}`}</option>
                                        ))}
                                    </select>
                                    <Input name="section" value={form.section} onChange={handleChange} placeholder={isAr ? "الشعبة *" : "Section *"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                    <Input name="rollNo" type="number" value={form.rollNo} onChange={handleChange} placeholder={isAr ? "رقم الجلوس *" : "Roll *"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                    <Input name="session" value={form.session} onChange={handleChange} placeholder={isAr ? "العام الدراسي *" : "Session *"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-tighter flex items-center gap-2 dark:text-emerald-400"><Users size={16} /> {isAr ? 'بيانات ولي الأمر' : 'Family Info'}</h4>
                                <div className="space-y-3">
                                    <Input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder={isAr ? "اسم الأب *" : "Father's Name *"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                    <Input name="motherName" value={form.motherName} onChange={handleChange} placeholder={isAr ? "اسم الأم *" : "Mother's Name *"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                    <Input name="guardianPhone" value={form.guardianPhone} onChange={handleChange} placeholder={isAr ? "هاتف ولي الأمر *" : "Guardian Phone *"} className="h-11 rounded-lg text-xs font-bold dark:bg-slate-950 dark:border-slate-800 dark:text-white" />

                                    <div className="pt-2 border-t dark:border-slate-800 space-y-3">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground dark:text-slate-500 tracking-widest">{isAr ? 'حساب ولي الأمر (اختياري)' : 'Parent Account (Optional)'}</p>
                                        <Input name="parentEmail" type="email" value={form.parentEmail} onChange={handleChange} placeholder={isAr ? "بريد ولي الأمر (pa.regno@school.site)" : "Parent Email (pa.regno@school.site)"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                        <Input name="parentPassword" type="password" value={form.parentPassword} onChange={handleChange} placeholder={isAr ? "كلمة مرور ولي الأمر (الافتراضي: Parent@1234)" : "Parent Password (Def: Parent@1234)"} className="h-11 rounded-lg text-xs dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Action & Address */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm space-y-4">
                            <h3 className="text-xs font-black uppercase flex items-center gap-2 dark:text-white"><MapPin size={16} /> {isAr ? 'العنوان' : 'Address'}</h3>
                            <textarea
                                name="presentAddress" rows={4} value={form.presentAddress} onChange={handleChange} required
                                placeholder={isAr ? "عنوان سكن الطالب *" : "Student's Residential Address *"}
                                className="w-full rounded-xl border dark:border-slate-800 p-4 text-xs font-medium outline-none focus:ring-2 ring-primary/20 transition-all dark:bg-slate-950 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" disabled={isSubmitting} className={`h-16 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary'} text-white`}>
                                {isSubmitting ? <RefreshCcw className="animate-spin me-2" /> : <Save className="me-2" size={18} />}
                                {isSubmitting ? (isAr ? "جارٍ المزامنة..." : "Syncing...") : isEdit ? (isAr ? "تحديث السجل" : "Update Record") : (isAr ? "إتمام التسجيل" : "Finalize Registration")}
                            </Button>

                            {isEdit && (
                                <Button type="button" onClick={handleDelete} variant="outline" className="h-14 rounded-2xl border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px] font-bold uppercase tracking-widest">
                                    <Trash2 size={16} className="me-2" /> {isAr ? 'حذف الطالب' : 'Delete Student'}
                                </Button>
                            )}
                        </div>

                        <div className="p-4 bg-primary/5 dark:bg-blue-900/10 rounded-2xl border border-dashed border-primary/20 dark:border-blue-800/50">
                            <div className="flex gap-2 text-primary/70 dark:text-blue-400">
                                <Info size={16} className="shrink-0" />
                                <p className="text-[9px] font-bold leading-relaxed uppercase">{isAr ? 'سيكون البريد الإلكتروني المسجل هنا هو اسم المستخدم للطالب لتسجيل الدخول إلى البوابة.' : "Email used here will be the student's username for logging into the portal."}</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
