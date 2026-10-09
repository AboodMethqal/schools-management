'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageProvider';

const allBlogs = [
  {
    id: 1,
    title: 'How to Integrate MongoDB with Next.js App Router',
    category: 'Development',
    author: 'Admin',
    date: 'Mar 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    id: 2,
    title: 'Optimizing Your SaaS Dashboard for Better UX',
    category: 'Design',
    author: 'Methqal Tech Team',
    date: 'Mar 25, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  },
  {
    id: 3,
    title: 'Secure Authentication in Modern Web Apps',
    category: 'Security',
    author: 'Ony',
    date: 'Mar 20, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: 4,
    title: 'Building Resilient Microservices with Node.js',
    category: 'Backend',
    author: 'Alex',
    date: 'Mar 15, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  },
  {
    id: 5,
    title: 'The Future of AI in Software Engineering',
    category: 'AI / ML',
    author: 'Admin',
    date: 'Mar 10, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  },
  {
    id: 6,
    title: 'Designing Accessible User Interfaces',
    category: 'Accessibility',
    author: 'Sara',
    date: 'Mar 05, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
  },
  {
    id: 7,
    title: 'State Management in React: Redux vs Context',
    category: 'Frontend',
    author: 'Ony',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  },
  {
    id: 8,
    title: '10 Best Practices for Cloud Deployment',
    category: 'DevOps',
    author: 'Methqal Tech Team',
    date: 'Feb 20, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
  },
  {
    id: 9,
    title: 'Mastering TypeScript: Advanced Patterns',
    category: 'Development',
    author: 'Admin',
    date: 'Feb 12, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
];

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const allBlogsAr = [
  {
    id: 1,
    title: 'كيفية دمج MongoDB مع مسار تطبيقات Next.js App Router في إدارة المدارس',
    category: 'التطوير البرمجي',
    author: 'المدير التقني',
    date: '28 مارس 2026',
    readTime: '5 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    id: 2,
    title: 'تحسين لوحة تحكم المنصة لتجربة مستخدم مثالية للمعلمين والإداريين',
    category: 'التصميم والتجربة',
    author: 'فريق مثقال تك',
    date: '25 مارس 2026',
    readTime: '8 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  },
  {
    id: 3,
    title: 'أنظمة المصادقة والأمان الرقمي الصارم في بوابات المدارس السحابية',
    category: 'الأمان والخصوصية',
    author: 'أوني',
    date: '20 مارس 2026',
    readTime: '6 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: 4,
    title: 'بناء خدمات ميكروسيرفيس عالية التحمل لمعالجة بيانات الطلاب والنتائج',
    category: 'الخوادم والبنية',
    author: 'أليكس',
    date: '15 مارس 2026',
    readTime: '10 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  },
  {
    id: 5,
    title: 'مستقبل الذكاء الاصطناعي في قياس مستوى الفهم والتقييم الأكاديمي',
    category: 'الذكاء الاصطناعي',
    author: 'المدير التقني',
    date: '10 مارس 2026',
    readTime: '7 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  },
  {
    id: 6,
    title: 'تصميم واجهات سهلة الاستخدام للطلاب وأولياء الأمور بمختلف الفئات',
    category: 'سهولة الوصول',
    author: 'سارة',
    date: '05 مارس 2026',
    readTime: '4 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
  },
  {
    id: 7,
    title: 'إدارة الحالة في التطبيقات الكبيرة: Redux أم React Context؟',
    category: 'تطوير الواجهات',
    author: 'أوني',
    date: '28 فبراير 2026',
    readTime: '6 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  },
  {
    id: 8,
    title: 'أفضل 10 ممارسات لنشر الأنظمة التعليمية على السحابة بجهوزية 99.9%',
    category: 'العمليات السحابية',
    author: 'فريق مثقال تك',
    date: '20 فبراير 2026',
    readTime: '12 دقيقة قراءة',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
  },
  {
    id: 9,
    title: 'إتقان TypeScript: الأنماط المتقدمة لكتابة كود برمجي موثوق',
    category: 'التطوير البرمجي',
    author: 'المدير التقني',
    date: '12 فبراير 2026',
    readTime: '9 دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop',
    accent: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
];

const BlogsPage = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const blogs = isAr ? allBlogsAr : allBlogs;
  const [searchQuery, setSearchQuery] = useState('');

  const categories = isAr
    ? [
        { label: 'الكل', value: '' },
        { label: 'التطوير البرمجي', value: 'التطوير' },
        { label: 'التصميم والتجربة', value: 'التصميم' },
        { label: 'الواجهات', value: 'الواجهات' },
        { label: 'العمليات السحابية', value: 'السحابية' },
      ]
    : [
        { label: 'All', value: '' },
        { label: 'Development', value: 'Development' },
        { label: 'Design', value: 'Design' },
        { label: 'Frontend', value: 'Frontend' },
        { label: 'DevOps', value: 'DevOps' },
      ];

  const filteredBlogs = blogs.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-bg-page min-h-screen transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pb-24">
        
        {/* Page Header */}
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
              {isAr ? "المدونة والمقالات" : "Our Blog & Resources"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
              {isAr ? (
                <>أفكار ورؤى <br className="hidden md:block" /> وأفضل الممارسات التقنية والتعليمية</>
              ) : (
                <>Insights, Ideas & <br className="hidden md:block" /> Engineering Best Practices</>
              )}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed">
              {isAr
                ? "استكشف مكتبتنا من المقالات، الشروحات، والرؤى البرمجية للبقاء في طليعة التطور وتصميم النظم التعليمية الذكية."
                : "Dive into our library of articles, tutorials, and insights to stay ahead in web development, design, and software architecture."}
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6"
        >
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-secondary opacity-70" />
            </div>
            <input
              type="text"
              placeholder={isAr ? "ابحث عن المقالات بالعنوان أو التصنيف..." : "Search articles by title or category..."}
              className="w-full bg-bg-card border border-border-light rounded-2xl py-4 ps-12 pe-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className="whitespace-nowrap px-5 py-2.5 rounded-full border border-border-light bg-bg-card text-text-secondary hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-medium text-sm"
                onClick={() => setSearchQuery(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, index) => (
              <motion.div
                key={post.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: index * 0.1, ease: 'easeOut' } 
                  }
                }}
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
                          {isAr ? "كُتب بواسطة" : "Written by"}
                        </span>
                        <span className="text-sm font-bold text-text-primary leading-tight">{post.author}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`#`} className="w-10 h-10 rounded-full bg-bg-page border border-border-light flex items-center justify-center text-text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
                      <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              {isAr ? "لم يتم العثور على نتائج" : "No results found"}
            </h3>
            <p className="text-text-secondary">
              {isAr
                ? `لم نتمكن من العثور على أي مقالات تطابق "${searchQuery}". جرب كلمات مفتاحية أخرى.`
                : `We couldn't find any articles matching "${searchQuery}". Try different keywords.`}
            </p>
          </div>
        )}

      </div>
    </main>
  );
};

export default BlogsPage;
