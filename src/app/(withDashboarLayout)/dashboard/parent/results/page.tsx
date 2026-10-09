'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Download,
  FileText,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Loader2,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { getParentResultsData } from '@/app/actions/parent/results';
import { useLanguage } from '@/context/LanguageProvider';

// Simple className merger
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Card Component
const Card = ({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      'bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500',
      className,
    )}
    style={style}
  >
    {children}
  </div>
);

import { Search, Printer } from 'lucide-react';

export default function ResultsPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // New States
  const [searchTerm, setSearchTerm] = useState("");
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPrintClass, setSelectedPrintClass] = useState("");
  const [selectedPrintSubject, setSelectedPrintSubject] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await getParentResultsData();
      if (res.success) {
        setData(res.data);
      } else {
        console.error("Results fetch failed:", res.error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDownloadExcel = (student: any) => {
    if (!student || !student.subjects || student.subjects.length === 0) return;
    
    const headers = ["Subject", "Marks", "Grade", "Point"];
    const rows = student.subjects.map((sub: any) => 
      `${sub.subject},${sub.marks},${sub.grade},${sub.point}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${student.studentName.replace(/\s+/g, '_')}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={60} />
          <GraduationCap className="absolute inset-0 m-auto text-blue-900/20" size={30} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-text-primary tracking-tight animate-pulse">
            Loading Academic Results...
          </p>
        </div>
      </div>
    );
  }

  const allResults = data?.allResults || [];

  const filteredResults = allResults.filter((r: any) => 
    r.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueClasses = Array.from(new Set(allResults.map((s: any) => s.currentClass))).filter(Boolean) as string[];
  const availableSubjects = Array.from(
    new Set(
      allResults.flatMap((s: any) => s.subjects.map((sub: any) => sub.subject))
    )
  ).sort() as string[];

  const handleSchoolWideDownload = () => {
    if (!selectedPrintClass || !selectedPrintSubject) return alert("Please select both Class and Subject");

    const studentsInClass = allResults.filter((s: any) => s.currentClass === selectedPrintClass);
    if (studentsInClass.length === 0) return alert("No students found in this class");

    const headers = ["Student ID", "Student Name", "Class", "Gender", "Subject", "Marks", "Grade", "Point"];
    const rows: string[] = [];

    studentsInClass.forEach((s: any) => {
      const subjectResult = s.subjects.find((sub: any) => sub.subject === selectedPrintSubject);
      if (subjectResult) {
        rows.push(`${s.studentId},${s.studentName},${s.currentClass},${s.gender},${subjectResult.subject},${subjectResult.marks},${subjectResult.grade},${subjectResult.point}`);
      } else {
        rows.push(`${s.studentId},${s.studentName},${s.currentClass},${s.gender},${selectedPrintSubject},N/A,N/A,N/A`);
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedPrintClass}_${selectedPrintSubject}_Results.csv`.replace(/\s+/g, '_'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPrintModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn p-2 md:p-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            All Students Results
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Calendar className="w-4 h-4" />
            <span>School-wide Academic Performance</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input 
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 ps-10 pe-4 py-3 bg-bg-card border border-border-light rounded-2xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-text-primary"
            />
          </div>

          <button 
            onClick={() => setPrintModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <Printer size={18} className="transition-transform group-hover:translate-y-0.5" /> Print Records
          </button>
        </div>
      </div>

      {/* Results Table Card */}
      <Card className="overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-bg-page/50 text-text-muted">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light">Student</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light">Class</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light">Gender</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light text-center">Overall Grade</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredResults.map((r: any, i: number) => (
                <tr key={r.id || i} className="group hover:bg-bg-page/80 transition-all duration-300 animate-fadeInSlide" style={{ animationDelay: `${(i % 10) * 70}ms` }}>
                  <td className="px-6 py-6">
                    <div>
                      <span className="text-sm font-bold text-text-primary block">{r.studentName}</span>
                      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">ID: {r.studentId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6"><span className="text-sm font-medium text-text-secondary">{r.currentClass}</span></td>
                  <td className="px-6 py-6"><span className="text-sm font-medium text-text-secondary capitalize">{r.gender}</span></td>
                  <td className="px-6 py-6 text-center">
                    <span className={cn('inline-flex items-center justify-center min-w-[40px] px-3 py-1.5 rounded-lg text-[10px] font-black border tracking-widest leading-none shadow-sm uppercase', r.grade === 'A+' || r.grade === 'A' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : r.grade === 'F' ? 'bg-red-500/10 text-red-500 border-red-500/20' : r.grade === 'N/A' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20')}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-end">
                    <button 
                      onClick={() => setSelectedStudent(r)}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 rounded-lg text-xs font-bold transition-colors"
                    >
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center opacity-50">
                    <BookOpen className="mx-auto block mb-2 opacity-50 w-8 h-8" />
                    <p className="text-sm font-medium tracking-tight">No students found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Individual Result Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bg-card border border-border-light rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fadeInSlide">
            <div className="p-6 border-b border-border-light flex items-center justify-between bg-bg-page/50">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{selectedStudent.studentName}'s Results</h2>
                <p className="text-sm text-text-muted mt-1">Class: {selectedStudent.currentClass} | ID: {selectedStudent.studentId}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-text-muted hover:text-text-primary p-2 bg-border-light/50 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-start border border-border-light rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-bg-page text-text-muted">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider border-b border-border-light">{isAr ? "المادة" : "Subject"}</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider border-b border-border-light text-center">Marks</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider border-b border-border-light text-center">{isAr ? "التقدير" : "Grade"}</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider border-b border-border-light text-center">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light bg-bg-card">
                  {selectedStudent.subjects?.map((sub: any, idx: number) => (
                    <tr key={idx} className="hover:bg-bg-page/30">
                      <td className="px-4 py-3 text-sm font-bold text-text-primary">{sub.subject}</td>
                      <td className="px-4 py-3 text-sm font-medium text-center">{sub.marks}</td>
                      <td className="px-4 py-3 text-sm font-bold text-center text-blue-600">{sub.grade}</td>
                      <td className="px-4 py-3 text-sm font-mono text-center">{sub.point}</td>
                    </tr>
                  ))}
                  {(!selectedStudent.subjects || selectedStudent.subjects.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                         <div className="inline-flex rounded-full bg-red-500/10 p-3 mb-3">
                            <FileText className="w-6 h-6 text-red-500" />
                         </div>
                         <p className="text-lg font-bold text-text-primary">Result is not added</p>
                         <p className="text-xs text-text-muted mt-1">No subject marks have been recorded yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                <div className="mt-6 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                   <span className="font-bold text-text-primary uppercase tracking-wider text-xs">Overall Performance</span>
                   <div className="flex gap-4">
                      <span className="text-sm"><span className="text-text-muted">Total Marks:</span> <span className="font-black">{selectedStudent.totalMarks}</span></span>
                      <span className="text-sm"><span className="text-text-muted">Grade:</span> <span className="font-black text-emerald-600">{selectedStudent.grade}</span></span>
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border-light bg-bg-page/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl border border-border-light font-bold text-sm text-text-primary hover:bg-bg-page transition-all"
              >
                Close
              </button>
              {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                <button 
                  onClick={() => handleDownloadExcel(selectedStudent)}
                  className="px-5 py-2.5 rounded-xl border border-transparent bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-md transition-all flex items-center gap-2"
                >
                  <Download size={16} /> Download Excel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Print Records Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bg-card border border-border-light rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-fadeInSlide">
            <div className="p-6 border-b border-border-light bg-bg-page/50">
              <h2 className="text-xl font-bold text-text-primary">Download School-wide Records</h2>
              <p className="text-sm text-text-muted mt-1">Select class and subject to generate result sheet</p>
            </div>
            
            <div className="p-6 space-y-5">
               <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Select Class</label>
                  <select 
                    value={selectedPrintClass}
                    onChange={(e) => setSelectedPrintClass(e.target.value)}
                    className="w-full bg-bg-page border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-text-primary"
                  >
                    <option value="">-- Select Class --</option>
                    {uniqueClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Select Subject</label>
                  <select 
                    value={selectedPrintSubject}
                    onChange={(e) => setSelectedPrintSubject(e.target.value)}
                    className="w-full bg-bg-page border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-text-primary"
                  >
                    <option value="">-- Select Subject --</option>
                    {availableSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
               </div>
            </div>
            
            <div className="p-4 border-t border-border-light bg-bg-page/50 flex justify-end gap-3">
              <button 
                onClick={() => setPrintModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-border-light font-bold text-sm text-text-primary hover:bg-bg-page transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSchoolWideDownload}
                disabled={!selectedPrintClass || !selectedPrintSubject}
                className="px-5 py-2.5 rounded-xl border border-transparent bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Download size={16} /> Download Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
