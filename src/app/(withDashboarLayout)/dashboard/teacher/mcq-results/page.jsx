'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import {
  Loader2,
  Search,
  FileText,
  GraduationCap,
  CalendarDays,
} from 'lucide-react';

const TeacherMcqResultsPage = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/exams/submit?scope=teacherSchool');
        const data = await res.json();

        if (data.success) {
          setResults(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch MCQ results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return results;

    return results.filter((item) => {
      return (
        item.studentName?.toLowerCase().includes(key) ||
        item.studentEmail?.toLowerCase().includes(key) ||
        item.examSubject?.toLowerCase().includes(key) ||
        item.roomCode?.toLowerCase().includes(key)
      );
    });
  }, [results, search]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-semibold uppercase tracking-widest">
          Loading MCQ results...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-bg-card border border-border-light rounded-3xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            MCQ Results
          </h1>
          <p className="text-text-muted mt-2 text-sm md:text-base">
            Students from your school only. Total records: {results.length}
          </p>

          <div className="mt-5 relative">
            <Search
              className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, email, subject or code"
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-border-light bg-bg-page text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="bg-bg-card border border-border-light rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-bg-page border-b border-border-light">
                <tr className="text-start text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-4 py-3 font-extrabold">{isAr ? "الطالب" : "Student"}</th>
                  <th className="px-4 py-3 font-extrabold">Subject</th>
                  <th className="px-4 py-3 font-extrabold">Room</th>
                  <th className="px-4 py-3 font-extrabold">{isAr ? "الدرجة" : "Score"}</th>
                  <th className="px-4 py-3 font-extrabold">School ID</th>
                  <th className="px-4 py-3 font-extrabold">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-border-light last:border-b-0 hover:bg-bg-page/60"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-text-primary text-sm">
                        {item.studentName || 'Unknown'}
                      </div>
                      <div className="text-xs text-text-muted">
                        {item.studentEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary font-semibold">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-primary" />
                        {item.examSubject || 'Untitled Exam'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-primary uppercase">
                      {item.roomCode || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-extrabold">
                        <GraduationCap size={12} />
                        {item.totalMark ?? 0}/{item.totalQuestions ?? 0}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-text-secondary">
                      {item.schoolId || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted font-medium">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={12} />
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleString()
                          : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResults.length === 0 && (
            <div className="p-10 text-center text-text-muted text-sm font-semibold">
              No matching results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherMcqResultsPage;
