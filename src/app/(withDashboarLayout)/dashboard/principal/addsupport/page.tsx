'use client';
import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Send,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Trash2,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Calendar,
  Hash,
  Activity,
  MessageSquare,
} from 'lucide-react';
import {
  createSupportTicket,
  getAllSupportTickets,
  deleteTicket,
} from '@/app/actions/principle/support';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

export default function SupportDashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load tickets function
  const loadTickets = async () => {
    setLoading(true);
    const result = await getAllSupportTickets();
if (result.success) setTickets(result.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Image select and preview handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
             Swal.fire({ 
          icon: 'error',
           title: 'Validation Error',
            text: 'File size should be less than 5MB'})
        //alert('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImagePreview(null);

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Are you sure you want to delete this ticket?')) return;
  //   const result = await deleteTicket(id);
  //   if (result.success) loadTickets();
  // };

const handleDelete = async (id: string) => {

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This ticket will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  });

  if (!result.isConfirmed) return;

  const deleteResult = await deleteTicket(id);

  if (deleteResult.success) {

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Ticket deleted successfully.",
      timer: 1500,
      showConfirmButton: false
    });

    loadTickets();

  } else {

    Swal.fire({
      icon: "error",
      title: "Failed!",
      text: deleteResult.error || "Something went wrong."
    });

  }
};


  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
      userEmail: 'principal@test.com',
      image: imagePreview, // Base64 payload uploaded to ImgBB
    };

    const result = await createSupportTicket(data);

    if (result.success) {
      setStatus({ type: 'success', msg: 'Ticket created successfully!' });
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus(null);
        setImagePreview(null);
        loadTickets();
      }, 1500);
    } else {
      setStatus({ type: 'error', msg: result.error || 'Something went wrong' });
    }
    setFormLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up p-4 md:p-6 lg:p-0">
      {/* --- Header Section --- */}
      <div className="relative overflow-hidden bg-[var(--color-bg-card)] p-8 md:p-10 rounded-[40px] border border-[var(--color-border-light)] shadow-sm group">
        <div className="absolute top-0 end-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <LifeBuoy size={120} />
        </div>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-start">
            <h2 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">
              {isAr ? 'مركز ' : 'Support '}<span className="text-primary">{isAr ? 'الدعم الفني' : 'Center'}</span>
            </h2>
            <p className="text-[var(--color-text-muted)] mt-2 font-medium max-w-md">
              {isAr ? 'فريق الدعم الفني جاهز لمساعدتكم في أي وقت. أنشئ تذكرة جديدة أدناه.' : 'Our team is ready to assist you. Create a new support ticket below.'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group/btn bg-primary hover:bg-black text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[2px] transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 active:scale-95"
          >
            <Plus
              size={20}
              className="group-hover/btn:rotate-90 transition-transform"
            />
            {isAr ? 'إنشاء تذكرة' : 'Create Ticket'}
          </button>
        </div>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isAr ? 'إجمالي التذاكر' : 'Total Tickets', value: tickets.length, icon: Hash },
          {
            label: isAr ? 'قيد الانتظار' : 'Pending',
            value: tickets.filter((t) => t.status === 'open').length,
            icon: Activity,
          },
          {
            label: isAr ? 'تم الحل' : 'Resolved',
            value: tickets.filter((t) => t.status === 'completed').length,
            icon: CheckCircle2,
          },
          { label: isAr ? 'آخر نشاط' : 'Last Activity', value: isAr ? 'اليوم' : 'Today', icon: Calendar },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[var(--color-bg-card)] p-5 rounded-3xl border border-[var(--color-border-light)] flex items-center gap-4"
          >
            <div className="p-3 bg-primary/5 rounded-2xl text-primary">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-tighter">
                {stat.label}
              </p>
              <p className="text-lg font-black text-[var(--color-text-primary)]">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Tickets Table --- */}
      <div className="bg-[var(--color-bg-card)] rounded-[32px] border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-[var(--color-bg-page)]/50 border-b border-[var(--color-border-light)]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">{isAr ? 'الموضوع والمعلومات' : 'Subject & Info'}</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">{isAr ? 'الأولوية' : 'Priority'}</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-center">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-primary"
                      size={40}
                    />
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center font-bold text-[var(--color-text-muted)]"
                  >
                    {isAr ? 'لا توجد تذاكر دعم حالياً.' : 'No tickets found.'}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex p-3 bg-[var(--color-bg-page)] rounded-2xl text-[var(--color-text-muted)]">
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <p className="font-black text-[var(--color-text-primary)] text-base group-hover:text-primary transition-colors">
                            {ticket.subject}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-[var(--color-text-muted)] uppercase italic">
                            <span>#{ticket.id.slice(-6).toUpperCase()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />{' '}
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${ticket.priority === 'high' ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-bg-page)] rounded-full border border-[var(--color-border-light)]">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {ticket.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-end">
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD MODAL --- */}
   {isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm min-h-screen"
    onClick={() => {
      setIsModalOpen(false);
      removeImage();
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-3xl bg-[var(--color-bg-card)] rounded-[32px] border border-[var(--color-border-light)] shadow-2xl flex flex-col max-h-[90vh]"
    >
      {/* HEADER */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[var(--color-border-light)] bg-[var(--color-bg-card)] rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-white rounded-xl">
            <Plus size={20} />
          </div>

          <h2 className="text-lg font-black uppercase tracking-wide">
            {isAr ? 'تذكرة دعم فني جديدة' : 'New Support Ticket'}
          </h2>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(false);
            removeImage();
          }}
          className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500"
        >
          <X size={22} />
        </button>
      </div>

      {/* BODY */}
      <div className="overflow-y-auto p-6 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase">
                {isAr ? 'عنوان المشكلة' : 'Issue Subject'}
              </label>

              <input
                name="subject"
                required
                className="w-full mt-1 px-4 py-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-page)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase">
                Priority
              </label>

              <select
                name="priority"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-page)]"
              >
                <option value="low">{isAr ? 'منخفضة' : 'Low'}</option>
                <option value="medium">{isAr ? 'متوسطة' : 'Medium'}</option>
                <option value="high">{isAr ? 'عالية' : 'High'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                required
                className="w-full mt-1 px-4 py-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-page)] resize-none"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase">
                Screenshot
              </label>

              <div className="mt-2 border-2 border-dashed border-[var(--color-border-light)] rounded-2xl p-6 text-center">
                {!imagePreview ? (
                  <>
                    <ImageIcon className="mx-auto mb-2 text-primary" size={28} />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs"
                    />
                  </>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      className="rounded-xl max-h-48 mx-auto"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 end-2 bg-rose-500 text-white p-1 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={formLoading}
              className="mt-6 w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={16} />
                  {isAr ? 'إرسال التذكرة' : 'Submit Ticket'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* STATUS */}
        {status && (
          <div
            className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}

            {status.msg}
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}
