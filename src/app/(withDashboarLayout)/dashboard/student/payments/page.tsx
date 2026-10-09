"use client"

import React, { useState, Suspense, useEffect } from "react"
import { DollarSign, Clock, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import PaymentFlow from "@/components/payments/PaymentFlow"
import PaymentDetails from "@/components/payments/PaymentDetails"
import { getPayments, getPendingFees, getStudentProfile } from "./actions"
import { useLanguage } from "@/context/LanguageProvider"

function PaymentsContent() {
    const { t, language } = useLanguage()
    const currency = language === 'ar' ? 'ر.ي' : '$'
    const searchParams = useSearchParams()
    const status = searchParams.get('status')
    const transactionId = searchParams.get('transactionId')

    const [showPaymentFlow, setShowPaymentFlow] = useState(!!status)
    const [paymentParams, setPaymentParams] = useState<{ amount: number; category: string } | null>(null)
    const [realPayments, setRealPayments] = useState<any[]>([])
    const [pendingFees, setPendingFees] = useState<any[]>([])
    const [studentProfile, setStudentProfile] = useState<{ name: string; email: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedPayment, setSelectedPayment] = useState<any | null>(null)

    const loadPayments = async () => {
        setLoading(true)
        try {
            const historyData = await getPayments()
            const pendingData = await getPendingFees()
            const profileData = await getStudentProfile()
            
            setRealPayments(historyData)
            setPendingFees(pendingData)
            setStudentProfile(profileData)
        } catch (error) {
            console.error("Failed to load payments:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPayments()
    }, [showPaymentFlow]) // Refresh when returning from payment flow

    if (showPaymentFlow) {
        return (
            <div className="relative">
                {!status && (
                    <button
                        onClick={() => {
                            setShowPaymentFlow(false)
                            setPaymentParams(null)
                        }}
                        className="fixed top-20 start-4 md:start-72 z-50 p-2 bg-[var(--color-bg-card)] rounded-xl shadow-lg border border-[var(--color-border-light)] hover:bg-[var(--color-bg-page)] transition-all transform active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
                    </button>
                )}
                <PaymentFlow 
                    initialStatus={status} 
                    initialTxnId={transactionId} 
                    defaultAmount={paymentParams?.amount}
                    defaultCategory={paymentParams?.category}
                    pendingFees={pendingFees}
                    studentProfile={studentProfile}
                />
            </div>
        )
    }

    const pendingTotal = pendingFees.reduce((acc, p) => acc + p.amount, 0)
    const successTotal = realPayments.filter(p => p.status === 'SUCCESS').reduce((acc, p) => acc + p.amount, 0)

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Payments & Invoices</h1>
                {loading && (
                    <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Due Card - Premium Redesign */}
                <div className={`
                    relative overflow-hidden shadow-2xl rounded-[2rem] p-8 flex-1 border transition-all duration-700
                    ${pendingTotal > 0 
                        ? "bg-linear-to-br from-slate-900 to-indigo-950 dark:from-indigo-950 dark:to-slate-950 border-slate-800 shadow-indigo-500/10" 
                        : "bg-linear-to-br from-emerald-500/5 to-emerald-600/10 dark:from-emerald-500/10 dark:to-emerald-950/20 border-emerald-500/20 shadow-emerald-500/5"}
                `}>
                    <div className="absolute top-0 end-0 p-8 opacity-10 rotate-12">
                        {pendingTotal > 0 ? (
                            <DollarSign size={120} className="text-emerald-400" />
                        ) : (
                            <CheckCircle2 size={120} className="text-emerald-500" />
                        )}
                    </div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <p className={`font-bold uppercase tracking-widest text-[10px] mb-2 ${pendingTotal > 0 ? "text-blue-200/60" : "text-emerald-600 dark:text-emerald-400"}`}>
                                {pendingTotal > 0 ? "Outstanding Dues (Pending)" : "All Dues Settled"}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-xl font-black ${pendingTotal > 0 ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-500"}`}>{currency}</span>
                                <h3 className={`text-5xl font-black tracking-tighter ${pendingTotal > 0 ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`}>
                                    {pendingTotal.toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {pendingTotal > 0 ? (
                            <button
                                onClick={() => {
                                    setPaymentParams({ amount: pendingTotal, category: 'All Outstanding Dues' })
                                    setShowPaymentFlow(true)
                                }}
                                className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1 active:scale-95 text-base w-full md:w-max"
                            >
                                Pay All Now
                            </button>
                        ) : (
                            <div className="mt-8 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 w-max px-4 py-2 rounded-xl border border-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4" /> You're all caught up!
                            </div>
                        )}
                    </div>
                </div>

                {/* Total Paid Card */}
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-[2rem] p-8 relative overflow-hidden shadow-sm flex-1">
                    <div className="absolute top-0 end-0 p-8 opacity-5">
                        <RefreshCw size={120} className="text-blue-500" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col justify-center h-full">
                        <div>
                            <p className="text-[var(--color-text-muted)] font-black uppercase tracking-widest text-[10px] mb-2">Total Payments Made</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-blue-500">{currency}</span>
                                <h3 className="text-5xl font-black tracking-tighter text-[var(--color-text-primary)]">{successTotal.toLocaleString()}</h3>
                            </div>
                        </div>
                        <p className="text-[var(--color-text-muted)] text-[11px] mt-6 font-bold flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Lifetime successful transactions
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment History Table - Theme Optimized */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-[2rem] shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-[var(--color-border-light)] flex justify-between items-center bg-[var(--color-bg-page)]/30 backdrop-blur-sm">
                    <h3 className="font-black text-[var(--color-text-primary)] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Real-time Payment History
                    </h3>
                    <button
                        onClick={loadPayments}
                        disabled={loading}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 border border-blue-500/20 bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                        Refresh History
                    </button>
                </div>

                <div className="overflow-x-auto p-4 md:p-6">
                    <table className="w-full text-sm text-start">
                        <thead>
                            <tr className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border-light)]">
                                <th className="px-4 py-3 font-black">Transaction ID</th>
                                <th className="px-4 py-3 font-black text-center">Date</th>
                                <th className="px-4 py-3 font-black">Category</th>
                                <th className="px-4 py-3 font-black">Amount</th>
                                <th className="px-4 py-3 font-black">Status</th>
                                <th className="px-4 py-3 font-black text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-light)]">
                            {loading && realPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-[var(--color-text-muted)] italic font-medium">Looking for records...</td>
                                </tr>
                            ) : realPayments.map((payment: any) => (
                                <tr key={payment.id} className="hover:bg-[var(--color-bg-page)]/50 transition-all group">
                                    <td className="px-4 py-5">
                                        <span className="font-mono font-bold text-[11px] text-[var(--color-text-muted)] group-hover:text-blue-500 transition-colors">
                                            #{payment.transactionId}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <div className="text-[var(--color-text-primary)] font-bold text-[11px]">
                                            {new Date(payment.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="font-black text-[var(--color-text-primary)] tracking-tight">
                                            {payment.feeCategory}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="font-black text-[var(--color-text-primary)] flex items-center gap-1">
                                            <span className="text-[10px] text-[var(--color-text-muted)]">{currency}</span>
                                            {payment.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`
                                            inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase
                                            ${payment.status === "SUCCESS" ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" :
                                                payment.status === "PENDING" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                                                    "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full me-2 
                                                ${payment.status === "SUCCESS" ? "bg-emerald-500" :
                                                    payment.status === "PENDING" ? "bg-amber-500" :
                                                        "bg-rose-500"}
                                            `}></span>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-end">
                                        <button
                                            onClick={() => setSelectedPayment(payment)}
                                            className="text-[var(--color-text-primary)] hover:text-blue-500 font-black text-[10px] uppercase tracking-widest border border-[var(--color-border-light)] bg-[var(--color-bg-card)] px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && realPayments.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-[var(--color-bg-page)] rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-[var(--color-text-muted)]" />
                        </div>
                        <p className="text-[var(--color-text-muted)] font-bold italic tracking-tight underline decoration-blue-500/20 underline-offset-8">
                            No payment records found
                        </p>
                    </div>
                )}
            </div>

            {selectedPayment && (
                <PaymentDetails
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </div>
    )
}

export default function PaymentsPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center font-bold text-blue-500 animate-pulse">Initializing Financial Gateway...</div>}>
            <PaymentsContent />
        </Suspense>
    )
}
