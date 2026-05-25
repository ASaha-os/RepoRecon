/**
 * Puter.js AI integration
 * Free GPT-4o level AI — no API key, no backend needed.
 * Docs: https://docs.puter.com/AI/chat/
 */

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          prompt: string,
          options?: { model?: string; stream?: boolean }
        ) => Promise<{ message: { content: string } } | string>;
      };
    };
  }
}

export interface AnalysisData {
  summary: string;
  mermaid_code: string;
  detected_issues: string[];
  fix_recommendations: string[];
}

/** Ensure puter.js script is loaded exactly once */
function loadPuterScript(): Promise<void> {
  if (window.puter) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (document.getElementById("puter-script")) {
      // Already injected — wait for it
      const check = setInterval(() => {
        if (window.puter) { clearInterval(check); resolve(); }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.id = "puter-script";
    script.src = "https://js.puter.com/v2/";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load puter.js"));
    document.head.appendChild(script);
  });
}

/** Fetch README from GitHub (raw URL is CORS-friendly) */
export async function fetchReadme(repoUrl: string): Promise<string> {
  const clean = repoUrl.trim().replace(/\/$/, "");
  if (!clean.includes("github.com")) throw new Error("Invalid GitHub URL");

  const parts = clean.replace(/https?:\/\//, "").split("/");
  if (parts.length < 3) throw new Error("Invalid GitHub URL format");
  const [, owner, repo] = parts;

  for (const branch of ["main", "master"]) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const res = await fetch(url);
    if (res.ok) return res.text();
  }
  throw new Error(
    `Could not fetch README from ${repoUrl}. Make sure the repo is public and has a README.md.`
  );
}

/** Strip badges, images, license noise to save tokens */
function cleanReadme(text: string): string {
  return text
    .replace(/<!--.*?-->/gs, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/<img[^>]*\/?>/gi, "")
    .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, "")
    .replace(/https?:\/\/[^\s]*(?:badge|shield|shields\.io)[^\s)]*/gi, "")
    .replace(/#{1,6}\s*(?:License|Contributing|Changelog|Sponsor|Donate).*?(?=\n#|\s*$)/gis, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 3000); // keep well within token budget
}

/** Parse JSON out of an AI response that may have markdown fences */
function extractJson(raw: string): AnalysisData {
  let text = raw.trim();

  // Strip ```json ... ``` fences
  const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenced) text = fenced[1];

  // Find first { if still not clean
  const brace = text.indexOf("{");
  if (brace > 0) text = text.slice(brace);

  try {
    const parsed = JSON.parse(text);
    return {
      summary: String(parsed.summary ?? "No summary generated"),
      mermaid_code: String(
        parsed.mermaid_code ??
          "sequenceDiagram\n    participant User\n    participant App\n    User->>App: request\n    App-->>User: response"
      ),
      detected_issues: Array.isArray(parsed.detected_issues)
        ? parsed.detected_issues.map(String)
        : [],
      fix_recommendations: Array.isArray(parsed.fix_recommendations)
        ? parsed.fix_recommendations.map(String)
        : [],
    };
  } catch {
    // Last resort: regex extraction
    const summary = raw.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "Analysis complete";
    const mermaid = raw.match(/"mermaid_code"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1]
      ?.replace(/\\n/g, "\n") ??
      "sequenceDiagram\n    participant User\n    participant App\n    User->>App: request";
    return {
      summary,
      mermaid_code: mermaid,
      detected_issues: [],
      fix_recommendations: [],
    };
  }
}

/** Main entry point — analyse a GitHub repo using puter.js AI */
export async function analyzeRepo(repoUrl: string): Promise<AnalysisData> {
  await loadPuterScript();

  const readme = await fetchReadme(repoUrl);
  const cleaned = cleanReadme(readme);

  const prompt = `You are a senior software architect. Analyze this GitHub repository README and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

README:
${cleaned}

Return exactly this JSON structure:
{
  "summary": "2-3 sentence description of the architecture and tech stack",
  "mermaid_code": "sequenceDiagram\\n    participant User\\n    participant Frontend\\n    participant Backend\\n    User->>Frontend: opens app\\n    Frontend->>Backend: API request\\n    Backend-->>Frontend: response\\n    Frontend-->>User: renders result",
  "detected_issues": ["Specific issue 1", "Specific issue 2", "Specific issue 3"],
  "fix_recommendations": ["Actionable fix 1", "Actionable fix 2", "Actionable fix 3"]
}

Rules:
- mermaid_code must be a valid Mermaid sequenceDiagram with \\n for newlines
- detected_issues: real issues from the README (security, performance, docs, etc.)
- fix_recommendations: concrete, actionable improvements
- Return ONLY the JSON object, nothing else`;

  const result = await window.puter.ai.chat(prompt, { model: "gpt-4o-mini" });

  // puter.ai.chat returns either a string or {message: {content: string}}
  const raw =
    typeof result === "string"
      ? result
      : result?.message?.content ?? "";

  if (!raw) throw new Error("Empty response from AI");
  return extractJson(raw);
}

/** Ask a follow-up question about the codebase */
export async function askAboutRepo(
  question: string,
  context: AnalysisData,
  repoUrl: string
): Promise<string> {
  await loadPuterScript();

  const prompt = `You are a senior software architect who has analyzed the repository: ${repoUrl}

Here is what you know about it:
Summary: ${context.summary}
Issues found: ${context.detected_issues.join(", ") || "none"}
Recommendations: ${context.fix_recommendations.join(", ") || "none"}

Answer this question concisely and accurately:
${question}

Be specific and practical. If the answer isn't in the context, say so honestly.`;

  const result = await window.puter.ai.chat(prompt, { model: "gpt-4o-mini" });
  return typeof result === "string"
    ? result
    : result?.message?.content ?? "No response";
}
