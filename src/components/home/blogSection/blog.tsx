'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageProvider';

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const BlogSection = () => {
  const { language } = useLanguage();

  const blogData = [
    {
      id: 1,
      title: language === 'ar' 
        ? 'التحول الرقمي في الإدارة المدرسية: خطوة نحو المستقبل' 
        : 'How to Integrate Modern School Tech with Next-Gen Portals',
      category: language === 'ar' ? 'تطوير تعليمي' : 'Development',
      author: language === 'ar' ? 'إدارة المنصة' : 'Admin',
      date: language === 'ar' ? '28 مارس 2026' : 'Mar 28, 2026',
      readTime: language === 'ar' ? 'قراءة 5 دقائق' : '5 min read',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      accent: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    },
    {
      id: 2,
      title: language === 'ar'
        ? 'أهمية التواصل المستمر بين المدرسة وولي الأمر لرفع تحصيل الطالب'
        : 'Optimizing Parent-Teacher Communication for Student Success',
      category: language === 'ar' ? 'إرشاد وتوجيه' : 'Design',
      author: language === 'ar' ? 'فريق مثقال تك' : 'Methqal Tech Team',
      date: language === 'ar' ? '25 مارس 2026' : 'Mar 25, 2026',
      readTime: language === 'ar' ? 'قراءة 8 دقائق' : '8 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000&auto=format&fit=crop',
      accent: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    },
    {
      id: 3,
      title: language === 'ar'
        ? 'أفضل الممارسات لأمان وسرية بيانات الطلاب في الأنظمة السحابية'
        : 'Best Practices for Securing Student Data in Cloud Platforms',
      category: language === 'ar' ? 'الأمان السيبراني' : 'Security',
      author: language === 'ar' ? 'المستشار التقني' : 'Technical Lead',
      date: language === 'ar' ? '20 مارس 2026' : 'Mar 20, 2026',
      readTime: language === 'ar' ? 'قراءة 6 دقائق' : '6 min read',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
      accent: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
  ];

  return (
    <section id="blog" className="bg-bg-page py-24 transition-colors duration-300">
      <div className="max-w-310 mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest uppercase text-[11px] mb-3 block">
              {language === 'ar' ? 'أحدث المقالات والأخبار' : 'Latest Insights'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              {language === 'ar' ? (
                <>
                  ابقَ على اطلاع بأحدث <br /> التطورات والرؤى التعليمية
                </>
              ) : (
                <>
                  Stay Updated with Our <br /> Latest Blog Posts
                </>
              )}
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all duration-300 bg-primary/5 px-6 py-3 rounded-full border border-primary/10"
          >
            {language === 'ar' ? 'عرض جميع المقالات' : 'View All Posts'} 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map((post) => (
            <motion.div
              key={post.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="group relative bg-bg-card border border-border-light rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.06)]"
            >
              {/* Image Container with Decoration */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Badge */}
                <div className={`absolute top-6 start-6 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-bold shadow-lg ${post.accent} backdrop-blur-md`}>
                  {post.category}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 relative">
                {/* Background Decor Circle */}
                <div className="absolute -end-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-[3.5] transition-transform duration-700 pointer-events-none" />

                {/* Metadata */}
                <div className="flex items-center gap-4 text-text-secondary text-[12px] font-medium mb-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {post.date}
                  </div>
                  <div className="w-1 h-1 bg-border-light rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {post.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-xl font-bold text-text-primary mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <div className="relative z-10 pt-6 border-t border-border-light flex items-center justify-between">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-secondary uppercase tracking-tighter">
                        {language === 'ar' ? 'بقلم' : 'Written by'}
                      </span>
                      <span className="text-sm font-bold text-text-primary leading-tight">{post.author}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button aria-label="read" className="w-10 h-10 rounded-full bg-bg-page border border-border-light flex items-center justify-center text-text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
