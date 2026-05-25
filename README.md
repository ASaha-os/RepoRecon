# 🚀 RepoRecon

> **Your AI-Powered Senior Architect in Your Pocket**

Instant GitHub repository analysis, architectural diagrams, and bug fixes powered by Google Gemini 2.5 Flash-Latest. Free, unlimited, in-depth.

![RepoRecon Banner](https://img.shields.io/badge/Built%20with-Love%20%26%20AI-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

## 📊 Presentation Deck 

Check out our **Canva presentation** to see the full vision and pitch:

<div align="center">

### 🎨 **[👉 CLICK HERE TO VIEW OUR HACKATHON PITCH DECK 👈](https://www.canva.com/design/DAG9Vr_WnHo/uZElXgVqcPm9d6SDqExkdg/view?utm_content=DAG9Vr_WnHo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hfb61c4573b)**

[![Canva Presentation](https://img.shields.io/badge/🎨%20CANVA%20PRESENTATION-FF6B9D?style=for-the-badge&logo=canva&logoColor=white&labelColor=FF1493)](https://www.canva.com/design/DAG9Vr_WnHo/uZElXgVqcPm9d6SDqExkdg/view?utm_content=DAG9Vr_WnHo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hfb61c4573b)

**Judges: Don't miss our beautiful presentation! 🚀**

*Dive into our vision, feature highlights, and why RepoRecon is the future of code analysis!*

</div>

---

## 🎯 What is RepoRecon?

RepoRecon is a cutting-edge web application that leverages Google's Gemini AI to perform deep architectural analysis of GitHub repositories. Simply paste a repo URL, and watch as our AI:

- 📊 **Generates comprehensive summaries** of your codebase architecture
- 🎨 **Creates beautiful Mermaid diagrams** visualizing your project structure
- 🐛 **Detects architectural issues** and potential bottlenecks
- 💡 **Provides actionable recommendations** for code improvements
- ⚡ **Processes everything in seconds** with zero configuration

Perfect for code reviews, onboarding, architecture planning, and hackathon showcases!

---

## ✨ Key Features

### 🤖 AI-Powered Analysis
- Powered by **Google Gemini 2.5 Flash-Latest** with 2M token context window
- Analyzes entire repositories without chunking or loss of understanding
- Lightning-fast processing on the free tier

### 📊 Repository Health Score Card
- **Visual health metrics** with overall score (0-100)
- Security, Performance, Maintainability, and Documentation scores
- **Shareable as image** - perfect for README badges and social media
- Download as PNG for presentations and reports

### 💬 AI Codebase Q&A
- **Interactive chat interface** to ask questions about the codebase
- "Where is authentication handled?" - Get instant answers
- Context-aware responses based on analysis
- **Demo-ready** - wow moment for judges and users

### 🔗 Shareable Analysis Links
- **One-click sharing** via URL or social media
- Persistent storage using localStorage
- Auto-generated shareable links for every analysis
- Share insights with your team instantly

### 📈 Beautiful Visualizations
- Auto-generated **Mermaid.js sequence diagrams** for architecture flow
- Interactive, responsive diagrams that work on all devices
- Dark mode optimized for developer comfort

### 📥 Export & Share
- **Download analysis as PDF** with one click
- **Download health score card as PNG**
- Share findings with your team instantly
- Professional report formatting

### 🎨 Modern UI/UX
- Sleek, dark-themed interface with glassmorphism design
- Smooth animations and transitions powered by Framer Motion
- Fully responsive (mobile, tablet, desktop)
- Light/Dark theme toggle

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Logo |
|-----------|---------|------|
| **React 18** | UI Framework | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) |
| **TypeScript** | Type Safety | ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white) |
| **Vite** | Build Tool | ![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white) |
| **Tailwind CSS** | Styling | ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white) |
| **Framer Motion** | Animations | ![Framer](https://img.shields.io/badge/Framer%20Motion-12-0055FF?logo=framer&logoColor=white) |
| **Mermaid.js** | Diagrams | ![Mermaid](https://img.shields.io/badge/Mermaid-11-FF3670?logo=mermaid&logoColor=white) |
| **Shadcn/ui** | Components | ![Shadcn](https://img.shields.io/badge/Shadcn%2Fui-Latest-000000?logo=shadcnui&logoColor=white) |
| **html2canvas** | PDF Export | ![html2canvas](https://img.shields.io/badge/html2canvas-1.4-FF6B6B) |
| **jsPDF** | PDF Generation | ![jsPDF](https://img.shields.io/badge/jsPDF-3.0-FF6B6B) |

### Backend
| Technology | Purpose | Logo |
|-----------|---------|------|
| **Django** | Web Framework | ![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django&logoColor=white) |
| **Python** | Language | ![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white) |
| **Google Gemini API** | AI Analysis | ![Google](https://img.shields.io/badge/Google%20Gemini-2.5-4285F4?logo=google&logoColor=white) |
| **Requests** | HTTP Client | ![Requests](https://img.shields.io/badge/Requests-2.31-FFD43B) |
| **CORS** | Cross-Origin Support | ![CORS](https://img.shields.io/badge/CORS-Enabled-green) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Frontend)
- Python 3.11+ (Backend)
- Google Gemini API Key ([Get one free](https://ai.google.dev/))
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/ASaha-os/RepoRecon.git
cd RepoRecon
```

#### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173`

#### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your Gemini API key
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_api_key_here

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

**📖 Need help with Gemini API setup? See [GEMINI_SETUP.md](./GEMINI_SETUP.md)**

The backend will be available at `http://localhost:8000`

---

## 📖 Usage

1. **Open RepoRecon** in your browser (http://localhost:5173)
2. **Paste a GitHub repository URL** (e.g., `https://github.com/username/repo`)
3. **Click "Analyze Repo"** and watch the magic happen ✨
4. **Explore the results**:
   - 📊 **Health Score Card** - Visual metrics you can share
   - 💬 **AI Q&A** - Ask questions about the codebase
   - 📝 Architecture summary
   - 🎨 Visual diagram
   - 🐛 Detected issues
   - 💡 Recommendations
5. **Share your analysis**:
   - Click "Share Analysis" to get a shareable link
   - Download health score card as PNG
   - Download full report as PDF

### Example Repositories to Try
- `https://github.com/facebook/react`
- `https://github.com/torvalds/linux`
- `https://github.com/nodejs/node`

### Demo Questions for AI Q&A
- "Where is authentication handled?"
- "What are the main security concerns?"
- "How is the data flow structured?"
- "What improvements should I prioritize?"

---

## 🏗️ Project Structure

```
RepoRecon/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeatureGrid.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── AnalysisResults.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── backend/
│   ├── core/
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── gemini_service.py
│   │   └── migrations/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── db.sqlite3
│
├── README.md
├── .gitignore
└── package.json
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_api_key_here

# Django Settings
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🎨 Features in Detail

### 📊 Repository Health Score Card
The health score card provides an at-a-glance view of your repository's quality:

- **Overall Score**: Weighted average of all metrics (0-100)
- **Security Score**: Based on detected security issues
- **Performance Score**: Optimization and efficiency metrics
- **Maintainability Score**: Code complexity and structure
- **Documentation Score**: README and code documentation quality

**Why it's special**:
- 📸 **Shareable as image** - developers love to screenshot and share
- 🎯 **Visual impact** - judges notice visual elements
- 📊 **Data-driven** - backed by AI analysis
- 🚀 **Organic traction** - perfect for social media

### 💬 AI Codebase Q&A
Interactive chat interface that answers questions about your codebase:

**Example questions**:
- "Where is authentication handled?"
- "What are the security vulnerabilities?"
- "How does the data flow work?"
- "What should I fix first?"

**Why it's special**:
- 🎭 **Wow demo moment** - live interaction impresses judges
- 🧠 **Context-aware** - uses analysis data for accurate answers
- ⚡ **Instant responses** - no waiting for re-analysis
- 💡 **Educational** - helps developers understand codebases faster

### 🔗 Shareable Analysis Links
Every analysis gets a unique shareable link:

**Features**:
- 🔗 **Persistent URLs** - share via link or social media
- 💾 **Local storage** - fast loading of shared analyses
- 🗑️ **Auto-cleanup** - removes analyses older than 30 days
- 📱 **Mobile-friendly** - works on all devices

**Why it's special**:
- 🚀 **Quick engineering win** - implemented in hours
- 🎯 **Real product feel** - not just a demo toy
- 👥 **Team collaboration** - share insights instantly
- 🏆 **Judge-friendly** - easy to share during presentations

### Smart Repository Analysis
- Fetches README and project structure from GitHub
- Cleans and optimizes content for AI processing
- Handles both main and master branch repositories
- Graceful error handling for private/missing repos

### Intelligent Diagram Generation
- Converts architecture into Mermaid sequence diagrams
- Handles complex multi-component systems
- Fallback to raw code if rendering fails
- Responsive and interactive

### Comprehensive Reporting
- Executive summary of codebase
- Architectural patterns identified
- Security and performance issues
- Best practice recommendations
- Professional PDF export

---

## 🚨 Important Notes

⚠️ **AI Limitations**: This analysis is generated by AI and may occasionally produce inaccurate or incomplete results. If you encounter unexpected output, please refresh the page or try again after a brief interval.

⚠️ **Free Tier**: As this service operates on a free tier, intermittent errors or rate limiting may occur during high-traffic periods.

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙌 Credits

Built with ❤️ by **Akash Saha**

- **GitHub**: [@ASaha-os](https://github.com/ASaha-os)
- **LinkedIn**: [Akash S](https://www.linkedin.com/in/akash-s-764359307/)

### Powered By
- 🤖 [Google Gemini AI](https://ai.google.dev/)
- ⚛️ [React](https://react.dev/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🐍 [Django](https://www.djangoproject.com/)

---

## 🎯 Hackathon Vibes

RepoRecon was built with the spirit of innovation and the goal of making code analysis accessible to everyone. Whether you're a solo developer, a startup, or an enterprise team, RepoRecon helps you understand your codebase faster and make better architectural decisions.

**Built for**: Developers who love clean code, beautiful UIs, and AI-powered insights.

**Perfect for**: Code reviews, onboarding, architecture planning, and impressing your team! 🚀

---

## 📞 Support

Have questions or found a bug? 

- 🐛 [Open an Issue](https://github.com/ASaha-os/RepoRecon/issues)
- 💬 [Start a Discussion](https://github.com/ASaha-os/RepoRecon/discussions)
- 📧 Reach out on LinkedIn

---

<div align="center">

**Made with 💜 and AI Magic**

⭐ If you find RepoRecon helpful, please give it a star!

[⬆ back to top](#-reporecon)

</div>
