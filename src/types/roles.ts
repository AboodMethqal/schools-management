export type UserRole =
    | "super_admin"
    | "admin"
    | "teacher"
    | "student"
    | "parent"
    | "accountant";

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    full_name?: string;
    avatar_url?: string;
    institution_id?: string;
}
