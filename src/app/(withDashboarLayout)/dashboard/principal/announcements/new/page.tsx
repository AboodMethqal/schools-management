"use client"
import React, { useState, useEffect } from 'react'
import { Megaphone, Users, Calendar, AlertCircle, Layers, FileText, Send, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createAnnouncement } from '@/app/actions/announcement'
import Swal from 'sweetalert2'
import { getCurrentSchoolId } from '@/app/actions/user'
import { useLanguage } from '@/context/LanguageProvider';

export default function NewAnnouncement() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const router = useRouter()
  const [schoolId, setSchoolId] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'all',
    targetClass: 'all',
    category: 'academic',
    priority: 'normal',
    expiryDate: '',
    schoolId: ''
  })

  useEffect(() => {
    getCurrentSchoolId().then(id => {
      if (id) {
        setSchoolId(id)
        setFormData(prev => ({ ...prev, schoolId: id }))
      }
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createAnnouncement(formData);

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "🎉 Announcement Published Successfully!",
        confirmButtonColor: "#3085d6",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push('/dashboard/principal/announcements');
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: result.error || "Something went wrong",
        confirmButtonColor: "#d33",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="text-center">
        <h2 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight uppercase flex items-center justify-center gap-3">
          <Megaphone className="text-[var(--color-primary)]" size={32} />
          {isAr ? 'إنشاء إعلان جديد' : 'Create New Announcement'}
        </h2>
        <p className="text-[var(--color-text-muted)] font-medium">{isAr ? 'بث الإعلانات والتعميمات لمؤسستك التعليمية.' : 'Broadcast notices to your institution.'}</p>
      </div>

      <div className="bg-[var(--color-bg-card)] p-8 rounded-3xl border border-[var(--color-border-light)] shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'عنوان الإعلان' : 'Notice Title'}</label>
            <div className="relative">
              <FileText className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input required type="text" name="title" value={formData.title} placeholder={isAr ? "مثال: إشعار العطلة الشتوية" : "e.g. Winter Vacation Notice"}
                className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                onChange={handleChange} />
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'التفاصيل / الوصف' : 'Details / Description'}</label>
            <textarea required name="content" value={formData.content} rows={5} placeholder={isAr ? "اكتب تفاصيل الإعلان هنا..." : "Write your notice details here..."}
              className="w-full p-4 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audience Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'الفئة المستهدفة' : 'Target Audience'}</label>
              <div className="relative">
                <Users className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                <select name="audience" value={formData.audience} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange}>
                  <option value="all">{isAr ? 'الجميع (الكل)' : 'Everyone (All)'}</option>
                  <option value="students">{isAr ? 'الطلاب فقط' : 'Students Only'}</option>
                  <option value="teachers">{isAr ? 'المعلمون فقط' : 'Teachers Only'}</option>
                  <option value="staff">{isAr ? 'طاقم الإدارة' : 'Office Staff'}</option>
                </select>
              </div>
            </div>

            {/* Conditional Class Selection (Only shows if Audience is Students) */}
            {formData.audience === 'students' && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'فصل محدد' : 'Specific Class'}</label>
                <div className="relative">
                  <Layers className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                  <select name="targetClass" value={formData.targetClass} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none ring-2 ring-[var(--color-primary)]/20" onChange={handleChange}>
                    <option value="all">{isAr ? 'جميع الفصول' : 'All Classes'}</option>
                    <option value="class-1">{isAr ? 'الصف الأول' : 'Class 1'}</option>
                    <option value="class-2">{isAr ? 'الصف الثاني' : 'Class 2'}</option>
                    <option value="class-10">{isAr ? 'الصف العاشر' : 'Class 10'}</option>
                    {/* Dynamic classes mapped per school */}
                  </select>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'تصنيف الإعلان' : 'Notice Category'}</label>
              <select name="category" value={formData.category} className="w-full px-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange}>
                <option value="academic">{isAr ? 'أكاديمي' : 'Academic'}</option>
                <option value="holiday">{isAr ? 'عطلة / إجازة' : 'Holiday / Vacation'}</option>
                <option value="exam">{isAr ? 'جدول الاختبارات' : 'Exam Schedule'}</option>
                <option value="event">{isAr ? 'فعالية / أنشطة' : 'Event / Sports'}</option>
                <option value="emergency">{isAr ? 'إشعار طارئ' : 'Emergency Notice'}</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'مستوى الأهمية' : 'Priority Level'}</label>
              <div className="relative">
                <AlertCircle className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                <select name="priority" value={formData.priority} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange}>
                  <option value="normal">{isAr ? 'عادي' : 'Normal'}</option>
                  <option value="high">{isAr ? 'أولوية عالية' : 'High Priority'}</option>
                  <option value="urgent">{isAr ? 'عاجل (فوري)' : 'Urgent (Immediate)'}</option>
                </select>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{isAr ? 'متاح حتى (تاريخ الانتهاء)' : 'Visible Until (Expiry)'}</label>
              <div className="relative">
                <Calendar className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                <input type="date" name="expiryDate" value={formData.expiryDate} className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none" onChange={handleChange} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.01] transition-all text-lg uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (isAr ? "جارٍ النشر..." : "Publishing...") : <><Send size={20} /> {isAr ? "نشر الإعلان" : "Broadcast Announcement"}</>}
          </button>
        </form>
      </div>
    </div>
  )
}
