'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from 'react';
import {
  Loader2,
  DollarSign,
  BookOpen,
  AlertCircle,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  getAccountantClasses,
  getSectionsByClass,
  assignClassFee,
} from '@/app/actions/accountant/fee';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageProvider';

const COMMON_FEE_TITLES = [
  'Monthly Tuition Fee',
  'Exam Fee',
  'Session Fee',
  'Library Fee',
  'Transport Fee',
];

export default function AssignFeePage() {
  const { t, language } = useLanguage();
  const currency = language === 'ar' ? 'ر.ي' : '$';
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    classId: '',
    sectionId: '',
  });

  // State for multiple fees
  const [feeInputs, setFeeInputs] = useState<
    { id: string; title: string; amount: string; custom: boolean }[]
  >(
    COMMON_FEE_TITLES.map((t, i) => ({
      id: `common-${i}`,
      title: t,
      amount: '',
      custom: false,
    })),
  );

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      loadSections(formData.classId);
    } else {
      setSections([]);
      setFormData((prev) => ({ ...prev, sectionId: '' }));
    }
  }, [formData.classId]);

  const loadClasses = async () => {
    setIsLoadingClasses(true);
    const res = await getAccountantClasses();
    if (res.success) {
      setClasses(res.data || []);
    } else {
      toast.error(res.error || 'Failed to load classes');
    }
    setIsLoadingClasses(false);
  };

  const loadSections = async (classId: string) => {
    setIsLoadingSections(true);
    const res = await getSectionsByClass(classId);
    if (res.success) {
      setSections(res.data || []);
    } else {
      toast.error(res.error || 'Failed to load sections');
    }
    setIsLoadingSections(false);
  };

  const handleAmountChange = (id: string, amount: string) => {
    setFeeInputs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, amount } : f)),
    );
  };

  const handleCustomTitleChange = (id: string, title: string) => {
    setFeeInputs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title } : f)),
    );
  };

  const addCustomFee = () => {
    setFeeInputs((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, title: '', amount: '', custom: true },
    ]);
  };

  const removeCustomFee = (id: string) => {
    setFeeInputs((prev) => prev.filter((f) => f.id !== id));
  };

  const totalAmount = useMemo(() => {
    return feeInputs.reduce((sum, item) => {
      const val = parseFloat(item.amount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [feeInputs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.classId) {
      toast.error('Please select a class');
      return;
    }

    const validFees = feeInputs
      .filter((f) => f.title.trim() !== '' && parseFloat(f.amount) > 0)
      .map((f) => ({ title: f.title.trim(), amount: parseFloat(f.amount) }));

    if (validFees.length === 0) {
      toast.error('Please enter an amount for at least one fee');
      return;
    }

    setIsSubmitting(true);
    const res = await assignClassFee({
      classId: formData.classId,
      sectionId: formData.sectionId || undefined,
      fees: validFees,
    });

    if (res.success) {
      toast.success(res.message || 'Fees assigned successfully');
      setFormData({ classId: '', sectionId: '' });
      setFeeInputs(
        COMMON_FEE_TITLES.map((t, i) => ({
          id: `common-${i}`,
          title: t,
          amount: '',
          custom: false,
        })),
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error(res.error || 'Failed to assign fees');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-500/20">
          <DollarSign size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Multi-Fee Assignment
          </h1>
          <p className="text-text-muted font-medium">
            Assign multiple fees simultaneously to a class or section
          </p>
        </div>
      </div>

      <div className="bg-bg-card rounded-[2rem] p-6 sm:p-10 shadow-sm border border-border-light">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Target Selection Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 border-b border-border-light pb-3">
              <BookOpen size={20} className="text-blue-500" />
              Target Audience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Select */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ms-1">
                  Select Class <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <BookOpen
                    className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />
                  <select
                    value={formData.classId}
                    onChange={(e) =>
                      setFormData({ ...formData, classId: e.target.value })
                    }
                    className="w-full ps-12 pe-4 py-4 bg-bg-page border border-border-light rounded-2xl text-sm font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                    disabled={isLoadingClasses}
                    required
                  >
                    <option value="">{language === "ar" ? "اختر صفاً..." : "Choose a class..."}</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingClasses && (
                    <Loader2
                      className="absolute end-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                      size={18}
                    />
                  )}
                </div>
              </div>

              {/* Section Select */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ms-1">
                  Select Section{' '}
                  <span className="text-text-muted">(Optional)</span>
                </label>
                <div className="relative group">
                  <Layers
                    className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />
                  <select
                    value={formData.sectionId}
                    onChange={(e) =>
                      setFormData({ ...formData, sectionId: e.target.value })
                    }
                    className="w-full ps-12 pe-4 py-4 bg-bg-page border border-border-light rounded-2xl text-sm font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none disabled:opacity-50 disabled:grayscale"
                    disabled={!formData.classId || isLoadingSections}
                  >
                    <option value="">All Sections</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingSections && (
                    <Loader2
                      className="absolute end-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
                      size={18}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Amounts Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center justify-between border-b border-border-light pb-3">
              <span className="flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-500" />
                Fee Amounts
              </span>
              <button
                type="button"
                onClick={addCustomFee}
                className="text-sm font-bold text-blue-600 bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 transition flex items-center gap-1"
              >
                <Plus size={16} /> Add Custom
              </button>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feeInputs.map((fee) => (
                <div
                  key={fee.id}
                  className="flex flex-col sm:flex-row gap-3 items-center p-3 bg-bg-page border border-border-light rounded-2xl group hover:border-blue-500/30 transition-colors"
                >
                  {fee.custom ? (
                    <div className="flex-1 w-full relative">
                      <input
                        type="text"
                        placeholder={language === "ar" ? "مثال: رسوم الرحلة المدرسية" : "e.g. Picnic Fee"}
                        value={fee.title}
                        onChange={(e) =>
                          handleCustomTitleChange(fee.id, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-bg-card border border-border-light rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium placeholder:text-text-muted"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 w-full px-2 py-2">
                      <p className="text-sm font-bold text-text-secondary">
                        {fee.title}
                      </p>
                    </div>
                  )}

                  <div className="w-full sm:w-40 relative shrink-0 flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">
                        {currency}
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={fee.amount}
                        onChange={(e) =>
                          handleAmountChange(fee.id, e.target.value)
                        }
                        className="w-full ps-8 pe-3 py-3 bg-bg-card border border-border-light rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    {fee.custom && (
                      <button
                        type="button"
                        onClick={() => removeCustomFee(fee.id)}
                        className="p-3 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-8 flex items-center justify-between p-6 bg-slate-900 dark:bg-bg-page border border-border-light rounded-2xl shadow-lg">
              <span className="text-slate-400 dark:text-text-muted font-bold tracking-widest uppercase text-sm">
                Grand Total per student
              </span>
              <span className="text-3xl font-black text-emerald-400">
                {language === 'ar' ? `ر.ي ${totalAmount.toLocaleString()}` : `$${totalAmount.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Warning Note */}
          <div className="p-5 bg-amber-500/10 dark:bg-amber-400/10 rounded-2xl border border-amber-500/20 flex gap-4 items-start">
            <AlertCircle size={24} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong>Important:</strong> Submitting this form will generate
              `PENDING` payment records for{' '}
              <strong>every fee title with a non-zero amount</strong> for all
              students in the specified{' '}
              {formData.sectionId ? 'section' : 'class'}.
              <br />
              Total records created per student:{' '}
              <strong>
                {feeInputs.filter((f) => parseFloat(f.amount) > 0).length}
              </strong>
              .
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingClasses || totalAmount === 0}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : null}
              {isSubmitting
                ? (language === 'ar' ? 'جارٍ معالجة الإسناد...' : 'Processing Assignments...')
                : (language === 'ar' ? `إسناد ر.ي ${totalAmount.toLocaleString()} للطلاب` : `Assign $${totalAmount.toLocaleString()} to Students`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
