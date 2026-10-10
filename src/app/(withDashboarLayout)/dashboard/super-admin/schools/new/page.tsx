"use client"
import React, { useState, useEffect } from 'react'
import {
    Building, Globe, Mail, ShieldCheck, Lock, 
     Users,  Facebook,  Phone, MapPin, ArrowLeft, CreditCard, Link as LinkIcon
} from 'lucide-react'
import { z } from 'zod'
import { createSchool } from '@/app/actions/school'
import { useAuth } from '@/hooks/useAuth'
import Swal from 'sweetalert2'
import { useLanguage } from '@/context/LanguageProvider'
import { useRouter } from 'next/navigation'

// Zod Schema
const schoolSchema = z.object({
    schoolName: z.string().min(3, "School name is required"),
    slug: z.string(),
    schoolEmail: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    plan: z.string(),
    duration: z.string(),
    schoolCategory: z.string(),
    expectedStudents: z.preprocess((val) => Number(val), z.number().optional()),
    numberOfClasses: z.preprocess((val) => Number(val), z.number().min(0).optional()),
    registrationId: z.string().min(1, "Registration ID is required"),
    facebookUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    language: z.string(),
    adminName: z.string().min(3, "Admin name is required"),
    adminEmail: z.string().email("Invalid admin email"),
    adminPassword: z.string().min(6, "Password must be at least 6 characters"),
    accountantName: z.string().min(3, "Accountant name is required"),
    accountantEmail: z.string().email("Invalid accountant email"),
    accountantPassword: z.string().min(6, "Password must be at least 6 characters")
})

import { getPlans } from '@/app/actions/plans'

