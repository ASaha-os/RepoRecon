# ✅ RepoRecon Deployment Checklist

## Pre-Deployment Checklist

### 🔑 Environment Variables

#### Backend (.env)
- [ ] `GEMINI_API_KEY` - Your Google Gemini API key
- [ ] `SECRET_KEY` - Django secret key (generate new for production)
- [ ] `DEBUG=False` - Disable debug mode
- [ ] `ALLOWED_HOSTS` - Add your domain
- [ ] `CORS_ALLOWED_ORIGINS` - Add your frontend URL

#### Frontend (.env.local)
- [ ] `VITE_API_URL` - Your backend URL

### 📦 Dependencies

#### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

#### Frontend
```bash
npm install
npm run build
```

### 🧪 Testing

- [ ] Backend health check: `http://localhost:8000/api/`
- [ ] Frontend builds without errors: `npm run build`
- [ ] Test analysis with sample repo
- [ ] Test health score card generation
- [ ] Test AI Q&A functionality
- [ ] Test shareable links
- [ ] Test PDF export
- [ ] Test on mobile devices

### 🔒 Security

- [ ] `.env` files are in `.gitignore`
- [ ] No API keys in code
- [ ] CORS properly configured
- [ ] HTTPS enabled (production)
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints

### 📊 Performance

- [ ] Static files compressed
- [ ] Images optimized
- [ ] Bundle size checked
- [ ] Lazy loading implemented
- [ ] Caching configured

---

## Deployment Options

### Option 1: Render.com (Recommended)

#### Backend Deployment

1. **Create Web Service**
   - Connect GitHub repository
   - Select `backend` directory
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn backend.wsgi:application`

2. **Environment Variables**
   ```
   GEMINI_API_KEY=your_key_here
   SECRET_KEY=your_secret_key_here
   DEBUG=False
   ALLOWED_HOSTS=your-app.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

3. **Add to requirements.txt**
   ```
   gunicorn==21.2.0
   whitenoise==6.6.0
   ```

#### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Import from GitHub
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

---

### Option 2: Railway

#### Backend
```bash
railway login
railway init
railway add
railway up
```

#### Frontend
Deploy to Vercel (same as above)

---

### Option 3: Heroku

#### Backend
```bash
heroku create reporecon-backend
heroku config:set GEMINI_API_KEY=your_key_here
git push heroku main
```

#### Frontend
Deploy to Vercel (same as above)

---

## Post-Deployment Checklist

### 🧪 Smoke Tests

- [ ] Homepage loads
- [ ] Can paste GitHub URL
- [ ] Analysis completes successfully
- [ ] Health score card displays
- [ ] AI Q&A responds
- [ ] Shareable link works
- [ ] PDF download works
- [ ] Mobile responsive

### 📊 Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor API usage
- [ ] Check rate limits
- [ ] Monitor response times

### 📝 Documentation

- [ ] Update README with live URLs
- [ ] Add deployment guide
- [ ] Document API endpoints
- [ ] Add troubleshooting guide

---

## Production Settings

### Backend (backend/backend/settings.py)

```python
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'your-backend.onrender.com']

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',
]

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Frontend (vite.config.ts)

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mermaid': ['mermaid'],
          'pdf': ['jspdf', 'html2canvas'],
        },
      },
    },
  },
});
```

---

## Troubleshooting

### Backend Issues

**Error: "Gemini API key not configured"**
- Check environment variables in hosting platform
- Verify `.env` file exists locally
- Restart backend service

**Error: "CORS error"**
- Add frontend URL to `CORS_ALLOWED_ORIGINS`
- Check protocol (http vs https)
- Restart backend

**Error: "Static files not found"**
- Run `python manage.py collectstatic`
- Check `STATIC_ROOT` setting
- Verify whitenoise is installed

### Frontend Issues

**Error: "Cannot connect to backend"**
- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check CORS configuration

**Error: "Build fails"**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors
- Verify all dependencies are installed

---

## Performance Optimization

### Backend
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Use CDN for static files
- [ ] Optimize database queries
- [ ] Add request throttling

### Frontend
- [ ] Enable code splitting
- [ ] Lazy load components
- [ ] Optimize images
- [ ] Use CDN for assets
- [ ] Enable service worker

---

## Monitoring & Analytics

### Recommended Tools

1. **Error Tracking**: Sentry
2. **Analytics**: Google Analytics / Plausible
3. **Uptime Monitoring**: UptimeRobot
4. **Performance**: Lighthouse CI
5. **API Monitoring**: Postman Monitor

---

## Backup & Recovery

### Database Backup
```bash
# SQLite (development)
cp backend/db.sqlite3 backup/db.sqlite3.$(date +%Y%m%d)

# PostgreSQL (production)
pg_dump $DATABASE_URL > backup.sql
```

### Environment Variables Backup
```bash
# Export from Render/Vercel dashboard
# Store securely (1Password, AWS Secrets Manager)
```

---

## Scaling Considerations

### When to Scale

- [ ] API rate limits exceeded
- [ ] Response times > 2 seconds
- [ ] Error rate > 1%
- [ ] Storage > 80% capacity

### Scaling Options

1. **Vertical Scaling**
   - Upgrade server resources
   - Increase memory/CPU

2. **Horizontal Scaling**
   - Add more backend instances
   - Use load balancer
   - Implement caching (Redis)

3. **Database Scaling**
   - Move to PostgreSQL
   - Add read replicas
   - Implement connection pooling

---

## Cost Optimization

### Free Tier Limits

**Render.com**
- 750 hours/month free
- Sleeps after 15 min inactivity
- 100 GB bandwidth

**Vercel**
- 100 GB bandwidth
- Unlimited deployments
- 100 GB-hours compute

**Google Gemini**
- 15 requests/minute
- 1,500 requests/day
- Free forever

### Cost Reduction Tips

1. Use shareable links to reduce API calls
2. Implement client-side caching
3. Optimize bundle size
4. Use CDN for static assets
5. Monitor and optimize API usage

---

## Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Environment variables set
- [ ] Security audit done
- [ ] Performance optimized

### Launch Day
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify all features work
- [ ] Monitor error logs
- [ ] Share on social media

### Post-Launch
- [ ] Monitor analytics
- [ ] Respond to feedback
- [ ] Fix critical bugs
- [ ] Plan next features
- [ ] Update documentation

---

## Support & Maintenance

### Weekly Tasks
- [ ] Check error logs
- [ ] Monitor API usage
- [ ] Review analytics
- [ ] Update dependencies

### Monthly Tasks
- [ ] Security audit
- [ ] Performance review
- [ ] Backup verification
- [ ] Cost analysis

### Quarterly Tasks
- [ ] Major version updates
- [ ] Feature planning
- [ ] User feedback review
- [ ] Infrastructure review

---

**Good luck with your deployment! 🚀**
