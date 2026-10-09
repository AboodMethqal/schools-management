'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { UserPlus, LayoutDashboard, BarChart3, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HowItWorks = () => {
  const { language } = useLanguage();

  const steps = [
    {
      icon: <UserPlus className="w-7 h-7" />,
      step: '01',
      title: language === 'ar' ? 'سجّل حساب مدرستك' : 'Register Your School',
      description: language === 'ar'
        ? 'أنشئ حساب مدرستك في دقائق معدودة، وأدخل البيانات الأساسية واختر الخطة الملائمة لطموحاتك.'
        : 'Create your school account in minutes. Fill in your school details and choose a plan that fits your needs.',
      accent: 'from-blue-500 to-indigo-600',
      glow: 'shadow-blue-500/20',
    },
    {
      icon: <LayoutDashboard className="w-7 h-7" />,
      step: '02',
      title: language === 'ar' ? 'جهّز لوحة التحكم والبيانات' : 'Set Up Your Dashboard',
      description: language === 'ar'
        ? 'أضف المعلمين والطلاب والفصول والمواد بسهولة، وخصص صلاحيات المنظومة بما يتوافق مع هيكل مدرستك.'
        : 'Add teachers, students, classes, and subjects. Customize your dashboard to match your school workflow perfectly.',
      accent: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/20',
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      step: '03',
      title: language === 'ar' ? 'تابع وأدِر كل العمليات' : 'Track & Manage',
      description: language === 'ar'
        ? 'رصد الحضور اليومي، إدخال الدرجات والامتحانات، متابعة الرسوم والإعلانات لحظياً من شاشة واحدة.'
        : 'Monitor attendance, results, fees, and announcements — all from one central place in real time.',
      accent: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/20',
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      step: '04',
      title: language === 'ar' ? 'ارتقِ بقرارات مدروسة' : 'Grow with Insights',
      description: language === 'ar'
        ? 'استفد من التقارير الإحصائية والتحليلات الدقيقة لتحسين الأداء التعليمي والمالي وتطوير مدرستك باستمرار.'
        : 'Use built-in analytics and reports to make data-driven decisions and continuously improve your school operations.',
      accent: 'from-orange-500 to-rose-500',
      glow: 'shadow-orange-500/20',
    },
  ];

  return (
    <section className="bg-bg-page py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-primary font-bold tracking-widest uppercase text-[11px] mb-3 block">
            {language === 'ar' ? 'خطوات بسيطة وسريعة' : 'Simple Process'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
            {language === 'ar' ? 'كيف تبدأ العمل مع مثقال تك؟' : 'How It Works'}
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto text-base font-medium">
            {language === 'ar'
              ? 'أطلق منظومة مدرستك الرقمية في 4 خطوات سهلة وواضحة — دون الحاجة لخبرة تقنية معقدة.'
              : 'Get your school up and running in four simple steps — no technical expertise required.'}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.12 },
                },
              }}
              className={`relative group bg-bg-card border border-border-light rounded-[2rem] p-8 hover:shadow-2xl ${item.glow} transition-all duration-500 overflow-hidden`}
            >
              {/* Step number watermark */}
              <span className="absolute -end-3 -top-4 text-[7rem] font-black text-border-light/40 select-none leading-none pointer-events-none">
                {item.step}
              </span>

              {/* Icon */}
              <div
                className={`relative z-10 mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              <h3 className="relative z-10 text-lg font-bold text-text-primary mb-3">
                {item.title}
              </h3>
              <p className="relative z-10 text-text-secondary text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Hover glow circle */}
              <div
                className={`absolute -bottom-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
