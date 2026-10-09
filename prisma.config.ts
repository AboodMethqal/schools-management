import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },

  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
});


// Please do:
//before start your code.
// 1️⃣ git pull origin development
// 2️⃣ npx prisma generate
// 3️⃣ npx prisma migrate dev

// if add new schema or change in /prisma/schema.prisma then run this:
// npx prisma migrate dev --name add-student

// If you get drift/conflict error, run:

// npx prisma migrate reset


// if add new schema or change in /prisma/schema.prisma then run this:
// npx prisma migrate dev --name add-student
