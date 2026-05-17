import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { processDoubt, DoubtInput } from "@/lib/ai";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const input: DoubtInput = {
      studentName: body.studentName || "Student",
      skillLevel: body.skillLevel || "Beginner",
      currentModule: "General",
      weekNumber: 1,
      totalWeeks: 12,
      doubtText: body.doubtText || "",
      files: body.files || [],
      channel: "Direct Frontend",
      history: body.history || [],
    };

    // Log the doubt
    const dbDoubt = await prisma.doubt.create({
      data: {
        studentName: input.studentName,
        skillLevel: input.skillLevel,
        currentModule: input.currentModule,
        weekNumber: input.weekNumber,
        doubtText: input.doubtText,
        screenshotDescription: input.files ? `Uploaded ${input.files.length} file(s)` : null,
        channel: input.channel,
        status: "pending",
      },
    });

    // Process via AI Agent
    const aiResponse = await processDoubt(input);

    // Update DB with resolution
    await prisma.doubt.update({
      where: { id: dbDoubt.id },
      data: {
        responseText: aiResponse.response_text,
        rootCause: aiResponse.root_cause,
        resolutionConfidence: aiResponse.resolution_confidence,
        conceptLink: aiResponse.concept_link,
        codeSnippet: aiResponse.code_snippet,
        escalationFlag: aiResponse.escalation_flag,
        escalationReason: aiResponse.escalation_reason,
        status: aiResponse.escalation_flag ? "escalated" : "resolved",
      },
    });

    return NextResponse.json({ success: true, aiResponse });
  } catch (error) {
    console.error("Resolve API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
