"use client"

import React, { useState, useEffect } from "react"
import {
    CheckCircle2,
    Wallet,
    Download,
    User,
    Calendar,
    History,
    FileText,
    ExternalLink,
    AlertCircle,
    Smartphone,
    ShieldCheck,
    CreditCard,
    ArrowRight,
    Edit3,
    Layers,
    Clock
} from "lucide-react"

import { getPaymentByTransactionId } from "@/app/(withDashboarLayout)/dashboard/student/payments/actions"
import { useLanguage } from "@/context/LanguageProvider"

export default function PaymentFlow({ 
    initialStatus, 
    initialTxnId, 
    defaultAmount, 
    defaultCategory,
    pendingFees = [],
    studentProfile
}: { 
    initialStatus?: string | null, 
    initialTxnId?: string | null,
    defaultAmount?: number,
    defaultCategory?: string,
    pendingFees?: any[],
    studentProfile?: { name: string; email: string } | null
}) {
    const { t, language } = useLanguage()
    const [step, setStep] = useState<string>(
        initialStatus === 'success' ? 'SUCCESS' :
            initialStatus === 'pending' ? 'PENDING' :
            initialStatus === 'failed' || initialStatus === 'cancelled' ? 'FAILED' :
                "SELECT"
    )
    
    // If we have pending fees, default to 'preset' mode. Otherwise 'custom'.
    const [paymentMode, setPaymentMode] = useState<'preset' | 'custom'>(
        defaultAmount ? 'custom' : (pendingFees.length > 0 ? 'preset' : 'custom')
    )
    
    const [selectedFee, setSelectedFee] = useState<any>(pendingFees.length > 0 ? pendingFees[0] : null)
    const [customAmount, setCustomAmount] = useState<string>(defaultAmount ? defaultAmount.toString() : "")
    const [isProcessing, setIsProcessing] = useState(false)
    const [transactionId, setTransactionId] = useState<string | null>(initialTxnId || null)
    const [verifiedAmount, setVerifiedAmount] = useState<number | null>(null)

    // Sync selected fee if pendingFees load later
    useEffect(() => {
        if (pendingFees.length > 0 && !selectedFee) {
            setSelectedFee(pendingFees[0])
            if (!defaultAmount) setPaymentMode('preset')
        }
    }, [pendingFees])

    // Verify amount from DB if returning from success
    useEffect(() => {
        if (transactionId && initialStatus === 'success') {
            getPaymentByTransactionId(transactionId).then(pay => {
                if (pay) setVerifiedAmount(pay.amount)
            })
        }
    }, [transactionId, initialStatus])

    const handlePayment = async () => {
        const finalAmount = paymentMode === 'custom' ? parseFloat(customAmount) : (selectedFee?.amount || 0)
        
        if (!finalAmount || finalAmount <= 0) {
            alert(language === 'ar' ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount")
            return
        }

        setIsProcessing(true)
        try {
            const response = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalAmount,
                    existingPaymentId: (paymentMode === 'preset' && selectedFee?.id) ? selectedFee.id : undefined,
                    feeCategory: paymentMode === 'custom' ? (defaultCategory || 'Custom Payment') : selectedFee.feeCategory,
                    customerName: studentProfile?.name || 'Student User',
                    customerEmail: studentProfile?.email || 'student@school.com',
                })
            });

            const data = await response.json();

            if (data.success && data.status === 'PENDING') {
                setTransactionId(data.transactionId || null);
                setStep('PENDING');
            } else {
                alert(data.error || (language === 'ar' ? 'تعذر تسجيل طلب الدفع' : 'Unable to submit payment request'));
            }
            setIsProcessing(false);
        } catch (error) {
            console.error('Payment exception:', error);
            setIsProcessing(false);
        }
    }

    if (step === "SUCCESS") return <PaymentStatus step="SUCCESS" amount={verifiedAmount || (paymentMode === 'custom' ? parseFloat(customAmount) : (selectedFee?.amount || 0))} txnId={transactionId} language={language} t={t} />
    if (step === "PENDING") return <PaymentStatus step="PENDING" amount={paymentMode === 'custom' ? parseFloat(customAmount) : (selectedFee?.amount || 0)} txnId={transactionId} language={language} t={t} />
    if (step === "FAILED") return <PaymentStatus step="FAILED" txnId={transactionId} language={language} t={t} />

    return (
        <div className="max-w-4xl mx-auto bg-[var(--color-bg-page)] min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
            <div className="flex flex-col items-center mb-10 gap-6">
                <div className="bg-[var(--color-bg-card)] px-6 py-2 rounded-full border border-[var(--color-border-light)] shadow-sm">
                    <h1 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-widest flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-500" /> {t('Secure Checkout')}
                    </h1>
                </div>

                {/* Mode Switcher */}
                <div className="flex p-1.5 bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-2xl shadow-sm">
                    <button 
                        onClick={() => setPaymentMode('preset')}
                        disabled={pendingFees.length === 0}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                            ${paymentMode === 'preset' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] disabled:opacity-30"}`}
                    >
                        <Layers className="w-4 h-4" /> {t('Assigned Fees')}
                    </button>
                    <button 
                        onClick={() => setPaymentMode('custom')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                            ${paymentMode === 'custom' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"}`}
                    >
                        <Edit3 className="w-4 h-4" /> {t('Custom Amount')}
                    </button>
                </div>
            </div>

            <FeeSelection
                paymentMode={paymentMode}
                selectedFee={selectedFee}
                pendingFees={pendingFees}
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                onSelect={setSelectedFee}
                onProceed={handlePayment}
                isProcessing={isProcessing}
                language={language}
                t={t}
            />
        </div>
    )
}

function FeeSelection({ paymentMode, selectedFee, pendingFees, customAmount, setCustomAmount, onSelect, onProceed, isProcessing, language, t }: any) {
    const currency = language === 'ar' ? 'ر.ي' : '$';

    return (
        <div className="space-y-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            {paymentMode === 'preset' ? (
                <>
                {/* Fee Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingFees.map((fee: any) => (
                        <button
                            key={fee.id}
                            onClick={() => onSelect(fee)}
                            className={`p-6 rounded-3xl border-2 transition-all text-start relative overflow-hidden group
                                ${selectedFee?.id === fee.id 
                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20" 
                                    : "bg-[var(--color-bg-card)] border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:border-blue-500/50"}
                            `}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors
                                ${selectedFee?.id === fee.id ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}
                            `}>
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-lg tracking-tight mb-1">{t(fee.feeCategory)}</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-widest
                                ${selectedFee?.id === fee.id ? "text-blue-100" : "text-[var(--color-text-muted)]"}
                            `}>
                                {language === 'ar' ? 'تاريخ الإسناد: ' : 'Assigned: '}{new Date(fee.createdAt).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}
                            </p>
                            
                            <div className={`absolute bottom-6 end-6 font-black text-xl tracking-tighter
                                ${selectedFee?.id === fee.id ? "text-white" : "text-[var(--color-text-primary)]"}
                            `}>
                                {language === 'ar' ? `${currency} ${fee.amount.toLocaleString()}` : `${currency}${fee.amount.toLocaleString()}`}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Selected Fee Breakdown Card */}
                {selectedFee && (
                    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                             <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                             <h3 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-widest">{t('Detail Summary')}</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-[var(--color-text-muted)]">{t('Fee Type')}</span>
                                <span className="text-[var(--color-text-primary)] font-bold">{t(selectedFee.feeCategory)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-[var(--color-text-muted)]">{t('Reference ID')}</span>
                                <span className="text-[var(--color-text-primary)] font-mono font-bold text-[10px]">{selectedFee.transactionId}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--color-border-light)] border-dashed flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{t('Total Payable')}</p>
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                                    {language === 'ar' ? 'أُسندت بتاريخ ' : 'Assigned on '}{new Date(selectedFee.createdAt).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}
                                </p>
                            </div>
                            <div className="text-end">
                                <span className="text-4xl font-black text-[var(--color-text-primary)] tracking-tighter">
                                    {language === 'ar' ? `${currency} ${selectedFee.amount.toLocaleString()}` : `${currency}${selectedFee.amount.toLocaleString()}`}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                </>
            ) : (
                /* Custom Amount Mode */
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-[2rem] p-8 md:p-12 shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                        <Edit3 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight mb-2">{t('Enter Custom Amount')}</h2>
                    <p className="text-[var(--color-text-muted)] font-medium mb-10 text-sm">{t('Input the specific amount you wish to pay now.')}</p>
                    
                    <div className="relative max-w-xs mx-auto mb-10 group">
                        <span className="absolute start-6 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-500">{currency}</span>
                        <input 
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[var(--color-bg-page)] border-2 border-[var(--color-border-light)] focus:border-blue-500 rounded-2xl py-6 ps-16 pe-6 text-3xl font-black text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all text-center group-hover:border-[var(--color-border-light)]"
                        />
                    </div>

                    <div className="flex items-center gap-3 justify-center text-xs font-bold text-amber-500 bg-amber-500/5 py-3 rounded-xl border border-amber-500/10">
                        <AlertCircle className="w-4 h-4" />
                        {t('Please double check the amount before proceeding')}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <button
                    onClick={onProceed}
                    disabled={isProcessing || (paymentMode === 'custom' && (!customAmount || parseFloat(customAmount) <= 0)) || (paymentMode === 'preset' && !selectedFee)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-8 rounded-2xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-50 text-lg"
                >
                    {isProcessing ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('Initiating Gateway...')}
                        </div>
                    ) : (
                        <>
                            {language === 'ar' ? (
                                <>دفع {paymentMode === 'custom' && customAmount ? `${currency} ${parseFloat(customAmount).toLocaleString()}` : 'الآن'} <ArrowRight className="w-5 h-5" /></>
                            ) : (
                                <>Pay {paymentMode === 'custom' && customAmount ? `${currency}${parseFloat(customAmount).toLocaleString()}` : 'Now'} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </>
                    )}
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                     <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {t('Secure Payment Request')}</span>
                     <span className="w-1 h-1 bg-[var(--color-border-light)] rounded-full" />
                     <span>{t('Payment confirmation is handled by school administration')}</span>
                </div>
            </div>
        </div>
    )
}

function PaymentStatus({ step, amount, txnId, language, t }: any) {
    const currency = language === 'ar' ? 'ر.ي' : '$';

    if (step === "PENDING") {
        return (
            <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-[var(--color-bg-page)] p-4 text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 shadow-xl shadow-amber-500/30">
                        <Clock className="h-9 w-9 text-white" />
                    </div>
                </div>
                <h1 className="mb-2 text-3xl font-black text-[var(--color-text-primary)]">
                    {t('Payment Request Submitted')}
                </h1>
                <p className="mb-8 font-bold text-[var(--color-text-muted)]">
                    {t('Payment request submitted and will be verified by administration.')}
                </p>
                <div className="w-full space-y-4 rounded-[2rem] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-8 shadow-sm">
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-bold text-[var(--color-text-muted)]">{t('Order Number')}</span>
                        <span className="font-mono font-black text-[var(--color-text-primary)]">{txnId || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-dashed border-[var(--color-border-light)] pt-4 text-sm">
                        <span className="font-bold text-[var(--color-text-muted)]">{t('Amount')}</span>
                        <span className="font-black text-amber-600">
                            {language === 'ar' ? `${currency} ${amount?.toLocaleString('ar-YE')}` : `${currency}${amount?.toLocaleString('en-US')}`}
                        </span>
                    </div>
                </div>
                <button onClick={() => window.location.href = '/dashboard/student/payments'} className="mt-6 w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700">
                    {t('Back to Payments')}
                </button>
            </div>
        )
    }

    if (step === "SUCCESS") {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-[var(--color-bg-page)] p-4 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2">{t('Payment Success!')}</h1>
                <p className="text-[var(--color-text-muted)] font-bold mb-12">{t('Your transaction has been processed securely.')}</p>

                <div className="w-full bg-[var(--color-bg-card)] rounded-[2rem] p-8 border border-[var(--color-border-light)] shadow-sm space-y-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 end-0 w-32 h-32 bg-emerald-500/5 rounded-full -me-16 -mt-16" />

                    <div className="flex justify-between items-center text-start">
                        <span className="text-[var(--color-text-muted)] font-black uppercase tracking-widest text-[9px]">{t('Transaction ID')}</span>
                        <span className="text-[var(--color-text-primary)] font-mono font-bold text-[10px] break-all ms-4">#{txnId || 'SB-98234710'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-[var(--color-border-light)] pt-6 border-dashed">
                        <span className="text-[var(--color-text-muted)] font-black uppercase tracking-widest text-[9px]">{t('Amount Paid')}</span>
                        <span className="text-emerald-500 font-black text-xl italic underline decoration-emerald-500/20">
                            {language === 'ar' ? `${currency} ${amount?.toLocaleString()}` : `${currency}${amount?.toLocaleString()}`}
                        </span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <button
                        onClick={() => window.location.href = '/dashboard/student/payments'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <History className="w-5 h-5" /> {t('Back to Dashboard')}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-page)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                    >
                        <Download className="w-5 h-5" /> {t('Download Receipt')}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[var(--color-bg-page)] p-4 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rose-100 dark:bg-rose-950/40 rounded-full flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-rose-500/40">
                    <AlertCircle className="w-10 h-10 text-white" />
                </div>
            </div>

            <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">{t('Payment Failed')}</h1>
            <p className="text-[var(--color-text-muted)] font-bold mb-12 max-w-[280px] mx-auto">{t("We couldn't process your request. No funds were debited.")}</p>

            <button
                onClick={() => window.location.href = '/dashboard/student/payments'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
                <History className="w-5 h-5" /> {t('Retry Payment')}
            </button>
            <p className="mt-8 text-[var(--color-text-muted)] text-[9px] font-black uppercase tracking-widest">{t('Transaction ID')}: {txnId || 'N/A'}</p>
        </div>
    )
}
