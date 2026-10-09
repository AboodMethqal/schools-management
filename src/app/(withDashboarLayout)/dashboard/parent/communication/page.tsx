'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  UserCircle2, 
  Plus, 
  Loader2, 
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { getCommunicationData, sendMessage } from "@/app/actions/parent/communication";
import { useLanguage } from "@/context/LanguageProvider";
import { toast } from "react-hot-toast";

// Simple className merger
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Card Component
const Card = ({
  children,
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500",
      className
    )}
    style={style}
  >
    {children}
  </div>
);

export default function ContactTeacherPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getCommunicationData();
      if (res.success && res.data) {
        setTeachers(res.data.teachers || []);
        if (res.data.teachers && res.data.teachers.length > 0) {
          setSelectedTeacher(res.data.teachers[0]);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !message.trim()) return;

    setSending(true);
    const res = await sendMessage(selectedTeacher.id, message);
    if (res.success) {
      toast.success("Message sent successfully!");
      setMessage('');
    } else {
      toast.error(res.error || "Failed to send message");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={60} />
          <GraduationCap className="absolute inset-0 m-auto text-blue-900/20" size={30} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-text-primary tracking-tight animate-pulse">Initializing Communication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter italic">
            Direct <span className="text-blue-600">Gateway.</span>
          </h1>
          <p className="text-text-muted text-base md:text-lg font-medium max-w-lg leading-relaxed">
            Communicate directly with your child's teachers. Get real-time updates and clarified academic support.
          </p>
        </div>

        <Card className="p-4 bg-emerald-500/5 border-emerald-500/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Response Time</p>
            <p className="text-sm font-bold text-text-primary">Avg. 4-6 Hours</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={16} className="text-blue-500" /> Messaging Ethics
            </h3>
            <ul className="space-y-4">
              {[
                "Keep communications professional and concise.",
                "Mention your child's name in subject if possible.",
                "Expect responses during school working hours.",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-xs text-text-secondary font-medium leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          {selectedTeacher && (
            <Card className="p-6 border-blue-500/20 bg-blue-500/5 relative overflow-hidden group">
              <div className="absolute -start-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 relative z-10">
                Selected Recipient
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {selectedTeacher.name}
                  </p>
                  <p className="text-[10px] text-text-muted font-medium mt-0.5">{selectedTeacher.role}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Message Form */}
        <form onSubmit={handleSendMessage} className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-8 border-b border-border-light">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Plus size={20} className="text-blue-500" /> New Message
              </h2>
            </div>

            <div className="p-8 space-y-8">
              {/* Teacher Select */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1">
                  Recipient Teacher
                </label>

                <div className="relative group/select">
                  <select
                    className="w-full bg-bg-page/50 border border-border-light rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all cursor-pointer font-bold text-text-primary"
                    value={selectedTeacher?.id || ""}
                    onChange={(e) =>
                      setSelectedTeacher(
                        teachers.find((t) => t.id === e.target.value) || teachers[0]
                      )
                    }
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.role}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="absolute end-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover/select:text-blue-500 transition-colors"
                    size={18}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ms-1">
                  Your Message
                </label>

                <textarea
                  required
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here... Be specific to get a faster response."
                  className="w-full bg-bg-page/50 border border-border-light rounded-2xl px-5 py-5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all resize-none leading-relaxed font-medium text-text-primary h-48"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending || !selectedTeacher || !message.trim()}
                className="w-full bg-linear-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 group"
              >
                {sending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Delivering...
                  </>
                ) : (
                  <>
                    Deliver Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