export default function NewSchool() {
    const { language } = useLanguage()
    const isAr = language === 'ar'
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState({
        schoolName: '',
        slug: '',
        schoolEmail: '',
        phone: '',
        address: '',
        plan: 'basic',
        duration: '12',
        schoolCategory: 'primary',
        expectedStudents: '',
        numberOfClasses: '',
        registrationId: '',
        facebookUrl: '',
        websiteUrl: '',
        language: 'english',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        accountantName: '',
        accountantEmail: '',
        accountantPassword: ''
    })

    const [plans, setPlans] = useState<any[]>([])

    useEffect(() => {
        const fetchPlans = async () => {
            const res = await getPlans()
            if (res.success && res.data) setPlans(res.data)
        }
        fetchPlans()
    }, [])

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'schoolName') {
            setFormData(prev => ({ ...prev, schoolName: value, slug: generateSlug(value) }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const validation = schoolSchema.safeParse(formData)
        if (!validation.success) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: validation.error.issues[0].message })
            setLoading(false)
            return
        }

        try {
            const result = await createSchool({
                ...formData,
                expectedStudents: parseInt(formData.expectedStudents) || 0,
                numberOfClasses: parseInt(formData.numberOfClasses) || 0,
            })

            if (!result.success) throw new Error(result.error)

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Institution Deployed Successfully!',
                timer: 2000,
                showConfirmButton: false
            })

            // Navigate directly to schools management list
            router.push('/dashboard/super-admin/schools')

        } catch (err: any) {
            Swal.fire({ icon: 'error', title: 'Submission Failed', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-12 pt-6">

            {/* Top Navigation & Header */}
            <div className="flex items-center justify-between px-2">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-bold uppercase text-xs tracking-widest"
                >
                    <ArrowLeft size={18} /> {isAr ? 'العودة إلى الإدارة' : 'Back to Management'}
                </button>
                <div className="text-end">
                    <h2 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tight">{isAr ? 'تسجيل مدرسة جديدة' : 'Register New School'}</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">{isAr ? 'إنشاء وتفعيل مدرسة ومؤسسة جديدة' : 'Create a new institutional instance'}</p>
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
                                <input required type="text" name="schoolName" value={formData.schoolName} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'النطاق الفرعي / المعرف' : 'Sub-domain / Slug'}</label>
                                <input type="text" value={formData.slug} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl opacity-70 cursor-not-allowed font-mono text-sm" readOnly />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'تصنيف المدرسة' : 'School Category'}</label>
                                <select name="schoolCategory" value={formData.schoolCategory} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange}>
                                    <option value="primary">{isAr ? 'مدرسة ابتدائية' : 'Primary School'}</option>
                                    <option value="high-school">{isAr ? 'مدرسة ثانوية' : 'High School'}</option>
                                    <option value="college">{isAr ? 'كلية / جامعة' : 'College / University'}</option>
                                    <option value="madrasa">{isAr ? 'مدرسة شرعية / معهد' : 'Madrasa'}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رقم التسجيل / الترخيص' : 'Registration ID'}</label>
                                <input required type="text" name="registrationId" value={formData.registrationId} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'العدد المتوقع للطلاب' : 'Expected Students'}</label>
                                <input type="number" name="expectedStudents" value={formData.expectedStudents} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'عدد الفصول الدراسية' : 'Number of Classes'}</label>
                                <input type="number" name="numberOfClasses" value={formData.numberOfClasses} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" placeholder="e.g. 5" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'لغة النظام' : 'System Language'}</label>
                                <select name="language" value={formData.language} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange}>
                                    <option value="arabic">العربية</option>
                  <option value="english">English</option>
                                    <option value="arabic">العربية</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Communication & Address */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-black text-emerald-500 flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
                            <Globe size={20} /> {isAr ? 'التواصل والموقع الإلكتروني' : 'Communication & Web'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</label>
                                <div className="relative">
                                    <Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                                    <input required type="email" name="schoolEmail" value={formData.schoolEmail} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                                <div className="relative">
                                    <Phone className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                                    <input type="text" name="phone" value={formData.phone} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'رابط الموقع الإلكتروني' : 'Website URL'}</label>
                                <div className="relative">
                                    <LinkIcon className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                                    <input type="text" name="websiteUrl" value={formData.websiteUrl} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Facebook Page</label>
                                <div className="relative">
                                    <Facebook className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                                    <input type="text" name="facebookUrl" value={formData.facebookUrl} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange} placeholder="https://facebook.com/..." />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Physical Address</label>
                                <div className="relative">
                                    <MapPin className="absolute start-4 top-4 text-[var(--color-text-muted)]" size={18} />
                                    <textarea name="address" value={formData.address} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl min-h-[80px]" onChange={handleChange}></textarea>
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'اختر الباقة' : 'Select Plan'}</label>
                                <select name="plan" value={formData.plan} className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange}>
                                    <option value="basic">Default (Basic)</option>
                                    {plans.map((p) => (
                                      <option key={p.id} value={p.name.toLowerCase()}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Subscription Duration</label>
                                <select name="duration" value={formData.duration} className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-xl" onChange={handleChange}>
                                    <option value="1">1 Month (Trial)</option>
                                    <option value="6">6 Months</option>
                                    <option value="12">12 Months (Recommended)</option>
                                    <option value="24">24 Months</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 4. Admin Account */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-black text-orange-500 flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
                            <ShieldCheck size={20} /> Master Admin Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Full Name</label>
                                <input required type="text" name="adminName" value={formData.adminName} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'البريد الإلكتروني للمدير' : 'Admin Email'}</label>
                                <input required type="email" name="adminEmail" value={formData.adminEmail} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Login Password (Visible)</label>
                                <div className="relative">
                                    <Lock className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                                    <input required type="text" name="adminPassword" value={formData.adminPassword} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl font-mono text-orange-600 font-bold" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Accountant Account */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-black text-blue-500 flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2 uppercase tracking-tighter">
                            <Users size={20} /> Accountant Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Full Name</label>
                                <input required type="text" name="accountantName" value={formData.accountantName} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Accountant Email</label>
                                <input required type="email" name="accountantEmail" value={formData.accountantEmail} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">Login Password (Visible)</label>
                                <div className="relative">
                                    <Lock className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                                    <input required type="text" name="accountantPassword" value={formData.accountantPassword} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl font-mono text-blue-600 font-bold" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] text-white font-black py-5 rounded-2xl shadow-lg hover:scale-[1.01] transition-all text-lg uppercase tracking-widest disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Deploy School Instance"}
                    </button>
                </form>
            </div>
        </div>
    )
}
