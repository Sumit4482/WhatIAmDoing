# ⚡ Quick Start - Deploy in 10 Minutes

## 🎯 Current Status

✅ **Files Created:**
- `backend/render.yaml` - Render deployment config
- `backend/.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `DEPLOYMENT.md` - Full deployment guide

✅ **Git Repository:**
- Initialized and committed
- Ready to push to GitHub

---

## 🚀 Next Steps (Do These Now)

### Step 1: Create GitHub Repository (2 min)

1. Go to: https://github.com/new
2. Repository name: `sumit-dashboard`
3. Description: `Real-time personal accountability dashboard`
4. Visibility: **Public** (or Private)
5. **Don't** check "Initialize with README"
6. Click **"Create repository"**

### Step 2: Push to GitHub (1 min)

**Option A: Using HTTPS (easiest)**

```bash
cd /Users/igdclt0379/Downloads/sumit-dashboard

# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/sumit-dashboard.git

git push -u origin main
```

**If you get authentication error:**
- Use GitHub Personal Access Token (Settings → Developer settings → Personal access tokens)
- Or use GitHub CLI: `gh auth login`

**Option B: Using SSH**

```bash
cd /Users/igdclt0379/Downloads/sumit-dashboard

# Replace YOUR_USERNAME with your GitHub username
git remote add origin git@github.com:YOUR_USERNAME/sumit-dashboard.git

git push -u origin main
```

### Step 3: Deploy Backend to Render (5 min)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect repo: `sumit-dashboard`
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   ```
   NODE_ENV = production
   PORT = 10000
   DATABASE_PATH = /opt/render/project/src/data/dashboard.db
   ```
7. Add Disk:
   - **Mount Path:** `/opt/render/project/src/data`
   - **Size:** 1 GB
8. Click **"Create Web Service"**
9. **Copy your Render URL** (e.g., `https://sumit-dashboard-backend.onrender.com`)

### Step 4: Deploy Frontend to Vercel (3 min)

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import: `sumit-dashboard`
5. Configure:
   - **Root Directory:** `web`
   - **Framework:** Vite (auto-detected)
6. Add Environment Variable:
   ```
   VITE_BACKEND_URL = https://sumit-dashboard-backend.onrender.com
   ```
   (Use your actual Render URL from Step 3)
7. Click **"Deploy"**
8. **Copy your Vercel URL** (e.g., `https://sumit-dashboard.vercel.app`)

### Step 5: Connect Services (2 min)

1. Go back to **Render**
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL = https://sumit-dashboard.vercel.app
   ```
   (Use your actual Vercel URL)
3. Save → Auto-redeploys

### Step 6: Test! (1 min)

1. Visit your Vercel URL
2. Open browser console (F12)
3. Look for: `🔌 Connected to backend`
4. ✅ If you see this, you're live!

---

## 🌍 Domain Setup (Optional - Do Later)

See `DEPLOYMENT.md` for full domain setup guide.

**Quick version:**
1. Buy domain on Cloudflare (~$2-20/year)
2. Add domain to Vercel (Settings → Domains)
3. Add DNS records in Cloudflare
4. Add API subdomain to Render
5. Update environment variables

---

## 📊 URLs You'll Get

| Service | Example URL |
|---------|-------------|
| **Render Backend** | `https://sumit-dashboard-backend.onrender.com` |
| **Vercel Frontend** | `https://sumit-dashboard.vercel.app` |
| **Custom Domain** | `https://sumit.xyz` (after domain setup) |

---

## 🆘 Need Help?

- **Full Guide:** See `DEPLOYMENT.md`
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## ✅ Checklist

- [ ] Created GitHub repo
- [ ] Pushed code to GitHub
- [ ] Deployed backend to Render
- [ ] Deployed frontend to Vercel
- [ ] Connected services (updated FRONTEND_URL)
- [ ] Tested connection
- [ ] (Optional) Bought domain
- [ ] (Optional) Connected domain

---

**You're ready! Start with Step 1 above.** 🚀
