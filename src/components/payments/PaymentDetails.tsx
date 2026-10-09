"use client"

import React from "react"
import {
    X,
    Download,
    Printer,
    CheckCircle2,
    Clock,
    AlertCircle,
    CreditCard,
    Calendar,
    Hash,
    User,
    Mail,
    Phone,
    FileText,
} from "lucide-react"
import { useLanguage } from "@/context/LanguageProvider"

interface PaymentDetailsProps {
    payment: any
    onClose: () => void
}

export default function PaymentDetails({ payment, onClose }: PaymentDetailsProps) {
    const { t, language } = useLanguage()
    const currency = language === 'ar' ? 'ر.ي' : '$'
    if (!payment) return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-[var(--color-bg-card)] w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-[var(--color-border-light)] transform transition-all scale-100">
                {/* Header */}
                <div className="p-6 bg-[var(--color-bg-page)]/50 border-b border-[var(--color-border-light)] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-[var(--color-text-primary)]">Payment Details</h2>
                        <p className="text-xs text-[var(--color-text-muted)] font-medium">Transaction info and digital receipt</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-bg-page)] rounded-full transition-colors text-[var(--color-text-muted)]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Status Badge Area */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner
                            ${payment.status === "SUCCESS" ? "bg-emerald-100/50 dark:bg-emerald-950/30" :
                                payment.status === "PENDING" ? "bg-amber-100/50 dark:bg-amber-950/30" : "bg-rose-100/50 dark:bg-rose-950/30"}
                        `}>
                            {payment.status === "SUCCESS" ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> :
                                payment.status === "PENDING" ? <Clock className="w-12 h-12 text-amber-500" /> :
                                    <AlertCircle className="w-12 h-12 text-rose-500" />}
                        </div>
                        <div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                ${payment.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/20" :
                                    payment.status === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-500/20" :
                                        "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-500/20"}
                            `}>
                                {payment.status}
                            </span>
                            <div className="flex items-baseline justify-center gap-1 mt-4">
                                <span className="text-sm font-black text-[var(--color-text-muted)]">{currency}</span>
                                <h3 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tighter">
                                    {payment.amount.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--color-bg-page)]/50 p-6 rounded-2xl border border-[var(--color-border-light)]">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Transaction ID</p>
                            <p className="font-mono text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <Hash className="w-3 h-3 text-blue-500" /> {payment.transactionId}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Payment Date</p>
                            <p className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-blue-500" /> {formatDate(payment.createdAt)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Fee Category</p>
                            <p className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <FileText className="w-3 h-3 text-blue-500" /> {payment.feeCategory}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Payment Method</p>
                            <p className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <CreditCard className="w-3 h-3 text-blue-500" /> {payment.method || 'Online Payment'}
                            </p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border-light)] pb-2">Payer Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-[var(--color-text-muted)] font-black uppercase tracking-tighter leading-none mb-1">Name</p>
                                    <p className="text-xs font-black text-[var(--color-text-primary)] truncate max-w-[120px]">{payment.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-[var(--color-text-muted)] font-black uppercase tracking-tighter leading-none mb-1">Email</p>
                                    <p className="text-xs font-black text-[var(--color-text-primary)] truncate max-w-[150px]">{payment.customerEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-[var(--color-text-muted)] font-black uppercase tracking-tighter leading-none mb-1">Phone</p>
                                    <p className="text-xs font-black text-[var(--color-text-primary)]">{payment.customerPhone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Disclaimer */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                        <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold leading-relaxed italic">
                            * This is a computer-generated digital receipt and is legally binding. For any discrepancies, please contact the school accountant office with the transaction ID.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-[var(--color-bg-page)]/50 border-t border-[var(--color-border-light)] flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-page)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] font-black py-4 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                    >
                        <Printer className="w-5 h-5" /> Print
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Download className="w-5 h-5" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Printable Invoice Component (Hidden from UI, visible in Print) */}
            <div className="hidden print:block">
                <div id="printable-receipt" className="p-10 font-sans text-slate-900 bg-white">
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Official Fee Receipt</h1>
                            <p className="text-sm font-bold text-slate-500">School Management System</p>
                        </div>
                        <div className="text-end">
                            <p className="text-sm font-bold">No: {payment.transactionId}</p>
                            <p className="text-xs text-slate-500 italic">{formatDate(payment.createdAt)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-10">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 border-b pb-1">Billed To</h4>
                            <div>
                                <p className="font-bold">{payment.customerName}</p>
                                <p className="text-xs text-slate-600 font-medium">{payment.customerEmail}</p>
                                <p className="text-xs text-slate-600 font-medium">{payment.customerPhone}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 border-b pb-1">Payment Status</h4>
                            <div>
                                <p className="font-black text-xl italic text-slate-900">{payment.status}</p>
                                <p className="text-xs text-slate-600 font-medium">Method: {payment.method || 'Online'}</p>
                                <p className="text-xs text-slate-600 font-medium">Gateway: Payment Provider</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-10 border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-3 text-start text-xs font-bold uppercase tracking-widest">Description</th>
                                <th className="p-3 text-end text-xs font-bold uppercase tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="p-4">
                                    <p className="font-bold">{payment.feeCategory}</p>
                                    <p className="text-[10px] text-slate-500 italic mt-1 font-medium">Session Fee Collection</p>
                                </td>
                                <td className="p-4 text-end font-black italic">{language === 'ar' ? `ر.ي ${payment.amount.toLocaleString()}` : `$${payment.amount.toLocaleString()}`}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="p-4 text-end font-black uppercase text-sm">{language === 'ar' ? 'إجمالي المدفوع' : 'Total Paid'}</td>
                                <td className="p-4 text-end font-black text-2xl italic tracking-tighter underline decoration-double">{language === 'ar' ? `ر.ي ${payment.amount.toLocaleString()}` : `$${payment.amount.toLocaleString()}`}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="mt-20 flex justify-between items-end">
                        <div className="max-w-xs">
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                This receipt is digitally generated and validated and is legally binding.
                                For any verification, please use the Transaction ID on our portal.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-40 h-[1px] bg-slate-900 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Verified Registrar</p>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-receipt, #printable-receipt * {
                            visibility: visible;
                        }
                        #printable-receipt {
                            position: absolute;
                            inset-inline-start: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                ` }} />
        </div>
    )
}
