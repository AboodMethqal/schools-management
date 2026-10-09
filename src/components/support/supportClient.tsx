'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, HelpCircle, MessageCircle, Book, Video, Shield, Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

const SupportClient = ({ initialOptions }: { initialOptions: any[] }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqsEn = [
    {
      question: "How do I get started with the School Portal?",
      answer: "Starting is easy! Check our 'Quick Start Guide' in the Documentation section. If you need a demo, our team can schedule a 1-on-1 session for your staff."
    },
    {
      question: "Can I manage multiple school branches?",
      answer: "Yes, our Super Admin panel supports Multi-Branch management. You can switch between campuses from the top dashboard menu."
    },
    {
      question: "How secure is our school's data?",
      answer: "We use bank-grade AES-256 encryption. Your data is backed up daily to multiple secure cloud locations to ensure zero data loss."
    }
  ];

  const faqsAr = [
    {
      question: "كيف يمكنني البدء في استخدام منصة المدرسة؟",
      answer: "البدء سهل للغاية! يمكنك مراجعة 'دليل البدء السريع' في قسم التوثيق، أو طلب جلسة تدريبية مخصصة لفريق مدرستك يقدمها خبراؤنا مباشرة."
    },
    {
      question: "هل يمكن إدارة فروع متعددة للمدرسة من لوحة واحدة؟",
      answer: "نعم بكل تأكيد، تتيح لوحة الإدارة العامة إدارة فروع ومجمعات متعددة مع إمكانية التبديل بين الفروع بسهولة تامة من القائمة العلوية."
    },
    {
      question: "ما مدى أمان وحماية بيانات الطلاب والمدرسة؟",
      answer: "نعتمد تشفيراً مصرفياً متقدماً AES-256 ونسخاً احتياطياً يومياً في بيئات سحابية متعددة ومعزولة لضمان حماية بياناتك بنسبة 100%."
    }
  ];

  const faqs = isAr ? faqsAr : faqsEn;

  const resources = isAr
    ? [
        { icon: Book, title: "أدلة وشروحات خطوة بخطوة", color: "text-blue-500", desc: "أدلة استخدام كاملة ومبسطة لكل وظيفة في النظام." },
        { icon: Video, title: "فيديوهات تدريبية تفاعلية", color: "text-emerald-500", desc: "شروحات مرئية تفصيلية لجميع البوابات والأدوار." },
        { icon: Shield, title: "بروتوكولات حماية وسرية البيانات", color: "text-purple-500", desc: "تعرف على كيفية تأمين سجلات مدرستك وحمايتها." }
      ]
    : [
        { icon: Book, title: "Step-by-Step Documentation", color: "text-blue-500", desc: "Detailed guides for every feature." },
        { icon: Video, title: "Interactive Video Tutorials", color: "text-emerald-500", desc: "Visual walkthroughs of the portal." },
        { icon: Shield, title: "Data Security Protocols", color: "text-purple-500", desc: "Learn how we protect your privacy." }
      ];

  return (
    <section className="bg-[var(--color-bg-page)] py-24 pt-40 transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* --- Header Section --- */}
        <div className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">
              {isAr ? "مركز المساعدة والدعم الفني" : "Help & Support Center"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[var(--color-text-primary)] leading-tight mb-6"
          >
            {isAr ? (
              <>
                نُمكّن مسيرتكم <span className="text-primary italic">التعليمية.</span> <br />
                نحن هنا دائماً <span className="text-[var(--color-text-secondary)] font-medium underline decoration-primary/30">لمساعدتكم.</span>
              </>
            ) : (
              <>
                Empowering Your <span className="text-primary italic">Journey.</span> <br />
                We Are Here to <span className="text-[var(--color-text-secondary)] font-medium underline decoration-primary/30">Assist You.</span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[var(--color-text-secondary)] leading-relaxed"
          >
            {isAr
              ? "سواء كنت معلماً، طالباً، ولي أمر، أو مديراً؛ فريق الدعم المخصص لدينا ومواردنا المتكاملة جاهزة لضمان تجربة تعليمية وإدارية مريحة وخالية من التعقيد."
              : "Whether you are a teacher, student, or admin, our dedicated support team and comprehensive resources are designed to ensure your management experience is seamless and stress-free."}
          </motion.p>
        </div>

        {/* --- Support Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {initialOptions?.map((option, idx) => {
            const IconComponent = (LucideIcons as any)[option.iconName] || LucideIcons.HelpCircle;

            const title = isAr ? t(option.title) : option.title;
            const description = isAr ? t(option.description) : option.description;
            const actionLabel = isAr ? (option.actionLabel === 'Contact Support' ? 'تواصل مع الدعم' : option.actionLabel === 'View Docs' ? 'عرض الأدلة' : option.actionLabel === 'Schedule Demo' ? 'حجز موعد تجربة' : t(option.actionLabel)) : option.actionLabel;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-[var(--color-bg-card)] border border-[var(--color-border-light)] p-8 rounded-3xl hover:border-primary transition-all duration-300 flex flex-col items-start"
              >
                {/* Subtle Background Icon Decoration */}
                <div className="absolute top-4 end-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                  <IconComponent size={60} />
                </div>

                <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 relative z-10">
                  <IconComponent size={24} />
                </div>

                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 relative z-10">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 relative z-10">
                  {description}
                </p>

                <Link href={option.link || "#"} className="mt-auto flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all relative z-10">
                  {actionLabel} <ArrowRight size={14} className={isAr ? "rotate-180" : ""} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* --- Resources & FAQ Section --- */}
        <div className="flex flex-col lg:flex-row gap-16 items-start border-t border-[var(--color-border-light)] pt-20">

          {/* Left Side: Specialized Resources */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
              {isAr ? "الخدمة الذاتية" : "Self-Service"}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              {isAr ? "حلول فورية وسريعة دون انتظار." : "Fast solutions without the wait."}
            </p>

            <div className="space-y-4">
              {resources.map((res, i) => (
                <div key={i} className="group flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-light)] hover:border-primary/30 cursor-pointer transition-all">
                  <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${res.color} group-hover:bg-primary/10 transition-colors`}><res.icon size={22} /></div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">{res.title}</h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{res.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: FAQ Accordion */}
          <div className="w-full lg:w-2/3">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
                {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {isAr ? "إجابات واضحة على أكثر الأسئلة والاستفسارات شيوعاً." : "Find quick answers to common technical queries."}
              </p>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[var(--color-bg-card)]/50 rounded-2xl border border-transparent hover:border-[var(--color-border-light)] transition-all px-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-6 flex justify-between items-center text-start group"
                  >
                    <span className="font-bold text-[var(--color-text-primary)] text-lg pe-4 group-hover:text-primary transition-colors">{faq.question}</span>
                    <div className={`p-1.5 rounded-lg border transition-all ${openFaq === index ? "bg-primary text-white border-primary rotate-180" : "bg-transparent text-[var(--color-text-muted)] border-[var(--color-border-light)]"}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[var(--color-text-secondary)] leading-relaxed ps-1 italic border-s-2 border-primary/20 ms-1">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Bottom Contact CTA --- */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mt-32 p-10 rounded-[3rem] bg-[var(--color-bg-card)] border border-[var(--color-border-light)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Abstract Circle Decor */}
          <div className="absolute -end-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-primary text-white rounded-[20px] flex items-center justify-center shadow-2xl shadow-primary/30">
              <Headphones size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-[var(--color-text-primary)]">
                {isAr ? "مساعدة واستشارات مخصصة" : "Personalized Assistance"}
              </h4>
              <p className="text-[var(--color-text-secondary)] font-medium mt-1">
                {isAr ? "فريق الدعم الفني جاهز للإجابة وتقديم الدعم المباشر لمدرستك." : "Our Super Admins are online and ready to jump on a call."}
              </p>
            </div>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 whitespace-nowrap relative z-10 flex items-center gap-3">
            <MessageCircle size={20} />
            {isAr ? "تواصل مع خبير الدعم" : "Contact Expert"}
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default SupportClient;
