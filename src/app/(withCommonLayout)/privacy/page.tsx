'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Server,
  ShieldAlert,
  Sparkles,
  FileText,
  Globe,
  CheckCircle2,
  ArrowRight,
  ShieldIcon,
  Database,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageProvider';

const corePrinciplesEn = [
  {
    icon: <Lock className="text-white" size={24} />,
    title: 'Zero-Knowledge Encryption',
    description:
      "Your sensitive data is encrypted before it even reaches our servers. We believe privacy isn't an option; it's a fundamental right.",
    color: 'bg-blue-600',
  },
  {
    icon: <ShieldCheck className="text-white" size={24} />,
    title: 'Compliance Ready',
    description:
      'Our systems are built to align with global data protection standards (GDPR & local regulations), ensuring your institution stays compliant.',
    color: 'bg-indigo-600',
  },
  {
    icon: <UserCheck className="text-white" size={24} />,
    title: 'User-Centric Control',
    description:
      'You own your data. You can export, modify, or request deletion of your institutional records at any time with a single click.',
    color: 'bg-purple-600',
  },
];

const corePrinciplesAr = [
  {
    icon: <Lock className="text-white" size={24} />,
    title: 'تشفير تام للبيانات',
    description:
      'يتم تشفير بياناتك الحساسة قبل وصولها إلى خوادمنا. الخصوصية لدينا ليست خياراً ثانوياً، بل حق أساسي أصيل.',
    color: 'bg-blue-600',
  },
  {
    icon: <ShieldCheck className="text-white" size={24} />,
    title: 'التزام بالمعايير واللوائح',
    description:
      'أنظمتنا مصممة للتوافق مع أعلى معايير حماية البيانات العالمية والمحلية، مما يضمن امتثال مدرستك التام.',
    color: 'bg-indigo-600',
  },
  {
    icon: <UserCheck className="text-white" size={24} />,
    title: 'تحكم كامل لمالك البيانات',
    description:
      'أنت المالك الحصري لبياناتك. يمكنك تصدير سجلات مؤسستك، تعديلها، أو إدارتها في أي وقت بنقرة واحدة.',
    color: 'bg-purple-600',
  },
];

const sectionsEn = [
  {
    title: '1. Information We Collect',
    icon: <Database size={20} />,
    content:
      "To provide a seamless educational experience, we collect specific data points. This includes institutional metadata (school name, registration ID), personnel information (admin & teacher emails), and student academic records. We minimize data collection to only what is strictly necessary for the platform's functionality.",
  },
  {
    title: '2. How We Utilize Your Data',
    icon: <Sparkles size={20} />,
    content:
      'Your data powers the core engine of our platform. We use it to generate automated attendance reports, process exam results, manage fee collections through school-approved payment channels, and provide personalized dashboards. We do not use your data for profiling or targeted advertising.',
  },
  {
    title: '3. Data Security & Storage',
    icon: <Server size={20} />,
    content:
      'All data is stored in Tier-4 data centers with 99.9% uptime. We utilize multi-layer firewalls and 256-bit SSL encryption for all data-in-transit. Our database backups are performed hourly and stored in geo-redundant, encrypted cloud storage to prevent any data loss.',
  },
  {
    title: '4. Third-Party Disclosures',
    icon: <Globe size={20} />,
    content:
      'We never sell, trade, or rent your institutional data to third parties. We only share information with trusted partners (e.g., payment gateways) necessary to complete transactions, and even then, only the bare minimum data is shared under strict confidentiality agreements.',
  },
];

const sectionsAr = [
  {
    title: '1. البيانات والمعلومات التي نجمعها',
    icon: <Database size={20} />,
    content:
      'لتقديم تجربة تعليمية وإدارية سلسة، نجمع بيانات محددة تشمل البيانات الوصفية للمؤسسة (اسم المدرسة، رقم التسجيل)، معلومات الطاقم (البريد الإلكتروني للإدارة والمعلمين)، والسجلات الأكاديمية للطلاب. ونحرص على حصر جمع البيانات بما هو ضروري جداً لتشغيل وظائف المنصة.',
  },
  {
    title: '2. كيف نستخدم بياناتك واستثمارها لخدمتك',
    icon: <Sparkles size={20} />,
    content:
      'تُستخدم بياناتك لتشغيل محرك المنصة الرئيسي، مثل إصدار تقارير الحضور الآلية، ومعالجة نتائج الاختبارات، وإدارة تحصيل الرسوم المدرسية وفق القنوات المعتمدة، وتوفير لوحات تحكم مخصصة. لا نستخدم بياناتك مطلقاً لأغراض التتبع الإعلاني أو التسويق الموجه.',
  },
  {
    title: '3. أمن البيانات ومراكز التخزين السحابي',
    icon: <Server size={20} />,
    content:
      'تُحفظ كافة البيانات في مراكز بيانات متقدمة بمستوى توافر 99.9%. ونعتمد جدران حماية متعددة الطبقات وتشفير SSL/TLS 256-bit لكافة البيانات أثناء النقل والتخزين. كما يتم إجراء نسخ احتياطي دوري وتخزينه في سحابة مشفرة جغرافياً لمنع أي فقدان للبيانات.',
  },
  {
    title: '4. سياسة الإفصاح وعدم مشاركة البيانات مع أطراف ثالثة',
    icon: <Globe size={20} />,
    content:
      'نحن لا نبيع أو نؤجر أو نتاجر ببيانات مؤسستك لأي طرف ثالث على الإطلاق. لا تتم مشاركة أي بيانات إلا مع شركاء الخدمة المعتمدين والموثوقين (مثل بوابات الدفع الرسمية) لإتمام المعاملات فقط، وتحت اتفاقيات سرية صارمة.',
  },
];

