"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Linkedin,
  Github,
  MapPin,
  Phone,
  Send,
  Smartphone,
  Monitor,
  Apple,
  Chrome,
  Terminal,
} from "lucide-react";
import PlayStoreIcon from "@/components/icon/PlayStore";
import WindowsIcon from "@/components/icon/Windows";
import Logo from "@/components/shared/logo/logo";
import { useLanguage } from "@/context/LanguageProvider";

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const quickLinks = [
    { label: language === 'ar' ? 'عن مثقال تك' : 'About Methqal Tech', href: '/about' },
    { label: language === 'ar' ? 'المدونة والأخبار' : 'Blogs & News', href: '/blogs' },
    { label: language === 'ar' ? 'قصص النجاح والآراء' : 'Success Stories', href: '/testimonials' },
    { label: language === 'ar' ? 'الأسعار والباقات' : 'Pricing Plans', href: '/pricing' },
    { label: language === 'ar' ? 'تسجيل دخول المنصة' : 'Portal Login', href: '/login' },
    { label: language === 'ar' ? 'تواصل معنا' : 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="bg-bg-card pt-20 pb-8 px-6 border-t border-border-light transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow Decorations */}
      <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-307.5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Logo variant="dark" />
            <p className="text-text-secondary leading-relaxed">
              {language === 'ar'
                ? 'مثقال تك — منصة رقمية متكاملة تساعد المدارس على إدارة العملية التعليمية ومتابعة الطلاب والمعلمين وأولياء الأمور بسهولة وأمان.'
                : 'Methqal Tech — A complete digital ecosystem designed to streamline school management, attendance, results, and fees.'}
            </p>

            <div className="pt-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4">
                {language === 'ar' ? 'تواصل معنا' : 'Connect With Us'}
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook size={18} />, link: "#", color: "hover:bg-blue-600" },
                  { icon: <Linkedin size={18} />, link: "#", color: "hover:bg-blue-700" },
                  { icon: <Github size={18} />, link: "#", color: "hover:bg-slate-700" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    aria-label="Social Link"
                    className={`w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-muted transition-all duration-300 hover:text-white hover:border-transparent ${social.color}`}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                <Smartphone size={20} className="text-primary" /> 
                {language === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps'}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-3 bg-bg-page border border-border-light p-3 rounded-2xl hover:border-primary/50 transition-all group">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center">
                    <PlayStoreIcon size={20} />
                  </div>
                  <div className="text-start">
                    <p className="text-[10px] uppercase font-bold text-text-muted leading-none">
                      {language === 'ar' ? 'متوفر على' : 'Get it on'}
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      Google Play
                    </p>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-bg-page border border-border-light p-3 rounded-2xl hover:border-primary/50 transition-all group">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Apple size={20} />
                  </div>
                  <div className="text-start">
                    <p className="text-[10px] uppercase font-bold text-text-muted leading-none">
                      {language === 'ar' ? 'متوفر على' : 'Download on'}
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      App Store
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                <Monitor size={20} className="text-primary" /> 
                {language === 'ar' ? 'تطبيقات سطح المكتب' : 'Desktop Apps'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Windows", icon: <WindowsIcon size={16} /> },
                  { name: "macOS", icon: <Apple size={16} /> },
                  { name: "Linux", icon: <Terminal size={16} /> },
                  { name: "Web App", icon: <Chrome size={16} /> },
                ].map((app) => (
                  <button
                    key={app.name}
                    className="flex items-center gap-2 bg-secondary/50 border border-border-light px-3 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-primary hover:border-primary transition-all">
                    {app.icon} {app.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:ps-8">
            <h3 className="text-lg font-bold text-text-primary mb-6">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-text-secondary font-medium hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-6">
                {language === 'ar' ? 'النشرة البريدية' : 'Newsletter'}
              </h3>
              <p className="text-sm text-text-muted mb-4">
                {language === 'ar'
                  ? 'ابقَ على اطلاع بأحدث الميزات والتحديثات المدرسية.'
                  : 'Stay updated with our latest releases and features.'}
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email address'}
                  className="w-full bg-bg-page border border-border-light rounded-2xl py-4 px-5 focus:outline-none focus:border-primary text-text-primary transition-all"
                />
                <button aria-label="subscribe" className="absolute end-2 top-2 p-2.5 bg-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all rtl:rotate-180">
                  <Send size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 border-t border-border-light pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0" size={18} />
                <span className="text-sm text-text-secondary">
                  {language === 'ar' ? 'صنعاء، اليمن' : 'Sana\'a, Yemen'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={18} />
                <span className="text-sm font-bold text-text-primary" dir="ltr">
                  +967 770 499 151
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text-muted text-sm font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-text-primary font-bold">
              {language === 'ar' ? 'مثقال تك — Methqal Tech' : 'Methqal Tech Inc.'}
            </span>{" "}
            {language === 'ar' ? '— جميع الحقوق محفوظة.' : '— All rights reserved.'}
          </p>

          <div className="flex items-center gap-3">
            {[
              language === 'ar' ? "فيزا" : "Visa",
              language === 'ar' ? "ماستركارد" : "Mastercard",
              language === 'ar' ? "سداد إلكتروني" : "Direct Pay",
              language === 'ar' ? "تحويل بنكي" : "Bank Transfer"
            ].map((pay) => (
              <span
                key={pay}
                className="px-3 py-1 bg-bg-page border border-border-light rounded-lg text-[10px] font-black text-text-muted uppercase tracking-tighter">
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
