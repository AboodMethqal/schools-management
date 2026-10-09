'use client';
import { useState, useEffect } from 'react';
import { History, Download, CreditCard, Calendar, ArrowUpRight, CheckCircle2, Clock, Loader2, GraduationCap } from 'lucide-react';
import { getParentFeesData } from "@/app/actions/parent/fees";
import { getParentDashboardData } from "@/app/actions/parent/dashboard";
import { initiatePayment } from "@/app/actions/payment";
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

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

export default function FeesPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getParentFeesData();
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handlePayment = async () => {
    try {
      const dashRes = await getParentDashboardData();
      if (!dashRes.success || !dashRes.data) {
        Swal.fire(t('Error'), language === 'ar' ? 'تعذر جلب بيانات الطالب' : 'Could not retrieve student information', 'error');
        return;
      }

      const { studentId, schoolId, parentName, studentId_real } = dashRes.data as any;
      
      Swal.fire({
        title: t('Initiating Payment'),
        text: language === 'ar' ? `جارٍ التحويل لبوابة الدفع لرصيد ر.ي ${data?.totalDue}...` : `Redirecting to secure gateway for $${data?.totalDue}...`,
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await initiatePayment({
        amount: data?.totalDue?.replace(/,/g, '') || '0',
        studentId: studentId_real || studentId, 
        schoolId: schoolId,
        feeCategory: 'School Fee',
        customerName: parentName,
      });

      if (res.success) {
        Swal.fire(t('Payment Request Submitted'), res.message || t('Payment request submitted and will be verified by administration.'), 'success');
        const refreshed = await getParentFeesData();
        if (refreshed.success) setData(refreshed.data);
      } else {
        Swal.fire(t('Payment Error'), res.error || t('Unable to submit payment request'), 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire(t('Error'), language === 'ar' ? 'حدث خطأ أثناء بدء عملية الدفع' : 'An unexpected error occurred during payment initialization.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={60} />
          <GraduationCap className="absolute inset-0 m-auto text-blue-900/20" size={30} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-text-primary tracking-tight animate-pulse">
            {language === 'ar' ? 'جارٍ تحميل السجلات المالية...' : 'Loading Financial Records...'}
          </p>
        </div>
      </div>
    );
  }

  const paymentHistory = data?.paymentHistory || [];
  const currencySymbol = language === 'ar' ? 'ر.ي' : '$';

  return (
    <div className="space-y-8 animate-fadeIn p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {t('Fees & Payments')}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("Monitor and manage your child's school fees and payment history")}
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-bg-card border border-border-light text-text-secondary hover:bg-bg-page rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <Download size={18} />
          {t('Statement')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Due Card */}
        <div className="lg:col-span-1">
          <Card className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6 border-none shadow-xl shadow-blue-500/20 relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="absolute end-[-20px] top-[-20px] opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <CreditCard size={180} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <CreditCard size={24} className="text-white" />
                </div>
                <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                  {t('Total Due')}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
                  {t('Remaining Balance')}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tight mt-1">
                    {language === 'ar' ? `ر.ي ${data?.totalDue || "0"}` : `$${data?.totalDue || "0"}`}
                  </p>
                  <span className="text-xs font-medium text-white/50">{currencySymbol}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-3 py-3 border-t border-white/10">
                <Calendar size={16} className="text-white/60" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                  {t('Due Date')}: <span className="text-white">{language === 'ar' ? '20 مارس 2026' : '20 March, 2026'}</span>
                </p>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-4 bg-white text-blue-700 rounded-2xl font-bold text-sm hover:shadow-2xl hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
              >
                {t('Pay Now')}
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </Card>
        </div>

        {/* History Table */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-border-light flex items-center justify-between bg-bg-page/30">
            <h3 className="font-bold text-text-primary flex items-center gap-2 text-sm uppercase tracking-widest leading-none">
              <History size={20} className="text-blue-500" /> {t('Transactions')}
            </h3>
            <button 
              onClick={() => window.print()}
              className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-all border border-blue-500/10 uppercase tracking-widest"
            >
              <Download size={16} /> {t('Statement')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-bg-page/50 text-text-muted">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light text-start">
                    {t('Month')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light text-start">
                    {t('Description')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light text-start">
                    {t('Amount')}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light text-end">
                    {t('Status')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {paymentHistory.map((item: any, idx: number) => {
                  const localizedAmount = language === 'ar' ? (item.amount?.includes('$') ? item.amount.replace('$', 'ر.ي ') : item.amount) : (item.amount?.includes('ر.ي') ? item.amount.replace('ر.ي', '$') : item.amount);
                  return (
                    <tr key={idx} className="hover:bg-bg-page/80 transition-colors animate-fadeInSlide" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="px-6 py-5">
                         <span className="text-sm font-bold text-text-primary">{t(item.month)}</span>
                      </td>
                      <td className="px-6 py-5">
                         <p className="text-xs text-text-muted leading-relaxed max-w-[200px]">{t(item.desc)}</p>
                      </td>
                      <td className="px-6 py-5">
                         <span className="text-sm font-bold text-text-primary">{localizedAmount}</span>
                      </td>
                      <td className="px-6 py-5 text-end">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-widest leading-none shadow-sm",
                          item.statusColor === 'emerald' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {item.statusColor === 'emerald' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {t(item.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-bg-page/30 mt-auto border-t border-border-light">
            <p className="text-[10px] text-text-muted font-bold text-center uppercase tracking-widest">
              {t('Showing last 6 months of records')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
