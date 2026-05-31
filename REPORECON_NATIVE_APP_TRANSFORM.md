# RepoRecon → Native Puter App: Full Transformation Prompt

> **For the AI Agent:** Read this document completely before writing a single line of code.
> This is the source of truth for the transformation. Do not deviate from the architecture, flow,
> or UX decisions described here. Do not create any extra `.md` files, documentation files,
> `README` updates, or `CHANGELOG` files during development unless explicitly described in
> this document. Code only.

---

## 1. Project Context

**App name:** RepoRecon — Your Senior AI Architect
**Live URL:** https://repo-recon.vercel.app
**Stack:** React (frontend) + Node.js (backend) + Puter.js AI (replaces Gemini free API)
**Goal:** Transform the existing web-app into a **native app experience** that qualifies for
the **Puter App Center** and passes their native UX quality standards.

**Design Inspiration:** https://claude.ai/new
Study that interface before you code anything. Observe:
- No landing page — the tool opens immediately
- Clean sidebar for navigation, no traditional navbar
- Focused, minimal UI with generous whitespace
- Conversation/flow-based interaction, not form-based
- Dark-first aesthetic, monochrome with sharp accents
- No marketing text, no hero sections, no feature lists inside the app

---

## 2. What Must Be Removed (Website Patterns to Kill)

Delete or refactor the following from the existing codebase:

- [ ] Any landing/hero section with tagline + CTA button
- [ ] Traditional top navbar with page links
- [ ] "Features" or "How it works" sections inside the app shell
- [ ] FAQ, contact, or about content inside the main app shell
- [ ] Long explanatory paragraphs anywhere in the app UI
- [ ] Footer with links (replace with minimal icon strip if needed)
- [ ] Any SEO meta content rendered as visible UI text
- [ ] Modal-based results display (diagrams/reports should render inline)
- [ ] Multi-step wizard-style forms

---

## 3. App Architecture

### 3.1 Layout Structure

```
┌──────────────────────────────────────────────┐
│  [Sidebar]  │  [Main Content Panel]           │
│             │                                 │
│  Icon-only  │  View renders here based on    │
│  nav strip  │  sidebar selection              │
│  (48px wide)│                                 │
│             │                                 │
│  [+]        │                                 │
│  [📋]       │                                 │
│  [⚙️]       │                                 │
│  ─────      │                                 │
│  [?]        │                                 │
│  [@]        │                                 │
└──────────────────────────────────────────────┘
```

- **Sidebar** is always visible on desktop. On mobile it becomes a bottom navigation bar with icons + labels.
- **Main panel** swaps content between views without full page reload.
- **No browser navigation involved** — all routing is internal React state or React Router with `MemoryRouter` (no URL-based routing required for Puter apps).
- Transitions between views use CSS opacity + translateY (150ms ease-out). No janky page reloads.

### 3.2 Sidebar Navigation Items (in order)

| Icon | Label (tooltip on hover) | View |
|------|--------------------------|------|
| `+` (plus / compose) | Add Repository | `AnalysisView` |
| `📋` (clipboard) | My Analyses | `HistoryView` |
| `⚙️` (gear) | Settings | `SettingsView` |
| — (divider) | — | — |
| `?` (help) | Help & FAQ | `HelpView` |
| `@` (person) | Profile | `ProfileView` |

Sidebar icons only. No text labels on desktop. Tooltips on hover. Active item has a subtle left-border accent or filled icon state.

---

## 4. The Core User Flow (Critical — Do Not Alter)

This is the primary value flow of the app. Every design decision serves this flow.

