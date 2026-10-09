import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.schoolId) return NextResponse.json({ error: "No school found" });

        const school = await prisma.school.findUnique({
            where: { id: user.schoolId },
            include: {
                subscriptions: true
            }
        });

        const allSubs = await prisma.subscription.findMany();

        return NextResponse.json({
            userEmail: user.email,
            schoolId: user.schoolId,
            schoolFound: !!school,
            subscriptionsCount: school?.subscriptions?.length || 0,
            subscriptions: school?.subscriptions,
            allEntriesInDb: allSubs.length,
            allEntries: allSubs
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
