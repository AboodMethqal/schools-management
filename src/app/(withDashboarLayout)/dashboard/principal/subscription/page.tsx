"use client";
import React, { useEffect, useState } from 'react';
import {
  Check, Zap, Shield, Crown, Loader2, Users, UserRound,
  HardDrive, Star, Rocket, Gem, Sparkles, Globe,
  Calendar, CreditCard, ArrowRight, CheckCircle2, Award
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPlans } from '@/app/actions/plans';
import { getMySchool } from '@/app/actions/school';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

const iconMap: Record<string, React.ElementType> = {
  Zap, Shield, Crown, Star, Rocket, Gem, Sparkles, Globe
};

export default function SubscriptionPage() {
  const { t, language } = useLanguage();
  const currency = language === 'ar' ? 'ر.ي ' : '$';
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<any[]>([]);
  const [mySchool, setMySchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(searchParams.get('payment') === 'success');
  const [showError, setShowError] = useState(searchParams.get('payment') === 'failed');
  const [showUpgradeView, setShowUpgradeView] = useState(false);

  const fetchData = async () => {
    try {
      const [plansRes, schoolRes] = await Promise.all([
        getPlans(),
        getMySchool()
      ]);

      if (plansRes.success && plansRes.data) setPlans(plansRes.data);
      if (schoolRes.success) setMySchool(schoolRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSubscriptionDetails = async (shouldCloseBanner = false) => {
    // ডাটা রিফ্রেশ করা যাতে লেটেস্ট তথ্য পাওয়া যায়
    const schoolRes = await getMySchool();
    const currentSchool = schoolRes.success ? schoolRes.data : mySchool;

    if (schoolRes.success) {
      setMySchool(schoolRes.data);
    }

    const { plan = 'Premium', duration = '12', subscriptions = [] } = currentSchool || {};
    const sub = subscriptions[0]; // লেটেস্ট সাবস্ক্রিপশন

    await Swal.fire({
      title: 'Payment Receipt 🎉',
      html: `
        <div style="text-align: center; padding: 10px;">
          <div style="margin-bottom: 20px; color: #059669; background: #ecfdf5; padding: 25px; border-radius: 24px; border: 1px solid #d1fae5;">
            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; color: #065f46;">Your Current Plan</p>
            <p style="font-size: 32px; font-weight: 900; margin: 0; color: #064e3b; text-transform: capitalize;">${plan}</p>
          </div>
          
          <div style="padding: 20px; background: #f9fafb; border-radius: 24px; text-align: left; border: 1px solid #f3f4f6;">
            <p style="font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Transaction Information:</p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 14px; padding-bottom: 8px; border-bottom: 1px dashed #e5e7eb;">
                <span style="color: #6b7280; font-weight: 600;">Transaction ID:</span>
                <span style="color: #111827; font-weight: 800; font-family: 'JetBrains Mono', monospace;">${sub?.transactionId || '---'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 14px; padding-bottom: 8px; border-bottom: 1px dashed #e5e7eb;">
                <span style="color: #6b7280; font-weight: 600;">Amount Authorized:</span>
                <span style="color: #111827; font-weight: 800;">${currency}${sub?.amount || '0.00'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 14px; padding-bottom: 8px; border-bottom: 1px dashed #e5e7eb;">
                <span style="color: #6b7280; font-weight: 600;">Validity Period:</span>
                <span style="color: #111827; font-weight: 800;">${duration} Months</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 14px;">
                <span style="color: #6b7280; font-weight: 600;">Activation Date:</span>
                <span style="color: #111827; font-weight: 800;">${sub?.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Verified'}</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 0 10px;">
             <p style="font-size: 12px; color: #6b7280; font-weight: 500; line-height: 1.6;">আপনার পেমেন্ট রেকর্ড নিরাপদে ডাটাবেজে সংরক্ষিত আছে। আপনার সাবস্ক্রিপশনটি অটোমেটিক আপডেট করা হয়েছে। ধন্যবাদ আমাদের সাথে থাকার জন্য।</p>
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Got it!',
      confirmButtonColor: '#10b981',
      showCloseButton: true,
      customClass: {
        popup: 'rounded-[3rem]',
        confirmButton: 'rounded-2xl px-10 py-4 font-black shadow-xl shadow-emerald-100'
      }
    });

    if (shouldCloseBanner) {
      setShowSuccess(false);
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.pathname);
    }
  };

  const handleBuyNow = async (plan: any) => {
    try {
      if (!user) {
        Swal.fire({
          icon: 'warning',
          title: 'নিবন্ধন প্রয়োজন',
          text: 'পেমেন্ট শুরু করতে অনুগ্রহ করে লগ-ইন করুন।',
          confirmButtonColor: '#2563eb'
        });
        return;
      }

      // আগে থেকে সাবস্ক্রিপশন আছে কিনা চেক করা
      const currentPlan = mySchool?.plan?.toLowerCase();
      const requestedPlan = plan.name.toLowerCase();

      if (currentPlan !== 'basic' && currentPlan !== 'free') {
        if (currentPlan === requestedPlan) {
          Swal.fire({
            icon: 'info',
            title: 'ইতিমধ্যে সচল',
            text: 'আপনার বর্তমানে এই সাবস্ক্রিপশনটি চালু আছে।',
            confirmButtonColor: '#2563eb'
          });
          return;
        }

        const currentPlanName = mySchool?.plan || 'Free';
        const result = await Swal.fire({
          title: 'প্ল্যান পরিবর্তন?',
          text: `আপনার বর্তমানে "${currentPlanName}" প্ল্যানটি সচল আছে। আপনি কি এটি পরিবর্তন করে "${plan.name}" নিতে চান?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#2563eb',
          cancelButtonColor: '#64748b',
          confirmButtonText: 'হ্যাঁ, পরিবর্তন করুন',
          cancelButtonText: 'না'
        });

        if (!result.isConfirmed) return;
      }

      const res = await fetch('/api/subscription/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: plan.name,
          amount: parseFloat(plan.price),
          duration: plan.duration,
          customerName: user.user_metadata?.name || user.email,
          customerEmail: user.email,
          customerPhone: user.user_metadata?.phone,
          schoolId: user.user_metadata?.schoolId,
        })
      });
      const data = await res.json();
      if (data.success && data.status === 'PENDING') {
        Swal.fire({
          icon: 'success',
          title: t('Payment Request Submitted'),
          text: t('Payment request submitted and will be verified by administration.'),
          confirmButtonColor: '#2563eb'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Payment Error'),
          text: data.error || t('Unable to submit payment request'),
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: t('Payment Error'),
        text: language === 'ar' ? 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.' : 'An error occurred during payment processing. Please try again later.',
        confirmButtonColor: '#ef4444'
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  // Active Subscription View - If there is at least one successful transaction
  const hasActiveSubscription = mySchool?.subscriptions?.some((s: any) => s.status === 'SUCCESS');

  if (hasActiveSubscription && !showUpgradeView) {
    const activePlanDetails = plans.find(p => p.name.toLowerCase() === mySchool.plan.toLowerCase());
    const Icon = activePlanDetails?.icon && iconMap[activePlanDetails.icon] ? iconMap[activePlanDetails.icon] : Crown;

    return (
      <div className="max-w-5xl mx-auto space-y-8 py-10 px-4 animate-fade-in">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold border border-emerald-100">
            <CheckCircle2 size={16} /> Active Subscription
          </div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">Your School is Powered Up!</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            You are currently using the <span className="text-gray-900 font-bold">{mySchool.plan}</span> plan.
            Everything is set up and running smoothly.
          </p>
        </div>

        {/* Premium Status Card */}
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-blue-500/5">
          <div className="absolute top-0 end-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -me-40 -mt-40 opacity-40" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-900 text-white rounded-2xl shadow-xl">
                  <Icon size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{mySchool.plan} Package</h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Calendar size={12} /> Auto-renews in {mySchool.duration} Months
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Users size={18} className="text-blue-500" />, label: 'Students', value: activePlanDetails?.students || 'Unlimited' },
                  { icon: <UserRound size={18} className="text-purple-500" />, label: 'Teachers', value: activePlanDetails?.teachers || 'Unlimited' },
                  { icon: <HardDrive size={18} className="text-emerald-500" />, label: 'Storage', value: activePlanDetails?.storage || '10GB' },
                  { icon: <Award size={18} className="text-amber-500" />, label: 'Status', value: 'Verified', valueClass: 'text-emerald-600' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {item.icon}
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mt-1">{item.label}</p>
                    <p className={`text-lg font-black text-gray-900 ${item.valueClass || ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Latest Payment Details Section */}
              {mySchool.subscriptions && mySchool.subscriptions[0] && (
                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <CreditCard size={16} />
                    </div>
                    <h3 className="font-black text-gray-900 text-lg">Last Transaction Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
                      <p className="font-bold text-gray-900 font-mono text-sm">{mySchool.subscriptions[0].transactionId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                      <p className="font-bold text-gray-900">{currency}{mySchool.subscriptions[0].amount} ({language === 'ar' ? (mySchool.subscriptions[0].method || 'تحصيل يدوي') : (mySchool.subscriptions[0].method || 'Manual Collection')})</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Date</p>
                      <p className="font-bold text-gray-900">
                        {new Date(mySchool.subscriptions[0].createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {["Core Features", "Advance Features", "Premium Support"].map((mod, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full md:w-72">
              <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 end-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={100} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Shield size={12} /> Security Check
                </p>
                <p className="text-2xl font-black mb-1">Verified ✓</p>
                <p className="text-sm text-gray-400 font-medium">Full access to all modules is active.</p>
                <div className="space-y-2 mt-6">
                  <button
                    onClick={() => showSubscriptionDetails(false)}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    View Details Receipt
                  </button>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setShowUpgradeView(true);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40 text-white"
                  >
                    Upgrade / Change Plan <Rocket size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-10">
          <p className="text-gray-400 text-sm font-medium">Looking to manage enterprise settings? Contact our support team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Status Messages */}
      {showSuccess && (
        <div className="max-w-4xl mx-auto bg-emerald-50 border border-emerald-200 p-6 rounded-[2rem] flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-black text-emerald-900 text-lg">Subscription Successful!</p>
              <p className="text-emerald-700 text-sm font-medium">Your school plan has been upgraded. Welcome aboard!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showSubscriptionDetails(false)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-200">View Details</button>
            <button onClick={() => showSubscriptionDetails(true)} className="text-emerald-500 hover:text-emerald-100 p-2 rounded-full transition-colors" title="Close Banner">
              <Star size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="max-w-4xl mx-auto bg-rose-50 border border-rose-200 p-6 rounded-[2rem] flex items-center justify-between animate-in fade-in slide-in-from-top">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <Star size={24} />
            </div>
            <div>
              <p className="font-black text-rose-900 text-lg">Payment Failed</p>
              <p className="text-rose-700 text-sm font-medium">Something went wrong with the transaction. Please try again.</p>
            </div>
          </div>
          <button onClick={() => setShowError(false)} className="text-rose-500 hover:text-rose-700 font-bold text-sm px-4 py-2">Dismiss</button>
        </div>
      )}

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Choose Your Plan</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium text-base">
          Empower your school with the most advanced management tools. Select a plan to get started.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <p className="font-bold">Gathering premium plans for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {plans.map((plan: any, index: number) => {
            const IconComponent = plan.icon && iconMap[plan.icon] ? iconMap[plan.icon] : Zap;
            const isPopular = index === 1;

            let colorClasses = 'bg-blue-50 text-blue-600';
            if (plan.color === 'purple') colorClasses = 'bg-purple-50 text-purple-600';
            if (plan.color === 'orange') colorClasses = 'bg-orange-50 text-orange-600';
            if (plan.color === 'emerald') colorClasses = 'bg-emerald-50 text-emerald-600';
            if (plan.color === 'rose') colorClasses = 'bg-rose-50 text-rose-600';
            if (plan.color === 'indigo') colorClasses = 'bg-indigo-50 text-indigo-600';
            if (plan.color === 'amber') colorClasses = 'bg-amber-50 text-amber-600';

            return (
              <div
                key={plan.id}
                className={`relative bg-white p-9 rounded-3xl border-2 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 group flex flex-col ${isPopular ? 'border-blue-600 shadow-xl shadow-blue-500/10' : 'border-gray-100 hover:border-blue-300'}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 start-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/30">
                    Most Popular
                  </div>
                )}

                {/* Icon + Name + Price */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${colorClasses}`}>
                    <IconComponent size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">{currency}{plan.price}</span>
                      <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/{plan.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 py-4 mb-5 border-y border-gray-100">
                  <div className="text-center">
                    <Users size={20} className="mx-auto text-gray-300 mb-1 group-hover:text-blue-400 transition-colors" />
                    <p className="text-xs font-black text-gray-900">{plan.students} Std</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <UserRound size={20} className="mx-auto text-gray-300 mb-1 group-hover:text-purple-400 transition-colors" />
                    <p className="text-xs font-black text-gray-900">{plan.teachers} Teach</p>
                  </div>
                  <div className="text-center">
                    <HardDrive size={20} className="mx-auto text-gray-300 mb-1 group-hover:text-emerald-400 transition-colors" />
                    <p className="text-xs font-black text-gray-900">{plan.storage}</p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-7 flex-1">
                  {["Attendance", "Library", "Fees", "Online Exams"].map((module, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-colors">
                        <Check size={13} className="text-emerald-600 group-hover:text-white transition-colors" />
                      </div>
                      {module}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleBuyNow(plan)}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 ${isPopular ? 'bg-gray-900 text-white shadow-xl hover:bg-black' : 'bg-gray-50 text-gray-900 hover:bg-blue-600 hover:text-white hover:shadow-xl'}`}
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
