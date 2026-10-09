'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { BookOpen, ShieldCheck, Zap, Globe2, Building2, MousePointerClick } from 'lucide-react';

export default function AboutWebsite() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const features = [
    {
      icon: <Globe2 className="w-8 h-8" />,
      title: "Centralized Academic Hub",
      description: "A single, unified platform connecting parents, teachers, and administration for seamless school operation management. No more scattered information.",
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Operations",
      description: "Everything from attendance marking to result publication happens in real-time, eliminating the latency of traditional paper-based processes.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Data Security First",
      description: "Built with enterprise-grade security protocols ensuring that all student, financial, and academic records remain entirely confidential.",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: <MousePointerClick className="w-8 h-8" />,
      title: "Intuitive Experience",
      description: "Designed carefully focusing on user experience so that people of all technical backgrounds can navigate the system easily.",
      color: "from-purple-500 to-fuchsia-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn p-4 md:p-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-bg-card border border-border-light shadow-xl">
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 px-8 py-16 md:py-24 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 mb-8 animate-bounce" style={{animationDuration: '3s'}}>
            <Building2 size={40} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight leading-tight">{isAr ? "الجيل القادم من " : "Next-Generation "}<br/><span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-indigo-500">{isAr ? "إدارة المدارس الذكية" : "School Management"}</span></h1>
          
          <p className="text-lg md:text-xl text-text-muted leading-relaxed font-medium">
            {isAr ? 'منصتنا مصممة للربط بين التعليم والتقنية الحديثة. نوفر الشفافية والكفاءة والذكاء للعمليات المدرسية اليومية لتمكين المجتمع التعليمي بأكمله.' : 'Our platform is designed to bridge the gap between education and technology. We bring transparency, efficiency, and intelligence to daily school operations, empowering the entire academic community.'}
          </p>
        </div>
      </div>

      {/* Philosophy / Features Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-500 w-6 h-6" />
          <h3 className="text-2xl font-bold text-text-primary">Core Architecture</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-3xl bg-bg-page border border-border-light hover:shadow-xl hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className={`absolute top-0 end-0 w-32 h-32 ${feature.bg} rounded-bl-[100px] transition-transform duration-500 group-hover:scale-150 origin-top-right ease-out`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} text-white flex items-center justify-center shadow-lg mb-6 transform group-hover:-translate-y-2 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h4 className="text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h4>
                
                <p className="text-text-secondary leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
