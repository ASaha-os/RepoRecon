# 🚀 RepoRecon Quick Start Guide

Get RepoRecon running in **5 minutes**!

## Prerequisites

- Node.js 18+ 
- Python 3.11+
- Google Gemini API Key ([Get one free](https://aistudio.google.com/app/apikey))

## 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/ASaha-os/RepoRecon.git
cd RepoRecon

# Install frontend dependencies
npm install
```

## 2️⃣ Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

## 3️⃣ Add Your Gemini API Key

Edit `backend/.env`:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
```

**Don't have a key?** Get one in 30 seconds:
1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

## 4️⃣ Start Backend

```bash
# Still in backend/ directory
python manage.py migrate
python manage.py runserver
```

✅ Backend running at http://localhost:8000

## 5️⃣ Start Frontend

Open a **new terminal**:

```bash
# From project root
npm run dev
```

✅ Frontend running at http://localhost:5173

## 🎉 You're Ready!

1. Open http://localhost:5173
2. Paste a GitHub URL (try: `https://github.com/facebook/react`)
3. Click "Analyze Repo"
4. Watch the magic happen! ✨

## 🎯 Try These Features

### Health Score Card
- Visual metrics with overall score
- Download as PNG to share
- Perfect for README badges

### AI Q&A
- Ask: "Where is authentication handled?"
- Ask: "What are the security issues?"
- Get instant, context-aware answers

### Shareable Links
- Click "Share Analysis" after analyzing
- Copy link and share with team
- Analysis persists for 30 days

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 8000 is in use
# Windows:
netstat -ano | findstr :8000
# macOS/Linux:
lsof -i :8000
```

### Frontend won't start?
```bash
# Check if port 5173 is in use
# Windows:
netstat -ano | findstr :5173
# macOS/Linux:
lsof -i :5173
```

### "Gemini API key not configured"?
- Make sure `backend/.env` exists
- Check that `GEMINI_API_KEY` is set correctly
- No spaces or quotes around the key

### "Cannot connect to backend"?
- Ensure backend is running on http://localhost:8000
- Check CORS settings in `backend/backend/settings.py`
- Try restarting both servers

## 📚 Next Steps

- Read [GEMINI_SETUP.md](./GEMINI_SETUP.md) for detailed API setup
- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## 💡 Pro Tips

1. **Cache Results**: Analysis results are automatically cached
2. **Share Links**: Use shareable links instead of re-analyzing
3. **Rate Limits**: Free tier = 15 requests/minute
4. **Best Repos**: Public repos with good READMEs work best

## 🆘 Need Help?

- 🐛 [Report Issues](https://github.com/ASaha-os/RepoRecon/issues)
- 💬 [Discussions](https://github.com/ASaha-os/RepoRecon/discussions)
- 📧 Contact: [LinkedIn](https://www.linkedin.com/in/akash-s-764359307/)

---

**Happy Analyzing! 🚀**
