# 🔑 Google Gemini API Setup Guide

This guide will help you set up your Google Gemini API key for RepoRecon.

## Why Gemini API?

RepoRecon uses **Google Gemini 2.5 Flash-Latest** for AI-powered repository analysis because:

- ✅ **Free Tier**: Generous free quota (15 requests per minute)
- ✅ **Fast**: Flash model optimized for speed
- ✅ **Powerful**: 2M token context window
- ✅ **No Credit Card**: Get started immediately

## Step 1: Get Your API Key

### Option A: Google AI Studio (Recommended - Fastest)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Select **"Create API key in new project"** (or use existing project)
4. Copy your API key (starts with `AIza...`)

### Option B: Google Cloud Console (For Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Generative Language API**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy your API key

## Step 2: Configure Backend

### Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
```

### Edit `backend/.env` and add your API key:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=AIzaSy...your_actual_key_here

# Other settings (keep defaults for local development)
SECRET_KEY=django-insecure-hackathon-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Step 3: Verify Setup

### Test the API key:

```bash
cd backend
python test.py
```

You should see:
```
✅ Gemini API key is configured
✅ Successfully connected to Gemini API
✅ Model: gemini-2.5-flash-latest
```

### Start the backend:

```bash
python manage.py runserver
```

## Step 4: Configure Frontend (Optional)

If you want to use Gemini features directly in the frontend:

### Create `.env.local` in root directory:

```bash
cp .env.example .env.local
```

### Edit `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

## Troubleshooting

### Error: "Gemini API key not configured"

**Solution**: Make sure you created `backend/.env` file with your API key.

```bash
# Check if .env exists
ls -la backend/.env

# If not, create it
cd backend
cp .env.example .env
# Then edit and add your key
```

### Error: "API key not valid"

**Solution**: 
1. Verify your API key is correct (no extra spaces)
2. Check if the API is enabled in Google Cloud Console
3. Try generating a new API key

### Error: "429 Rate Limit Exceeded"

**Solution**: 
- Free tier: 15 requests per minute
- Wait 60 seconds and try again
- For production, upgrade to paid tier

### Error: "Could not find any working Gemini model"

**Solution**:
1. Ensure you're using the latest API key
2. Check if Generative Language API is enabled
3. Try these model names in order:
   - `gemini-2.5-flash-latest` (recommended)
   - `gemini-1.5-flash-latest`
   - `gemini-1.5-flash`

## API Key Security

### ⚠️ IMPORTANT: Never commit your API key to Git!

The `.gitignore` file already excludes:
- `backend/.env`
- `.env.local`
- `*.env`

### For Production Deployment:

1. **Render.com**: Add environment variables in dashboard
2. **Vercel**: Use environment variables in project settings
3. **Heroku**: Use `heroku config:set GEMINI_API_KEY=your_key`

## Rate Limits & Quotas

### Free Tier (Default):
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per minute**

### Tips to Stay Within Limits:
1. Cache analysis results (already implemented)
2. Use shareable links instead of re-analyzing
3. Implement request throttling for production

## Upgrading to Paid Tier

For production use with higher traffic:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing for your project
3. Upgrade to **Pay-as-you-go** pricing
4. Enjoy higher rate limits:
   - **1,000 requests per minute**
   - **Unlimited daily requests**

## Need Help?

- 📚 [Gemini API Documentation](https://ai.google.dev/docs)
- 💬 [Google AI Forum](https://discuss.ai.google.dev/)
- 🐛 [Report Issues](https://github.com/ASaha-os/RepoRecon/issues)

---

## Quick Reference

```bash
# Backend setup
cd backend
cp .env.example .env
# Edit .env and add GEMINI_API_KEY
python manage.py runserver

# Frontend setup
cp .env.example .env.local
# Edit .env.local if needed
npm run dev
```

**That's it! You're ready to analyze repositories with AI! 🚀**
