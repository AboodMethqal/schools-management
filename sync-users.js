"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
// List of orphaned auth users that need DB records
const usersToSync = [
    { authUserId: '263de00b-3d11-45d2-86c8-d815b2730709', email: 'test_admin@demo.methqal.tech', name: 'Test Admin', role: 'admin' },
];
async function main() {
    try {
        // Find any valid school to attach these users to temporarily
        const school = await prisma.school.findFirst();
        if (!school)
            throw new Error("No schools found in DB!");
        console.log(`Using school: ${school.schoolName} (${school.id})`);
        for (const u of usersToSync) {
            const user = await prisma.user.upsert({
                where: { email: u.email },
                update: { authUserId: u.authUserId, role: u.role, schoolId: school.id },
                create: { authUserId: u.authUserId, email: u.email, name: u.name, role: u.role, status: 'active', schoolId: school.id }
            });
            console.log(`✅ Synced: ${user.email} → ${user.role}`);
        }
    }
    catch (e) {
        console.error("❌ Error:", e);
    }
    finally {
        await pool.end();
    }
}
main();
