"use client";
import React, { useState, useEffect } from 'react';
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import {
    Plus,
    FileText,
    Link as LinkIcon,
    Search,
    BookOpen,
    Eye,
    Trash2,
    MoreVertical,
    Upload,
    Loader2,
    Edit
} from 'lucide-react';
import { getStudyMaterials, createStudyMaterial, deleteStudyMaterial, updateStudyMaterial, uploadMaterialToImgBB } from '@/app/actions/teacher/studyMaterials';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Swal from 'sweetalert2';

export default function StudyMaterialsPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("All Classes");
    const [selectedSubject, setSelectedSubject] = useState("All Subjects");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editMaterial, setEditMaterial] = useState<any | null>(null);

    const { user } = useAuth();
    const schoolId = user?.user_metadata?.schoolId || "";
    const teacherId = user?.id || "";

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        class: 'Class X - A',
        subject: 'Mathematics',
        description: '',
        type: 'PDF',
        attachmentUrl: '', // Reset to empty
        size: '2.4 MB'
    });

    const [assignedClasses, setAssignedClasses] = useState<any[]>([]);

    useEffect(() => {
        fetchInitialData();
    }, [schoolId]);

    const fetchInitialData = async () => {
        setLoading(true);
        const [materialsRes, classesRes] = await Promise.all([
            getStudyMaterials(schoolId || undefined),
            import('@/app/actions/teacher/results').then(m => m.getClasses())
        ]);

        if (materialsRes.success) {
            setMaterials(materialsRes.data || []);
        } else {
            toast.error(materialsRes.error || "Failed to fetch materials");
        }

        if (classesRes.success && classesRes.data) {
            setAssignedClasses(classesRes.data);
            if (classesRes.data.length > 0 && !formData.class) {
                setFormData(prev => ({ ...prev, class: classesRes.data[0].name }));
            }
        }
        setLoading(false);
    };

    const openEditModal = (material: any) => {
        setEditMaterial(material);
        setFormData({
            title: material.title,
            class: material.class,
            subject: material.subject,
            description: material.description || '',
            type: material.type,
            attachmentUrl: material.attachmentUrl,
            size: material.size || '2.4 MB'
        });
        setShowUploadModal(true);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.attachmentUrl && !selectedFile) {
            toast.error("Please provide a file URL or select a file to upload.");
            return;
        }

        setIsSubmitting(true);
        let finalUrl = formData.attachmentUrl;
        let finalSize = formData.size;

        // Handle File Upload if a file is selected
        if (selectedFile) {
            setUploading(true);
            const formDataUpload = new FormData();
            formDataUpload.append('image', selectedFile);

            const uploadRes = await uploadMaterialToImgBB(formDataUpload);

            if (uploadRes.success && uploadRes.url) {
                finalUrl = uploadRes.url;
                finalSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
            } else {
                toast.error("File upload failed: " + (uploadRes.error || "Unknown error"));
                setIsSubmitting(false);
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const submissionData = {
            ...formData,
            attachmentUrl: finalUrl,
            size: finalSize,
            schoolId,
            teacherId
        };

        const response = editMaterial
            ? await updateStudyMaterial(editMaterial.id, formData)
            : await createStudyMaterial(submissionData);

        if (response.success) {
            Swal.fire({
                title: editMaterial ? 'Updated!' : 'Published!',
                text: editMaterial ? 'Material updated successfully.' : 'Material published successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
            });
            setShowUploadModal(false);
            setEditMaterial(null);
            fetchInitialData();
            setSelectedFile(null);
            // Reset form
            setFormData({
                title: '',
                class: 'Class X - A',
                subject: 'Mathematics',
                description: '',
                type: 'PDF',
                attachmentUrl: '',
                size: '2.4 MB'
            });
        } else {
            toast.error(response.error || "Failed to process material");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
        });

        if (result.isConfirmed) {
            const response = await deleteStudyMaterial(id);
            if (response.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'The material has been deleted.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
                });
                setMaterials(materials.filter(m => m.id !== id));
            } else {
                toast.error(response.error || "Failed to delete material");
            }
        }
    };

    const filteredMaterials = materials.filter(material => {
        const matchesSearch = (material.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === "All Classes" || material.class === selectedClass;
        const matchesSubject = selectedSubject === "All Subjects" || material.subject === selectedSubject;
        return matchesSearch && matchesClass && matchesSubject;
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title={isAr ? "المواد" : "Study"}
                highlight={isAr ? "التعليمية" : "Materials"}
                emoji="📚"
                subtitle="Upload and share resources with your students."
                rightElement={
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
                    >
                        <Plus size={18} /> Upload New Material
                    </button>
                }
            />

            <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="px-4 py-2 bg-bg-page border border-border-light rounded-xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer text-text-secondary"
                        >
                            <option>{isAr ? "جميع الفصول" : "All Classes"}</option>
                            {assignedClasses.map((cls) => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-4 py-2 bg-bg-page border border-border-light rounded-xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer text-text-secondary"
                        >
                            <option>{isAr ? "جميع المواد" : "All Subjects"}</option>
                            <option>Mathematics</option>
                            <option>Chemistry</option>
                            <option>Physics</option>
                        </select>
                    </div>

                    <div className="relative w-full lg:w-80 group">
                        <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full ps-12 pe-4 py-3 bg-bg-page border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary"
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            <p>Loading materials...</p>
                        </div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="text-center py-20 bg-bg-page/20 rounded-2xl border border-dashed border-border-light">
                            <BookOpen className="mx-auto text-text-muted mb-4" size={48} />
                            <p className="text-text-secondary font-medium">No materials found. Start by uploading one!</p>
                        </div>
                    ) : (
                        filteredMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="group bg-bg-page/40 p-4 rounded-2xl border border-border-light/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${material.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {material.type === 'PDF' ? <FileText size={24} /> : <LinkIcon size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">{material.title}</h3>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                                                <BookOpen size={12} /> {material.subject}
                                            </span>
                                            <span className="w-1 h-1 bg-border-light rounded-full"></span>
                                            <span className="text-xs font-semibold text-text-muted uppercase">{material.type} • {material.size}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2 lg:gap-4">
                                    <span className="text-xs font-medium text-text-muted hidden md:block">
                                        Uploaded on {new Date(material.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <a href={material.attachmentUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-lg text-text-muted hover:text-primary transition-all" title="View">
                                            <Eye size={18} />
                                        </a>
                                        <button
                                            onClick={() => openEditModal(material)}
                                            className="p-2 hover:bg-primary/10 rounded-lg text-text-muted hover:text-primary transition-all"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(material.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-text-muted hover:text-red-500 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-bg-page rounded-lg text-text-muted">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && (setShowUploadModal(false), setEditMaterial(null))}></div>
                    <form onSubmit={handleUpload} className="bg-bg-card w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl animate-slideInBottom border border-border-light max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-bold text-text-primary mb-6">{editMaterial ? (isAr ? 'تحديث الملف' : 'Update Material') : (isAr ? 'رفع ملف تعليمي' : 'Upload Material')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Algebra Slides"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Class</label>
                                    <select
                                        value={formData.class}
                                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        {assignedClasses.map((cls) => (
                                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                                        ))}
                                        {assignedClasses.length === 0 && <option>No Classes Assigned</option>}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option>Mathematics</option>
                                        <option>Chemistry</option>
                                        <option>Physics</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">{isAr ? "الوصف" : "Description"}</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                                    placeholder="Provide a brief overview of the material..."
                                ></textarea>
                            </div>
                            <div
                                onClick={() => document.getElementById('file-upload')?.click()}
                                className={`border-2 border-dashed ${selectedFile ? 'border-primary bg-primary/5' : 'border-border-light bg-bg-page/30'} rounded-2xl p-8 text-center hover:border-primary/5 transition-all cursor-pointer group`}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setFormData(prev => ({
                                                ...prev,
                                                title: prev.title || file.name.split('.')[0],
                                                type: file.type.includes('pdf') ? 'PDF' : 'LINK'
                                            }));
                                        }
                                    }}
                                />
                                {uploading ? (
                                    <Loader2 className="animate-spin mx-auto text-primary mb-2" size={32} />
                                ) : (
                                    <Upload size={32} className={`mx-auto ${selectedFile ? 'text-primary' : 'text-text-muted'} group-hover:text-primary transition-colors mb-2`} />
                                )}
                                <p className="text-sm font-bold text-text-secondary">
                                    {selectedFile ? selectedFile.name : 'Click to upload or drag file here'}
                                </p>
                                <p className="text-xs text-text-muted mt-1 uppercase font-black tracking-widest text-[8px]">
                                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOC, PPT, MP4 (MAX 50MB)'}
                                </p>
                            </div>

                            <div className="relative flex items-center gap-4 py-2">
                                <div className="h-px bg-border-light flex-1"></div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Or Provide Link</span>
                                <div className="h-px bg-border-light flex-1"></div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">External Link/URL</label>
                                <div className="relative group">
                                    <LinkIcon className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="url"
                                        value={formData.attachmentUrl}
                                        onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                                        className="w-full ps-12 pe-4 py-3 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="https://example.com/shared-doc"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => { setShowUploadModal(false); setEditMaterial(null); }}
                                    className="flex-1 py-3 border border-border-light text-text-secondary rounded-xl font-bold text-sm hover:bg-bg-page transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                                    {isSubmitting ? 'Processing...' : editMaterial ? 'Update' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
