"use client"

import React, { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Ensure component is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="p-2.5 h-10 w-10 rounded-xl bg-bg-card border border-border-light" />
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 text-text-secondary hover:bg-bg-page rounded-xl transition-all duration-300 border border-border-light bg-bg-card shadow-sm active:scale-95 flex items-center justify-center h-10 w-10"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <Moon className="h-5 w-5 text-blue-400 animate-in zoom-in duration-300" />
            ) : (
                <Sun className="h-5 w-5 text-amber-500 animate-in zoom-in duration-300" />
            )}
        </button>
    )
}
