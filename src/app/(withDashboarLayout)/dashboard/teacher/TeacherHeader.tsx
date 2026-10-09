"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageProvider';

interface TeacherHeaderProps {
    title: string;
    highlight?: string;
    emoji?: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
}

export const TeacherHeader = ({
    title,
    highlight,
    emoji,
    subtitle,
    rightElement
}: TeacherHeaderProps) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                    {t(title)} {highlight && <span className="text-primary italic">{highlight}</span>} {emoji}
                </h1>
                {subtitle && (
                    <p className="text-text-muted mt-2 font-medium">
                        {t(subtitle)}
                    </p>
                )}
            </div>
            {rightElement && (
                <div className="flex items-center gap-3">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
