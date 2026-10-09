'use client';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LayoutGrid,
  AlertCircle,
} from 'lucide-react';

const ExamHall = ({ examData, user, result, setResult, clearSession }) => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const answersRef = useRef({});
  const userRef = useRef(user);
  const isAutoSubmitting = useRef(false);

  // ১. এন্সার লোড করা (LocalStorage থেকে)
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('examAnswers');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    answersRef.current = answers;
    localStorage.setItem('examAnswers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ২. টাইমার লজিক (সংশোধিত রিকভারি সিস্টেম)
  useEffect(() => {
    if (!examData || result) return;

    const durationStr = examData?.duration || '60 Minutes';
    const durationInSeconds = (parseInt(durationStr.split(' ')[0]) || 60) * 60;
    let examEndTime = localStorage.getItem(`examEndTime_${examData.roomCode}`);

    if (!examEndTime) {
      const now = Math.floor(Date.now() / 1000);
      examEndTime = now + durationInSeconds;
      localStorage.setItem(`examEndTime_${examData.roomCode}`, examEndTime);
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = parseInt(examEndTime) - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        if (!result && !submitting && !isAutoSubmitting.current) {
          isAutoSubmitting.current = true;
          handleAutoSubmit();
        }
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [examData?.roomCode, result]);

  // ৩. সাবমিশন লজিক
  const submitToDatabase = async (finalAnswers = answersRef.current) => {
    if (submitting) return;
    setSubmitting(true);

    Swal.fire({
      title: 'Submitting Answers...',
      text: 'Please wait while we secure your response.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const currentUser = userRef.current;
    const qID = examData?._id || examData?.id;

    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionID: qID,
          roomCode: examData.roomCode,
          studentAnswers: finalAnswers,
          studentEmail: currentUser?.email,
          schoolId:
            currentUser?.user_metadata?.schoolId ||
            currentUser?.user_metadata?.school_id ||
            null,
          studentName:
            currentUser?.displayName || currentUser?.email?.split('@')[0],
          examSubject: examData.roomTitle,
          teacherEmail: examData.teacherEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        localStorage.removeItem('activeExam');
        localStorage.removeItem('examAnswers');
        localStorage.removeItem(`examEndTime_${examData.roomCode}`);
        Swal.close();
      }
    } catch (err) {
      Swal.fire('Error', 'Submission failed! Check connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    Swal.fire({
      title: 'Finish Exam?',
      text: `You have answered ${Object.keys(answers).length} out of ${examData.questions.length} questions.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      confirmButtonText: 'Yes, Submit Now',
    }).then((res) => {
      if (res.isConfirmed) submitToDatabase();
    });
  };

  const handleAutoSubmit = () => {
    Swal.fire({
      title: 'Time is up!',
      text: 'Your assessment is being submitted automatically.',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false,
    }).then(() => submitToDatabase());
  };

  if (timeLeft === null) return null;

  const questions = examData?.questions || [];
  const currentQ = questions[currentStep];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const formatTime = (s) => {
    const m = Math.max(0, Math.floor(s / 60));
    const sec = Math.max(0, s % 60);
    return { min: m, sec: sec.toString().padStart(2, '0') };
  };
  const time = formatTime(timeLeft);

  // রেজাল্ট ভিউ (আইকনিক ডিজাইন)
  if (result) {
    return (
      <div className="min-h-screen bg-bg-page dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-bg-card p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-border-light animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-2">
            Assessment Finished
          </h2>
          <div className="text-6xl font-black text-primary mb-10">
            {result.score ?? 0}
            <span className="text-xl text-slate-300 dark:text-slate-500">
              /{result.total ?? 0}
            </span>
          </div>
          <button
            onClick={() => {
              clearSession();
              window.location.href = '/dashboard/student/my-exams';
            }}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-page dark:bg-slate-950 min-h-screen font-display text-text-primary pb-14">
      <main className="py-8 px-4">
        <div className="mx-auto max-w-[1180px] flex gap-6 xl:gap-8 items-start justify-center">
          <div className="max-w-[860px] flex-1 flex flex-col gap-5">
            {/* Header with Timer & Title */}
            <div className="flex flex-wrap justify-between items-center bg-bg-card p-5 rounded-[1.5rem] border border-border-light shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black transition-all ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary/10 text-primary'}`}
                >
                  <Clock size={18} />
                  <span className="text-base">
                    {time.min}:{time.sec}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    Current Session
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {examData.roomTitle}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full bg-bg-page text-text-secondary text-[10px] font-black uppercase tracking-widest border border-border-light">
                {examData.roomCode}
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col gap-4 p-5 bg-bg-card rounded-[1.5rem] shadow-sm border border-border-light">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-text-primary font-black uppercase text-xs tracking-wider">
                    Exam Progress
                  </p>
                  <p className="text-text-muted text-xs font-bold">
                    {answeredCount} of {questions.length} Questions Answered
                  </p>
                </div>
                <div className="text-end">
                  <span className="text-primary font-black text-lg">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 md:p-8 bg-bg-card rounded-[2rem] shadow-sm border border-border-light relative overflow-hidden min-h-[340px]">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs shadow-lg shadow-slate-200">
                  {currentStep + 1}
                </span>
                <span className="text-text-muted font-black uppercase text-[10px] tracking-[0.2em]">
                  Question Details
                </span>
              </div>

              <h2 className="text-text-primary text-xl md:text-2xl font-black mb-7 leading-tight">
                {currentQ?.description}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {currentQ &&
                  Object.entries(currentQ.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setAnswers({ ...answers, [currentQ.id]: key })
                      }
                      className={`group flex items-center gap-4 p-4 md:p-5 rounded-[1.2rem] border-2 transition-all text-start ${
                        answers[currentQ.id] === key
                          ? 'border-primary bg-primary/5 shadow-inner'
                          : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                          answers[currentQ.id] === key
                            ? 'bg-primary text-white scale-110 shadow-lg'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-700 group-hover:text-primary'
                        }`}
                      >
                        {key}
                      </span>
                      <span
                        className={`font-bold text-base md:text-lg ${answers[currentQ.id] === key ? 'text-text-primary' : 'text-text-secondary'}`}
                      >
                        {value}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border-light bg-bg-card text-text-secondary font-black uppercase text-[10px] tracking-widest hover:bg-bg-page disabled:opacity-30 transition-all active:scale-95"
              >
                <ChevronLeft size={16} /> {isAr ? "السابق" : "Previous"}
              </button>

              {currentStep === questions.length - 1 ? (
                <button
                  onClick={handleManualSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  {isAr ? "إنهاء وتسليم الاختبار " : "Complete Exam "}<CheckCircle2 size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-hover shadow-xl active:scale-95"
                >
                  {isAr ? "السؤال التالي " : "Next Question "}<ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Question Map */}
          <aside className="hidden xl:flex sticky top-24 flex-col gap-4 w-[220px] bg-bg-card p-5 rounded-[1.5rem] border border-border-light shadow-sm">
            <div className="flex items-center gap-3 border-b border-border-light pb-3">
              <LayoutGrid size={16} className="text-primary" />
              <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
                Question Map
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all transform hover:scale-105 ${
                    currentStep === idx
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20'
                      : answers[q.id]
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200 border border-sky-200/70 dark:border-sky-700/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-2 pt-3 border-t border-border-light space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <div className="w-2 h-2 rounded-full bg-sky-300 dark:bg-sky-500"></div>{' '}
                Answered
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <div className="w-2 h-2 rounded-full bg-primary"></div> Current
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>{' '}
                Pending
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ExamHall;
