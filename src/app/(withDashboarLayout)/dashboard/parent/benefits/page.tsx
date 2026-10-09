'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { CheckCircle2, TrendingUp, Clock, FileText, Bell, Users, ShieldCheck, Gift } from 'lucide-react';

export default function WebsiteBenefits() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const benefits = [
    {
      title: "Real-time Academic Tracking",
      description: "Monitor your child's grades, GPA trends, and exam results instantly as soon as teachers publish them.",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Instant Notifications",
      description: "Receive immediate updates on school notices, emergency closures, and academic reminders straight to your dashboard.",
      icon: <Bell className="w-6 h-6" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Paperless Convenience",
      description: "Access and download report cards directly. No more losing paper documents or waiting in line.",
      icon: <FileText className="w-6 h-6" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Time-saving Efficiency",
      description: "View school-wide student performances and find all academic info in a few clicks without visiting the campus manually.",
      icon: <Clock className="w-6 h-6" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Direct Transparency",
      description: "Total visibility into how students are performing globally, providing accurate benchmarks for your child's position.",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      title: "Community Awareness",
      description: "Stay deeply connected to the school ecosystem by having full access to public results, announcements, and profiles.",
      icon: <Users className="w-6 h-6" />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn p-4 md:p-8">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">
        <div className="absolute top-0 end-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Gift className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-50">Parent Privileges</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Empowering Parents with <br/> Digital Convenience
          </h1>
          
          <p className="text-lg text-blue-100 leading-relaxed font-medium">
            Discover the myriad of benefits integrated into your parent dashboard designed to make your involvement in your child's education seamless and stress-free.
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, idx) => (
          <div 
            key={idx}
            className="group p-8 rounded-3xl bg-bg-card border border-border-light hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 ease-out"
          >
            <div className={`w-14 h-14 rounded-2xl ${benefit.bg} ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
              {benefit.icon}
            </div>
            
            <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 group-hover:text-blue-500 transition-colors">
              {benefit.title}
            </h3>
            
            <p className="text-text-secondary leading-relaxed text-sm font-medium">
              {benefit.description}
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-y-0 translate-y-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Available Now
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
