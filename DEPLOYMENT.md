# 🚀 Deployment Guide - Sumit Dashboard

Complete step-by-step guide to deploy your dashboard to production.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Render account (free)
- ✅ Vercel account (free)
- ✅ Cloudflare account (for domain)

---

## 🗄️ Step 1: Push to GitHub

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `sumit-dashboard`
3. Description: `Real-time personal accountability dashboard`
4. Visibility: **Public** (or Private if you prefer)
5. **Don't** initialize with README (we already have code)
6. Click "Create repository"

### 1.2 Push Your Code

Run these commands in your terminal:

```bash
cd /Users/igdclt0379/Downloads/sumit-dashboard

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sumit-dashboard.git

# Push to GitHub
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use GitHub CLI: `gh auth login`
- Or use SSH: `git remote set-url origin git@github.com:YOUR_USERNAME/sumit-dashboard.git`

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account (if not already connected)
3. Select repository: **`sumit-dashboard`**
4. Click **"Connect"**

### 2.3 Configure Service

Fill in these settings:

```
Name: sumit-dashboard-backend
Environment: Node
Region: Oregon (US West) [or closest to you]
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 2.4 Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"** → Add:

```
NODE_ENV = production
PORT = 10000
DATABASE_PATH = /opt/render/project/src/data/dashboard.db
FRONTEND_URL = https://your-vercel-url.vercel.app
```

**Note:** Leave `FRONTEND_URL` as placeholder for now, we'll update it after Vercel deployment.

### 2.5 Add Persistent Disk

Scroll down to **"Disks"** section:

1. Click **"Add Disk"**
2. Fill in:
   ```
   Name: dashboard-db
   Mount Path: /opt/render/project/src/data
   Size: 1 GB
   ```
3. Click **"Add Disk"**

### 2.6 Deploy

1. Click **"Create Web Service"**
2. Wait ~5 minutes for first deployment
3. Copy your Render URL: `https://sumit-dashboard-backend.onrender.com`

**Save this URL** - you'll need it for Vercel!

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select **`sumit-dashboard`** repository
3. Click **"Import"**

### 3.3 Configure Project

Vercel should auto-detect settings, but verify:

```
Framework Preset: Vite
Root Directory: web
Build Command: npm run build (auto-detected)
Output Directory: dist (auto-detected)
Install Command: npm install (auto-detected)
```

### 3.4 Add Environment Variable

Scroll to **"Environment Variables"** → Add:

```
VITE_BACKEND_URL = https://sumit-dashboard-backend.onrender.com
```

**Replace** `sumit-dashboard-backend.onrender.com` with your actual Render URL!

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait ~2 minutes
3. Copy your Vercel URL: `https://sumit-dashboard.vercel.app`

**Save this URL** - you'll need it for Render!

---

## 🔄 Step 4: Connect Render and Vercel

### 4.1 Update Render with Vercel URL

1. Go back to **Render Dashboard**
2. Click on your backend service: `sumit-dashboard-backend`
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL:
   ```
   FRONTEND_URL = https://sumit-dashboard.vercel.app
   ```
6. Click **"Save Changes"**
7. Render will automatically redeploy

### 4.2 Verify Connection

1. Open your Vercel URL: `https://sumit-dashboard.vercel.app`
2. Open browser console (F12)
3. Look for: `🔌 Connected to backend`
4. If you see connection errors, check:
   - Render service is running (green status)
   - `FRONTEND_URL` in Render matches your Vercel URL exactly
   - CORS settings are correct

---

## 🌍 Step 5: Buy Domain on Cloudflare

### 5.1 Register Domain