```
[Add Repository] 
       │
       ▼
[Repository Input Screen]
  • Large, focused GitHub URL input field
  • Placeholder: "github.com/username/repository"
  • Single primary action button: "Analyze"
  • Optionally: Recent repos as clickable chips below input
       │
       ▼ (on Analyze click — show inline loading state, no spinner page)
       │
[Mermaid JS Diagram Panel]
  • Renders the architecture diagram inline
  • Diagram type selector (top-right): Flowchart | Sequence | ER | Class
  • Copy diagram button (copies Mermaid code)
  • Download SVG button
  • Puter Save button (saves SVG to /RepoRecon/ folder in Puter FS)
  • If diagram has rendering errors, show a fallback text block
    with the raw Mermaid code and a "Try to fix" button
       │
       ▼ (diagram appears, then score card slides in below)
       │
[Health Score Card]
  • Circular score badge: 0–100
  • Score colour: red <40, amber 40–70, green >70
  • Breakdown grid (4 cells):
    - Code Complexity
    - Documentation Coverage
    - Test Coverage
    - Dependency Freshness
  • Each cell: icon + label + score bar
  • "Copy badge" button: copies a markdown badge for GitHub READMEs
       │
       ▼ (card appears, then reports section slides in below)
       │
[Detailed Reports Section]
  • Tab strip: Issues | Suggestions | Architecture Notes | Dependencies
  • Each tab renders a clean list of items (icon + title + detail)
  • Items are expandable (click to expand full detail)
  • "Copy all" button per tab
       │
       ▼ (reports visible, then Q&A chat appears at bottom)
       │
[AI Q&A Chat]
  • Heading: "Ask about this repository"
  • Input field at bottom (sticky, like claude.ai message input)
  • Suggested starter questions as chips above input:
    "Where is auth handled?"
    "What does the main service do?"
    "Are there any security concerns?"
    "What dependencies should be updated?"
  • User types a question → Puter.js AI responds grounded in repo context
  • Chat history scrolls upward
  • AI responses render with markdown support (code blocks, bullet lists)
  • Each response has a copy button
```

**Important UX rules for the flow:**
- Each section (Diagram → Score Card → Reports → Q&A) renders **progressively** as data arrives. Do not wait for everything before showing anything.
- Use `IntersectionObserver` to gently reveal each section as it enters the viewport.
- The URL input is never hidden after analysis starts — it stays in the sidebar or as a compact "breadcrumb" at the top of the panel so users can start a new analysis anytime.
- The Q&A chat maintains context of the current repo analysis (pass repo summary + diagram as system context to Puter.js AI on each message).

---

## 5. Views Specification

### 5.1 AnalysisView (default view / Add Repository)

- Opens when user clicks `+` in sidebar or on first app load.
- If no prior analysis exists: shows centered input field, large, calm. Like claude.ai's home screen.
- If analysis is in progress: shows the progressive flow described in Section 4.
- If analysis is complete: shows all sections (Diagram + Score + Reports + Q&A) stacked vertically, scrollable.
- A "New Analysis" button (top of panel, subtle) lets the user start over.

### 5.2 HistoryView (My Analyses)

- Shows a list of previous repo analyses.
- Each item: repo name, GitHub URL, analysis date, health score badge.
- Click any item to restore the full analysis in AnalysisView.
- "Clear history" button at bottom.
- History stored in `localStorage` (or Puter FS if Puter SDK is initialized).
- Empty state: icon + text "No analyses yet. Add a repository to get started."

### 5.3 SettingsView

Minimal. Only settings that actually matter:

| Setting | Control |
|---------|---------|
| Theme | Toggle: Light / Dark |
| Default diagram type | Dropdown: Flowchart / Sequence / ER / Class |
| Auto-save to Puter FS | Toggle |
| Clear all history | Destructive button |

No other settings. Do not pad this view.

### 5.4 HelpView (FAQ)

This replaces a website-style FAQ page. It is built **inside the app** as a view:

- Native accordion list of FAQ items (click to expand answer).
- Below FAQ: **Contact section** — just two fields:
  - Email input
  - Message textarea
  - Submit button (can fire a `mailto:` or a simple backend endpoint)
- Keep it clean. No decoration. No hero image. This is a utility view.

**FAQ items to include (pre-fill these):**
1. What is RepoRecon? — Brief app-context answer, not marketing copy.
2. Which repositories are supported? — Public GitHub repos only (currently).
3. How is the health score calculated?
4. Is my repository data stored?
5. What AI powers the analysis? — Puter.js AI (no external API keys required).
6. How do I save my analysis? — Via the "Save to Puter" button.
7. Why is my diagram not rendering? — Known Mermaid edge cases + how to use the "Try to fix" button.

### 5.5 ProfileView (Puter Profile)

