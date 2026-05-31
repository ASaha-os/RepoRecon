/**
 * Puter.js AI integration
 * Free GPT-4o level AI — no API key, no backend needed.
 * Docs: https://docs.puter.com/AI/chat/
 */

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
      // Already injected — wait for it (with a 15s timeout)
      let elapsed = 0;
      const check = setInterval(() => {
        elapsed += 100;
        if (window.puter) { clearInterval(check); resolve(); }
        if (elapsed > 15000) { clearInterval(check); reject(new Error("Puter.js failed to load (timeout)")); }
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

/** Timeout wrapper — rejects after `ms` milliseconds */
function withTimeout<T>(promise: Promise<T>, ms: number, label = "Operation"): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s. Please try again.`)), ms);
    promise
      .then((v) => { clearTimeout(timer); resolve(v); })
      .catch((e) => { clearTimeout(timer); reject(e); });
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
    .slice(0, 4000); // keep well within token budget
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

  // Find last } and trim
  const lastBrace = text.lastIndexOf("}");
  if (lastBrace > 0) text = text.slice(0, lastBrace + 1);

  try {
    const parsed = JSON.parse(text);
    return {
      summary: String(parsed.summary ?? "No summary generated"),
      mermaid_code: String(
        parsed.mermaid_code ??
          "flowchart TD\n    A[User] --> B[Application]\n    B --> C[Response]"
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
      "flowchart TD\n    A[User] --> B[Application]\n    B --> C[Response]";
    return {
      summary,
      mermaid_code: mermaid,
      detected_issues: [],
      fix_recommendations: [],
    };
  }
}

/** Internal: make a single AI call with timeout */
async function callAI(prompt: string, timeoutMs = 60000): Promise<string> {
  await loadPuterScript();

  const result = await withTimeout(
    window.puter.ai.chat(prompt, { model: "gpt-4o" }),
    timeoutMs,
    "AI analysis"
  );

  const raw =
    typeof result === "string"
      ? result
      : result?.message?.content ?? "";

  if (!raw) throw new Error("Empty response from AI");
  return raw;
}

/** Main entry point — analyse a GitHub repo using puter.js AI */
export async function analyzeRepo(repoUrl: string): Promise<AnalysisData> {
  const readme = await fetchReadme(repoUrl);
  const cleaned = cleanReadme(readme);

  const prompt = `You are a principal software architect with 20+ years of experience conducting thorough code audits. Analyze this GitHub repository README and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

README:
${cleaned}

Return exactly this JSON structure:
{
  "summary": "A detailed 4-6 sentence architectural overview covering: the project's purpose, its primary tech stack (languages, frameworks, databases), the overall system architecture pattern (monolith, microservices, serverless, etc.), key modules/layers, how data flows through the system, and any notable design decisions or trade-offs.",
  "mermaid_code": "A detailed Mermaid flowchart using 'flowchart TD' syntax. Include: subgraph blocks for major layers (e.g., 'subgraph Frontend', 'subgraph Backend', 'subgraph Database', 'subgraph External Services'). Include at least 8-12 nodes with descriptive labels. Use decision diamonds where appropriate (e.g., '{Auth Valid?}'). Show data flow directions with labeled arrows (e.g., '-->|REST API|'). Use \\n for newlines. DO NOT use sequenceDiagram — use flowchart TD only.",
  "detected_issues": ["Issue 1: [Category] — Detailed description of the vulnerability or problem, including its potential impact on production systems and affected components", "Issue 2: ...", "... at least 6-8 detailed issues covering security vulnerabilities, performance bottlenecks, scalability concerns, code quality problems, missing error handling, documentation gaps, dependency risks, and deployment concerns"],
  "fix_recommendations": ["Recommendation 1: [Priority: Critical/High/Medium] — Detailed, actionable step-by-step fix including specific technologies, patterns, or libraries to use, and the expected improvement", "Recommendation 2: ...", "... at least 6-8 detailed, actionable recommendations with priority levels, each containing specific implementation guidance"]
}

CRITICAL RULES:
- mermaid_code MUST start with 'flowchart TD' (NOT sequenceDiagram)
- mermaid_code MUST use \\n for newlines
- mermaid_code MUST contain subgraph blocks for each architectural layer
- mermaid_code MUST have at least 8 nodes with descriptive labels
- detected_issues MUST have at least 6 entries, each being a detailed paragraph
- fix_recommendations MUST have at least 6 entries, each with a priority level and detailed implementation steps
- summary MUST be 4-6 sentences covering architecture, tech stack, and design patterns
- Return ONLY the JSON object, nothing else`;

  // Try up to 2 times
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callAI(prompt, 90000);
      return extractJson(raw);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === 0) {
        // Wait a moment before retrying
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  throw lastError ?? new Error("Analysis failed after retries");
}

/** Ask a follow-up question about the codebase */
export async function askAboutRepo(
  question: string,
  context: AnalysisData,
  repoUrl: string
): Promise<string> {
  const prompt = `You are a principal software architect and senior security engineer who has conducted a thorough audit of the repository: ${repoUrl}

Here is your comprehensive analysis:
Architecture Summary: ${context.summary}
Known Issues: ${context.detected_issues.join(" | ") || "none identified"}
Existing Recommendations: ${context.fix_recommendations.join(" | ") || "none yet"}

The developer is asking: "${question}"

Provide a detailed, architect-grade response following this structure:

1. **Direct Answer**: Address the question head-on with specifics
2. **Technical Deep-Dive**: Explain the underlying architecture, patterns, and trade-offs involved
3. **Security & Risk Assessment**: Highlight any security implications or vulnerabilities related to the question
4. **Actionable Recommendations**: Provide concrete, step-by-step improvements with specific technologies/patterns to use
5. **Priority & Impact**: Rate the urgency and expected impact of each recommendation

Be thorough, specific, and practical. Reference specific components, files, or patterns from the codebase when possible. If the answer isn't fully available from the context, clearly state what additional information would be needed and provide your best architectural assessment based on what's available.`;

  return callAI(prompt, 60000);
}
