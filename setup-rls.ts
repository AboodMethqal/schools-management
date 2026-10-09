import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        console.log('Deploying Auth Sync Trigger...')

        // Function to handle new user signup
        await prisma.$executeRawUnsafe(`
            create or replace function public.handle_new_user()
            returns trigger
            language plpgsql
            security definer set search_path = ''
            as $$
            declare
              v_school_id text;
            begin
              -- Try to find a matching school from metadata
              v_school_id := new.raw_user_meta_data->>'schoolId';

              -- Only attempt insert when we have a valid schoolId that exists
              if v_school_id is not null then
                begin
                  insert into public."User" (id, "authUserId", email, name, role, status, "schoolId", "createdAt", "updatedAt")
                  values (
                    gen_random_uuid()::text,
                    new.id::text,
                    new.email,
                    coalesce(new.raw_user_meta_data->>'name', 'New User'),
                    coalesce(cast(new.raw_user_meta_data->>'role' as "public"."Role"), 'student'::"public"."Role"),
                    'active',
                    v_school_id,
                    now(),
                    now()
                  );
                exception when others then
                  -- Silently ignore constraint violations
                  -- The application will handle User creation via upsert
                  null;
                end;
              end if;
              return new;
            end;
            $$;
        `)

        // Trigger attachment
        await prisma.$executeRawUnsafe(`
            drop trigger if exists on_auth_user_created on auth.users;
        `)

        await prisma.$executeRawUnsafe(`
            create trigger on_auth_user_created
              after insert on auth.users
              for each row execute procedure public.handle_new_user();
        `)

        console.log('Trigger Deployed. Enabling RLS on User table...')

        await prisma.$executeRawUnsafe(`
            ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
        `)

        await prisma.$executeRawUnsafe(`
            DROP POLICY IF EXISTS "Users can view own profile" ON public."User";
        `)

        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can view own profile" 
            ON public."User" FOR SELECT 
            USING ( "authUserId" = auth.uid()::text );
        `)

        await prisma.$executeRawUnsafe(`
            DROP POLICY IF EXISTS "Users can update own profile" ON public."User";
        `)

        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can update own profile" 
            ON public."User" FOR UPDATE
            USING ( "authUserId" = auth.uid()::text );
        `)

        console.log('✅ Successfully applied all Auth triggers and RLS policies.')
    } catch (error) {
        console.error('❌ Migration failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
