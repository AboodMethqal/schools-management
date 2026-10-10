"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Send, Megaphone, Search, Filter, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { getAnnouncements } from "@/app/actions/announcement";
import { useLanguage } from "@/context/LanguageProvider";
import { getCurrentSchoolId } from "@/app/actions/user";

export default function AnnouncementsPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all_roles");

  useEffect(() => {
    async function loadNotices() {
      const schoolId = await getCurrentSchoolId();
      if (!schoolId) { setLoading(false); return; }
      const res = await getAnnouncements(schoolId);
      if (res.success) setNotices(res.data || []);
      setLoading(false);
    }
    loadNotices();
  }, []);

  // Filter logic
  const filteredNotices = notices.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === "all_roles" || item.audience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  const publishedCount = notices.filter((a) => a.status === "published").length;
  const draftCount = notices.filter((a) => a.status === "draft").length;

  return (
    <div className="min-h-screen p-6 transition-colors bg-gray-50 dark:bg-transparent text-gray-900 dark:text-white">

      {/* Top Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase">{isAr ? 'لوحة الإعلانات المدرسية' : 'Announcement Board'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAr ? `${publishedCount} منشور · ${draftCount} مسودة` : `${publishedCount} published · ${draftCount} drafts`}
          </p>
        </div>

        <Link href={`/dashboard/principal/announcements/new`} className="
          flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition
          bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20
        ">
          <Plus size={18} />
          {isAr ? 'إعلان جديد' : 'New Announcement'}
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or content..."
            className="w-full ps-12 pe-4 py-3 bg-gray-100 dark:bg-white/5 border-none rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full ps-12 pe-4 py-3 bg-gray-100 dark:bg-white/5 border-none rounded-xl outline-none text-sm font-bold appearance-none cursor-pointer"
            onChange={(e) => setAudienceFilter(e.target.value)}
          >
            <option value="all_roles">All Roles</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      {/* List Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center font-bold text-gray-500 animate-pulse">Fetching Announcements...</div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((item) => (
            <div
              key={item.id}
              className="
                flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl p-5 transition gap-4
                bg-white border border-gray-200 hover:border-purple-500/50 hover:shadow-md
                dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10
              "
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${item.priority === 'urgent' ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-500'
                  }`}>
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] leading-tight">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
                      <Users size={10} /> {item.audience} {item.targetClass ? `(${item.targetClass})` : ''}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                      <Calendar size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.status === "published"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                    }`}
                >
                  {item.status}
                </span>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition text-gray-500">
                    <Eye size={18} />
                  </button>

                  {item.status === "draft" && (
                    <button className="
                      flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition
                      bg-purple-600 text-white hover:bg-purple-700
                    ">
                      <Send size={14} />
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest border-2 border-dashed border-gray-200 dark:border-white/5 rounded-[40px]">
            {isAr ? 'لم يتم العثور على إعلانات' : 'No announcements found'} matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
