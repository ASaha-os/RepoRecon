# 🔒 Security Guidelines for RepoRecon

## Environment Variables Protection

### ✅ What's Protected

Both `.gitignore` files (root and backend) now protect **ALL** environment file variants:

```
.env
.env.*
.env.local
.env.dev
.env.development
.env.prod
.env.production
.env.test
.env.staging
*.env
```

**Exception:** `.env.example` files are allowed (they contain no secrets)

---

## 🚨 Current Status

✅ **No sensitive .env files are tracked by git**

Your repository currently has these .env files locally (not tracked):
- `.env.local` (root)
- `backend/.env`
- `backend/.env.dev`

These files are **safe** - they're ignored by git and won't be committed.

---

## 🛡️ Security Checklist

Before pushing to GitHub:

- [ ] Run security check: `.\check-security.ps1` (Windows) or `./check-security.sh` (Linux/Mac)
- [ ] Verify no .env files are staged: `git status`
- [ ] Check tracked files: `git ls-files | grep .env`
- [ ] Only `.env.example` should appear

---

## 🔑 API Keys & Secrets

### Development
Store in local `.env` files (already ignored):
```env
GEMINI_API_KEY=your_key_here
SECRET_KEY=your_secret_here
```

### Production (Vercel)
Set in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add `VITE_API_URL`

### Production (Render)
Set in Render dashboard:
- Go to Environment tab
- Add `GEMINI_API_KEY`, `SECRET_KEY`, etc.

---

## 🚫 What NOT to Commit

Never commit files containing:
- API keys (Google Gemini, etc.)
- Secret keys
- Database credentials
- OAuth tokens
- Private keys
- Passwords

---

## ✅ What's Safe to Commit

- `.env.example` - Template with placeholder values
- `DEPLOYMENT.md` - Deployment instructions
- `README.md` - Public documentation
- Source code (without hardcoded secrets)

---

## 🔍 Security Check Scripts

### Windows (PowerShell)
```powershell
.\check-security.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x check-security.sh
./check-security.sh
```

These scripts verify:
1. No sensitive .env files are tracked by git
2. Lists all .env files in your working directory
3. Provides remediation steps if issues found

---

## 🆘 If You Accidentally Committed Secrets

### 1. Remove from Git (Keep Local Copy)
```bash
git rm --cached .env
git rm --cached backend/.env
git commit -m "Remove sensitive files"
```

### 2. Rotate Compromised Secrets
- Generate new API keys
- Update keys in local .env files
- Update keys in Vercel/Render dashboards

### 3. Clean Git History (if pushed)
```bash
# Use BFG Repo-Cleaner or git filter-branch
# See: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
```

---

## 📚 Resources

- [GitHub: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

## 🎯 Best Practices

1. **Never hardcode secrets** in source code
2. **Use environment variables** for all sensitive data
3. **Run security checks** before every push
4. **Rotate keys regularly** (every 90 days)
5. **Use different keys** for dev/staging/production
6. **Review .gitignore** before adding new env files

---

**Remember:** Security is everyone's responsibility! 🔐
