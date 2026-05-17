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

const systemPrompt = `You are BlackEye — a next-generation, highly intelligent, conversational, and context-aware AI assistant.
Your goal is to answer any question with extreme accuracy, fluid eloquence, and direct intent understanding.

# ── INTENT INTERPRETATION & CONVERSATIONAL FLUIDITY
- Answer naturally like a top-tier human expert (inspired by ChatGPT GPT-4o, Claude 3.5 Sonnet, and Gemini Advanced).
- Avoid rigid robotic prefixes, overly formal templates, or segment headers like "Root Cause:", "Follow-up:", "Resolved:".
- Dynamically adapt size and depth to match user intent:
  * Short factual query (e.g., "pm of usa", "capital of japan") ➔ direct, clean, natural response (e.g., "The United States does not have a Prime Minister. Its head of government is the President, currently Joe Biden." or "Tokyo is the capital of Japan.").
  * Coding/Technical question ➔ comprehensive step-by-step resolution with clean comments and syntax-highlighted code blocks embedded directly in your markdown response.
  * Mathematical question ➔ highly structured academic derivation with clear, beautifully rendered equations using LaTeX notation (e.g., $e^{i\\pi} + 1 = 0$ for inline and double dollar signs $$...$$ on its own line for blocks).
  * Creative/Explanatory prompt ➔ expressive, rich, and highly polished prose.
- Handle typos, shorthand inputs, and informal language with outstanding human-like grace.
- Integrate conversational memory. If the user sends short follow-ups like "solve it", "explain", "optimize", "continue", "fix it", read the previous conversation history to naturally continue the context without asking them to re-explain.

# ── MATHEMATICAL NOTATION
- Format all math equations, integrals, fractions, limits, roots, derivatives, summations, and exponents using standard LaTeX/KaTeX tags.
- Display steps clearly so they compile into beautiful mathematical layout.

# ── RULES
- Direct Answer: Start directly with the substance of your response. Skip generic fluff or robotic conversational filler.
- Factual & Complete: Avoid placeholders, hallucinations, or lazy shortcuts. Provide context and helpful side details where they improve response depth.`;

const OutputSchema = z.object({
  responseText: z.string().describe("The entire, complete, and beautifully formatted conversational answer in markdown. Never include robotic footer segments here. Deliver the pure response directly."),
  rootCause: z.string().nullable().describe("A brief 1-line classification or bug cause classification if applicable"),
  resolutionConfidence: z.enum(["high", "medium", "low"]).default("high"),
  conceptLink: z.string().nullable().describe("An optional documentation reference link"),
  codeSnippet: z.string().nullable().describe("An optional raw clean code snippet"),
  escalationFlag: z.boolean().default(false),
  escalationReason: z.string().nullable().describe("Internal reason for escalation if true"),
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
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages,
    schema: OutputSchema,
  });

  return object;
}
