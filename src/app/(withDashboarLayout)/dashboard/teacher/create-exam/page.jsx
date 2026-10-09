'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageProvider';
import {
  RefreshCw,
  Trash2,
  PlusCircle,
  ChevronDown,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const createEmptyQuestion = (id) => ({
  id,
  description: '',
  options: { A: '', B: '', C: '', D: '' },
  correctAnswer: '',
});

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const CreateExam = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user } = useAuth();
  const [roomTitle, setRoomTitle] = useState('');
  const [roomCode, setRoomCode] = useState(generateCode);
  const [durationInMinutes, setDurationInMinutes] = useState('60');
  const [category, setCategory] = useState('');
  const [currentClass, setCurrentClass] = useState('1');
  const [nextQuestionId, setNextQuestionId] = useState(2);
  const teacherEmail = user?.email?.toLowerCase?.() || '';

  const [questions, setQuestions] = useState([createEmptyQuestion(1)]);

  function generateRandomCode() {
    const code = generateCode();
    setRoomCode(code);
  }

  const handleCreateRoom = async () => {
    // ১. ভ্যালিডেশন চেক
    if (
      !roomTitle ||
      !category ||
      !durationInMinutes ||
      parseInt(durationInMinutes) <= 0
    ) {
      return Swal.fire(
        'Invalid Input',
        'Please enter a valid title, category and duration (minimum 1 minute)!',
        'warning',
      );
    }

    try {
      // ২. ডুপ্লিকেট রুম কোড চেক
      const checkRes = await fetch(`/api/exams/create?roomCode=${roomCode}`);
      const checkData = await checkRes.json();

      if (
        checkData.success &&
        checkData.data.some((exam) => exam.roomCode === roomCode)
      ) {
        return Swal.fire({
          icon: 'error',
          title: 'Code Already Exists',
          text: 'This room code is already in use. Please generate a new one!',
        });
      }
    } catch (err) {
      console.error('Code check error:', err);
    }

    // ৩. প্রশ্ন ভ্যালিডেশন
    const hasIncomplete = questions.some(
      (q) =>
        !q.description ||
        !q.correctAnswer ||
        Object.values(q.options).some((opt) => !opt),
    );
    if (hasIncomplete) {
      return Swal.fire(
        'Wait!',
        'Please complete all questions and options.',
        'error',
      );
    }

    if (!teacherEmail) {
      return Swal.fire(
        'Login Required',
        'Teacher account not detected. Please login again.',
        'warning',
      );
    }

    // ৪. ডাটা তৈরি (আপনার ডাটাবেস ফরম্যাট অনুযায়ী)
    const roomData = {
      roomTitle,
      roomCode,
      duration: `${durationInMinutes} Minutes`, // সরাসরি স্ট্রিং ফরম্যাটে পাঠানো হচ্ছে
      category,
      currentClass,
      questions,
      teacherEmail,
      createdAt: new Date(),
      exam: false,
    };

    try {
      const res = await fetch('/api/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });

      const result = await res.json();
      if (result.success) {
        Swal.fire('Success', 'Exam room published successfully!', 'success');
        // রিসেট ফরম
        setRoomTitle('');
        setCategory('');
        setQuestions([createEmptyQuestion(1)]);
        setNextQuestionId(2);
        generateRandomCode();
      }
    } catch {
      Swal.fire('Error', 'Something went wrong while publishing!', 'error');
    }
  };

  return (
    <div className="p-4 md:p-8 w-full bg-bg-page min-h-screen space-y-6">
      {/* Header */}
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight italic">
            Create Exam Room
          </h1>
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider">
            Setup questions and access code
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Card */}
        <div className="lg:col-span-2 bg-bg-card p-6 rounded-2xl shadow-sm border border-border-light space-y-6">
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">
              Room Title
            </label>
            <input
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-page focus:bg-bg-card focus:shadow-md focus:shadow-primary/10 outline-none transition-all font-bold text-text-primary border border-border-light"
              placeholder={isAr ? "مثال: اختبار العلوم النصفي 2026" : "e.g. Science Midterm 2026"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">
                Duration (Min)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={durationInMinutes}
                  onChange={(e) => setDurationInMinutes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-primary/5 focus:bg-white focus:shadow-md focus:shadow-primary/10 outline-none transition-all font-black text-slate-800 border-none"
                />
                <span className="absolute end-3 font-black text-[9px] text-primary">
                  MINS
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-page focus:bg-bg-card focus:shadow-md focus:shadow-primary/10 outline-none transition-all font-bold text-text-primary border border-border-light"
                placeholder="ICT/Math"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">
                Class
              </label>
              <div className="relative">
                <select
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-page outline-none appearance-none font-black text-text-primary cursor-pointer border border-border-light"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {isAr ? `الصف ${i + 1}` : `Class ${i + 1}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Access Code Card */}
        <div className="bg-primary text-white p-6 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden shadow-xl shadow-primary/20 border-none">
          <div className="absolute -top-2 -end-2 p-2 opacity-10">
            <Layers size={100} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">
            Access Code
          </p>
          <div className="flex items-center gap-4 relative z-10">
            <input
              type="text"
              value={roomCode}
              onChange={(e) =>
                setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              className="bg-transparent text-3xl font-black tracking-widest font-mono border-b-2 border-white/30 focus:border-white outline-none w-40 text-center"
            />
            <button
              onClick={generateRandomCode}
              className="hover:rotate-180 transition-all bg-white/10 p-2 rounded-lg border-none shadow-inner"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <p className="text-[9px] mt-4 opacity-60 font-black tracking-wider">
            6-Digit Numerical Code
          </p>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-black text-text-primary flex items-center gap-2 text-lg italic">
            <CheckCircle2 className="text-primary" size={24} /> Questions
          </h2>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-bg-card px-3 py-1 rounded-lg shadow-sm border border-border-light">
            Total: {questions.length}
          </span>
        </div>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border-light overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-primary uppercase bg-primary/5 px-4 py-1 rounded-full">
                  Question {index + 1}
                </span>
                <button
                  onClick={() =>
                    questions.length > 1 &&
                    setQuestions(questions.filter((item) => item.id !== q.id))
                  }
                  className="text-text-muted hover:text-red-500 transition-all p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea
                value={q.description}
                onChange={(e) =>
                  setQuestions(
                    questions.map((item) =>
                      item.id === q.id
                        ? { ...item, description: e.target.value }
                        : item,
                    ),
                  )
                }
                className="w-full px-4 py-3 rounded-xl bg-bg-page focus:bg-bg-card focus:shadow-inner outline-none font-bold text-text-primary text-sm border border-border-light resize-none"
                placeholder="Type your question here..."
                rows="2"
              ></textarea>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((label) => (
                  <div
                    key={label}
                    className={`flex items-center rounded-xl px-4 py-2 transition-all ${q.correctAnswer === label ? 'bg-primary/10 shadow-sm' : 'bg-bg-page border border-border-light'}`}
                  >
                    <button
                      onClick={() =>
                        setQuestions(
                          questions.map((item) =>
                            item.id === q.id
                              ? { ...item, correctAnswer: label }
                              : item,
                          ),
                        )
                      }
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black me-3 transition-all ${q.correctAnswer === label ? 'bg-primary text-white shadow-lg' : 'bg-bg-card text-text-muted shadow-sm border border-border-light'}`}
                    >
                      {label}
                    </button>
                    <input
                      value={q.options[label]}
                      onChange={(e) =>
                        setQuestions(
                          questions.map((item) =>
                            item.id === q.id
                              ? {
                                  ...item,
                                  options: {
                                    ...item.options,
                                    [label]: e.target.value,
                                  },
                                }
                              : item,
                          ),
                        )
                      }
                      type="text"
                      placeholder={`Option ${label}`}
                      className="bg-transparent outline-none text-xs w-full font-bold text-text-secondary border-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            setQuestions((prev) => [
              ...prev,
              createEmptyQuestion(nextQuestionId),
            ]);
            setNextQuestionId((prev) => prev + 1);
          }}
          className="w-full py-4 bg-bg-card border border-dashed border-border-light rounded-2xl flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase hover:bg-primary/5 hover:border-primary transition-all shadow-sm"
        >
          <PlusCircle size={18} /> Add Next Question
        </button>
      </div>

      <div className="mt-8 flex justify-end pb-10">
        <button
          onClick={handleCreateRoom}
          disabled={!teacherEmail}
          className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95 border-none"
        >
          Publish Exam Room
        </button>
      </div>
    </div>
  );
};

export default CreateExam;
