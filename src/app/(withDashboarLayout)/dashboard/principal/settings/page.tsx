"use client";

import { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/LanguageProvider";
import { getMyProfileData, updateMyProfileData } from "@/app/actions/principle/profile";

export default function SettingsPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const res = await getMyProfileData();
      
      if (res.success && res.data) {
        setProfile({
          fullName: res.data.name || "",
          email: res.data.email || "",
          role: res.data.role || "",
        });
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  // Update profile function
  const handleUpdate = async () => {
    setUpdating(true);
    const res = await updateMyProfileData({
      fullName: profile.fullName,
    });
    setUpdating(false);

    if (res.success) {
      Swal.fire("Success!", res.message, "success");
    } else {
      Swal.fire("Error!", res.error, "error");
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050B18]">
            <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gradient-to-br dark:from-[#050B18] dark:to-[#020617] dark:text-white">
        <div className="rounded-2xl p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <User size={20} /> {isAr ? 'بيانات الملف الشخصي' : 'My Profile Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label={isAr ? "الاسم الكامل" : "Full Name"} 
                  name="fullName" 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                />
                <Input label={isAr ? "البريد الإلكتروني" : "Email"} value={profile.email} disabled />
                <Input label={isAr ? "الدور" : "Role"} value={profile.role} disabled />
            </div>

            <button 
                onClick={handleUpdate} 
                disabled={updating}
                className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
            >
                {updating ? <Loader2 className="animate-spin" size={18} /> : null}
                {updating ? isAr ? "جارٍ التحديث..." : "Updating..." : "{isAr ? 'تحديث الملف الشخصي' : 'Update Profile'}"}
            </button>
        </div>
    </div>
  );
}

// Input component...
function Input({ label, value, name, disabled = false, onChange }: { label: string; value: string; name?: string; disabled?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-gray-500 dark:text-gray-400 ms-1">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition font-medium bg-gray-100 border border-gray-200 focus:border-purple-500 dark:bg-white/10 dark:border-white/10 dark:focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
