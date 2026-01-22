# 🔧 Vercel Settings - Step by Step Fix

## ⚠️ Current Issue: 404 Error

The 404 error means Vercel can't find your files. This is **always** a configuration issue.

---

## ✅ **CRITICAL FIX: Set Root Directory**

This is the #1 cause of 404 errors!

### Step-by-Step:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click on your project

2. **Go to Settings:**
   - Click **"Settings"** tab (top navigation)

3. **Find Root Directory:**
   - Scroll down to **"Root Directory"** section
   - Click **"Edit"** button

4. **Set Root Directory:**
   - Enter: `web`
   - Click **"Save"**

5. **Verify it saved:**
   - Should now show: `web` (not empty or `/`)

---

## ✅ **Verify Build Settings**

While in **Settings → General**, verify:

### Framework Preset:
```
Vite
```

### Build Command:
```
npm run build
```

### Output Directory:
```
dist
```

### Install Command:
```
npm install
```

---

## ✅ **Check Environment Variables**

Go to **Settings → Environment Variables**:

1. Verify `VITE_BACKEND_URL` exists
2. Value should be your Render backend URL
3. Example: `https://sumit-dashboard-backend.onrender.com`
4. Should be set for: **Production**, **Preview**, **Development**

---

## ✅ **Redeploy After Changes**

After changing Root Directory:

1. Go to **"Deployments"** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

---

## 📊 **Expected Build Logs**

After fixing Root Directory, you should see:

```
✓ Installing dependencies...
✓ Building for production...
✓ 2096 modules transformed
✓ dist/index.html (1.19 kB)
✓ dist/assets/index-*.js (497.59 kB)
✓ dist/assets/index-*.css (73.26 kB)
✓ Build completed in ~30-60 seconds
```

**NOT** 107ms!

---

## 🆘 **If Still 404 After Root Directory Fix**

### Option 1: Delete and Recreate Project

1. Delete current Vercel project
2. Create new project
3. Import: `Sumit4482/WhatIAmDoing`
4. **During import**, set Root Directory: `web`
5. Add environment variable: `VITE_BACKEND_URL`
6. Deploy

### Option 2: Check Build Logs

1. Go to **Deployments** tab
2. Click on latest deployment
3. Check **"Build Logs"**
4. Look for errors or warnings
5. Share logs if still failing

---

## ✅ **Quick Checklist**

- [ ] Root Directory = `web` ✅ **MOST IMPORTANT**
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Framework = `Vite`
- [ ] Environment Variable `VITE_BACKEND_URL` set
- [ ] Redeployed after changes

---

**The Root Directory setting is 99% of the time the issue!** Set it to `web` and redeploy.
