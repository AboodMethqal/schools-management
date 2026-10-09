"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  User,
  Mail,
  Phone,
  Eye,
  RefreshCw,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';
import {
  getSchoolApplications,
  approveSchoolApplication,
  rejectSchoolApplication,
} from '@/app/actions/application';
import Link from 'next/link';

export default function SchoolApplicationsInbox() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    ALL: 0,
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
  });

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSchoolApplications({
        status: statusFilter,
        search: searchTerm,
      });

      if (res.success && res.data) {
        setApplications(res.data);
        if (res.counts) setCounts(res.counts);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (app: any) => {
    const result = await Swal.fire({
      title: isAr ? 'الموافقة على طلب الانضمام؟' : 'Approve Application?',
      text: isAr
        ? `سيتم إنشاء مدرسة جديدة باسم "${app.schoolName}" وحساب مسؤول جديد للمستخدم (${app.email}).`
        : `This will create school "${app.schoolName}" and an administrator account for (${app.email}).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: isAr ? 'نعم، اعتماد المدرسة' : 'Yes, Approve School',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel',
      input: 'textarea',
      inputPlaceholder: isAr ? 'ملاحظات الاعتماد (اختياري)...' : 'Approval notes (optional)...',
      inputValue: reviewNotes,
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const approveRes = await approveSchoolApplication(app.id, result.value);
        if (approveRes.success) {
          await Swal.fire({
            title: isAr ? 'تم الاعتماد بنجاح!' : 'Application Approved!',
            text: isAr
              ? 'تم إنشاء سجل المدرسة وحساب المسؤول في النظام بنجاح.'
              : 'School and administrator account created successfully.',
            icon: 'success',
          });
          setSelectedApp(null);
          setReviewNotes('');
          loadData();
        } else {
          Swal.fire({
            title: isAr ? 'خطأ!' : 'Error!',
            text: approveRes.error || (isAr ? 'فشل الاعتماد' : 'Failed to approve'),
            icon: 'error',
          });
        }
      } catch (err: any) {
        Swal.fire({
          title: isAr ? 'خطأ غير متوقع!' : 'Error!',
          text: err.message,
          icon: 'error',
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async (app: any) => {
    const result = await Swal.fire({
      title: isAr ? 'رفض طلب الانضمام؟' : 'Reject Application?',
      text: isAr
        ? `هل أنت متأكد من رفض طلب "${app.schoolName}"؟ يرجى توضيح سبب الرفض.`
        : `Are you sure you want to reject the application for "${app.schoolName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: isAr ? 'تأكيد الرفض' : 'Confirm Rejection',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel',
      input: 'textarea',
      inputPlaceholder: isAr ? 'سبب الرفض (إلزامي)...' : 'Rejection reason (required)...',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return isAr ? 'يجب إدخال سبب الرفض' : 'Please provide a reason for rejection';
        }
      },
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const rejectRes = await rejectSchoolApplication(app.id, result.value);
        if (rejectRes.success) {
          await Swal.fire({
            title: isAr ? 'تم الرفض' : 'Application Rejected',
            text: isAr ? 'تم تحديث حالة الطلب إلى مرفوض.' : 'Application marked as rejected.',
            icon: 'info',
          });
          setSelectedApp(null);
          setReviewNotes('');
          loadData();
        } else {
          Swal.fire({
            title: isAr ? 'خطأ!' : 'Error!',
            text: rejectRes.error || (isAr ? 'فشل الرفض' : 'Failed to reject'),
            icon: 'error',
          });
        }
      } catch (err: any) {
        Swal.fire({
          title: isAr ? 'خطأ غير متوقع!' : 'Error!',
          text: err.message,
          icon: 'error',
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            {isAr ? 'معتمد' : 'Approved'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <XCircle size={12} />
            {isAr ? 'مرفوض' : 'Rejected'}
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Clock size={12} />
            {isAr ? 'قيد المراجعة' : 'Under Review'}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock size={12} />
            {isAr ? 'بانتظار المراجعة' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-black text-[9px] uppercase tracking-widest mb-2">
            <FileText size={12} />
            {isAr ? 'إدارة الطلبات الواردة' : 'Applications Management'}
          </div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">
            {isAr ? 'صندوق طلبات انضمام المدارس' : 'School Applications Inbox'}
          </h2>
          <p className="text-[var(--color-text-muted)] font-medium text-sm">
            {isAr
              ? 'مراجعة طلبات المؤسسات الجديدة، التحقق من بياناتها، واعتماد إنشاء المدارس تلقائياً.'
              : 'Review incoming school registrations, verify details, and approve school onboarding.'}
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:border-blue-500/40 text-xs font-black uppercase tracking-wider transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {isAr ? 'تحديث البيانات' : 'Refresh'}
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[var(--color-bg-card)] p-2 rounded-2xl border border-[var(--color-border-light)]">
        {[
          { key: 'ALL', labelEn: 'All Applications', labelAr: 'الكل' },
          { key: 'PENDING', labelEn: 'Pending', labelAr: 'قيد الانتظار' },
          { key: 'APPROVED', labelEn: 'Approved', labelAr: 'المعتمدة' },
          { key: 'REJECTED', labelEn: 'Rejected', labelAr: 'المرفوضة' },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          const count = counts[tab.key] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-page)]'
              }`}
            >
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--color-bg-page)] text-[var(--color-text-muted)]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="bg-[var(--color-bg-card)] p-4 rounded-3xl border border-[var(--color-border-light)] shadow-sm">
        <div className="relative">
          <Search
            className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            size={18}
          />
          <input
            type="text"
            placeholder={
              isAr
                ? 'البحث باسم المدرسة، اسم المسؤول، البريد أو رقم المرجع...'
                : 'Search by school name, admin, email, or reference...'
            }
            className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-2xl outline-none text-sm text-[var(--color-text-primary)] font-medium focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-separate border-spacing-0">
            <thead>
              <tr className="bg-[var(--color-bg-page)] text-[var(--color-text-muted)] text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">
                  {isAr ? 'المرجع والمؤسسة' : 'Reference & School'}
                </th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">
                  {isAr ? 'المسؤول والاتصال' : 'Admin & Contact'}
                </th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">
                  {isAr ? 'تاريخ التقديم' : 'Submitted Date'}
                </th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">
                  {isAr ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)] text-end">
                  {isAr ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center font-black text-[var(--color-text-muted)] text-xs uppercase animate-pulse"
                  >
                    {isAr ? 'جارٍ تحميل طلبات المدارس...' : 'Loading Applications...'}
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[var(--color-bg-page)]/50 transition-colors group"
                  >
                    {/* School & Reference */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
                          {app.applicationNo}
                        </span>
                        <span className="font-black text-[var(--color-text-primary)] text-sm">
                          {app.schoolName}
                        </span>
                        {app.instituteCode && (
                          <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                            {isAr ? 'الترخيص:' : 'Code:'} {app.instituteCode}
                          </span>
                        )}
                        {app.school && (
                          <Link
                            href={`/dashboard/super-admin/schools`}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold hover:underline mt-1"
                          >
                            <Building size={10} />
                            {isAr ? 'المدرسة منشأة ومربوطة' : 'School Created & Linked'}
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Admin & Contact */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                          <User size={13} className="text-[var(--color-text-muted)]" />
                          {app.adminName}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
                          <Mail size={12} className="text-[var(--color-text-muted)]" />
                          {app.email}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1.5">
                          <Phone size={12} className="text-[var(--color-text-muted)]" />
                          {app.phone}
                        </span>
                      </div>
                    </td>

                    {/* Submission Date */}
                    <td className="px-6 py-5 text-xs font-medium text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[var(--color-text-muted)]" />
                        {new Date(app.createdAt).toLocaleDateString(
                          isAr ? 'ar-EG' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">{statusBadge(app.status)}</td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewNotes(app.reviewNotes || '');
                          }}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                          title={isAr ? 'عرض التفاصيل والمراجعة' : 'View Details & Review'}
                        >
                          <Eye size={15} />
                        </button>

                        {app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleApprove(app)}
                            disabled={actionLoading}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                            title={isAr ? 'اعتماد وإنشاء المدرسة' : 'Approve & Create School'}
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}

                        {app.status !== 'REJECTED' && app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleReject(app)}
                            disabled={actionLoading}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                            title={isAr ? 'رفض الطلب' : 'Reject Application'}
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center font-bold text-[var(--color-text-muted)] text-sm"
                  >
                    {isAr ? 'لا توجد طلبات انضمام تطابق المعايير.' : 'No school applications found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail & Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border-light)] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--color-border-light)] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-blue-600 uppercase">
                    {selectedApp.applicationNo}
                  </span>
                  {statusBadge(selectedApp.status)}
                </div>
                <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                  {selectedApp.schoolName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-full hover:bg-[var(--color-bg-page)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-light)] space-y-1">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                  {isAr ? 'المسؤول المعين' : 'Administrator Name'}
                </span>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">
                  {selectedApp.adminName}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-light)] space-y-1">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                  {isAr ? 'البريد المهني' : 'Business Email'}
                </span>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">
                  {selectedApp.email}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-light)] space-y-1">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                  {isAr ? 'رقم الهاتف' : 'Contact Phone'}
                </span>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">
                  {selectedApp.phone}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-light)] space-y-1">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                  {isAr ? 'رمز الترخيص / المؤسسة' : 'Institute / License Code'}
                </span>
                <p className="font-bold text-sm text-[var(--color-text-primary)] font-mono">
                  {selectedApp.instituteCode || 'N/A'}
                </p>
              </div>
            </div>

            {/* Applicant Message */}
            {selectedApp.message && (
              <div className="p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-light)] space-y-1">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                  {isAr ? 'رسالة / ملاحظات مقدم الطلب' : 'Applicant Message'}
                </span>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {selectedApp.message}
                </p>
              </div>
            )}

            {/* Review History / Notes if existing */}
            {selectedApp.reviewedAt && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                  <span>
                    {isAr ? 'تمت المراجعة بواسطة:' : 'Reviewed by:'} {selectedApp.reviewedBy || 'Super Admin'}
                  </span>
                  <span>
                    {new Date(selectedApp.reviewedAt).toLocaleString(
                      isAr ? 'ar-EG' : 'en-US'
                    )}
                  </span>
                </div>
                {selectedApp.reviewNotes && (
                  <p className="text-xs text-blue-900 bg-white/70 p-2.5 rounded-xl border border-blue-200">
                    {selectedApp.reviewNotes}
                  </p>
                )}
              </div>
            )}

            {/* Actions in Modal */}
            <div className="pt-2 border-t border-[var(--color-border-light)] flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl bg-[var(--color-bg-page)] border border-[var(--color-border-light)] text-xs font-black uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>

              {selectedApp.status !== 'APPROVED' && (
                <>
                  <button
                    onClick={() => handleReject(selectedApp)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-rose-600/20"
                  >
                    <XCircle size={15} />
                    {isAr ? 'رفض الطلب' : 'Reject Application'}
                  </button>

                  <button
                    onClick={() => handleApprove(selectedApp)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 size={15} />
                    {isAr ? 'اعتماد وإنشاء المدرسة' : 'Approve & Create School'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
