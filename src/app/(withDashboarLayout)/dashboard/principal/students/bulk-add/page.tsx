"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
    FileUp,
    Download,
    ChevronLeft,
    CheckCircle2,
    Users,
    AlertCircle,
    Info,
    RefreshCcw,
    Database,
    UploadCloud,
} from "lucide-react";
import { addMultipleStudents } from "@/app/actions/student";
import { useLanguage } from "@/context/LanguageProvider";

export default function BulkAddStudentPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const router = useRouter();

    const [parsedData, setParsedData] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPdfUploading, setIsPdfUploading] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ===============================
    // {isAr ? 'تحميل نموذج CSV' : 'Download CSV Template'}
    // ===============================
    const handleDownloadTemplate = () => {
        const headers = [
            "registrationNo", "firstName", "lastName", "dateOfBirth",
            "gender", "bloodGroup", "religion", "currentClass",
            "section", "rollNo", "session", "fatherName",
            "motherName", "guardianPhone", "emergencyContact",
            "email", "presentAddress", "permanentAddress",
        ];

        const csvContent = headers.join(",");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "student_bulk_import_template.csv";
        link.click();
    };

    // ===============================
    // CSV Upload
    // ===============================
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        setError(null);
        setSuccessMessage(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[];
                const validRows = data.filter(row => row.registrationNo && row.firstName);

                if (validRows.length === 0) {
                    setError("CSV is empty or missing required columns (registrationNo, firstName).");
                    setParsedData([]);
                } else {
                    setParsedData(validRows);
                    if (validRows.length < data.length) {
                        setError(`Warning: ${data.length - validRows.length} rows skipped due to missing required fields.`);
                    }
                }
                setIsParsing(false);
            },
            error: (err) => {
                setError(`CSV Parse Error: ${err.message}`);
                setIsParsing(false);
            },
        });
    };

    // ===============================
    // Submit CSV Data
    // ===============================
    const handleSubmitAll = async () => {
        if (parsedData.length === 0) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await addMultipleStudents(parsedData);
            if (result.success) {
                setSuccessMessage(`Successfully imported ${result.count} students (${result.skipped ?? 0} duplicates skipped)`);
                setSuccess(true);
                setTimeout(() => router.push("/dashboard/principal/students"), 3000);
            } else {
                setError(result.error || "Bulk upload failed.");
            }
        } catch {
            setError("Server error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===============================
    // PDF Upload
    // ===============================
    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            return;
        }

        setPdfFile(file);
        setError(null);
        setSuccessMessage(null);

        try {
            setIsPdfUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload-pdf", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            const validRows = (data.data || []).filter((row: any) => row.firstName || row.registrationNo);

            if (validRows.length === 0) {
                setError("AI was unable to extract any valid student records from the PDF.");
                setParsedData([]);
            } else {
                setParsedData(validRows);
                setSuccessMessage(`AI Successfully extracted ${validRows.length} students from the PDF! Please review the preview table and import.`);
            }
        } catch (err: any) {
            setError(err.message || "PDF processing failed.");
        } finally {
            setIsPdfUploading(false);
        }
    };

    // ===============================
    // Success Screen
    // ===============================
    if (success) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 pb-20 bg-bg-page/30 dark:bg-slate-950 transition-colors duration-300">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[2rem] border dark:border-slate-800 shadow-sm flex flex-col items-center text-center max-w-lg w-full"
                >
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-3">
                        Import Successful
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">
                        {successMessage}
                    </p>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-4">Redirecting you to the student list...</p>
                </motion.div>
            </div>
        );
    }

    // ===============================
    // Main UI
    // ===============================
    return (
        <div className="w-full min-h-screen bg-bg-page/30 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-primary text-white shadow-lg">
                            <Users size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                Bulk Add Students
                            </h1>
                            <p className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-[0.2em]">
                                Import Data • CSV or  PDF
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleDownloadTemplate} variant="outline" className="hidden md:flex h-10 text-[10px] font-black uppercase tracking-widest dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900">
                            <Download size={14} className="me-2 text-primary dark:text-blue-400" />
                            CSV Template
                        </Button>
                        <Button variant="ghost" onClick={() => router.back()} className="h-10 text-[10px] font-black uppercase tracking-widest dark:text-slate-300 dark:hover:bg-slate-900">
                            <ChevronLeft className="me-2" size={14} /> Back
                        </Button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border-s-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-2 rounded-e-xl shadow-sm"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        <span className="leading-relaxed">{error}</span>
                    </motion.div>
                )}

                {/* Success Banner (Non-Blocking) */}
                {successMessage && !success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-s-4 border-emerald-500 text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 rounded-e-xl shadow-sm"
                    >
                        <Info size={16} className="shrink-0" />
                        <span className="leading-relaxed">{successMessage}</span>
                    </motion.div>
                )}

                {/* Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* CSV Upload Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm flex flex-col h-full space-y-6">
                        <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-4">
                            <Database className="text-primary dark:text-blue-400" size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Standard CSV Import</h3>
                        </div>

                        <div className="relative flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-950 hover:bg-blue-50/50 dark:hover:bg-slate-900 transition-all duration-200 group overflow-hidden">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                disabled={isParsing || isSubmitting}
                            />

                            <motion.div
                                animate={isParsing ? { rotate: 360 } : { y: [0, -5, 0] }}
                                transition={isParsing ? { repeat: Infinity, duration: 1, ease: "linear" } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className={`mb-4 ${isParsing ? "text-primary dark:text-blue-500" : "text-gray-400 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-blue-500 transition-colors"}`}
                            >
                                {isParsing ? <RefreshCcw size={48} /> : <UploadCloud size={48} />}
                            </motion.div>

                            <p className="text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors text-center">
                                {isParsing ? "Parsing Data..." : "Drag & Drop CSV"}
                            </p>
                            {!isParsing && (
                                <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2 text-center">
                                    or click to browse
                                </p>
                            )}

                            {/* Mobile Template Download button */}
                            <Button onClick={(e) => { e.stopPropagation(); handleDownloadTemplate(); }} variant="link" className="mt-6 md:hidden text-[10px] font-bold uppercase text-primary dark:text-blue-400">
                                Download Template
                            </Button>
                        </div>
                    </div>

                    {/* AI PDF Upload Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm flex flex-col h-full space-y-6 relative overflow-hidden">
                        {/* AI Sparkle decoration */}
                        <div className="absolute top-0 end-0 p-4 opacity-10 pointer-events-none dark:opacity-5">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-4 relative z-10">
                            <Users className="text-indigo-500 dark:text-indigo-400" size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                AI Smart Import
                                <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 py-0.5 px-2 rounded-full">PRO</span>
                            </h3>
                        </div>

                        <div className={`relative flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 group overflow-hidden ${isPdfUploading ? 'border-indigo-300 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handlePdfUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                disabled={isPdfUploading || isSubmitting}
                            />

                            <motion.div
                                animate={isPdfUploading ? { opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                                className={`mb-4 ${isPdfUploading ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors"}`}
                            >
                                {isPdfUploading ? <RefreshCcw size={48} className="animate-spin" /> : <FileUp size={48} />}
                            </motion.div>

                            <p className="text-[11px] font-black uppercase tracking-widest text-center transition-colors text-gray-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                                {isPdfUploading ? "AI ANALYZING..." : (pdfFile ? pdfFile.name : "UPLOAD PDF")}
                            </p>

                            {!isPdfUploading && !pdfFile && (
                                <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2 text-center max-w-[200px]">
                                    Supports scanned documents and digital PDFs
                                </p>
                            )}

                            {isPdfUploading && (
                                <div className="w-3/4 max-w-[200px] bg-gray-200 dark:bg-slate-800 rounded-full h-1 mt-4 overflow-hidden">
                                    <motion.div
                                        className="bg-indigo-500 dark:bg-indigo-400 h-1 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Preview Section */}
                {parsedData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800 shadow-sm overflow-hidden"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b dark:border-slate-800 gap-4">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Data Preview</h3>
                                <p className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-widest mt-1">
                                    Found <span className="text-gray-900 dark:text-white">{parsedData.length}</span> records ready.
                                    {parsedData.length > 5 && " Showing first 5."}
                                </p>
                            </div>

                            <Button
                                onClick={handleSubmitAll}
                                disabled={isSubmitting}
                                className="bg-primary text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCcw size={16} className="animate-spin me-2" />
                                        {isAr ? 'جارٍ الاستيراد...' : 'Importing...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} className="me-2" />
                                        Confirm & Import
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-start">
                                <thead className="bg-gray-50/50 dark:bg-slate-950/50 text-gray-500 dark:text-slate-400 uppercase font-black tracking-widest border-b dark:border-slate-800">
                                    <tr>
                                        <th className="p-4">Reg No</th>
                                        <th className="p-4">Student Name</th>
                                        <th className="p-4">Class/Section</th>
                                        <th className="p-4">Roll No</th>
                                        <th className="p-4">Guardian Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                                    {parsedData.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 font-bold text-gray-700 dark:text-slate-300">
                                                {row.registrationNo || <span className="text-red-400 italic">Missing</span>}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{row.firstName} {row.lastName}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300">
                                                    {row.currentClass || "?"} / {row.section || "?"}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium text-gray-600 dark:text-slate-400">{row.rollNo || "-"}</td>
                                            <td className="p-4 font-medium text-gray-600 dark:text-slate-400">{row.guardianPhone || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
