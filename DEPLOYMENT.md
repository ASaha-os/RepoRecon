# 🚀 RepoRecon Deployment Guide

Deploy RepoRecon with **Vercel** (Frontend) and **Render** (Backend).

---

## 📋 Prerequisites

- GitHub account with the RepoRecon repository
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com
- Google Gemini API Key: https://ai.google.dev/

---

## 🔧 Step 1: Deploy Backend on Render

### 1.1 Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `reporecon-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn backend.wsgi:application` |

### 1.2 Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `DEBUG` | `False` |
| `SECRET_KEY` | (Click "Generate" for a secure key) |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `ALLOWED_HOSTS` | `.onrender.com,your-backend-name.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` |
| `PYTHON_VERSION` | `3.11.0` |

### 1.3 Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (2-5 minutes)
3. Note your backend URL: `https://reporecon-backend.onrender.com`

### 1.4 Test Backend

Visit: `https://your-backend-name.onrender.com/api/health/`

You should see: `{"status": "ok"}`

---

## 🎨 Step 2: Deploy Frontend on Vercel

### 2.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (leave empty) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 2.2 Set Environment Variables

In Vercel project settings → **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-name.onrender.com` |

⚠️ **Important**: Replace `your-backend-name` with your actual Render backend URL!

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (1-2 minutes)
3. Your frontend is live at: `https://your-project.vercel.app`

---

## 🔗 Step 3: Update CORS Settings

After both are deployed, update Render backend's `CORS_ALLOWED_ORIGINS`:

```
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://reporecon.vercel.app
```

Then redeploy the backend on Render.

---

## ✅ Verification Checklist

- [ ] Backend health check works: `https://backend.onrender.com/api/health/`
- [ ] Frontend loads: `https://frontend.vercel.app`
- [ ] Analysis works: Paste a GitHub URL and click "Analyze Repo"
- [ ] PDF download works
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` on Render includes your Vercel URL
- Make sure there's no trailing slash in the URLs
- Redeploy backend after changing environment variables

### Backend Not Responding
- Check Render logs for errors
- Verify `GEMINI_API_KEY` is set correctly
- Ensure `ALLOWED_HOSTS` includes `.onrender.com`

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set in Vercel
- Check browser console for the actual API URL being used
- Ensure backend URL doesn't have trailing slash

### Render Free Tier Sleep
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading for always-on service

---

## 🔄 Updating the Deployment

### Frontend (Vercel)
- Push to `main` branch → Auto-deploys

### Backend (Render)
- Push to `main` branch → Auto-deploys
- Or manually trigger from Render dashboard

---

## 📊 Environment Variables Summary

### Backend (Render)
```env
DEBUG=False
SECRET_KEY=<generated-secure-key>
GEMINI_API_KEY=<your-gemini-api-key>
ALLOWED_HOSTS=.onrender.com,reporecon-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://reporecon.vercel.app
PYTHON_VERSION=3.11.0
```

### Frontend (Vercel)
```env
VITE_API_URL=https://reporecon-backend.onrender.com
```

---

## 🎉 You're Live!

Once deployed, share your RepoRecon URL with the world:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`

Good luck with the hackathon! 🚀
