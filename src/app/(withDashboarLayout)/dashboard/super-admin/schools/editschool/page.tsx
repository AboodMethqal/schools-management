"use client"
import React, { useState, useEffect } from 'react'
import { 
  Building, Globe, Mail, 
  Facebook,Phone, MapPin, ArrowLeft, CreditCard,  Link as LinkIcon, Save
} from 'lucide-react'
import { updateSchool } from '@/app/actions/school' 
import { getPlans } from '@/app/actions/plans'
import Swal from 'sweetalert2'
import { useLanguage } from '@/context/LanguageProvider'
import { useRouter } from 'next/navigation'

interface EditSchoolProps {
  initialData: any; 
}

export default function EditSchool({ initialData }: EditSchoolProps) {
  const { language } = useLanguage()
  const isAr = language === 'ar'
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    schoolName: '',
    slug: '',
    schoolEmail: '',
    phone: '',
    address: '',
    plan: 'basic',
    duration: '12',
    schoolCategory: 'high-school',
    expectedStudents: '',
    registrationId: '',
    facebookUrl: '',
    websiteUrl: '',
    language: 'english',
    numberOfClasses: ''
  })

  const [plans, setPlans] = useState<any[]>([])

  // Populate form with database data
  useEffect(() => {
    const fetchPlans = async () => {
      const res = await getPlans()
        if (res.success && res.data) setPlans(res.data)
    }
    fetchPlans()

    if (initialData) {
      setFormData({
        schoolName: initialData.schoolName || '',
        slug: initialData.slug || '',
        schoolEmail: initialData.schoolEmail || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        plan: initialData.plan || 'basic',
        duration: initialData.duration || '12',
        schoolCategory: initialData.schoolCategory || 'high-school',
        expectedStudents: initialData.expectedStudents?.toString() || '',
        registrationId: initialData.registrationId || '',
        facebookUrl: initialData.facebookUrl || '',
        websiteUrl: initialData.websiteUrl || '',
        language: initialData.language || 'english',
        numberOfClasses: initialData.numberOfClasses?.toString() || '',
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await updateSchool(initialData.id, formData)
      if (!result.success) throw new Error(result.error)

      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Institution info updated.', timer: 2000, showConfirmButton: false })
      router.push('/dashboard/super-admin/schools') 
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-12 pt-6">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between px-2">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-bold uppercase text-xs tracking-widest">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-end">
            <h2 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tight">Update Institution</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Modify existing school instance parameters</p>
        </div>
      </div>

      <div className="bg-[var(--color-bg-card)] p-8 rounded-3xl border border-[var(--color-border-light)] shadow-xl">
        <form className="space-y-10" onSubmit={handleSubmit}>
          
          {/* 1. {isAr ? 'الملف المؤسسي' : 'Institutional Profile'} */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[var(--color-primary)] flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
              <Building size={20} /> {isAr ? 'الملف المؤسسي' : 'Institutional Profile'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'اسم المدرسة' : 'School Name'}</label>
                <input required type="text" name="schoolName" value={formData.schoolName} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none text-[var(--color-text-primary)]" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Sub-domain / Slug (ReadOnly)</label>
                <input type="text" value={formData.slug} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl opacity-60 cursor-not-allowed font-mono text-sm text-[var(--color-text-primary)]" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'تصنيف المدرسة' : 'School Category'}</label>
                <select name="schoolCategory" value={formData.schoolCategory} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange}>
                  <option value="primary">{isAr ? 'مدرسة ابتدائية' : 'Primary School'}</option>
                  <option value="high-school">{isAr ? 'مدرسة ثانوية' : 'High School'}</option>
                  <option value="college">{isAr ? 'كلية / جامعة' : 'College / University'}</option>
                  <option value="madrasa">{isAr ? 'مدرسة شرعية / معهد' : 'Madrasa'}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رقم التسجيل / الترخيص' : 'Registration ID'}</label>
                <input required type="text" name="registrationId" value={formData.registrationId} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'العدد المتوقع للطلاب' : 'Expected Students'}</label>
                <input type="number" name="expectedStudents" value={formData.expectedStudents} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'عدد الفصول الدراسية' : 'Number of Classes'}</label>
                <input type="number" name="numberOfClasses" value={formData.numberOfClasses} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'لغة النظام' : 'System Language'}</label>
                <select name="language" value={formData.language} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange}>
                  <option value="arabic">العربية</option>
                  <option value="english">English</option>
                  <option value="arabic">العربية</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. {isAr ? 'التواصل والموقع الإلكتروني' : 'Communication & Web'} */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-emerald-500 flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
              <Globe size={20} /> {isAr ? 'التواصل والموقع الإلكتروني' : 'Communication & Web'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</label>
                <div className="relative">
                  <Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input required type="email" name="schoolEmail" value={formData.schoolEmail} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                <div className="relative">
                  <Phone className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input type="text" name="phone" value={formData.phone} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رابط الموقع الإلكتروني' : 'Website URL'}</label>
                <div className="relative">
                  <LinkIcon className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input type="text" name="websiteUrl" value={formData.websiteUrl} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Facebook Page</label>
                <div className="relative">
                  <Facebook className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input type="text" name="facebookUrl" value={formData.facebookUrl} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange} />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute start-4 top-4 text-[var(--color-text-muted)]" size={18} />
                  <textarea name="address" value={formData.address} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl min-h-[80px] text-[var(--color-text-primary)]" onChange={handleChange}></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Subscription & Plan */}
          <div className="p-6 bg-[var(--color-bg-page)] rounded-2xl border border-[var(--color-border-light)] space-y-6">
            <h3 className="text-lg font-black text-purple-500 flex items-center gap-2 uppercase tracking-tighter">
              <CreditCard size={20} /> Subscription & Billing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select name="plan" value={formData.plan} className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange}>
                <option value="basic">Default (Basic)</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.name.toLowerCase()}>{p.name}</option>
                ))}
              </select>
              <select name="duration" value={formData.duration} className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-xl text-[var(--color-text-primary)]" onChange={handleChange}>
                <option value="1">1 Month</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-black py-5 rounded-2xl shadow-lg hover:scale-[1.01] transition-all text-lg uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : <><Save size={24} /> Save School Updates</>}
          </button>
        </form>
      </div>
    </div>
  )
}
