"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Building, Globe,  ShieldCheck, Users, CreditCard, Trash2, ShieldAlert
} from 'lucide-react'
import { getSchoolById, updateSchool } from '@/app/actions/school'
import { useLanguage } from '@/context/LanguageProvider'
import Swal from 'sweetalert2'

export default function EditSchoolPage() {
    const { language } = useLanguage()
    const isAr = language === 'ar'
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  const [formData, setFormData] = useState<any>({
    schoolName: '', slug: '', schoolEmail: '', phone: '', address: '',
    plan: 'basic', duration: '12', schoolCategory: 'high-school',
    expectedStudents: '', registrationId: '', facebookUrl: '',
    websiteUrl: '', language: 'english', adminName: '',
    adminEmail: '', adminPassword: '', numberOfClasses: ''
  })

  // 1. Fetch school data from database
  useEffect(() => {
    async function fetchSchool() {
      const res = await getSchoolById(id as string)
      if (res.success) {
        setFormData(res.data)
        setLoading(false)
      } else {
        Swal.fire(isAr ? 'خطأ!' : 'Error!', isAr ? 'تعذر تحميل بيانات المؤسسة' : 'Error loading school data', 'error')
        router.push('/dashboard/super-admin/schools')
      }
    }
    fetchSchool()
  }, [id])

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const res = await updateSchool(id as string, formData)
    if (res.success) {
      Swal.fire(isAr ? 'تم التحديث!' : 'Updated!', isAr ? 'تم تحديث بيانات المؤسسة بنجاح' : 'Institution Updated Successfully!', 'success')
    } else {
      Swal.fire(isAr ? 'فشل التحديث' : 'Update Failed', res.error || (isAr ? 'حدث خطأ أثناء التحديث' : 'Failed to update institution'), 'error')
    }
    setUpdating(false)
  }

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-[var(--color-primary)]">FETCHING INSTITUTION DATA...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Header & Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">Manage Institution</h2>
          <p className="text-[var(--color-text-muted)] font-medium">Update profile and subscription settings.</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
          formData.status === 'Suspended' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {formData.status || 'Active'} Status
        </span>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm">
           <Users className="text-[var(--color-primary)] mb-2" size={24} />
           <p className="text-[var(--color-text-muted)] text-[10px] font-black uppercase">Capacity</p>
           <h4 className="text-xl font-black">{formData.expectedStudents || '0'} Students</h4>
        </div>
        <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm">
           <CreditCard className="text-purple-500 mb-2" size={24} />
           <p className="text-[var(--color-text-muted)] text-[10px] font-black uppercase">Plan Details</p>
           <h4 className="text-xl font-black uppercase">{formData.plan} ({formData.duration}M)</h4>
        </div>
      </div>

      {/* Main Edit Form */}
      <div className="bg-[var(--color-bg-card)] p-8 rounded-3xl border border-[var(--color-border-light)] shadow-xl space-y-10">
        <form className="space-y-10" onSubmit={handleUpdate}>
          
          {/* 1. Institutional Profile */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[var(--color-primary)] flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
              <Building size={20} /> {isAr ? 'الملف المؤسسي' : 'Institutional Profile'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'اسم المدرسة' : 'School Name'}</label>
                <input required name="schoolName" value={formData.schoolName} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Sub-domain / Slug (Read Only)</label>
                <input readOnly value={formData.slug} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl opacity-60 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Category</label>
                <select name="schoolCategory" value={formData.schoolCategory} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange}>
                  <option value="primary">{isAr ? 'مدرسة ابتدائية' : 'Primary School'}</option>
                  <option value="high-school">{isAr ? 'مدرسة ثانوية' : 'High School'}</option>
                  <option value="college">{isAr ? 'كلية / جامعة' : 'College / University'}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رقم التسجيل / الترخيص' : 'Registration ID'}</label>
                <input name="registrationId" value={formData.registrationId} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'عدد الفصول الدراسية' : 'Number of Classes'}</label>
                <input type="number" name="numberOfClasses" value={formData.numberOfClasses} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* 2. Communication & Web */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-emerald-500 flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
              <Globe size={20} /> {isAr ? 'التواصل والموقع الإلكتروني' : 'Communication & Web'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder={isAr ? "البريد الإلكتروني الرسمي" : "Official Email"} name="schoolEmail" value={formData.schoolEmail} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              <input placeholder={isAr ? "رقم الهاتف" : "Phone Number"} name="phone" value={formData.phone} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              <input placeholder={isAr ? "الموقع الإلكتروني" : "Website URL"} name="websiteUrl" value={formData.websiteUrl} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              <input placeholder={isAr ? "رابط فيسبوك" : "Facebook URL"} name="facebookUrl" value={formData.facebookUrl} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              <div className="md:col-span-2">
                <textarea placeholder={isAr ? "العنوان الكامل" : "Full Address"} name="address" value={formData.address} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl h-24" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* 3. Admin Account */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-orange-500 flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
              <ShieldCheck size={20} /> {isAr ? 'بيانات اعتماد المدير' : 'Admin Credentials'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder={isAr ? "اسم المدير" : "Admin Name"} name="adminName" value={formData.adminName} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
              <input placeholder={isAr ? "البريد الإلكتروني للمدير" : "Admin Email"} name="adminEmail" value={formData.adminEmail} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={updating}
            className="w-full bg-[var(--color-primary)] text-white font-black py-5 rounded-2xl shadow-lg hover:scale-[1.01] transition-all text-lg uppercase tracking-widest disabled:opacity-50"
          >
            {updating ? (isAr ? "جارٍ التحديث..." : "UPDATING SYSTEM...") : (isAr ? "حفظ التغييرات" : "SAVE INSTITUTION CHANGES")}
          </button>
        </form>
      </div>

      {/* 4. Danger Zone */}
      <div className="bg-[var(--color-bg-card)] p-8 rounded-3xl border border-[var(--color-border-light)] space-y-8">
        <h3 className="text-xl font-black text-red-600 mb-4 uppercase flex items-center gap-2">
          <ShieldAlert size={24} /> {isAr ? 'منطقة الخطر' : 'Danger Zone'}
        </h3>
        <div className="p-6 border-2 border-red-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-[var(--color-text-primary)]">{isAr ? 'تعليق نشاط المدرسة' : 'Suspend Institution'}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{isAr ? 'تعليق المدرسة سيمنع وصول جميع المستخدمين واللوحات التابعة لها.' : 'Suspending will freeze all panel access for this school and its users.'}</p>
          </div>
          <button className="px-6 py-3 rounded-xl font-black text-sm bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all uppercase">
            Suspend Now
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 text-red-500 font-bold text-xs hover:underline uppercase tracking-tighter">
            <Trash2 size={14} /> Permanently Delete This School and All Data
          </button>
        </div>
      </div>
    </div>
  )
}
