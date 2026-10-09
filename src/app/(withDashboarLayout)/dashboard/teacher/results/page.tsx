"use client";
import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    Search,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Save,
    Filter,
    Settings,
    Calculator,
    ChevronDown,
    ChevronUp,
    Loader2,
    Download,
    FileText
} from 'lucide-react';
import { getClasses, getStudentsByClass, getResults, saveResults } from '@/app/actions/teacher/results';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

const defaultSubjectsEn = ["Arabic", "English", "Mathematics", "Science", "Islamic Studies", "Computer Science"];
const defaultSubjectsAr = ["العربية", "الإنجليزية", "الرياضيات", "العلوم", "التربية الإسلامية", "الحاسوب"];

export default function ResultsPage() {
    const { language, t } = useLanguage();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [examType, setExamType] = useState('Final Term');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
    const [subjects, setSubjects] = useState(language === 'ar' ? defaultSubjectsAr : defaultSubjectsEn);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setSubjects(language === 'ar' ? defaultSubjectsAr : defaultSubjectsEn);
    }, [language]);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [studentsData, setStudentsData] = useState<any[]>([]);

    // Fetch Classes
    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            const res = await getClasses();
            if (res.success && res.data) {
                setClasses(res.data);
            } else {
                setClasses([]);
                toast.error(res.error || "Failed to load classes");
            }
            setIsLoading(false);
        };
        fetchClasses();
    }, []);

    // Fetch Students and Results when Class changes
    useEffect(() => {
        if (!selectedClass) return;

        const fetchData = async () => {
            setIsLoading(true);
            const studentsRes = await getStudentsByClass(selectedClass);

            if (studentsRes.success && studentsRes.data) {
                // Fetch all results for these students in this exam type
                const allResults = await Promise.all(
                    subjects.map(sub => getResults(selectedClass, sub, examType))
                );

                const studentMap = (studentsRes.data || []).map((student: any) => {
                    const marks: Record<string, any> = {};
                    subjects.forEach((sub, index) => {
                        const subResult = allResults[index];
                        if (subResult.success && subResult.data) {
                            const studentResult = subResult.data.find((r: any) => r.studentId === student.id);
                            marks[sub] = studentResult ? studentResult.marks : "";
                        } else {
                            marks[sub] = "";
                        }
                    });

                    return {
                        id: student.id,
                        name: `${student.firstName} ${student.lastName}`,
                        roll: student.rollNo,
                        marks
                    };
                });
                setStudentsData(studentMap);
            } else {
                toast.error(studentsRes.error || "Failed to load students");
            }
            setIsLoading(false);
        };
        fetchData();
    }, [selectedClass, examType, subjects]);

    const handleAddSubject = async () => {
        const { value: subjectName } = await Swal.fire({
            title: 'New Subject',
            text: 'Enter a subject name to add it to the gradebook.',
            input: 'text',
            inputPlaceholder: 'e.g. History',
            showCancelButton: true,
            confirmButtonText: 'Add',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value || !value.trim()) return 'Please enter a subject name.';
                if (subjects.includes(value.trim())) return 'This subject is already added.';
                return null;
            }
        });

        if (subjectName && !subjects.includes(subjectName.trim())) {
            const trimmed = subjectName.trim();
            setSubjects(prev => [...prev, trimmed]);
            setStudentsData(prev => prev.map(student => ({
                ...student,
                marks: {
                    ...student.marks,
                    [trimmed]: ""
                }
            })));
        }
    };

    const handleMarkChange = (studentId: string, subject: string, value: string) => {
        if (value === "") {
            setStudentsData(prev => prev.map(student => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        marks: { ...student.marks, [subject]: "" }
                    };
                }
                return student;
            }));
            return;
        }

        const numValue = parseInt(value);
        if (isNaN(numValue)) return;

        // Ensure mark is between 1 and 100
        const sanitizedValue = Math.min(100, Math.max(1, numValue));

        setStudentsData(prev => prev.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    marks: {
                        ...student.marks,
                        [subject]: sanitizedValue
                    }
                };
            }
            return student;
        }));
    };

    const handleSave = async () => {
        if (!selectedClass) return;

        setIsSaving(true);
        try {
            const resultsToSave: any[] = [];
            studentsData.forEach(student => {
                subjects.forEach(subject => {
                    resultsToSave.push({
                        studentId: student.id,
                        marks: Number(student.marks[subject]) || 0,
                        subject,
                        examType,
                        classId: selectedClass
                    });
                });
            });

            const res = await saveResults(resultsToSave);
            if (res.success) {
                Swal.fire({
                    title: 'Saved!',
                    text: 'Results have been updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                toast.error(res.error || "Failed to save results");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        }
        setIsSaving(false);
    };

    const calculateGPA = (studentMarks: Record<string, number>) => {
        const marks = Object.values(studentMarks);
        if (marks.length === 0) return { gpa: "0.00", grade: "N/A" };
        const total = marks.reduce((sum, m) => sum + (Number(m) || 0), 0);
        const avg = total / marks.length;

        if (avg >= 80) return { gpa: "5.00", grade: "A+" };
        if (avg >= 70) return { gpa: "4.00", grade: "A" };
        if (avg >= 60) return { gpa: "3.50", grade: "A-" };
        if (avg >= 50) return { gpa: "3.00", grade: "B" };
        if (avg >= 40) return { gpa: "2.00", grade: "C" };
        if (avg >= 33) return { gpa: "1.00", grade: "D" };
        return { gpa: "0.00", grade: "F" };
    };

    const handleExportCSV = () => {
        if (!selectedClass || studentsData.length === 0) return;

        const classInfo = classes.find(c => c.id === selectedClass);
        const filename = `${classInfo?.name || "Results"}_${examType.replace(/\s+/g, '_')}_Results.csv`;

        // 1. Headers
        const headers = ["Roll", "Student Name", ...subjects, "Total", "GPA", "Grade"];
        
        // 2. Rows
        const rows = studentsData.map(student => {
            const { gpa, grade } = calculateGPA(student.marks);
            const total = Object.values(student.marks).reduce((sum: number, m: any) => sum + (Number(m) || 0), 0);
            
            return [
                student.roll,
                `"${student.name}"`, // Quote names to handle potential commas
                ...subjects.map(s => student.marks[s] || 0),
                total,
                gpa,
                grade
            ];
        });

        // 3. Assemble CSV
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // 4. Download Trigger
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${filename}`);
    };

    const filteredStudents = studentsData.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roll.toString().includes(searchQuery)
    );

    if (isLoading && !selectedClass) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        Results <span className="text-primary italic">Gradebook</span> 🏆
                    </h1>
                    <p className="text-text-muted mt-2 font-medium">
                        Bulk enter and manage student marks for all subjects.
                    </p>
                </div>
                {selectedClass && (
                    <button
                        onClick={() => setSelectedClass(null)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-light rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-page transition-all active:scale-95"
                    >
                        <ChevronLeft size={18} /> Back to Selection
                    </button>
                )}
            </div>

            {!selectedClass ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls.id)}
                            className="group bg-bg-card p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                                        {cls.name}
                                    </h3>
                                    <p className="text-xs font-black text-text-muted uppercase tracking-widest mt-0.5">Gradebook View</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <Trophy size={16} className="text-primary/60" />
                                    <span className="text-sm font-bold">{examType}</span>
                                </div>
                                <div className="bg-primary/5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                                    Open Grid
                                </div>
                            </div>

                            <div className="absolute end-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="col-span-full p-12 text-center bg-bg-card border border-border-light rounded-3xl">
                            <p className="text-text-muted font-bold">No classes found. Please contact admin to assign classes.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-bg-card border border-border-light p-4 rounded-3xl shadow-sm">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative">
                                <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name or roll..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ps-10 pe-4 py-2 bg-bg-page border border-border-light rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-bg-page border border-border-light px-4 py-2 rounded-xl">
                                <Filter size={14} className="text-text-muted" />
                                <select
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                    className="bg-transparent text-xs font-bold text-text-secondary focus:outline-none cursor-pointer"
                                >
                                    <option value="Final Term">Final Term</option>
                                    <option value="Mid Term">Mid Term</option>
                                    <option value="First Term">First Term</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddSubject}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Settings size={14} /> Add Subject
                            </button>
                            <button 
                                onClick={handleExportCSV}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-bg-page border border-border-light text-text-secondary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-border-light transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={14} /> Export CSV
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    {/* Grid Container */}
                    <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6 overflow-hidden relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        )}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Calculator size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-text-primary">
                                    {classes.find(c => c.id === selectedClass)?.name} - Marksheet
                                </h2>
                                <p className="text-xs text-text-muted font-medium italic">All Subjects Overview</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-start">
                                <thead>
                                    <tr className="border-b border-border-light text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        <th className="pb-4 px-4 sticky start-0 bg-bg-card z-10 w-24">Roll</th>
                                        <th className="pb-4 px-4 sticky start-24 bg-bg-card z-10">Student Name</th>
                                        <th className="pb-4 px-4 text-center">Total</th>
                                        <th className="pb-4 px-4 text-center">GPA</th>
                                        <th className="pb-4 px-4 text-end">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light/50">
                                    {filteredStudents.map((student) => {
                                        const { gpa, grade } = calculateGPA(student.marks);
                                        const total = Object.values(student.marks).reduce((sum: number, m: any) => sum + (Number(m) || 0), 0);
                                        const isExpanded = expandedStudent === student.id;

                                        return (
                                            <React.Fragment key={student.id}>
                                                <tr
                                                    onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                                                    className={`
                                                        group cursor-pointer transition-all duration-200
                                                        ${isExpanded ? 'bg-primary/[0.04] shadow-inner' : 'hover:bg-bg-page/50'}
                                                    `}
                                                >
                                                    <td className="py-5 px-4 sticky start-0 z-10 bg-inherit border-r border-border-light/5">
                                                        <span className="text-[10px] font-black text-text-muted tracking-widest uppercase">{student.roll}</span>
                                                    </td>
                                                    <td className="py-5 px-4 sticky start-24 z-10 bg-inherit shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`
                                                                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                                                ${isExpanded ? 'bg-primary text-white shadow-lg shadow-primary/30 rotate-180' : 'bg-primary/10 text-primary group-hover:scale-110'}
                                                            `}>
                                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            </div>
                                                            <span className={`font-bold transition-colors ${isExpanded ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>
                                                                {student.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-center">
                                                        <span className="text-sm font-black text-text-primary">{total}</span>
                                                    </td>
                                                    <td className="py-5 px-4 text-center">
                                                        <span className="text-sm font-bold text-primary tabular-nums">{gpa}</span>
                                                    </td>
                                                    <td className="py-5 px-4 text-end">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${grade === 'A+' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                                                            grade === 'A' || grade === 'A-' ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                                                                grade === 'F' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                                                    'bg-bg-page text-text-secondary border border-border-light'
                                                            }`}>
                                                            {grade}
                                                        </span>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details: Subject Marks Entry */}
                                                {isExpanded && (
                                                    <tr className="bg-primary/[0.01] border-s-4 border-primary">
                                                        <td colSpan={5} className="px-6 py-8">
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-in fade-in slide-in-from-start-4 duration-500 ease-out">
                                                                {subjects.map(subject => (
                                                                    <div key={subject} className="group/field space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-1 flex items-center gap-2 group-hover/field:text-primary transition-colors">
                                                                            <Settings size={10} className="opacity-0 group-hover/field:opacity-100 transition-opacity" /> {subject}
                                                                        </label>
                                                                        <div className="relative">
                                                                            <input
                                                                                type="number"
                                                                                value={student.marks[subject]}
                                                                                onChange={(e) => handleMarkChange(student.id, subject, e.target.value)}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                placeholder="-"
                                                                                min="1"
                                                                                max="100"
                                                                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-border-light rounded-xl text-sm font-black text-center focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm transition-all hover:border-primary/40 focus:scale-[1.02]"
                                                                            />
                                                                            <div className="absolute top-1/2 -translate-y-1/2 end-3 opacity-20 text-[8px] font-bold pointer-events-none uppercase">Marks</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-text-muted font-bold">
                                                No students found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
