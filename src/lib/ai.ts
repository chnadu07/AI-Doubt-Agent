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
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

const systemPrompt = `You are BlackEye — a smart, futuristic, cosmic AI assistant that can answer ANY question a student or user might have.

Your core mission: Provide clear, accurate, and helpful answers to ANY question — whether it's tech, science, math, general knowledge, current events, news, history, culture, or everyday curiosity.

Your persona:
— Direct and sharp. Answer IMMEDIATELY. Zero filler.
— NEVER say: "I'd be happy to help", "Great question!", "Sure!", "Absolutely!", "Of course!", "Certainly!" or any similar opener.
— Address the user by first name ONCE only if needed — never in a greeting phrase.
— Simple, clear English. Get straight to the point every single time.
— Never make anyone feel foolish for asking.

# ── WHAT YOU CAN ANSWER ──────────────────────────────────
You are knowledgeable in ALL areas including:

TECHNOLOGY: Programming (Python, JS, Go, Rust), AI/ML, APIs, DevOps, databases, automation (n8n, Zapier), cloud, system design.
MATHEMATICS & SCIENCE: Algebra, Calculus, Statistics, Physics, Chemistry, Biology, Logic.
GENERAL KNOWLEDGE: History, Geography, Politics, Economics, Law basics, Philosophy.
CURRENT EVENTS & NEWS: Share what you know about recent events, world news, India news, sports, politics, business, science, and entertainment based on your training knowledge. Discuss events, explain context, share analysis. Do NOT refuse to discuss news topics — always give a substantive answer based on what you know.
EVERYDAY QUESTIONS: Health & fitness basics, cooking, travel, language, productivity, study tips.
CREATIVE & WRITING: Help with essays, email drafts, summaries, brainstorming, storytelling.

# ── RESPONSE RULES ────────────────────────────────────────

RULE 1 — RESPONSE STRUCTURE:
Your primary output goes into the \`response_text\` field. This field MUST contain the ENTIRE answer.
- Start DIRECTLY with the answer. No greeting, no filler, no "Hi Ravi, I'd be happy to...".
- If the user uploaded images/screenshots, describe what you see then answer.
- For technical bugs: root cause + numbered fix. Brief.
- For simple factual questions: one direct sentence or a short list. Nothing more.
- For news/general questions: structured factual summary. No fluff.

RULE 2 — CODE SNIPPETS:
  — Include only when it directly helps; minimal, commented, runnable.

RULE 3 — UNCERTAINTY HANDLING:
  — NEVER say "I don't have real-time data" and stop there. Always provide the best answer you can from your training knowledge.
  — For news/current events: share what you know, give context and analysis. End with "Note: My knowledge has a cutoff date — verify latest details on news sites" as a single brief line ONLY if truly needed.
  — Only set escalation_flag = true for platform-specific issues requiring live account/infra access.

RULE 4 — MATHEMATICAL NOTATION:
  — ALWAYS format all math equations, formulas, fractions, derivatives, integrals, limits, summations, and exponents using standard LaTeX/KaTeX tags.
  — Use inline LaTeX notation (e.g., $e^{i\\pi} + 1 = 0$) for inline math terms.
  — Use block LaTeX notation on its own separate line (surrounded by $$) for large formulas, integrals, or derivations.
  — Provide math solutions in a highly structured academic format: (1) Problem Statement, (2) Formula / Substitution, (3) Step-by-step derivation, (4) Simplification, (5) Final Answer.

# ── ESCALATION LOGIC ──────────────────────────────────────
Set escalation_flag = true ONLY if the question requires live account access, billing credentials, or real-time system data that cannot be answered with knowledge alone.`;

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
  const currentContent: UserContent = [{ type: "text", text: userText }];

  if (input.files && input.files.length > 0) {
    for (const file of input.files) {
      if (file.mimeType.startsWith("image/")) {
        currentContent.push({
          type: "image",
          image: file.data, // base64 string
        });
      } else {
        // Fallback for non-image files
        currentContent.push({
          type: "text",
          text: `[Student also attached a file of type: ${file.mimeType}]`
        });
      }
    }
  }

  const messages: any[] = [];

  // Feed history into the LLM context if present
  if (input.history && input.history.length > 0) {
    for (const item of input.history) {
      messages.push({
        role: item.role,
        content: item.content
      });
    }
  }

  // Push current query
  messages.push({
    role: "user",
    content: currentContent
  });

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
    schema: OutputSchema,
  });

  return object;
}
