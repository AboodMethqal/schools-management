import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const serializeExam = (exam) => ({
    ...exam,
    _id: exam?.id,
});

const toQuestionArray = (value) => (Array.isArray(value) ? value : []);

// ১. এক্সাম ক্রিয়েট করা
export async function POST(request) {
    try {
        const body = await request.json();
        const roomCode = String(body?.roomCode || '').trim();
        const roomTitle = String(body?.roomTitle || '').trim();
        const teacherEmail = String(body?.teacherEmail || '').trim().toLowerCase();

        if (!roomCode || !roomTitle || !teacherEmail) {
            return NextResponse.json({ success: false, error: "roomCode, roomTitle, and teacherEmail are required" }, { status: 400 });
        }

        const existing = await prisma.quizRoom.findUnique({
            where: { roomCode },
            select: { id: true },
        });

        if (existing) {
            return NextResponse.json({ success: false, error: "Room code already exists" }, { status: 409 });
        }

        const created = await prisma.quizRoom.create({
            data: {
                roomCode,
                roomTitle,
                teacherEmail,
                category: body?.category ? String(body.category) : null,
                currentClass: body?.currentClass ? String(body.currentClass) : null,
                duration: body?.duration ? String(body.duration) : null,
                exam: Boolean(body?.exam),
                schoolId: body?.schoolId ? String(body.schoolId) : null,
                questions: toQuestionArray(body?.questions),
                payload: body,
                createdAt: body?.createdAt ? new Date(body.createdAt) : new Date(),
            },
        });

        return NextResponse.json({ success: true, message: "Room created successfully", id: created.id });
    } catch (error) {
        return NextResponse.json({ success: false, error: error?.message || "Failed to create exam room" }, { status: 500 });
    }
}

// ২. এক্সাম রিড করা (কোড দিয়ে অথবা টিচার ইমেইল দিয়ে)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const roomCode = searchParams.get("roomCode");
        const email = searchParams.get("email");
        const studentEmail = searchParams.get("studentEmail");

        if (roomCode) {
            const exam = await prisma.quizRoom.findUnique({ where: { roomCode } });
            return NextResponse.json({ success: true, data: exam ? [serializeExam(exam)] : [] });
        }

        // স্টুডেন্ট যখন রুম কোড দিয়ে জয়েন করার চেষ্টা করবে
        if (code) {
            const exam = await prisma.quizRoom.findUnique({ where: { roomCode: code } });

            // ১. রুম কোড ভুল হলে
            if (!exam) {
                return NextResponse.json({ success: false, message: "Invalid Room Code" }, { status: 404 });
            }

            // ২. রুম যদি টিচার এক্টিভেট না করে (exam: false)
            // আপনার এরর ৪0৩ এখান থেকেই আসছে। টিচারকে বলুন ড্যাশবোর্ড থেকে Start Exam দিতে।
            if (exam.exam === false || exam.exam === undefined) {
                return NextResponse.json({
                    success: false,
                    message: "This room is currently inactive. Please wait for your teacher to start the exam."
                }, { status: 403 });
            }

            // ৩. স্টুডেন্ট আগে পরীক্ষা দিয়েছে কি না চেক করা
            if (studentEmail) {
                const alreadySubmitted = await prisma.quizSubmission.findUnique({
                    where: {
                        roomCode_studentEmail: {
                            roomCode: code,
                            studentEmail,
                        },
                    },
                    select: { id: true },
                });
                if (alreadySubmitted) {
                    return NextResponse.json({
                        success: false,
                        message: "Access Denied! You have already submitted this exam once."
                    }, { status: 400 });
                }
            }

            // সব ঠিক থাকলে প্রশ্ন পাঠানো (উত্তর ছাড়া)
            const safeQuestions = toQuestionArray(exam.questions).map((question) => {
                const { correctAnswer, ...rest } = question;
                void correctAnswer;
                return rest;
            });
            return NextResponse.json({
                success: true,
                exam: serializeExam({ ...exam, questions: safeQuestions })
            });
        }

        // টিচারের জন্য ইমেইল ফিল্টার
        if (email) {
            const exams = await prisma.quizRoom.findMany({
                where: { teacherEmail: email.toLowerCase() },
                orderBy: { createdAt: "desc" },
            });
            return NextResponse.json({ success: true, data: exams.map(serializeExam) });
        }

        const exams = await prisma.quizRoom.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json({ success: true, data: exams.map(serializeExam) });

    } catch (error) {
        return NextResponse.json({ success: false, error: error?.message || "Failed to fetch exams" }, { status: 500 });
    }
}

// ৩. এক্সাম ডিলিট করা
// আপনার বর্তমান DELETE মেথডটি এভাবে আপডেট করুন
// আপনার এপিআই এর DELETE মেথডটি নিচের মতো হবে
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const deleteAll = searchParams.get("all"); // 'all' প্যারামিটার চেক

        // ১. সব ডিলিট করার লজিক
        if (deleteAll === "true") {
            await prisma.quizSubmission.deleteMany({});
            await prisma.quizRoom.deleteMany({});
            return NextResponse.json({ success: true, message: "All records cleared!" });
        }

        // ২. সিঙ্গেল ডিলিট লজিক
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const deleted = await prisma.quizRoom.deleteMany({ where: { id } });
        await prisma.quizSubmission.deleteMany({ where: { questionID: id } });

        if (deleted.count === 0) {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Exam deleted" });

    } catch (error) {
        return NextResponse.json({ success: false, error: error?.message || "Failed to delete exam" }, { status: 500 });
    }
}



// ৪. এক্সাম স্ট্যাটাস আপডেট করা (Toggle exam: true/false)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, exam } = body; // ফ্রন্টএন্ড থেকে id এবং নতুন status (true/false) পাঠানো হবে

        if (!id || typeof exam !== 'boolean') {
            return NextResponse.json({ success: false, message: "Valid id and exam(boolean) are required" }, { status: 400 });
        }

        const result = await prisma.quizRoom.updateMany({
            where: { id },
            data: { exam },
        });

        if (result.count === 1) {
            return NextResponse.json({ success: true, message: "Status updated successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error?.message || "Failed to update exam status" }, { status: 500 });
    }
}
