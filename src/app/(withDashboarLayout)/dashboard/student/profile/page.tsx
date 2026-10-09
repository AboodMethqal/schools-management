"use client"

import React, { useEffect, useState } from "react"
import { User, Mail, Phone, MapPin, GraduationCap, Edit3, Save, X, Loader2 } from "lucide-react"
import { getMyStudentProfile, updateMyStudentProfile } from "@/app/actions/principle/student"
import Swal from "sweetalert2"
import { useLanguage } from "@/context/LanguageProvider";

export default function ProfilePage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const res = await getMyStudentProfile();
            if (res.success) setStudent(res.data);
            setLoading(false);
        }
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formElement = e.currentTarget; 
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());

        // 🟢 SweetAlert2 in English
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Your profile information will be updated!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel',
            background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#000'
        });

        if (result.isConfirmed) {
            setIsSaving(true);
            const res = await updateMyStudentProfile(data);
            if (res.success) {
                setStudent(res.data);
                setIsEditing(false);
                Swal.fire({
                    title: 'Success!',
                    text: 'Profile updated successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#000'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: res.error || 'Could not update profile.',
                    icon: 'error',
                    background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#000'
                });
            }
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500 px-4">
            {/* Header */}
            <div className="flex justify-between items-end mt-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight italic uppercase">My Profile</h1>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md ${isEditing ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-blue-600 dark:hover:bg-blue-500'}`}
                >
                    {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
                </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Profile Banner & Avatar */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="h-32 bg-slate-900 dark:bg-slate-950 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 opacity-90"></div>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative flex flex-col items-center -mt-12 md:flex-row md:items-end md:-mt-16 md:space-x-6">
                            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-lg flex items-center justify-center text-4xl font-bold text-slate-500 dark:text-slate-400">
                                {student?.firstName?.[0]}{student?.lastName?.[0]}
                            </div>
                            <div className="mt-4 md:mt-0 md:pb-2 text-center md:text-start flex-1">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input name="firstName" defaultValue={student.firstName} className="text-xl font-bold bg-transparent border-b-2 border-blue-400 dark:text-white outline-none w-1/2" />
                                        <input name="lastName" defaultValue={student.lastName} className="text-xl font-bold bg-transparent border-b-2 border-blue-400 dark:text-white outline-none w-1/2" />
                                    </div>
                                ) : (
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student?.firstName} {student?.lastName}</h2>
                                )}
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{student?.currentClass} - {student?.sectionName || "General Section"}</p>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide border border-emerald-200 dark:border-emerald-800">
                                        Active Student
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identity Info */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Personal Details
                        </h3>
                        <div className="space-y-4">
                            <InfoRow isEditing={isEditing} label="Student ID" name="registrationNo" value={student.registrationNo} disabled />
                            <InfoRow isEditing={isEditing} label="Date of Birth" name="dateOfBirth" value={new Date(student.dateOfBirth).toLocaleDateString()} disabled />
                            <InfoRow isEditing={isEditing} label="Gender" name="gender" value={student.gender} disabled />
                            <InfoRow isEditing={isEditing} label="Blood Group" name="bloodGroup" value={student.bloodGroup} />
                            <InfoRow isEditing={isEditing} label="Religion" name="religion" value={student.religion} />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">
                            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Academic Information
                        </h3>
                        <div className="space-y-4">
                            <InfoRow isEditing={isEditing} label="Class & Section" name="currentClass" value={`${student.currentClass} (${student.sectionName || "A"})`} disabled />
                            <InfoRow isEditing={isEditing} label="Roll Number" name="rollNo" value={student.rollNo} disabled />
                            <InfoRow isEditing={isEditing} label="Admission Date" name="admissionDate" value={new Date(student.admissionDate).toLocaleDateString()} disabled />
                            <InfoRow isEditing={isEditing} label="Session" name="session" value={student.session} disabled />
                        </div>
                    </div>

                    {/* Contact & Family (Full Width) */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">
                            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Contact & Family
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <ContactItem icon={<Phone className="h-4 w-4" />} label="Guardian Phone" isEditing={isEditing}>
                                    <input name="guardianPhone" defaultValue={student.guardianPhone} disabled={!isEditing} className={`w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none ${isEditing ? 'border-b border-blue-400' : ''}`} />
                                </ContactItem>
                                <ContactItem icon={<Mail className="h-4 w-4" />} label="Email Address" isEditing={false}>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{student.user?.email}</p>
                                </ContactItem>
                            </div>
                            <div className="space-y-4">
                                <ContactItem icon={<MapPin className="h-4 w-4" />} label="Present Address" isEditing={isEditing}>
                                    <textarea name="presentAddress" defaultValue={student.presentAddress} disabled={!isEditing} rows={2} className={`w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none resize-none ${isEditing ? 'border-b border-blue-400' : ''}`} />
                                </ContactItem>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Save Button */}
                {isEditing && (
                    <div className="fixed bottom-10 start-1/2 -translate-x-1/2 z-50">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex items-center gap-3 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-10 py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {isSaving ? "Saving..." : "Save Profile Changes"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

// --- Helper Components ---

function InfoRow({ isEditing, label, name, value, disabled }: any) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 rounded-lg transition-colors">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
            {isEditing && !disabled ? (
                <input 
                    name={name} 
                    defaultValue={value} 
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-transparent border-b border-blue-300 dark:border-blue-700 outline-none text-end" 
                />
            ) : (
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{value || "N/A"}</span>
            )}
        </div>
    );
}

function ContactItem({ icon, label, children }: any) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-lg border border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 transition-all group">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-blue-500 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
                {children}
            </div>
        </div>
    );
}
