# 🚀 Quick Deploy Guide - Noor-e-Ramadan

## সবচেয়ে সহজ উপায়: Railway (5 মিনিটে Deploy!)

### Step 1: GitHub এ Push করুন
```bash
git init
git add .
git commit -m "Initial commit - Noor-e-Ramadan"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Railway এ Deploy করুন

1. **Railway Account খুলুন:**
   - https://railway.app এ যান
   - "Start a New Project" ক্লিক করুন
   - GitHub দিয়ে login করুন

2. **Repository Connect করুন:**
   - "Deploy from GitHub repo" নির্বাচন করুন
   - আপনার repository select করুন
   - Railway automatically detect করবে Node.js

3. **Environment Variables Set করুন:**
   Railway dashboard-এ "Variables" tab-এ যান এবং add করুন:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key
   NODE_ENV=production
   LATITUDE=23.8103
   LONGITUDE=90.4125
   NEXT_PUBLIC_SOCKET_URL=https://your-app-name.up.railway.app
   ```
   ⚠️ **Important:** `NEXT_PUBLIC_SOCKET_URL` Railway আপনাকে URL দেবার পর set করুন

4. **Deploy Start হবে:**
   - Railway automatically build করবে
   - 2-3 মিনিট লাগবে
   - Success হলে আপনাকে URL দেবে

5. **Live URL পাবেন:**
   - Format: `https://your-app-name.up.railway.app`
   - এই URL share করতে পারবেন!

---

## Alternative: Render.com (Free)

1. https://render.com এ যান
2. "New +" → "Web Service" 
3. GitHub repo connect করুন
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Environment Variables add করুন (Railway এর মতো)
6. Deploy!

---

## ⚙️ Environment Variables Checklist

Deployment platform-এ এই variables add করতে হবে:

✅ **Required:**
- `GEMINI_API_KEY` - Google Gemini API key
- `NODE_ENV=production`

✅ **Optional (Default আছে):**
- `LATITUDE=23.8103` (Dhaka)
- `LONGITUDE=90.4125` (Dhaka)
- `PORT` - Platform automatically set করবে

✅ **After First Deploy:**
- `NEXT_PUBLIC_SOCKET_URL` - আপনার deployed URL (e.g., `https://your-app.up.railway.app`)

---

## 🔍 Deploy করার পর Check করুন:

1. ✅ Browser-এ deployed URL open করুন
2. ✅ Browser Console (F12) খুলে Socket.io connection check করুন
3. ✅ Prayer times দেখাচ্ছে কিনা check করুন
4. ✅ Real-time updates কাজ করছে কিনা test করুন

---

## 🎯 Railway Free Tier:

- ✅ 500 hours/month (প্রায় 24/7)
- ✅ $5 credit/month
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Perfect for this app!

---

## 📱 Mobile/Tablet থেকে Access:

Deploy করার পর যে URL পাবেন, সেটা যেকোনো device থেকে open করতে পারবেন!

**Example:** `https://noor-ramadan.up.railway.app`

---

## 🆘 Problem হলে:

1. **Build Error:** Railway logs check করুন
2. **Socket.io Connect না হলে:** `NEXT_PUBLIC_SOCKET_URL` correctly set করা আছে কিনা check করুন
3. **Prayer Times না দেখাচ্ছে:** Server logs check করুন

---

## ✅ Success হলে:

আপনার app live হবে এবং যেকোনো device থেকে access করতে পারবেন! 🎉

**Next:** Dashboard UI components build করুন!
