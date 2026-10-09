'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

const FAQ = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: language === 'ar' ? 'هل تتوفر فترة تجريبية مجانية للنظام؟' : 'Is there a free trial available?',
      answer: language === 'ar'
        ? 'نعم! نقدم فترة تجربة مجانية مع وصول كامل لجميع الميزات المتقدمة لتختبر تجربة إدارة مدرستك عملياً.'
        : 'Yes! We offer a free trial with full access to all premium features so you can test the workflow.'
    },
    {
      question: language === 'ar' ? 'ما مدى أمان وحماية بيانات مدرستنا والطلاب؟' : 'How secure is our school and student data?',
      answer: language === 'ar'
        ? 'بياناتكم محمية بأعلى معايير التشفير والأمان السحابي، مع نسخ احتياطي دوري وصلاحيات محكمة تمنع أي وصول غير مصرح به.'
        : 'Extremely secure. We use end-to-end encryption, automated backups, and strict role-based access control.'
    },
    {
      question: language === 'ar' ? 'هل يمكن تخصيص الفصول والمواد بما يلائم مدرستنا؟' : 'Can I customize subjects and grade levels?',
      answer: language === 'ar'
        ? 'بالتأكيد، يتيح لك النظام إضافة وتعديل الفصول، الشعب، المواد الدراسية، والأنشطة بما يتوافق تماماً مع نظام مدرستك.'
        : 'Absolutely. Our flexible platform allows you to configure classes, sections, subjects, and activities exactly as needed.'
    },
    {
      question: language === 'ar' ? 'هل يستطيع ولي الأمر متابعة أكثر من طالب بنفس الحساب؟' : 'Can a parent monitor multiple students from one account?',
      answer: language === 'ar'
        ? 'نعم، تدعم منصة مثقال تك ربط عدة أبناء بحساب ولي أمر واحد، مما يتيح التبديل السلس بينهم ومتابعة نتائجهم ورسومهم وحضورهم.'
        : 'Yes, Methqal Tech fully supports multi-child parent accounts to easily track attendance, results, and fees.'
    }
  ];

  return (
    <section className="bg-bg-page py-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-text-primary">
            {language === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-border-light rounded-2xl bg-bg-card overflow-hidden">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-start transition-colors hover:bg-primary/5"
              >
                <span className="font-bold text-text-primary">{item.question}</span>
                {activeIndex === index ? <Minus className="text-primary" /> : <Plus className="text-primary" />}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-text-secondary text-sm leading-relaxed"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
