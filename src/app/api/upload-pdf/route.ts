import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: "GEMINI_API_KEY is missing from environment variables." },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
Extract the student data from the attached PDF document.
Return a JSON array of objects representing the students.
Each object MUST have the following strict keys:
"registrationNo" (string)
"firstName" (string)
"lastName" (string, optional)
"dateOfBirth" (string, YYYY-MM-DD format)
"gender" (string)
"bloodGroup" (string, optional)
"religion" (string, optional)
"currentClass" (string)
"section" (string)
"rollNo" (number or string)
"session" (string)
"fatherName" (string)
"motherName" (string)
"guardianPhone" (string)
"emergencyContact" (string, optional)
"email" (string, optional)
"presentAddress" (string)
"permanentAddress" (string, optional)

If any data is missing for a field, provide an empty string "" or null.
Return ONLY valid JSON without any markdown formatting like \`\`\`json.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: "application/pdf",
                            },
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text || "";
        let parsedData = [];
        try {
            parsedData = JSON.parse(text);
        } catch (err) {
            // fallback generic cleanup if schema wrapping occurred
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            parsedData = JSON.parse(cleanText);
        }

        if (!Array.isArray(parsedData)) {
            // If it returns a single object containing an array, try to extract it
            if (parsedData.students && Array.isArray(parsedData.students)) {
                parsedData = parsedData.students;
            } else {
                parsedData = [parsedData];
            }
        }

        return NextResponse.json({ success: true, count: parsedData.length, data: parsedData });

    } catch (error: any) {
        console.error("PDF processing error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process PDF" },
            { status: 500 }
        );
    }
}
