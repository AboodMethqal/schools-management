"use client"

import React from "react"

interface LogoProps {
    className?: string
    variant?: "light" | "dark" | "blue"
    size?: "sm" | "md" | "lg"
    title?: string
    subtitle?: string
    logoUrl?: string | null
}

export default function Logo({
    className = "",
    variant = "light",
    size = "md",
    title,
    subtitle,
    logoUrl
}: LogoProps) {
    const textColorClass = variant === "light"
        ? "text-white"
        : variant === "dark"
            ? "text-slate-900 dark:text-white"
            : "text-blue-600"

    const sizeClasses = {
        sm: { image: "h-9 w-9 rounded-lg", text: "text-sm", gap: "gap-2" },
        md: { image: "h-10 w-10 rounded-xl", text: "text-base", gap: "gap-2.5" },
        lg: { image: "h-14 w-14 rounded-2xl", text: "text-xl", gap: "gap-3" }
    }

    const currentSize = sizeClasses[size]
    const source = logoUrl || "/brand/methqal-tech-mark.jpg"

    return (
        <div className={`flex items-center font-black ${currentSize.gap} ${currentSize.text} ${textColorClass} ${className}`} dir="ltr">
            <img
                src={source}
                alt="Methqal Tech"
                className={`${currentSize.image} object-cover shrink-0 shadow-lg shadow-blue-600/20`}
            />
            <div className="flex flex-col leading-tight">
                <span className="tracking-tight whitespace-nowrap">
                    {title || "Methqal"}<span className="text-blue-500">{subtitle || " Tech"}</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.16em] opacity-70 whitespace-nowrap">METHQAL TECH</span>
            </div>
        </div>
    )
}
