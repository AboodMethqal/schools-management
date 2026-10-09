'use client'
import { useState, useEffect } from 'react';
import { User, Lock, Save, ShieldCheck, Mail, Info, RefreshCw, Loader2, Phone } from 'lucide-react';
import { getParentProfileData, updateParentProfile } from '@/app/actions/parent/profile';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

// Simple className merger
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Card Component
const Card = ({
  children,
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500",
      className
    )}
    style={style}
  >
    {children}
  </div>
);

export default function SettingsPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function loadData() {
      const res = await getParentProfileData();
      if (res.success && res.data) {
        setData(res.data);
        setName(res.data.name || '');
        setPhone(res.data.phone || '');
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await updateParentProfile({ name, phone });
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        Swal.fire({
          title: 'Update Failed',
          text: res.error || 'Failed to update profile',
          icon: 'error',
          confirmButtonColor: '#3b82f6',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn p-2 md:p-6">
      {/* Header */}
      <div className="text-center md:text-start space-y-2">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Settings & Security
        </h1>
        <p className="text-sm text-text-muted max-w-lg leading-relaxed">
          Manage your personal information, contact details, and account security settings in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Visual only for now) */}
        <div className="hidden lg:block space-y-2">
          {[
            { label: 'Personal Info', icon: User, active: true },
            { label: 'Security', icon: Lock, active: false },
            { label: 'Notifications', icon: Mail, active: false },
          ].map((item, i) => (
             <button 
               key={i}
               className={cn(
                 "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                 item.active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-bg-card text-text-secondary hover:bg-bg-page border border-border-light shadow-sm"
               )}
             >
               <item.icon size={18} />
               {item.label}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Section */}
          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-border-light bg-bg-page/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shadow-sm border border-blue-500/20">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-text-primary">Personal Information</h3>
              </div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded">Primary</span>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid gap-2 group/input">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1 group-focus-within/input:text-blue-600 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                   <User className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                   <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-bg-page/50 border border-border-light text-text-primary rounded-2xl ps-12 pe-5 py-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid gap-2 group/input">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1 group-focus-within/input:text-blue-600 transition-colors">
                  Phone Number
                </label>
                <div className="relative">
                   <Phone className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                   <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full bg-bg-page/50 border border-border-light text-text-primary rounded-2xl ps-12 pe-5 py-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid gap-2 opacity-70 group/input">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1">
                  Email Address (Non-changeable)
                </label>
                <div className="relative">
                   <Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                   <input
                    type="email"
                    disabled
                    value={data?.email || ''}
                    className="w-full bg-bg-page border border-border-light text-text-muted rounded-2xl ps-12 pe-5 py-4 text-sm cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleUpdate}
                  disabled={updating}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.98] group disabled:opacity-50"
                >
                  {updating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} className="transition-transform group-hover:scale-110" />
                  )}
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </Card>

          {/* Password Change Section */}
          <Card className="p-0 overflow-hidden shadow-sm border-blue-100/30">
            <div className="px-8 py-5 border-b border-border-light bg-bg-page/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shadow-sm border border-amber-500/20">
                  <Lock size={20} />
                </div>
                <h3 className="font-bold text-text-primary">Change Password</h3>
              </div>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded">Security</span>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid gap-2 group/input">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1 group-focus-within/input:text-blue-600 transition-colors">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-bg-page/50 border border-border-light text-text-primary rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2 group/input">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1 group-focus-within/input:text-blue-600 transition-colors">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-bg-page/50 border border-border-light text-text-primary rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
                <div className="grid gap-2 group/input">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1 group-focus-within/input:text-blue-600 transition-colors">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-type new password"
                    className="w-full bg-bg-page/50 border border-border-light text-text-primary rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full py-4 bg-linear-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-slate-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group">
                  <ShieldCheck size={20} className="text-emerald-400" /> Update Security Settings
                </button>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-amber-500/5 border-t border-amber-500/20">
               <div className="flex items-center gap-3">
                  <Info className="text-amber-500 shrink-0" size={14} />
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest italic">
                    Note: For security reasons, you may need to log in again after changing your password.
                  </p>
               </div>
            </div>
          </Card>
          
          {/* Account Status */}
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between group overflow-hidden relative">
              <div className="absolute top-0 end-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-500">Account Verified</h4>
                    <p className="text-[10px] text-text-muted font-bold">Your guardian identity has been verified by the school.</p>
                 </div>
              </div>
              <button className="bg-bg-card text-emerald-500 text-[10px] font-black px-4 py-2.5 rounded-xl border border-emerald-500/20 shadow-sm hover:bg-emerald-500/10 transition-all relative z-10 uppercase tracking-widest">
                 View Info
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}