Integrates with Puter SDK to show the logged-in user's Puter account details:

```javascript
// Show Puter user info
const user = await puter.auth.getUser();
// Display: user.username, user.email, avatar (first letter fallback)
```

- Display: avatar circle (initials fallback), username, email
- "My saved analyses" — link to `/RepoRecon/` folder in Puter FS
- "Sign out of Puter" button
- If not authenticated with Puter: show "Sign in with Puter" button

---

## 6. Design System

### 6.1 Aesthetic Direction

**Dark-first. Monochrome with a single accent colour.**

Inspired by: claude.ai, Linear, Vercel dashboard.
- Not playful. Not colourful. Not gradient-heavy.
- Precise, calm, professional developer tool.
- The UI should feel like the IDE they're already in — comfortable and focused.

### 6.2 Colour Tokens (CSS Custom Properties)

```css
:root {
  /* Dark theme (default) */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  --bg-hover: #222222;

  --text-primary: #f5f5f5;
  --text-secondary: #999999;
  --text-tertiary: #555555;

  --border: #2a2a2a;
  --border-subtle: #1e1e1e;

  --accent: #e8e8e8;           /* white-ish accent for dark theme */
  --accent-hover: #ffffff;

  --score-green: #22c55e;
  --score-amber: #f59e0b;
  --score-red: #ef4444;

  --sidebar-width: 48px;
  --panel-max-width: 760px;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f9f9f9;
  --bg-tertiary: #f3f3f3;
  --bg-hover: #eeeeee;

  --text-primary: #111111;
  --text-secondary: #666666;
  --text-tertiary: #aaaaaa;

  --border: #e5e5e5;
  --border-subtle: #f0f0f0;

  --accent: #111111;
  --accent-hover: #000000;
}
```

### 6.3 Typography

```css
/* Use a system monospace stack for code elements and a clean sans for UI */

--font-ui: 'Geist', 'Inter', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;

--text-xs: 11px;
--text-sm: 13px;
--text-base: 15px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 32px;
```

Load Geist from: `https://vercel.com/font` or fall back to system-ui.

### 6.4 Spacing

Use an 8px base grid. Common values: 4, 8, 12, 16, 24, 32, 48, 64px.

### 6.5 Transitions

```css
--transition-fast: 100ms ease;
--transition-base: 150ms ease-out;
--transition-slow: 250ms ease-in-out;

/* View transitions */
.view-enter {
  opacity: 0;
  transform: translateY(8px);
}
.view-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--transition-base), transform var(--transition-base);
}
```

### 6.6 Components to Build

Build these as reusable components. Do not inline styles on one-off elements.

| Component | Description |
|-----------|-------------|
| `<Sidebar />` | Icon-only nav strip, 48px, fixed left |
| `<RepoInput />` | Large, clean URL input with Analyze button |
| `<MermaidPanel />` | Diagram renderer with type selector + action buttons |
| `<HealthScoreCard />` | Circular score + breakdown grid |
| `<ReportTabs />` | Tabbed report sections (Issues, Suggestions, etc.) |
| `<QAChat />` | Sticky bottom input + chat history |
| `<HistoryList />` | Past analysis cards list |
| `<FAQAccordion />` | Expandable FAQ + contact form |
| `<ProfileCard />` | Puter user info display |
| `<LoadingDots />` | Minimal inline loading indicator (3 dots, no spinners) |
| `<SectionReveal />` | Wrapper that animates children in on scroll |

---

## 7. Puter SDK Integration

### 7.1 Installation

```bash
npm install @puter/sdk
# or load via CDN in index.html:
# <script src="https://js.puter.com/v2/"></script>
```

### 7.2 Initialization

```javascript
// In App.jsx or a PuterProvider context
import puter from '@puter/sdk'; // or use window.puter if CDN

// Initialize on mount
useEffect(() => {
  puter.init(); // Puter handles auth internally
}, []);
```

### 7.3 Integration Points in the Flow

