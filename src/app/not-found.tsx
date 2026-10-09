"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    const [dots, setDots] = useState<{ x: number; y: number; opacity: number; size: number }[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: 25 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.random() * 0.35 + 0.05,
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
                background: "linear-gradient(135deg, #050818 0%, #080d24 50%, #0c0618 100%)",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                padding: "24px",
            }}
        >
            {/* Ambient glow */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                <div style={{
                    position: "absolute", top: "15%", left: "15%",
                    width: 500, height: 500, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }} />
                <div style={{
                    position: "absolute", bottom: "15%", right: "10%",
                    width: 400, height: 400, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }} />   
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800, height: 400, borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }} />
            </div>

            {/* Grid */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
            }} />

            {/* Particles */}
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
                            background: i % 3 === 0
                                ? "rgba(59,130,246,0.7)"
                                : i % 3 === 1
                                    ? "rgba(139,92,246,0.6)"
                                    : "rgba(255,255,255,0.3)",
                            opacity: dot.opacity,
                        }}
                        animate={{ y: [-10, 10, -10], opacity: [dot.opacity, dot.opacity * 2.5, dot.opacity] }}
                        transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
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
                    width: "100%", maxWidth: 540,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    borderRadius: 28,
                    padding: "52px 48px",
                    textAlign: "center",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.55), 0 0 80px rgba(37,99,235,0.06)",
                }}
            >
                {/* Large 404 text */}
                <div style={{ position: "relative", marginBottom: 8, userSelect: "none" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontSize: "clamp(6rem, 20vw, 10rem)",
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: "-0.05em",
                            background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(139,92,246,0.1) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        404
                    </motion.div>

                    {/* Floating icon over 404 */}
                    <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.35, type: "spring", stiffness: 180, damping: 14 }}
                        style={{
                            position: "absolute",
                            top: "50%", left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 80, height: 80,
                            borderRadius: 22,
                            background: "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(139,92,246,0.12))",
                            border: "1px solid rgba(59,130,246,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 40px rgba(37,99,235,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 20, -20, 10, 0] }}
                            transition={{ duration: 0.8, delay: 1.2, repeat: Infinity, repeatDelay: 4 }}
                        >
                            <Compass size={36} color="#60a5fa" strokeWidth={1.8} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(37,99,235,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        borderRadius: 999,
                        padding: "5px 14px",
                        marginBottom: 18,
                    }}
                >
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: "#60a5fa", textTransform: "uppercase" }}>
                        Page Not Found
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    style={{
                        fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                        fontWeight: 900,
                        color: "#f1f5f9",
                        lineHeight: 1.2,
                        marginBottom: 14,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Lost in the{" "}
                    <span style={{
                        background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>Digital Hallways</span>
                    ?
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 }}
                    style={{
                        fontSize: 15,
                        color: "rgba(148,163,184,0.8)",
                        lineHeight: 1.7,
                        marginBottom: 40,
                        fontWeight: 500,
                    }}
                >
                    The page you are looking for has been moved, removed, or simply does not exist in our school's digital campus.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                    <Link
                        href="/"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            padding: "14px 28px",
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            border: "1px solid rgba(37,99,235,0.5)",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 12,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            boxSizing: "border-box",
                            width: "100%",
                            boxShadow: "0 8px 32px rgba(37,99,235,0.35), 0 2px 8px rgba(0,0,0,0.3)",
                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 40px rgba(37,99,235,0.45), 0 4px 12px rgba(0,0,0,0.4)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(37,99,235,0.35), 0 2px 8px rgba(0,0,0,0.3)";
                        }}
                    >
                        <Home size={16} />
                        Campus Portal
                    </Link>

                    <button
                        onClick={() => window.history.back()}
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
                            cursor: "pointer",
                            width: "100%",
                            transition: "background 0.2s ease, border-color 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                        }}
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
