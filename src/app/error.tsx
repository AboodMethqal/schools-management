"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, Zap, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [dots, setDots] = useState<{ x: number; y: number; opacity: number; size: number }[]>([]);

    useEffect(() => {
        console.error(error);
    }, [error]);

    useEffect(() => {
        const generated = Array.from({ length: 30 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.random() * 0.4 + 0.05,
            size: Math.random() * 3 + 1,
        }));
        setDots(generated);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #120820 100%)",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                padding: "24px",
            }}
        >
            {/* Ambient glow blobs */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            }}>
                <div style={{
                    position: "absolute", top: "20%", left: "10%",
                    width: 500, height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }} />
                <div style={{
                    position: "absolute", bottom: "10%", right: "5%",
                    width: 400, height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }} />
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700, height: 700,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)",
                    filter: "blur(100px)",
                }} />
            </div>

            {/* Grid overlay */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
            }} />

            {/* Floating particles */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                {dots.map((dot, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${dot.x}%`,
                            top: `${dot.y}%`,
                            width: dot.size,
                            height: dot.size,
                            borderRadius: "50%",
                            background: i % 3 === 0 ? "rgba(220,38,38,0.6)" : i % 3 === 1 ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.3)",
                            opacity: dot.opacity,
                        }}
                        animate={{ y: [-8, 8, -8], opacity: [dot.opacity, dot.opacity * 2, dot.opacity] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                    />
                ))}
            </div>

            {/* Main card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: "relative", zIndex: 10,
                    width: "100%", maxWidth: 520,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    borderRadius: 28,
                    padding: "52px 48px",
                    textAlign: "center",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(220,38,38,0.05)",
                }}
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    style={{
                        width: 88, height: 88,
                        borderRadius: 24,
                        background: "linear-gradient(135deg, rgba(220,38,38,0.2), rgba(239,68,68,0.08))",
                        border: "1px solid rgba(220,38,38,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 32px",
                        boxShadow: "0 0 40px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                >
                    <motion.div
                        animate={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <AlertTriangle size={40} color="#f87171" strokeWidth={2} />
                    </motion.div>
                </motion.div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(220,38,38,0.12)",
                        border: "1px solid rgba(220,38,38,0.25)",
                        borderRadius: 999,
                        padding: "5px 14px",
                        marginBottom: 20,
                    }}
                >
                    <Zap size={10} color="#f87171" fill="#f87171" />
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: "#f87171", textTransform: "uppercase" }}>
                        System Error Detected
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    style={{
                        fontSize: "clamp(2rem, 5vw, 2.75rem)",
                        fontWeight: 900,
                        color: "#f1f5f9",
                        lineHeight: 1.1,
                        marginBottom: 16,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Something went{" "}
                    <span style={{
                        background: "linear-gradient(135deg, #f87171, #dc2626)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>wrong</span>
                    .
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 }}
                    style={{
                        fontSize: 15,
                        color: "rgba(148,163,184,0.85)",
                        lineHeight: 1.7,
                        marginBottom: 40,
                        fontWeight: 500,
                    }}
                >
                    An unexpected error occurred. Our team has been notified and is actively working to resolve the issue.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                    <button
                        onClick={() => reset()}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            padding: "14px 28px",
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                            border: "1px solid rgba(220,38,38,0.4)",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 12,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            width: "100%",
                            boxShadow: "0 8px 32px rgba(220,38,38,0.35), 0 2px 8px rgba(0,0,0,0.3)",
                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 40px rgba(220,38,38,0.45), 0 4px 12px rgba(0,0,0,0.4)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(220,38,38,0.35), 0 2px 8px rgba(0,0,0,0.3)";
                        }}
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            padding: "14px 28px",
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#cbd5e1",
                            fontWeight: 800,
                            fontSize: 12,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            width: "100%",
                            boxSizing: "border-box",
                            transition: "background 0.2s ease, border-color 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                        }}
                    >
                        <Home size={16} />
                        Go to Homepage
                    </Link>
                </motion.div>

                {/* Error Digest */}
                {error.digest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            marginTop: 32,
                            paddingTop: 20,
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: "rgba(100,116,139,0.6)", textTransform: "uppercase", marginBottom: 4 }}>
                            Error Digest
                        </p>
                        <p style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(100,116,139,0.5)", letterSpacing: "0.05em" }}>
                            {error.digest}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
