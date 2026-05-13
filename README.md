# DISHA AI Doubt Resolution Portal 🚀

DISHA is an intelligent, student-facing web portal designed to instantly resolve academic programming doubts. Moving beyond traditional webhooks and text-only bots, this platform features a direct, interactive UI built with **Next.js 15**, **Prisma (SQLite)**, and the **Google Gemini 2.5 Flash Vision AI**.

With a beautiful dark-mode cyberpunk aesthetic, students can submit code issues, drag-and-drop screenshots or architectural diagrams, and receive highly detailed, structured, and empathetic responses in seconds.

## ✨ Features

- **Modern Cyberpunk UI**: A highly responsive, glassmorphic dark-mode interface built with Tailwind CSS.
- **Multimodal Drag & Drop**: Easily drag-and-drop images (JPG, PNG, WEBP) and text files directly into the portal for visual debugging.
- **Gemini Vision Integration**: Powered by Google's `gemini-2.5-flash` model via the Vercel AI SDK, capable of analyzing code snippets alongside uploaded screenshots.
- **Adaptive Skill Levels**: The AI customizes its language, analogies, and complexity based on the student's selected learning stage (Beginner, Intermediate, Advanced).
- **Automated Escalation Logic**: Safely escalates queries to human mentors if the doubt requires infrastructure access, live production credentials, or falls below confidence thresholds.
- **Persistent Database Logging**: All doubts, inputs, uploads context, and AI resolutions are securely logged using Prisma ORM.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (Node.js)
- **Database**: SQLite, Prisma ORM
- **AI Integration**: Vercel AI SDK (`@ai-sdk/google`), Zod (Structured Outputs)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chnadu07/AI-Doubt-Agent.git
   cd AI-Doubt-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Open the `.env` file and insert your Gemini API Key:
   ```env
   DATABASE_URL="file:./dev.db"
   GOOGLE_GENERATIVE_AI_API_KEY="your_api_key_here"
   ```

4. **Initialize Database**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start asking doubts!

## 📸 How it Works

1. **Input Details**: Enter your name and select your skill level.
2. **Describe Doubt**: Paste your broken code, error log, or architectural question.
3. **Attach Visuals**: Drag and drop a screenshot of the error or platform interface.
4. **Submit**: Watch the portal process the multimodal data and generate a clear, step-by-step resolution.

---
*Built to empower students and unblock them in under 2 minutes.*
