"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

/* ── Inline math renderer ─────────────────── */
function renderInline(str: string) {
  // Matches inline math $...$ first (not followed or preceded by space to prevent currency mismatches),
  // then bold **...**, code `...`, and italic *...*
  return str.split(/(\$(?!\s)[^$\n]+(?<!\s)\$|\*\*.*?\*\*|`.*?`|\*.*?\*)/g).map((p, i) => {
    if (p.startsWith("$") && p.endsWith("$")) {
      const expr = p.slice(1, -1);
      let html = "";
      try {
        html = katex.renderToString(expr, {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        html = `<span class="math-error">${expr}</span>`;
      }
      return (
        <span
          key={i}
          className="math-inline"
          style={{
            padding: "0 2px",
            color: "#a5b4fc",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    if (p.startsWith("**") && p.endsWith("**"))
      return (
        <strong key={i} style={{ color: "#f1f5f9", fontWeight: 600 }}>
          {p.slice(2, -2)}
        </strong>
      );
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("*") && p.endsWith("*"))
      return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

/* ── Block math renderer ──────────────────── */
function BlockMath({ math }: { math: string }) {
  let html = "";
  try {
    html = katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
    });
  } catch (err) {
    html = `<span class="math-error">${math}</span>`;
  }
  return (
    <div
      className="math-block"
      style={{
        margin: "18px 0",
        padding: "16px",
        background: "rgba(99, 102, 241, 0.04)",
        border: "1px solid rgba(99, 102, 241, 0.1)",
        borderRadius: "12px",
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        boxShadow: "inset 0 0 12px rgba(0, 0, 0, 0.2)",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ── Code block with copy ─────────────────── */
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block">
      <div className="code-header">
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#64748b" }}>
          {lang || "code"}
        </span>
        <button className="copy-btn" onClick={copy}>
          {copied ? (
            <><Check style={{ width: 11, height: 11 }} />Copied</>
          ) : (
            <><Copy style={{ width: 11, height: 11 }} />Copy</>
          )}
        </button>
      </div>
      <div className="code-content">{code}</div>
    </div>
  );
}

/* ── Full markdown renderer ───────────────── */
export function renderMd(text: string) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      const lang = codeMatch[1];
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      out.push(<CodeBlock key={i} code={codeLines.join("\n")} lang={lang} />);
      i++;
      continue;
    }

    // Fenced Block Math
    if (line.trim().startsWith("$$")) {
      // If it's a single-line block math
      if (line.trim().endsWith("$$") && line.trim().length > 2) {
        const expr = line.trim().slice(2, -2).trim();
        out.push(<BlockMath key={i} math={expr} />);
        i++;
        continue;
      }

      // Multi-line block math
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("$$")) {
        mathLines.push(lines[i]);
        i++;
      }
      out.push(<BlockMath key={i} math={mathLines.join("\n")} />);
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### "))
      out.push(<h3 key={i}>{renderInline(line.slice(4))}</h3>);
    else if (line.startsWith("## "))
      out.push(<h2 key={i}>{renderInline(line.slice(3))}</h2>);
    else if (line.startsWith("# "))
      out.push(<h1 key={i}>{renderInline(line.slice(2))}</h1>);
    // Blockquote
    else if (line.startsWith("> "))
      out.push(<blockquote key={i}>{renderInline(line.slice(2))}</blockquote>);
    // Horizontal rule
    else if (line.match(/^(-{3,}|\*{3,}|_{3,})$/))
      out.push(<hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "12px 0" }} />);
    // Bullet list
    else if (line.match(/^[\*\-]\s/))
      out.push(
        <li key={i}>
          <span style={{ marginTop: 2 }}>{renderInline(line.slice(2))}</span>
        </li>
      );
    // Numbered list
    else if (line.match(/^\d+\.\s/)) {
      const m = line.match(/^(\d+)\.\s/)!;
      out.push(
        <li key={i} style={{ gap: 10 }}>
          <span style={{ color: "#6366f1", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
            {m[1]}.
          </span>
          <span>{renderInline(line.slice(m[0].length))}</span>
        </li>
      );
    }
    // Empty line
    else if (!line.trim())
      out.push(<div key={i} style={{ height: 8 }} />);
    // Regular paragraph
    else
      out.push(<p key={i}>{renderInline(line)}</p>);

    i++;
  }
  return out;
}

/* ── Streaming typewriter with cursor ─────── */
export function StreamingText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  return (
    <div className="prose-ai">
      {renderMd(text)}
      {isStreaming && <span className="cursor-blink" />}
    </div>
  );
}
