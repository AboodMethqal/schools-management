import { createClient } from "@supabase/supabase-js";

// Check for required keys
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing! Server-side onboarding will fail.");
}

// Supabase Admin client using Service Role Key
// This client bypasses RLS and is used for server-side management/onboarding
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key-to-prevent-crash",

    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
