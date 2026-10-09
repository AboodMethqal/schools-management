import { LucideIcon } from "lucide-react";



export interface DashboardMenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: string;
}


export interface UserProfile {
    name: string;
    role: string;
    avatar?: string;
    initials: string;
    subText?: string;
}
