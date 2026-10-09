'use client';
import React, { useState, useEffect } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import JoinModal from './_components/JoinModal';
import ExamHall from './_components/ExamHall';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageProvider';

const ExamsPage = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user, loading } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [result, setResult] = useState(null);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const savedExam = window.localStorage.getItem('activeExam');
    if (savedExam) {
      try {
        setExamData(JSON.parse(savedExam));
      } catch {
        window.localStorage.removeItem('activeExam');
      }
    }
  }, []);

  const handleJoin = async (targetCode = roomCode) => {
    if (!user)
      return Toast.fire({ icon: 'warning', title: 'Please login to join!' });
    if (targetCode.length < 6)
      return Toast.fire({ icon: 'warning', title: 'Enter 6-digit code' });

    setJoinLoading(true);
    try {
      const email = user?.email || '';
      const res = await fetch(
        `/api/exams/create?code=${targetCode}&studentEmail=${encodeURIComponent(email)}`,
      );
      const data = await res.json();

      if (data.success) {
        const foundExam = data.exam;
        setExamData(foundExam);
        window.localStorage.setItem('activeExam', JSON.stringify(foundExam));
        setIsJoinModalOpen(false);
        Toast.fire({ icon: 'success', title: 'Joined Successfully!' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: data.message,
          confirmButtonColor: '#0f172a',
        });
      }
    } catch {
      Toast.fire({ icon: 'error', title: 'Connection Error' });
    } finally {
      setJoinLoading(false);
    }
  };

  const clearSession = () => {
    window.localStorage.removeItem('activeExam');
    window.localStorage.removeItem('examAnswers');
    setExamData(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (examData || result) {
    return (
      <ExamHall
        examData={examData}
        user={user}
        result={result}
        setResult={setResult}
        clearSession={clearSession}
      />
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-10 bg-bg-page">
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-sky-800 via-blue-800 to-indigo-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute -top-12 -end-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -start-16 h-64 w-64 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block animate-pulse" />
              Exam Hall Access
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {isAr ? "أداء الاختبار من " : "Take Exam From "}<span className="block text-cyan-200 italic">{isAr ? "لوحة التحكم الخاصة بك" : "Your Dashboard"}</span>
            </h1>
            <p className="text-blue-100 mt-5 text-sm md:text-base leading-relaxed font-medium">
              Enter your teacher&apos;s 6-digit room code to join a live exam.
              Your attempts and scores will be saved automatically in My Exams.
            </p>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="mt-8 inline-flex items-center gap-2 bg-white text-slate-900 px-7 py-3.5 rounded-xl font-black tracking-wide transition-all hover:scale-[1.02] active:scale-95"
            >
              <PlayCircle size={18} /> {isAr ? "إدخال رمز القاعة" : "Enter Room Code"}
            </button>
          </div>
          
        </div>
      </div>

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        onJoin={() => handleJoin()}
        loading={joinLoading}
      />
    </main>
  );
};

export default ExamsPage;