| Where | Puter API call |
|-------|----------------|
| Save diagram | `puter.fs.write('/RepoRecon/diagram-{timestamp}.svg', svgContent)` |
| Load history from Puter | `puter.fs.readdir('/RepoRecon/')` |
| Show notification (analysis done) | `puter.ui.alert('Analysis complete', { icon: 'success' })` |
| Show notification (error) | `puter.ui.alert('Analysis failed', { icon: 'error' })` |
| Get user profile | `puter.auth.getUser()` |
| Sign out | `puter.auth.signOut()` |

### 7.4 Puter.js AI (replaces Gemini API)

```javascript
// Use Puter.js AI for both analysis and Q&A
const response = await puter.ai.chat([
  {
    role: 'system',
    content: `You are a senior software architect. You are analyzing this GitHub repository:
    Repository: ${repoName}
    File structure: ${fileStructure}
    Key files content: ${keyFilesContent}
    
    Provide concise, expert analysis. Output Mermaid diagrams in \`\`\`mermaid blocks.`
  },
  {
    role: 'user',
    content: userQuestion // or initial analysis prompt
  }
], {
  model: 'claude-3-5-sonnet', // or whichever Puter exposes
  stream: true // stream responses for progressive rendering
});
```

---

## 8. Component File Structure

Follow this structure. Do not create extra directories or files outside this layout.

```
src/
├── App.jsx                   # Root: layout shell + routing
├── main.jsx                  # Entry point
│
├── components/
│   ├── Sidebar.jsx
│   ├── RepoInput.jsx
│   ├── MermaidPanel.jsx
│   ├── HealthScoreCard.jsx
│   ├── ReportTabs.jsx
│   ├── QAChat.jsx
│   ├── HistoryList.jsx
│   ├── FAQAccordion.jsx
│   ├── ProfileCard.jsx
│   ├── LoadingDots.jsx
│   └── SectionReveal.jsx
│
├── views/
│   ├── AnalysisView.jsx      # Main analysis flow (default)
│   ├── HistoryView.jsx
│   ├── SettingsView.jsx
│   ├── HelpView.jsx          # FAQ + Contact
│   └── ProfileView.jsx       # Puter profile
│
├── hooks/
│   ├── usePuter.js           # Puter SDK wrapper hook
│   ├── useAnalysis.js        # Analysis state + API calls
│   └── useHistory.js         # localStorage/Puter FS history
│
├── services/
│   ├── github.js             # GitHub API calls (fetch repo tree, key files)
│   ├── analysis.js           # Puter.js AI analysis calls
│   └── mermaid.js            # Mermaid rendering helpers + error fixing
│
├── styles/
│   ├── globals.css           # CSS variables + resets
│   └── components.css        # Shared component styles (if not using CSS modules)
│
└── utils/
    ├── github.js             # URL parsing, repo name extraction
    └── score.js              # Health score calculation logic
```

**Do not create:**
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- Any extra `*.md` documentation files
- Storybook configs
- Unnecessary test boilerplate files
- `docs/` folder
- `scripts/` folder (unless a specific build script is needed)

---

## 9. Backend (Node.js) — Minimal Changes Required

The backend is kept lightweight. Its only job is:
1. Accept a GitHub repo URL
2. Fetch the file tree + content of key files via GitHub API (to avoid CORS)
3. Return structured repo data to the frontend

The frontend handles all AI calls via Puter.js (no AI logic in backend).

**Endpoints (keep existing, just verify these work):**

```
POST /api/analyze
  Body: { repoUrl: "https://github.com/user/repo" }
  Returns: { 
    repoName, 
    fileTree,          // array of { path, type }
    keyFiles,          // array of { path, content } for important files
    metadata           // stars, language, description, etc.
  }
