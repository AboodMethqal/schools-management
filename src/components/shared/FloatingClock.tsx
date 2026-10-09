"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageProvider"

export function FloatingClock() {
    const { language } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setMounted(true);
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted || !currentTime) {
        return null;
    }

    // Formatting components for a cleaner look
    const locale = language === 'ar' ? 'ar-YE' : 'en-US';
    const timeStr = currentTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = currentTime.toLocaleDateString(locale, { day: '2-digit', month: 'short' });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            className="fixed bottom-6 end-6 z-[100] cursor-default select-none"
        >
            <div className="relative group">
                {/* Magnetic Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                {/* Main Pill Container */}
                <div className="relative flex items-center gap-3 px-4 py-2 bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)]">

                    {/* Status Dot */}
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>

                    {/* Time - Primary Focus */}
                    <div className="flex flex-col leading-none">
                        <span className="text-[13px] font-mono font-bold text-white tracking-widest uppercase">
                            {timeStr}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="h-4 w-[1px] bg-white/10"></div>

                    {/* Date - Secondary Focus */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {dateStr}
                        </span>
                    </div>
                </div>

                {/* Subtle Bottom Highlight */}
                <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>
        </motion.div>
    )
}
