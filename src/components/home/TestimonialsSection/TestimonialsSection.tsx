'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageProvider";

const TestimonialsSection = () => {
  const { language } = useLanguage();

  const testimonials = [
    {
      quote: language === 'ar'
        ? 'جودة التعليم ومتابعة المدرسة أصبحت ممتازة جداً بعد استخدام المنصة. تحسن أداء ابني وثقته بنفسه بشكل ملحوظ.'
        : "The quality of education at this school is outstanding. My child's confidence and results have both improved significantly.",
      name: language === 'ar' ? 'أحمد الشامي' : 'Ahmed Al-Shami',
      role: language === 'ar' ? 'ولي أمر' : 'Parent',
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      quote: language === 'ar'
        ? 'النظام الرقمي لمثقال تك سهّل حياتنا كثيراً كأولياء أمور. الآن نتابع درجات أبنائنا وجدول الحصص والحضور والرسوم من الهاتف مباشرة.'
        : "The school's digital management system has made our lives much easier. Now all information is at our fingertips.",
      name: language === 'ar' ? 'فاطمة الكبسي' : 'Fatema Al-Kebsi',
      role: language === 'ar' ? 'ولي أمر' : 'Parent',
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      quote: language === 'ar'
        ? 'استفدت كثيراً من الاختبارات والمواد التعليمية على المنصة، والمعلمون متفاعلون ومستعدون دائماً لتقديم المساعدة والتوجيه.'
        : "I have learned a lot studying at this school. The teachers are very caring and always ready to help.",
      name: language === 'ar' ? 'تامر العمري' : 'Tamer Al-Omari',
      role: language === 'ar' ? 'طالب' : 'Student',
      rating: 4,
      avatar: "https://i.pravatar.cc/150?img=53",
    },
  ];

  return (
    <section className="py-20 bg-bg-page border-border-light transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <p className="text-primary font-bold tracking-[0.2em] text-[11px] uppercase mb-3">
            {language === 'ar' ? 'آراء وتجارب العملاء' : 'Testimonials'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {language === 'ar' ? (
              <>
                ماذا يقول أولياء الأمور والطلاب{" "}
                <span className="text-primary">عن تجربة مثقال تك؟</span>
              </>
            ) : (
              <>
                What Parents & Students{" "}
                <span className="text-primary">Say About Us</span>
              </>
            )}
          </h2>
          <div className="w-12 h-1 bg-primary mt-4 rounded-full mx-auto" />
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-bg-card border border-border-light p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "fill-primary text-primary"
                        : "text-border-light"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-muted text-sm leading-relaxed mb-6 italic">
                “{testimonial.quote}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border-light">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-text-muted font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/testimonials" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/10">
            {language === 'ar' ? 'قراءة المزيد من الآراء والقصص' : 'Read More Testimonials'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