1. Go to https://dash.cloudflare.com
2. Click **"Register Domains"** (or go to https://www.cloudflare.com/products/registrar/)
3. Search for your desired domain (e.g., `sumit.xyz`, `sumit.live`)
4. Add to cart and checkout
5. Complete purchase

**Domain Suggestions:**
- `sumit.xyz` (~$2/year) - Cheapest
- `sumit.live` (~$20/year) - Professional
- `sumit.dev` (~$15/year) - Developer-friendly
- `sumit.tech` (~$20/year) - Tech-focused

### 5.2 Domain is Automatically Configured

Cloudflare automatically sets up DNS for your domain. You're ready to connect!

---

## 🔗 Step 6: Connect Domain to Services

### 6.1 Connect Domain to Vercel (Frontend)

1. Go to **Vercel Dashboard**
2. Click on your project: `sumit-dashboard`
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter your domain: `sumit.xyz` (or whatever you bought)
6. Click **"Add"**
7. Vercel will show DNS records to add

### 6.2 Add DNS Records in Cloudflare

1. Go to **Cloudflare Dashboard**
2. Select your domain
3. Go to **DNS** → **Records**
4. Add these records:

   **For Root Domain:**
   ```
   Type: A
   Name: @
   Content: 76.76.21.21
   Proxy: ✅ Proxied (orange cloud)
   ```

   **For WWW:**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy: ✅ Proxied (orange cloud)
   ```

5. Click **"Save"**
6. Wait 5-10 minutes for DNS propagation

### 6.3 Connect API Subdomain to Render (Backend)

1. Go to **Render Dashboard**
2. Click on your backend service
3. Go to **Settings** → **Custom Domains**
4. Click **"Add Custom Domain"**
5. Enter: `api.sumit.xyz` (replace with your domain)
6. Render will show DNS records

### 6.4 Add API DNS Record in Cloudflare

1. Go back to **Cloudflare DNS**
2. Add CNAME record:

   ```
   Type: CNAME
   Name: api
   Target: sumit-dashboard-backend.onrender.com
   Proxy: ❌ DNS only (gray cloud - important for WebSockets!)
   ```

   **Important:** Use **DNS only** (gray cloud) for API subdomain, not proxied!

3. Click **"Save"**

### 6.5 Update Environment Variables

**In Vercel:**
1. Go to **Settings** → **Environment Variables**
2. Update `VITE_BACKEND_URL`:
   ```
   VITE_BACKEND_URL = https://api.sumit.xyz
   ```
3. Redeploy (Vercel will auto-redeploy on env var change)

**In Render:**
1. Go to **Environment** tab
2. Add/Update:
   ```
   ALLOWED_ORIGINS = https://sumit.xyz,https://www.sumit.xyz
   ```
3. Render will auto-redeploy

---

## ✅ Step 7: Test Everything

### 7.1 Test Frontend

1. Visit: `https://sumit.xyz`
2. Check browser console for: `🔌 Connected to backend`
3. Verify dashboard loads with data

### 7.2 Test Backend API

1. Visit: `https://api.sumit.xyz/health`
2. Should return: `{"status":"ok"}`

### 7.3 Test WebSocket Connection

1. Open browser console on `https://sumit.xyz`
2. Look for WebSocket connection logs
3. Try changing mood/tasks - should sync in real-time

### 7.4 Test Mobile App (Optional)

1. Update mobile app's backend URL to `https://api.sumit.xyz`
2. Test on device or Expo Go
3. Verify sync with web dashboard

---

## 🐛 Troubleshooting

### Backend won't start on Render

**Check:**
- Render logs: Service → Logs
- `DATABASE_PATH` matches disk mount path
- `PORT=10000` (Render's default)
- Disk is mounted correctly

**Fix:**
- Verify disk mount path: `/opt/render/project/src/data`
- Check `DATABASE_PATH` env var matches

### WebSocket connection fails

**Check:**
- CORS settings in Render
- `FRONTEND_URL` matches your domain exactly
- API subdomain uses **DNS only** (not proxied) in Cloudflare

**Fix:**
- Update `ALLOWED_ORIGINS` in Render
- Ensure API CNAME is **gray cloud** (DNS only) in Cloudflare

### Database resets on restart

**Check:**
- Disk is persistent (not ephemeral)
- `DATABASE_PATH` points to disk mount path
- Disk size is sufficient (1GB should be plenty)

**Fix:**
- Verify disk mount path
- Check disk is attached to service

### Domain not working

**Check:**
- DNS propagation (can take up to 48 hours, usually 5-10 min)
- DNS records are correct
- SSL certificate is issued (automatic on Vercel/Render)

**Fix:**
- Wait for DNS propagation
- Verify DNS records match exactly
- Check Cloudflare SSL/TLS mode: **Full** or **Full (strict)**

---

## 📊 Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Render Backend** | `https://sumit-dashboard-backend.onrender.com` | API + WebSocket |
| **Vercel Frontend** | `https://sumit-dashboard.vercel.app` | Web Dashboard |
| **Custom Domain** | `https://sumit.xyz` | Your domain |
| **API Subdomain** | `https://api.sumit.xyz` | Backend on your domain |

---

## 💰 Cost Summary

| Service | Monthly | Yearly |
|---------|---------|--------|
| **Render** | FREE | FREE |
| **Vercel** | FREE | FREE |
| **Cloudflare** | FREE | FREE |
| **Domain** | - | $2-20 |
| **Total** | **$0** | **$2-20** |

---

## 🎉 You're Live!

Your dashboard is now accessible to the world at:
- **Web:** `https://sumit.xyz`
- **API:** `https://api.sumit.xyz`

Share it with friends and let them roast you! 🔥

---

## 📝 Next Steps

- [ ] Set up monitoring (optional)
- [ ] Add analytics (optional)
- [ ] Customize domain email (optional)
- [ ] Set up backups (optional)

---

**Need Help?** Check the logs in Render/Vercel dashboards or open an issue on GitHub!
