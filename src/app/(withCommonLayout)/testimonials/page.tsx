'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageProvider";

const testimonialsEn = [
  {
    quote: "The quality of education at this school is outstanding. My child's confidence and results have both improved significantly.",
    name: "Md. Rashed Ali",
    role: "Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote: "The school's digital management system has made our lives much easier. Now all information is at our fingertips.",
    name: "Fatema Begum",
    role: "Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote: "I have learned a lot studying at this school. The teachers are very caring and always ready to help.",
    name: "Tanveer Hasan",
    role: "Student",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=53",
  },
  {
    quote: "The extracurricular activities are phenomenal. My daughter has blossomed not just academically, but socially as well.",
    name: "Ayesha Siddiqa",
    role: "Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=24",
  },
  {
    quote: "Moving to this school was the best decision we made. The smart classrooms and interactive learning approach keep the students engaged.",
    name: "Kamrul Islam",
    role: "Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    quote: "The school fosters a wonderful sense of community. The transparent communication between teachers and parents is highly appreciated.",
    name: "Um Mohammed",
    role: "Parent",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=40",
  },
  {
    quote: "The campus security and child safety measures are top-notch. I can focus on my work knowing my son is in safe hands.",
    name: "Faisal Ahmed",
    role: "Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=60",
  },
  {
    quote: "I love the science labs and the library. There's always something new to explore and the environment is very encouraging.",
    name: "Israt Jahan Tanisha",
    role: "Student",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=43",
  },
  {
    quote: "Excellent academic standard with equally good focus on sports. A well-rounded educational institution.",
    name: "Mostofa Kamal",
    role: "Parent",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
];

const testimonialsAr = [
  {
    quote: "مستوى النظام ومتابعة المدرسة متميز للغاية. تحسن مستوى ابني وثقته بنفسه بشكل ملحوظ بفضل المتابعة المستمرة.",
    name: "أ. راشد العلي",
    role: "ولي أمر",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote: "نظام إدارة المدرسة الرقمي سهّل علينا الكثير من الإجراءات، وأصبحت كافة الدرجات والتقارير في متناول أيدينا فوراً.",
    name: "أ. فاطمة باجعفر",
    role: "ولي أمر",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote: "استفدت كثيراً من المنصة وسهولة الوصول للاختبارات والمواد التعليمية. المعلمون متفاعلون ومستعدون للمساعدة دائماً.",
    name: "تنوير حسن",
    role: "طالب",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=53",
  },
  {
    quote: "التواصل الشفاف مع المعلمين ومتابعة الحضور المباشر جعلنا مطمئنين تماماً على المسار التعليمي لبناتنا.",
    name: "عائشة الصديق",
    role: "ولي أمر",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=24",
  },
  {
    quote: "الانتقال إلى هذه المدرسة والاعتماد على بيئتها الذكية كان أفضل قرار اتخذناه لضمان مستقبل أبنائنا.",
    name: "كمال الدين",
    role: "ولي أمر",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    quote: "المنصة تعزز التواصل المباشر بين المدرسة والأسرة، والتقارير الشهرية والمالية واضحة ودقيقة جداً.",
    name: "أم محمد",
    role: "ولي أمر",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=40",
  },
  {
    quote: "إجراءات السلامة والمتابعة اليومية والانضباط عالية الدقة، أستطيع العمل وأنا مطمئن تماماً على ابني.",
    name: "فيصل أحمد",
    role: "ولي أمر",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=60",
  },
  {
    quote: "أحب المكتبة الإلكترونية والاختبارات التفاعلية، والبيئة المدرسية محفزة للغاية على الابتكار والتفوق.",
    name: "إسراء طه",
    role: "طالبة",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=43",
  },
  {
    quote: "معايير أكاديمية رفيعة مع اهتمام كبير بالأنشطة وتنمية المهارات القيادية للطلاب.",
    name: "مصطفى كمال",
    role: "ولي أمر",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
];

const TestimonialsPage = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const testimonials = isAr ? testimonialsAr : testimonialsEn;

  return (
    <main className="bg-bg-page min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Page Header */}
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold tracking-[0.2em] text-[11px] uppercase mb-4 block">
              {isAr ? "قصص النجاح" : "Success Stories"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
              {isAr ? (
                <>آراء وتجارب <br className="hidden md:block" /> طلابنا وأولياء الأمور</>
              ) : (
                <>Hear from Our <br className="hidden md:block" /> Students & Parents</>
              )}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed">
              {isAr
                ? "اقرأ ما يقوله مجتمعنا التعليمي عن التجارب، الإنجازات، والنجاح الذي تحقق من خلال منصتنا."
                : "Read what our community has to say about the experiences, milestones, and success achieved at our institution."}
            </p>
            <div className="w-12 h-1 bg-primary mt-8 rounded-full mx-auto" />
          </motion.div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name + index}
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
              className="group bg-bg-card border border-border-light p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
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
              <p className="text-text-muted text-sm leading-relaxed mb-6 italic min-h-[80px]">
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
      </div>
    </main>
  );
};

export default TestimonialsPage;
