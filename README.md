# RepoRecon

> **Your AI-powered senior architect for GitHub repositories**

RepoRecon analyzes public GitHub repos and delivers architecture diagrams, health scores, issue detection, and actionable recommendations — powered by AI.

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)

---

## Live sites

| Site | URL | Purpose |
|------|-----|---------|
| **Marketing / landing** | [repo-recon.vercel.app](https://repo-recon.vercel.app/) (or your deploy URL) | Product overview, features, smooth scroll navigation |
| **Full application** | [**app-repo-recon.netlify.app**](https://app-repo-recon.netlify.app/) | Paste a repo URL, run analysis, Q&A, export, share |

The landing page **Launch App** buttons open the full app in a **new tab** via a standard link (`<a href="…" target="_blank">`) so they work reliably in production (popup blockers often block `window.open()`).

---

## Presentation deck

<div align="center">

### [View Hackathon Pitch Deck (Canva)](https://www.canva.com/design/DAG9Vr_WnHo/uZElXgVqcPm9d6SDqExkdg/view?utm_content=DAG9Vr_WnHo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hfb61c4573b)

</div>

---

## What is RepoRecon?

RepoRecon helps developers understand any public GitHub codebase quickly:

- **Architecture summaries** and Mermaid sequence diagrams  
- **Repository health score** (security, performance, maintainability, docs)  
- **Detected issues** and prioritized recommendations  
- **Codebase Q&A** — ask natural-language questions about the repo  
- **Shareable analysis links** and **PDF / PNG export**

### Two-part architecture

```
┌─────────────────────────────┐     Launch App (new tab)     ┌──────────────────────────────┐
│  Marketing site (this repo) │  ─────────────────────────►  │  Full app (Netlify)          │
│  React + Vite landing page  │                              │  Analysis, Q&A, exports      │
└─────────────────────────────┘                              └──────────────────────────────┘
                                        │
                                        ▼
                              Optional Django + Gemini API
                              (backend/ for server-side analysis)
```

- **This repository** — marketing homepage (`HeroSection`, `FeatureGrid`, `HowItWorks`, `Footer`), theme toggle, smooth in-page navigation.  
- **Deployed app** — full analysis workflow at [app-repo-recon.netlify.app](https://app-repo-recon.netlify.app/).  
- **Backend (optional)** — Django + Google Gemini for API-based analysis (`backend/`).

---

## Key features (full app)

| Feature | Description |
|---------|-------------|
| **Health score card** | Overall + category scores; export as PNG |
| **Architecture diagrams** | Mermaid sequence diagrams from repo structure |
| **Codebase Q&A** | Chat about auth, data flow, security, priorities |
| **Shareable links** | Unique URLs backed by `localStorage` |
| **PDF export** | Full report download |
| **Sub-10s analysis** | In-browser via Puter AI (no API key on client) |

### Landing page highlights

- Static **Launch App** CTA (solid navy, production-safe link navigation)  
- Framer Motion hero + scroll reveals  
- Smooth anchor scrolling (`#features`, `#how-it-works`) with fixed-header offset  
- Light / dark theme  

---

## Tech stack

### Frontend (root `src/`)

| Technology | Use |
|------------|-----|
| React 18 + TypeScript | UI |
| Vite 5 | Build & dev server |
| Tailwind CSS 3 | Styling |
| Framer Motion 12 | Motion & scroll animations |
| Shadcn/ui + Radix | Components |
| Mermaid.js | Diagrams |
| Puter AI (`js.puter.com`) | Client-side AI (no API key in browser) |
| html2canvas + jsPDF | Export |

### Backend (optional)

| Technology | Use |
|------------|-----|
| Django 4 | REST API |
| Python 3.11+ | Services |
| Google Gemini | Server-side deep analysis |

---

## Quick start

### Prerequisites

- **Node.js 18+** (landing + app frontend)  
- **Python 3.11+** (only if running Django backend)  
- **Git**

### 1. Clone

```bash
git clone https://github.com/ASaha-os/RepoRecon.git
cd RepoRecon
```

### 2. Landing / frontend

```bash
npm install
npm run dev
```

Dev server: **http://localhost:8080** (see `vite.config.ts`).

```bash
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

### 3. Backend (optional)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Set GEMINI_API_KEY in .env

python manage.py migrate
python manage.py runserver
```

API: **http://localhost:8000** — see [backend/SETUP.md](./backend/SETUP.md).

---

## Usage

### Marketing site

1. Open the deployed landing URL or `npm run dev`.  
2. Browse **Features** and **How it works**.  
3. Click **Launch App** / **Let's Try It** — opens [app-repo-recon.netlify.app](https://app-repo-recon.netlify.app/) in a new tab.

### Full application

1. Open [https://app-repo-recon.netlify.app/](https://app-repo-recon.netlify.app/).  
2. Paste a public GitHub URL (e.g. `https://github.com/expressjs/express`).  
3. Run analysis and explore health score, diagrams, issues, Q&A, share, and export.

**Example repos**

- `https://github.com/expressjs/express`  
- `https://github.com/pallets/flask`  
- `https://github.com/facebook/react`

---

## Project structure

```
RepoRecon/
├── src/
│   ├── components/landing/
│   │   ├── HeroSection.tsx       # Hero + Launch App CTA
│   │   ├── LaunchAppButton.tsx   # <a> link to full app (production-safe)
│   │   ├── Header.tsx / Footer.tsx
│   │   ├── FeatureGrid.tsx / HowItWorks.tsx
│   │   ├── SmoothAnchor.tsx      # Smooth in-page nav
│   │   ├── ScrollReveal.tsx
│   │   ├── AnalysisResults.tsx   # Used in full app flow
│   │   ├── RepoHealthScore.tsx / CodebaseQA.tsx
│   │   └── ThemeToggle.tsx
│   ├── constants/links.ts        # App + portfolio URLs
│   ├── lib/
│   │   ├── puterAI.ts            # Client AI analysis
│   │   ├── shareUtils.ts
│   │   └── smoothScroll.ts
│   ├── pages/Index.tsx
│   └── App.tsx
├── public/
│   ├── _redirects                # Netlify SPA
│   └── _headers
├── backend/                      # Optional Django API
├── index.html
├── netlify.toml
├── vercel.json
├── package.json
└── vite.config.ts
```

---

## Deployment

### Marketing site (Vercel / Netlify / static host)

```bash
npm run build
```

Publish the **`dist/`** folder.

| Platform | Config |
|----------|--------|
| **Netlify** | `netlify.toml` — build `npm run build`, publish `dist`, SPA redirect |
| **Vercel** | `vercel.json` — SPA rewrite to `index.html` |

Set environment variables only if you add custom app URLs later (defaults are in `src/constants/links.ts`).

### Full application

Deploy the app project separately to Netlify:  
**https://app-repo-recon.netlify.app/**

Keep `REPO_RECON_APP_URL` in `src/constants/links.ts` in sync with that URL after any domain change.

---

## Environment variables

### Backend (`backend/.env`)

```env
GEMINI_API_KEY=your_api_key_here
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

Frontend analysis via Puter AI does not require a Gemini key in the browser. See [GEMINI_SETUP.md](./GEMINI_SETUP.md) if present, or `backend/SETUP.md`.

---

## Important notes

- **AI output** may be incomplete or inaccurate; refresh or retry if needed.  
- **Free tiers** (Puter / Gemini) may rate-limit under heavy load.  
- **Launch App** must use real `<a href>` navigation — do not rely on `window.open()` alone in production.

---

## Contributing

1. Fork the repo  
2. `git checkout -b feature/your-feature`  
3. Commit and push  
4. Open a Pull Request  

---

## Credits

Built by **Akash Saha**

- **GitHub**: [@ASaha-os](https://github.com/ASaha-os)  
- **LinkedIn**: [Akash S](https://www.linkedin.com/in/akash-s-764359307/)  
- **Portfolio**: [akashs-portfolio.vercel.app](https://akashs-portfolio.vercel.app/)

Powered by Puter AI, React, Tailwind CSS, and optionally Django + Google Gemini.

---

## License

MIT — see [LICENSE](./LICENSE) if present.

---

<div align="center">

**Made with care and AI**

[Open an issue](https://github.com/ASaha-os/RepoRecon/issues) · [Discussions](https://github.com/ASaha-os/RepoRecon/discussions)

[⬆ Back to top](#reporecon)

</div>