const PrivacyPage = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const lastUpdated = isAr ? '16 مارس 2026' : 'March 16, 2026';
  const corePrinciples = isAr ? corePrinciplesAr : corePrinciplesEn;
  const sections = isAr ? sectionsAr : sectionsEn;

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-0 start-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 end-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Header */}
        <header className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary mb-8"
          >
            <ShieldIcon size={14} className="animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">
              {isAr ? "معايير أمان المؤسسات" : "Enterprise Security Standard"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-text-primary mb-8 tracking-tighter leading-none"
          >
            {isAr ? (
              <>الخصوصية كركيزة <span className="text-primary italic">أساسية.</span></>
            ) : (
              <>Privacy as a <span className="text-primary italic">Foundation.</span></>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary leading-relaxed font-medium"
          >
            {isAr
              ? "نؤمن بأن بيانات المؤسسات التعليمية تستحق أعلى درجات الحماية والسرية. استكشف التزامنا التام بالشفافية والمعايير الصارمة التي نطبقها لحماية مدرستك."
              : "At our core, we believe that education data deserves the highest level of protection. Explore our commitment to transparency and the rigorous standards we maintain to keep your institution safe."}
          </motion.p>

          <div className="mt-6 flex items-center justify-center gap-2 text-text-muted font-bold text-xs uppercase tracking-widest">
            <span>{isAr ? "آخر تحديث" : "Last Updated"}</span>
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span className="text-text-primary">{lastUpdated}</span>
          </div>
        </header>

        {/* Core Principles Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-32">
          {corePrinciples.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-card border border-border-light p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div
                className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-12 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                {item.title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-medium">
                {item.description}
              </p>
              <div className="absolute -bottom-2 -end-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <ShieldIcon size={150} />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Main Content Layout */}
        <main className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left Sidebar - Navigation/Summary */}
          <aside className="sticky top-32 space-y-8 hidden lg:block">
            <div className="p-8 bg-bg-card border border-border-light rounded-[32px]">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                {isAr ? "فهرس السياسة" : "In this policy"}
              </h4>
              <nav className="flex flex-col gap-4">
                {sections.map((s, i) => (
                  <a
                    key={i}
                    href={`#section-${i}`}
                    className="flex items-center gap-3 text-sm font-bold text-text-muted hover:text-primary transition-colors group"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[10px] group-hover:bg-primary group-hover:text-white">
                      0{i + 1}
                    </span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="p-8 bg-primary rounded-[32px] text-white shadow-xl shadow-primary/20">
              <CheckCircle2 className="mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">
                {isAr ? "متوافق مع معايير الحماية العالمية" : "GDPR Compliant"}
              </h4>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                {isAr
                  ? "نلتزم التزاماً كاملاً باللوائح الدولية لحماية بيانات الطلاب والمؤسسات."
                  : "We fully adhere to General Data Protection Regulations."}
              </p>
            </div>
          </aside>

          {/* Right Side - Detailed Content */}
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.section
                key={idx}
                id={`section-${idx}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                className="relative group"
              >
                <div className="absolute -start-4 top-0 bottom-0 w-1 bg-primary/10 group-hover:bg-primary transition-colors rounded-full" />
                <div className="ps-8">
                  <div className="flex items-center gap-3 mb-6 text-primary">
                    {section.icon}
                    <span className="text-xs font-black uppercase tracking-widest">
                      {isAr ? `البند ${idx + 1}` : `Article ${idx + 1}`}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary mb-6 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-lg text-text-secondary leading-[1.8] font-medium">
                    {section.content}
                  </p>
                </div>
              </motion.section>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
};

export default PrivacyPage;
