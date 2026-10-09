import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

const serializeResult = (result) => ({
    ...result,
    _id: result?.id,
});

const toQuestionArray = (value) => (Array.isArray(value) ? value : []);

export async function POST(request) {
    try {
        const { roomCode, studentAnswers, studentEmail, studentName, questionID, schoolId } = await request.json();

        if (!roomCode || !studentAnswers || !studentEmail || !studentName) {
            return NextResponse.json({ success: false, message: "roomCode, studentAnswers, studentEmail and studentName are required" }, { status: 400 });
        }

        const currentUser = await getCurrentUser();

        // ডাটাবেস থেকে আসল উত্তরসহ এক্সাম ডাটা আনা
        const exam = await prisma.quizRoom.findUnique({ where: { roomCode } });

        if (!exam) return NextResponse.json({ success: false, message: "Exam room not found" }, { status: 404 });

        const examQuestionId = questionID || exam.id;
        const alreadySubmitted = await prisma.quizSubmission.findUnique({
            where: {
                roomCode_studentEmail: {
                    roomCode,
                    studentEmail,
                },
            },
            select: { id: true },
        });

        if (alreadySubmitted) {
            return NextResponse.json({ success: false, message: "You already submitted this exam" }, { status: 400 });
        }

        // সঠিক উত্তরের সাথে স্টুডেন্টের উত্তরের তুলনা (Mark calculation)
        let totalMark = 0;
        const questions = toQuestionArray(exam.questions);
        questions.forEach((q) => {
            if (studentAnswers[q.id] === q.correctAnswer) {
                totalMark += 1;
            }
        });

        // রেজাল্ট অবজেক্ট তৈরি
        const resultDoc = {
            questionID: examQuestionId,
            studentName,
            studentEmail,
            schoolId: currentUser?.schoolId ?? schoolId ?? exam.schoolId ?? null,
            examSubject: exam.roomTitle,
            teacherEmail: exam.teacherEmail,
            roomCode,
            totalMark,
            totalQuestions: questions.length,
            studentAnswers,
            submittedAt: new Date()
        };

        // ডাটাবেসে সেভ করা
        await prisma.quizSubmission.create({ data: resultDoc });

        return NextResponse.json({
            success: true,
            score: totalMark,
            total: questions.length
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}



// আপনার বর্তমান POST মেথডের নিচে এটি যোগ করুন
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email"); // স্টুডেন্ট ইমেইল
        const teacherEmail = searchParams.get("teacherEmail"); // টিচার ইমেইল
        const questionID = searchParams.get("questionID");
        const roomCode = searchParams.get("roomCode");
        const scope = searchParams.get("scope");

        const query = {};
        if (email) query.studentEmail = email;
        if (teacherEmail) query.teacherEmail = teacherEmail.toLowerCase();
        if (questionID) query.questionID = questionID;
        if (roomCode) query.roomCode = roomCode;

        // Teacher dashboard MCQ Results: only show results from the teacher's school.
        if (scope === "teacherSchool") {
            const currentUser = await getCurrentUser();

            if (!currentUser) {
                return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
            }

            if (!currentUser.schoolId) {
                return NextResponse.json({ success: false, message: "Teacher school is not configured" }, { status: 400 });
            }

            query.schoolId = currentUser.schoolId;
        }

        const results = await prisma.quizSubmission.findMany({
            where: query,
            orderBy: { submittedAt: "desc" },
        });

        return NextResponse.json({ success: true, data: results.map(serializeResult) });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}




// আপনার বিদ্যমান GET মেথডের নিচে এটি যোগ করুন
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const deleteAll = searchParams.get("all");

        // সব রেজাল্ট ডিলিট করার জন্য
        if (deleteAll === "true") {
            await prisma.quizSubmission.deleteMany({});
            return NextResponse.json({ success: true, message: "All results cleared" });
        }

        // সিঙ্গেল রেজাল্ট ডিলিট করার জন্য
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        await prisma.quizSubmission.deleteMany({ where: { id } });
        return NextResponse.json({ success: true, message: "Result deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
