'use client';

import React from 'react';
import {
  MonitorPlay,
  Cpu,
  LibraryBig,
  BusFront,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageProvider';

const Features = () => {
  const { language } = useLanguage();

  const featuresData = [
    {
      id: 1,
      title: language === 'ar' ? 'الفصول الرقمية التفاعلية' : 'Digital Classroom',
      description: language === 'ar'
        ? 'شاشات ذكية ووسائل عرض رقمية حديثة تجعل الدرس تفاعلياً وممتعاً وترسخ المعلومات لدى الطلاب.'
        : 'Modern smart boards and projector-equipped rooms making learning interactive and engaging.',
      icon: <MonitorPlay className="w-8 h-8" />,
      accent: 'bg-blue-500/10 text-blue-600',
    },
    {
      id: 2,
      title: language === 'ar' ? 'مختبرات الحاسوب والوسائط' : 'Multimedia Lab',
      description: language === 'ar'
        ? 'معامل تقنية متطورة تمكن الطلاب من اكتساب مهارات عملية واستخدام أحدث البرمجيات والتطبيقات.'
        : 'Advanced computer labs where students gain hands-on experience with the latest technology.',
      icon: <Cpu className="w-8 h-8" />,
      accent: 'bg-purple-500/10 text-purple-600',
    },
    {
      id: 3,
      title: language === 'ar' ? 'مكتبة رقمية شاملة' : 'Enriched Library',
      description: language === 'ar'
        ? 'مجموعة ضخمة من الكتب والمراجع والمصادر التعليمية الرقمية لإثراء معارف الطلاب وشغفهم بالتعلم.'
        : "A vast collection of books and digital resources to satisfy our students' thirst for knowledge.",
      icon: <LibraryBig className="w-8 h-8" />,
      accent: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      id: 4,
      title: language === 'ar' ? 'نقل مدرسي آمن وموثوق' : 'Safe Transport',
      description: language === 'ar'
        ? 'خدمة حافلات مدرسية مخصصة ومجهزة مع متابعة دقيقة لضمان وصول الطلاب بسلامة وأمان يومياً.'
        : 'Dedicated school bus service with real-time monitoring to ensure a safe commute for every child.',
      icon: <BusFront className="w-8 h-8" />,
      accent: 'bg-amber-500/10 text-amber-600',
    },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section id="features" className="bg-bg-page transition-colors duration-300">
      <div className="max-w-310 mx-auto">
        {/* Header Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest uppercase text-[11px] mb-3 block">
              {language === 'ar' ? 'مزايا المنظومة التعليمية' : 'Our Features'}
            </span>
            {language === 'ar' ? (
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
                بيئة تعليمية متكاملة <br /> تضمن تميز أبنائكم
              </h2>
            ) : (
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
                Why Should Parents <br /> Choose Our School?
              </h2>
            )}
          </div>
          <div className="hidden md:block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1.5 bg-primary rounded-full"
            ></motion.div>
          </div>
        </motion.div>

        {/* Features Grid with Stagger Effect */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featuresData.map((feature) => (
            <motion.div
              key={feature.id}
              className="group relative bg-bg-card border border-border-light p-8 rounded-[2.5rem] hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.06)] overflow-hidden"
            >
              {/* Background Decor */}
              <div className="absolute -end-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-[4] transition-transform duration-700 pointer-events-none" />

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${feature.accent} flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-12`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-[15px] mb-6">
                {feature.description}
              </p>

              <div className="flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>{language === 'ar' ? 'اعرف المزيد' : 'Learn More'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
