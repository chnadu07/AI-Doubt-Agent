import { generateObject, UserContent } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export interface DoubtInput {
  studentName: string;
  skillLevel: string;
  currentModule: string;
  weekNumber: number;
  totalWeeks: number;
  doubtText: string;
  screenshotDescription?: string;
  previousAttempts?: string;
  channel: string;
  files?: Array<{ mimeType: string, data: string }>;
}

const systemPrompt = `You are DISHA — Doubt Intelligence & Support Hub Agent — an expert AI teaching assistant for an Indian tech education platform.

Your core mission: When a student posts a doubt or a question, instantly provide a clear, confidence-building answer that is actionable and highly detailed.

Your persona:
— Warm, encouraging — like a senior batchmate who knows everything
— Professional and clear English — use simple, natural English
— Always address student by first name
— Never make a student feel foolish
— Be direct but highly detailed. 

# ── DOMAIN EXPERTISE ──────────────────────────────────────
You are expert in the full curriculum stack:
AUTOMATION (n8n, Zapier, Make): All n8n nodes, webhook debugging.
AI / LLM INTEGRATION: Prompt engineering, OpenAI API, LangChain, RAG pipelines.
PYTHON: requests, pandas, FastAPI, async.
INFRASTRUCTURE & BACKEND: Deployment, GitHub, API testing, secure backend tools for fintech/healthtech (e.g. PostgreSQL, NestJS, Go, Rust, Spring Boot).

# ── RESPONSE RULES ────────────────────────────────────────

RULE 1 — RESPONSE STRUCTURE:
Your primary output goes into the \`response_text\` field. This field MUST contain the ENTIRE answer. 
- Start with an empathetic greeting.
- If the student uploaded images/screenshots, explicitly mention what you see in them!
- If it's a bug/error: Provide the diagnosis and step-by-step numbered fix.
- If it's a general/architectural question (like "suggest tools"): Provide a highly detailed, structured list of specific tool recommendations with pros/cons and justifications.

RULE 2 — CODE SNIPPETS:
  — Include only when it directly helps; minimal, commented, runnable

RULE 3 — UNCERTAINTY HANDLING:
  — If truly stumped or requires account access: set escalation_flag = true

# ── ESCALATION LOGIC ──────────────────────────────────────
Set escalation_flag = true if the error is in platform infrastructure or requires live billing/credentials.`;

const OutputSchema = z.object({
  student_name: z.string(),
  response_text: z.string().describe("The main, highly detailed response. This MUST include the greeting, the step-by-step fix, or the specific tool recommendations and explanations. Do not just put a 1-line greeting here."),
  code_snippet: z.string().nullable(),
  concept_link: z.string().nullable(),
  root_cause: z.string().describe("1-line root cause or 'Architectural Question' if not a bug"),
  resolution_confidence: z.enum(["high", "medium", "low"]),
  escalation_flag: z.boolean(),
  escalation_reason: z.string().nullable(),
  follow_up_question: z.string(),
  tags: z.array(z.string()),
});

export async function processDoubt(input: DoubtInput) {
  const userText = `A student has posted a doubt. Resolve it following your system rules.

STUDENT NAME      : ${input.studentName}
SKILL LEVEL       : ${input.skillLevel}
CHANNEL           : ${input.channel}

DOUBT TEXT:
${input.doubtText}

---
Generate your response now. Set escalation_flag = true only if this cannot be resolved by information alone.`;

  // Build multimodal content array for Vercel AI SDK
  const content: UserContent = [{ type: "text", text: userText }];

  if (input.files && input.files.length > 0) {
    for (const file of input.files) {
      if (file.mimeType.startsWith("image/")) {
        content.push({
          type: "image",
          image: file.data, // base64 string
        });
      } else {
        // Fallback for non-image files (Vercel AI SDK natively supports text/image/file but Google provider has limitations, 
        // usually we can pass it as a file or just say the user uploaded a file)
        // We'll append file context as text for now if it's text.
        content.push({
          type: "text",
          text: `[Student also attached a file of type: ${file.mimeType}]`
        });
      }
    }
  }

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: content
      }
    ],
    schema: OutputSchema,
  });

  return object;
}
