"use client";
import React, { useState, useEffect } from 'react';
import { 
  Save, Zap, Users, UserRound, HardDrive, 
  ArrowLeft, Loader2, Shield, Crown, 
  Star, Rocket, Gem, Sparkles, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPlan, updatePlan } from '@/app/actions/plans';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

const ICONS = [
  { id: 'Zap', icon: Zap, label: 'Lightning' },
  { id: 'Shield', icon: Shield, label: 'Security' },
  { id: 'Crown', icon: Crown, label: 'Premium' },
  { id: 'Star', icon: Star, label: 'Essential' },
  { id: 'Rocket', icon: Rocket, label: 'Fast' },
  { id: 'Gem', icon: Gem, label: 'Luxury' },
  { id: 'Sparkles', icon: Sparkles, label: 'Magic' },
  { id: 'Globe', icon: Globe, label: 'Global' },
];

const COLORS = [
  { id: 'blue', value: 'bg-blue-500', border: 'border-blue-200' },
  { id: 'purple', value: 'bg-purple-500', border: 'border-purple-200' },
  { id: 'orange', value: 'bg-orange-500', border: 'border-orange-200' },
  { id: 'emerald', value: 'bg-emerald-500', border: 'border-emerald-200' },
  { id: 'rose', value: 'bg-rose-500', border: 'border-rose-200' },
  { id: 'indigo', value: 'bg-indigo-500', border: 'border-indigo-200' },
  { id: 'amber', value: 'bg-amber-500', border: 'border-amber-200' },
];

const iconMap: Record<string, React.ElementType> = {
  Zap, Shield, Crown, Star, Rocket, Gem, Sparkles, Globe
};

export default function EditPlan({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);
    const { language } = useLanguage();
    const isAr = language === 'ar';


    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '',
        icon: 'Zap',
        color: 'blue',
        students: '',
        teachers: '',
        storage: ''
    });

    useEffect(() => {
        const fetchPlanData = async () => {
            try {
                const res = await getPlan(id);
                if (res.success && res.data) {
                    
                    // Map legacy tailwind string values to pure colors
                    let initialColor = res.data.color || 'blue';
                    if (initialColor === 'text-blue-500') initialColor = 'blue';
                    if (initialColor === 'text-purple-500') initialColor = 'purple';
                    if (initialColor === 'text-yellow-500') initialColor = 'orange';
                    if (initialColor === 'text-emerald-500') initialColor = 'emerald';

                    setFormData({
                        name: res.data.name || '',
                        price: res.data.price || '',
                        duration: res.data.duration || '',
                        icon: res.data.icon || 'Zap',
                        color: initialColor,
                        students: res.data.students || '',
                        teachers: res.data.teachers || '',
                        storage: res.data.storage || ''
                    });
                } else {
                    Swal.fire(isAr ? 'خطأ!' : 'Error!', isAr ? 'فشل تحميل بيانات الخطة' : 'Failed to load plan details', 'error');
                    router.push('/dashboard/super-admin/plans');
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
                Swal.fire(isAr ? 'خطأ!' : 'Error!', isAr ? 'حدث خطأ أثناء تحميل الخطة' : 'Error loading plan details', 'error');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchPlanData();
    }, [id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await updatePlan(id, formData);
        if (res.success) {
          await Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Plan updated successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
          router.push("/dashboard/super-admin/plans");
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: res.error || "Failed to update plan",
          });
        }
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Something went wrong" });
      } finally {
        setLoading(false);
      }
    };

    const ActiveIcon = iconMap[formData.icon] || Zap;

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-12 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/super-admin/plans" className="p-2 bg-white border rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Edit Subscription Plan</h2>
              <p className="text-sm text-gray-500">Refine the pricing and features of this plan</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* Section 1: Basic Identity */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Sparkles size={18}/></div>
                <h3 className="font-bold text-gray-800">Identity & Branding</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Plan Display Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Standard"
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">
                      {isAr ? 'السعر (ر.ي)' : 'Price ($)'}
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 2500"
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Duration Cycle</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 6 Months"
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                {/* Visual Icon Picker */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Pick an Icon</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {ICONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, icon: item.id }))}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${formData.icon === item.id ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'}`}
                      >
                        <item.icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Color Picker */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Accent Theme</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, color: color.id }))}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${color.value} ${formData.color === color.id ? 'border-gray-900 scale-110' : 'border-white hover:scale-105'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Quotas & Limits */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={18}/></div>
                <h3 className="font-bold text-gray-800">System Quotas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Students</label>
                  <input name="students" value={formData.students} onChange={handleInputChange} required placeholder="500" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-500 outline-none transition-all font-medium text-center" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Teachers</label>
                  <input name="teachers" value={formData.teachers} onChange={handleInputChange} required placeholder="50" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-500 outline-none transition-all font-medium text-center" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider ms-1">Storage</label>
                  <input name="storage" value={formData.storage} onChange={handleInputChange} required placeholder="10GB" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-500 outline-none transition-all font-medium text-center" />
                </div>
              </div>
            </div>


            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-gray-400 flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              {loading ? 'Saving Changes...' : 'Update & Sync Plan'}
            </button>
          </div>

          {/* Live Preview Column Scrollable */}
          <div className="sticky top-8 flex flex-col items-center">
            <div className="px-6 py-2 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
              Live Preview (Admin Dashboard View)
            </div>
            
            <div className="relative bg-white p-10 rounded-[3rem] border-2 border-gray-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] w-full max-w-sm overflow-hidden">
              <div className={`absolute -end-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-20 
                ${formData.color === 'blue' ? 'bg-blue-500' : ''}
                ${formData.color === 'purple' ? 'bg-purple-500' : ''}
                ${formData.color === 'orange' ? 'bg-orange-500' : ''}
                ${formData.color === 'emerald' ? 'bg-emerald-500' : ''}
                ${formData.color === 'rose' ? 'bg-rose-500' : ''}
                ${formData.color === 'indigo' ? 'bg-indigo-500' : ''}
                ${formData.color === 'amber' ? 'bg-amber-500' : ''}
              `} />

              <div 
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner transition-colors
                  ${formData.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                  ${formData.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
                  ${formData.color === 'orange' ? 'bg-orange-50 text-orange-600' : ''}
                  ${formData.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                  ${formData.color === 'rose' ? 'bg-rose-50 text-rose-600' : ''}
                  ${formData.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : ''}
                  ${formData.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                `}
              >
                <ActiveIcon size={32} />
              </div>

              <h3 className="text-3xl font-black text-gray-900 leading-tight">
                {formData.name || 'Plan Name'}
              </h3>
              
              <div className="mt-6 flex flex-col">
                <span className="text-5xl font-black text-gray-900">
                  {isAr ? `ر.ي ${formData.price || '0'}` : `$${formData.price || '0'}`}
                </span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                  per {formData.duration || 'period'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 my-8 py-6 border-y border-gray-50">
                <div className="text-center">
                  <Users size={20} className="mx-auto text-gray-300 mb-1" />
                  <p className="text-[12px] font-black text-gray-900">{formData.students || '0'}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Students</p>
                </div>
                <div className="text-center border-x border-gray-50">
                  <UserRound size={20} className="mx-auto text-gray-300 mb-1" />
                  <p className="text-[12px] font-black text-gray-900">{formData.teachers || '0'}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Teachers</p>
                </div>
                <div className="text-center">
                  <HardDrive size={20} className="mx-auto text-gray-300 mb-1" />
                  <p className="text-[12px] font-black text-gray-900">{formData.storage || '0'}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Cloud</p>
                </div>
              </div>


              <div className="mt-10 h-16 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">
                Checkout Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
