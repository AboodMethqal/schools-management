"use client";
import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Save, Camera, 
    Shield, UserCircle, Calendar, Briefcase, GraduationCap, 
    Droplets, Loader2, Target
} from 'lucide-react';
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import { getMyTeacherProfile, updateTeacherProfile } from "@/app/actions/principle/profile"; 
import Swal from "sweetalert2";

export default function ProfilePage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        teacherId: "",
        phone: "",
        designation: "",
        department: "",
        qualification: "",
        gender: "",
        bloodGroup: "",
        religion: "",
        presentAddress: "",
        permanentAddress: "",
        dateOfBirth: "",
        joiningDate: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            const res = await getMyTeacherProfile();
            
            if (res.success && res.data) {
                const teacher = res.data;
                const user = teacher.user;

                setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                    teacherId: teacher.teacherId || "",
                    phone: teacher.phone || "",
                    designation: teacher.designation || "",
                    department: teacher.department || "",
                    qualification: teacher.qualification || "",
                    gender: teacher.gender || "",
                    bloodGroup: teacher.bloodGroup || "",
                    religion: teacher.religion || "",
                    presentAddress: teacher.presentAddress || "",
                    permanentAddress: teacher.permanentAddress || "",
                    dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : "",
                    joiningDate: teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "",
                });
            }
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleUpdate = async () => {
        setUpdating(true);
        const res = await updateTeacherProfile(formData);
        setUpdating(false);
        
        if (res.success) {
            Swal.fire({
                title: "Success!",
                text: res.message,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire("Error!", res.error, "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title="Profile"
                highlight="Settings"
                emoji="👤"
                subtitle="Manage your personal information and profile details."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-bg-card rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden text-center p-10">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/30 uppercase">
                                {formData.name ? formData.name.substring(0, 2) : "AR"}
                            </div>
                            <button className="absolute -bottom-2 -end-2 p-2.5 bg-white dark:bg-slate-800 border border-border-light rounded-2xl shadow-xl text-primary hover:scale-110 transition-all">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="text-2xl font-black text-text-primary uppercase tracking-wider">{formData.name}</h2>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-2">{formData.designation}</p>

                        <div className="mt-10 space-y-4 text-start">
                            <SidebarItem icon={<Shield size={18}/>} label="Employee ID" value={formData.teacherId} />
                            <SidebarItem icon={<Briefcase size={18}/>} label="Department" value={formData.department} />
                            <SidebarItem icon={<Calendar size={18}/>} label="Joining Date" value={formData.joiningDate} />
                        </div>
                    </div>
                </div>

                {/* Right Area - Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-bg-card rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        {/* Header instead of Tabs */}
                        <div className="bg-bg-page px-8 py-6 border-b border-border-light flex items-center gap-3">
                            <UserCircle size={22} className="text-primary" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">General Information</h3>
                        </div>

                        <div className="p-8 md:p-12 flex-1">
                            <div className="space-y-10 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField label="Full Name" icon={<User size={14}/>} value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                                    <InputField label="Email Address" icon={<Mail size={14}/>} value={formData.email} disabled />
                                    <InputField label="Phone Number" icon={<Phone size={14}/>} value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                                    <InputField label="Designation" icon={<Target size={14}/>} value={formData.designation} onChange={(v: string) => setFormData({...formData, designation: v})} />
                                    <InputField label="Department" icon={<Briefcase size={14}/>} value={formData.department} onChange={(v: string) => setFormData({...formData, department: v})} />
                                    <InputField label="Qualification" icon={<GraduationCap size={14}/>} value={formData.qualification} onChange={(v: string) => setFormData({...formData, qualification: v})} />
                                    <InputField label="Date of Birth" type="date" icon={<Calendar size={14}/>} value={formData.dateOfBirth} onChange={(v: string) => setFormData({...formData, dateOfBirth: v})} />
                                    <InputField label="Blood Group" icon={<Droplets size={14}/>} value={formData.bloodGroup} onChange={(v: string) => setFormData({...formData, bloodGroup: v})} />
                                    <div className="md:col-span-2">
                                        <InputField label="Present Address" icon={<MapPin size={14}/>} value={formData.presentAddress} onChange={(v: string) => setFormData({...formData, presentAddress: v})} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border-light/50">
                                    <button 
                                        onClick={handleUpdate}
                                        disabled={updating}
                                        className="flex items-center justify-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50"
                                    >
                                        {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {updating ? "Updating..." : "Update Profile"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function SidebarItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 p-4 bg-bg-page/50 rounded-2xl border border-border-light/50">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">{icon}</div>
            <div>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-text-secondary tabular-nums">{value || "N/A"}</p>
            </div>
        </div>
    );
}

function InputField({ label, icon, value, onChange, type = "text", disabled = false }: any) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                {icon} {label}
            </label>
            <input 
                type={type} 
                value={value} 
                disabled={disabled}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="w-full px-6 py-4.5 bg-bg-page border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary disabled:opacity-50" 
            />
        </div>
    );
}
