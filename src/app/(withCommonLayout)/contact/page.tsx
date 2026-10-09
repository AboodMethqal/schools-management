"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Globe, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="py-20 bg-bg-page border-border-light transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section: Same style as Features and Statistics */}
        <div className="mb-16">
          <p className="text-primary font-bold tracking-[0.2em] text-[11px] uppercase mb-3">
            {isAr ? "ابق على تواصل" : "Get In Touch"}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {isAr ? (
              <>تواصل <span className="text-primary">معنا</span></>
            ) : (
              <>Contact <span className="text-primary">Us</span></>
            )}
          </h2>
          <div className="w-12 h-1 bg-primary mt-4 rounded-full" />
        </div>

        {/* Main Container: Form + Map */}
        <div className="flex flex-col lg:flex-row bg-bg-card border border-border-light rounded-2xl overflow-hidden mb-16 shadow-sm">
          {/* Left: Contact Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {isAr ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your name"}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-bg-page border border-border-light rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary/30 focus:bg-bg-card transition-all duration-300 placeholder:text-text-muted/40 text-text-secondary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {isAr ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-bg-page border border-border-light rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary/30 focus:bg-bg-card transition-all duration-300 placeholder:text-text-muted/40 text-text-secondary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {isAr ? "الموضوع" : "Subject"}
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder={isAr ? "أدخل موضوع الرسالة" : "Enter subject"}
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-bg-page border border-border-light rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary/30 focus:bg-bg-card transition-all duration-300 placeholder:text-text-muted/40 text-text-secondary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {isAr ? "الرسالة" : "Message"}
                </label>
                <textarea
                  name="message"
                  placeholder={isAr ? "اكتب تفاصيل رسالتك هنا..." : "Type your message here..."}
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-bg-page border border-border-light rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary/30 focus:bg-bg-card transition-all duration-300 placeholder:text-text-muted/40 text-text-secondary resize-none"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/10 active:scale-95 transition-all duration-300 group"
                >
                  {isAr ? "إرسال الرسالة" : "Send Message"}
                  <Send className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isAr ? "rotate-180" : ""}`} />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Map Integration */}
          <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-full relative overflow-hidden bg-bg-card border-t lg:border-t-0 lg:border-l border-border-light">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3651.902!2d90.410!3d23.770!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s&q=23.770315,90.410076"
              width="100%"
              height="100%"
              className="w-full h-full min-h-[400px] object-cover"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Info Cards: Matching Features card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Address Card */}
          <div className="group bg-bg-card border border-border-light p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-bg-page border border-border-light flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
              {isAr ? "العنوان" : "Address"}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed group-hover:text-text-primary transition-colors duration-300">
              {isAr ? "صنعاء، اليمن" : "Sana'a, Yemen"}
            </p>
          </div>

          {/* Phone Card */}
          <div className="group bg-bg-card border border-border-light p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-bg-page border border-border-light flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
              {isAr ? "الهاتف" : "Phone"}
            </h3>
            <a
              href="tel:+967770499151"
              dir="ltr"
              className="text-text-muted text-sm group-hover:text-primary transition-colors duration-300 inline-block"
            >
              +967 770 499 151
            </a>
          </div>

          {/* Email Card */}
          <div className="group bg-bg-card border border-border-light p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-bg-page border border-border-light flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
              {isAr ? "البريد الإلكتروني" : "Email"}
            </h3>
            <a
              href="mailto:info@methqal.tech"
              dir="ltr"
              className="text-text-muted text-sm group-hover:text-primary transition-colors duration-300 break-all inline-block"
            >
              info@methqal.tech
            </a>
          </div>

          {/* Website Card */}
          <div className="group bg-bg-card border border-border-light p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-bg-page border border-border-light flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
              {isAr ? "الموقع الإلكتروني" : "Website"}
            </h3>
            <a
              href="https://methqal.tech"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-text-muted text-sm group-hover:text-primary transition-colors duration-300 inline-block"
            >
              methqal.tech
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
