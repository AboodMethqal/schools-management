'use client';

import React from "react";
import { motion } from "framer-motion";
import { LuSchool } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageProvider";

export default function PageLoader() {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#030712",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Soft background glow */}
            <div style={{
                position: "absolute",
                top: "30%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500, height: 500,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
            }} />




            {/* Subtle grid */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }} />

            <div style={{ position: "relative", textAlign: "center" }}>
                {/* Spinner */}
                <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 28px" }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: "absolute", inset: 0,
                            borderRadius: "50%",
                            border: "2px solid transparent",
                            borderTopColor: "rgba(37,99,235,0.2)",
                            borderRightColor: "rgba(37,99,235,0.2)",
                        }}
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: "absolute", inset: 6,
                            borderRadius: "50%",
                            border: "2px solid transparent",
                            borderBottomColor: "#2563EB",
                            borderLeftColor: "#2563EB",
                            boxShadow: "0 0 12px rgba(37,99,235,0.25)",
                        }}
                    />
                    <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#2563EB",
                    }}>
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                           <LuSchool />
                        </motion.div>
                    </div>
                </div>

                {/* Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#94a3b8",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                    }}
                >
                    {isAr ? "جارٍ التحميل..." : "Loading..."}
                </motion.p>

                {/* Progress shimmer bar */}
                <div style={{
                    width: 160, height: 2,
                    background: "#E2E8F0",
                    borderRadius: 999,
                    margin: "14px auto 0",
                    overflow: "hidden",
                }}>
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            height: "100%", width: "60%",
                            background: "linear-gradient(90deg, transparent, #2563EB, transparent)",
                            borderRadius: 999,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