```

If the backend doesn't yet have this clean structure, refactor it. Do not add new endpoints unless required by a specific integration point listed in this document.

---

## 10. Mobile Responsiveness

On screens < 768px wide:

- Sidebar becomes a **bottom navigation bar** (full width, 60px tall, icon + label)
- Main panel takes full width with 16px horizontal padding
- Mermaid diagram becomes horizontally scrollable within its container
- Q&A chat input remains sticky at the bottom (above the nav bar)
- Score card grid collapses to 2-column instead of 4-column

---

## 11. Performance Rules

- **No full page reloads** between views. Ever.
- **Progressive rendering:** show the Mermaid diagram as soon as it's ready. Do not wait for the score card or reports before displaying it.
- **Lazy load** `mermaid` library (it's heavy). Only import it when a diagram is about to render.
- **Debounce** the GitHub URL input — do not fire validation on every keystroke.
- **Cache** analysis results in localStorage by repo URL + timestamp to avoid re-fetching on history restore.
- Avoid unnecessary re-renders — use `useMemo` / `useCallback` on heavy components.

---

## 12. Error States

Every async operation needs a handled error state. Do not show generic browser errors.

| Error | Display |
|-------|---------|
| Invalid GitHub URL | Inline red hint text below input field |
| Repo not found / private | Inline message: "Repository not found or is private." |
| GitHub API rate limited | Message with retry countdown timer |
| Mermaid render failure | Show raw code block + "Try to fix" button (re-prompts AI to fix syntax) |
| Puter AI timeout | "Analysis taking longer than usual. Retrying..." with auto-retry |
| Puter FS save failure | Toast notification: "Save failed. Try again." |

---

## 13. Puter App Center Compliance Checklist

Before submitting, verify every item:

- [ ] App opens directly to the main tool (no landing page gate)
- [ ] No marketing copy visible anywhere inside the app shell
- [ ] Navigation is consistent across all views (same sidebar, same header)
- [ ] All transitions are smooth (no jarring page loads)
- [ ] App is fully functional (no broken buttons, no 404 views)
- [ ] Works in Puter's dark theme without broken colours
- [ ] Mobile responsive (bottom nav bar, scrollable diagram)
- [ ] Puter SDK initialized and at least one native API in use (notifications or FS)
- [ ] App description (for App Center submission) is concise, factual, under 100 words

---

## 14. Agent Execution Order

Execute tasks in this exact sequence. Do not jump ahead.

```
Phase 1 — Cleanup (remove website patterns)
  1. Delete landing page / hero section code
  2. Remove traditional navbar
  3. Remove all marketing text from component files
  4. Remove FAQ/Contact from any existing in-app section

Phase 2 — Layout shell
  5. Build Sidebar component (icon-only, 48px)
  6. Build App.jsx layout (sidebar + main panel)
  7. Wire up view switching (React state or MemoryRouter)
  8. Apply CSS variables (globals.css)

Phase 3 — Core flow components
  9.  Build RepoInput component
  10. Build MermaidPanel component (with lazy-loaded mermaid lib)
  11. Build HealthScoreCard component
  12. Build ReportTabs component
  13. Build QAChat component
  14. Wire all components into AnalysisView with progressive rendering

Phase 4 — Supporting views
  15. Build HistoryView + useHistory hook
  16. Build SettingsView (theme toggle wired to CSS variable)
  17. Build HelpView (FAQAccordion + contact form)
  18. Build ProfileView (Puter auth integration)

Phase 5 — Puter SDK integration
  19. Add usePuter hook
  20. Wire up save-to-Puter-FS button in MermaidPanel
  21. Wire up notifications (analysis start/complete/error)
  22. Wire up ProfileView with puter.auth.getUser()

Phase 6 — Polish & compliance check
  23. Verify all transitions are working
  24. Verify mobile layout (bottom nav)
  25. Verify all error states
  26. Run through Puter compliance checklist (Section 13)
```

---

## 15. Final Notes for the Agent

- **Do not ask for clarification mid-execution.** If something is ambiguous, make the more minimal, app-like choice.
- **Do not create documentation files.** No `.md` files, no `docs/`, no `NOTES.txt`. Code only.
- **Do not over-engineer.** If a simple CSS solution works, don't add a library. If localStorage works for history, don't add a database.
- **Commit to the dark theme first.** Light theme is a toggle. Test in dark.
- **The Mermaid diagram is the hero feature.** It should be the most polished element in the app. If the rest looks plain but the diagram renders beautifully with smooth animation, that's the right trade-off.
- **The Q&A chat is the delightful surprise.** Make it feel conversational, not like a form. Starter question chips should be visually inviting.
- This app should make a developer think: *"I want this open all the time in my IDE sidecar."*

---

*End of transformation prompt. Begin with Phase 1.*
