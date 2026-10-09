"use client";
import React, { useState, useEffect, useRef } from 'react';
import { UserCircle, Mail, Phone, Lock, Save, Camera, Loader2, ShieldCheck, User } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAccountantProfile, updateAccountantProfile } from '@/app/actions/accountant/profile';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageProvider';

export default function AccountantSettingsPage() {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const { updatePassword: supabaseUpdatePassword } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profileImage: "",
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const loadProfile = async () => {
        setLoading(true);
        const res = await getAccountantProfile();
        if (res.success && res.data) {
            const u = res.data;
            setFormData({
                name: u.name || "",
                email: u.email || "",
                profileImage: u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Accountant')}&background=4f46e5&color=fff&size=200`,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProfileUpdate = async () => {
        if (!formData.name.trim()) {
            return Swal.fire("Error", "Name is required", "error");
        }

        setUpdating(true);
        const res = await updateAccountantProfile({
            name: formData.name,
            profileImage: formData.profileImage,
        });
        setUpdating(false);

        if (res.success) {
            // Reload from DB so UI shows the persisted values
            await loadProfile();
            Swal.fire({
                title: "Success!",
                text: res.message,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
        } else {
            Swal.fire("Error!", res.error, "error");
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            return Swal.fire("Error", "Please fill in all password fields", "error");
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return Swal.fire("Error", "Passwords do not match", "error");
        }

        if (passwordData.newPassword.length < 6) {
            return Swal.fire("Error", "Password must be at least 6 characters", "error");
        }

        setUpdatingPassword(true);
        const res = await supabaseUpdatePassword(passwordData.newPassword);
        setUpdatingPassword(false);

        if (!res.error) {
            Swal.fire({
                title: "Password Updated!",
                text: "Your password has been changed successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            setPasswordData({ newPassword: "", confirmPassword: "" });
        } else {
            Swal.fire("Error!", res.error.message || "Failed to update password", "error");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            return Swal.fire("Error", "Please upload a valid image file", "error");
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            return Swal.fire("Error", "Image must be less than 2MB", "error");
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setFormData(prev => ({ ...prev, profileImage: dataUrl }));
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn p-4 md:p-8 max-w-5xl mx-auto">
            
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 text-white">
                <div className="absolute -end-20 -top-20 opacity-20 blur-3xl w-64 h-64 bg-white rounded-full"></div>
                
                {/* Profile Photo Uploader */}
                <div className="relative group z-10 shrink-0">
                    <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl bg-white flex items-center justify-center">
                        <img 
                            src={formData.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 end-0 p-3 bg-white text-primary rounded-full shadow-xl hover:scale-110 transition-transform ring-4 ring-primary"
                    >
                        <Camera size={18} className="fill-current" />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>

                <div className="z-10 text-center md:text-start space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{formData.name}</h1>
                    <p className="text-white/80 font-bold tracking-widest uppercase text-sm flex items-center gap-2 justify-center md:justify-start">
                        <ShieldCheck size={16} />
                        {isAr ? 'محاسب' : 'Accountant'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* General Information Card */}
                <div className="bg-bg-card rounded-[2rem] border border-border-light shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
                    <div className="bg-bg-page px-8 py-6 border-b border-border-light flex items-center gap-3">
                        <UserCircle size={22} className="text-primary" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">{isAr ? 'المعلومات العامة' : 'General Information'}</h3>
                    </div>

                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                            <InputField 
                                label={isAr ? "الاسم الكامل" : "Full Name"} 
                                icon={<User size={14}/>} 
                                value={formData.name} 
                                onChange={(v: string) => setFormData({...formData, name: v})} 
                            />
                            <InputField 
                                label={isAr ? "البريد الإلكتروني" : "Email Address"} 
                                icon={<Mail size={14}/>} 
                                value={formData.email} 
                                disabled 
                                tooltip={isAr ? "لا يمكن تغيير البريد الإلكتروني مباشرة." : "Email cannot be changed directly."}
                            />
                        </div>

                        <div className="pt-8">
                            <button 
                                onClick={handleProfileUpdate}
                                disabled={updating}
                                className="w-full flex items-center justify-center gap-3 bg-primary text-white px-8 py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:bg-primary-hover hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {updating ? (isAr ? "جارٍ الحفظ..." : "Saving Changes...") : (isAr ? "حفظ التغييرات" : "Save Changes")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security / Password Card */}
                <div className="bg-bg-card rounded-[2rem] border border-border-light shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
                    <div className="bg-bg-page px-8 py-6 border-b border-border-light flex items-center gap-3">
                        <Lock size={22} className="text-red-500" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">{isAr ? 'الأمان وكلمة المرور' : 'Security & Password'}</h3>
                    </div>

                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                            <InputField 
                                type="password"
                                label={isAr ? "كلمة المرور الجديدة" : "New Password"} 
                                icon={<Lock size={14}/>} 
                                value={passwordData.newPassword} 
                                onChange={(v: string) => setPasswordData({...passwordData, newPassword: v})} 
                                placeholder={isAr ? "أدخل كلمة المرور الجديدة (6 أحرف على الأقل)" : "Enter new password (min 6 chars)"}
                            />
                            <InputField 
                                type="password"
                                label={isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"} 
                                icon={<ShieldCheck size={14}/>} 
                                value={passwordData.confirmPassword} 
                                onChange={(v: string) => setPasswordData({...passwordData, confirmPassword: v})} 
                                placeholder={isAr ? "أعد إدخال كلمة المرور للتأكيد" : "Re-enter to confirm"}
                            />
                        </div>

                        <div className="pt-8">
                            <button 
                                onClick={handlePasswordUpdate}
                                disabled={updatingPassword}
                                className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 border-2 border-transparent hover:border-slate-800 dark:hover:border-slate-200 text-white px-8 py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {updatingPassword ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                                {updatingPassword ? (isAr ? "جارٍ التحديث..." : "Updating...") : (isAr ? "تحديث كلمة المرور" : "Update Password")}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Helper Component for Input fields
function InputField({ label, icon, value, onChange, type = "text", disabled = false, placeholder, tooltip }: any) {
    return (
        <div className="space-y-3 relative group">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                {icon} {label}
            </label>
            <input 
                type={type} 
                value={value} 
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="w-full px-5 py-4 bg-bg-page border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-slate-400 placeholder:font-medium" 
            />
            {tooltip && disabled && (
                <div className="absolute end-4 top-[50%] -translate-y-[50%] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap">
                    {tooltip}
                </div>
            )}
        </div>
    );
}
