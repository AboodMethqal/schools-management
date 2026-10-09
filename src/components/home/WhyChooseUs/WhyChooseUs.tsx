'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, CloudCog, Users, BarChart3, Smartphone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

const WhyChooseUs = () => {
    const { language } = useLanguage();

    const features = [
        {
            icon: <Users size={24} />,
            title: language === 'ar' ? 'نظام تسجيل دخول موحد' : 'Unified Login System',
            description: language === 'ar' 
                ? 'يدخل الطلاب والمعلمون والإداريون وأولياء الأمور من صفحة موحدة واحدة، مع توجيه ذكي وتلقائي لكل مستخدم إلى لوحته الخاصة.'
                : 'Students, teachers, and principals use one single page to log in. Our smart system automatically takes you to your correct dashboard.',
            color: 'from-blue-500 to-cyan-400'
        },
        {
            icon: <BarChart3 size={24} />,
            title: language === 'ar' ? 'لوحات تحكم مخصصة لكل دور' : 'Role-Based Dashboards',
            description: language === 'ar'
                ? 'يرى كل مستخدم بدقة ما يهمه: الإدارة تتابع الإحصاءات والمالية، المعلم يدير الفصول والدرجات، وولي الأمر يتابع أبناءه.'
                : 'Every user sees exactly what they need. Principals see money stats, teachers see classes, and students see their results and notices.',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            icon: <ShieldCheck size={24} />,
            title: language === 'ar' ? 'إدارة مالية ودفع موثوق' : 'Fast & Secure Payments',
            description: language === 'ar'
                ? 'سداد الرسوم وإدارة المدفوعات والتحصيل وإصدار سندات القبض بدقة وسرعة من خلال نظام مالي داخلي متكامل.'
                : 'Manage tuition fees, collection records, and receipts smoothly with our internal financial engine.',
            color: 'from-emerald-400 to-teal-500'
        },
        {
            icon: <Zap size={24} />,
            title: language === 'ar' ? 'حضور فوري ورصد النتائج' : 'Live Attendance & Results',
            description: language === 'ar'
                ? 'يسجل المعلمون الحضور والغياب والدرجات في ثوانٍ معدودة، مع إمكانية متابعة فورية من أولياء الأمور من هواتفهم.'
                : 'Teachers can take attendance and add marks in seconds. Parents can check their child\'s progress easily from home.',
            color: 'from-amber-400 to-orange-500'
        },
        {
            icon: <CloudCog size={24} />,
            title: language === 'ar' ? 'متابعة مالية المدرسة والمصروفات' : 'Track School Finance',
            description: language === 'ar'
                ? 'سجل دقيق لكافة الرسوم المحصلة والمصروفات والرواتب الشهرية والتقارير المحاسبية، وداعاً للفواتير والسجلات الورقية.'
                : 'Keep a perfect record of all fees collected and money spent each month. Say goodbye to confusing paper records.',
            color: 'from-rose-400 to-red-500'
        },
        {
            icon: <Smartphone size={24} />,
            title: language === 'ar' ? 'متوافق بالكامل مع الجوال والأجهزة' : 'Mobile Friendly',
            description: language === 'ar'
                ? 'يعمل بكفاءة عالية على الحواسيب والأجهزة اللوحية والهواتف الذكية مع تصميم مريح وتجربة مستخدم عصرية وسلسة.'
                : 'Use it from your computer, tablet or mobile phone. Our clean design makes it super easy for anyone to control their school data.',
            color: 'from-blue-600 to-indigo-700'
        }
    ];

    return (
        <section id="whychooseus" className="pt-4 pb-24 relative overflow-hidden bg-bg-page">
            {/* Background elements */}
            <div className="absolute top-0 start-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <ShieldCheck size={18} className="text-primary" />
                        <span className="text-sm font-black uppercase tracking-widest text-primary">
                            {language === 'ar' ? 'مزايا مثقال تك الحصرية' : 'The Methqal Tech Advantage'}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-text-primary mb-6 tracking-tight"
                    >
                        {language === 'ar' ? 'لماذا تختار المدارس مثقال تك؟' : 'Why Schools Choose Us'}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-text-muted text-lg"
                    >
                        {language === 'ar' 
                            ? 'نحن لا نقدم مجرد برنامج مدرسي، بل منظومة رقمية متكاملة مصممة لجعل إدارة المدرسة سهلة، دقيقة، وخالية من الأخطاء.'
                            : 'We don\'t just provide software; we provide a complete digital ecosystem designed to make school management effortless and error-free.'}
                    </motion.p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-border-light to-transparent hover:from-primary/50 transition-colors duration-500"
                        >
                            <div className="h-full bg-bg-card rounded-[23px] p-8 relative overflow-hidden flex flex-col items-start gap-6">

                                {/* Hover Glow */}
                                <div className={`absolute -top-24 -end-24 w-48 h-48 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-500`} />

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                {/* Text Content */}
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-text-muted leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Decorative Pattern */}
                                <div className="absolute end-0 bottom-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
                                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="20" className="text-primary" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
