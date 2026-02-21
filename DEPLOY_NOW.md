# 🚀 এখনই Deploy করুন! (Deploy Now)

## সবচেয়ে সহজ: Railway (5 মিনিট)

### ✅ Step-by-Step:

1. **GitHub এ Code Push করুন:**
   ```bash
   git init
   git add .
   git commit -m "Ready to deploy"
   # GitHub এ নতুন repo তৈরি করুন, তারপর:
   git remote add origin https://github.com/YOUR_USERNAME/noor-e-ramadan.git
   git push -u origin main
   ```

2. **Railway এ যান:**
   - https://railway.app
   - "Start a New Project" → "Deploy from GitHub repo"
   - আপনার repo select করুন

3. **Environment Variables Add করুন:**
   Railway dashboard → Variables tab:
   ```
   GEMINI_API_KEY=your_api_key_here
   NODE_ENV=production
   ```

4. **Wait 2-3 মিনিট** - Railway automatically deploy করবে

5. **Live URL পাবেন!** 
   Format: `https://your-app-name.up.railway.app`

6. **Socket URL Set করুন:**
   Deploy হওয়ার পর Railway আপনাকে URL দেবে, সেটা add করুন:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-app-name.up.railway.app
   ```

---

## 🎯 Done! 

আপনার app এখন live! URL share করুন যেকোনো device থেকে access করতে পারবেন।

---

## 📱 Test করুন:

1. Browser-এ deployed URL open করুন
2. F12 → Console খুলুন
3. "Connected to server" message দেখবেন
4. Prayer times real-time update হবে!

---

## 🆘 Problem হলে:

- **Build fail?** → Railway logs check করুন
- **Socket connect না?** → `NEXT_PUBLIC_SOCKET_URL` check করুন
- **Port error?** → Railway automatically PORT set করে, worry করবেন না

---

## 💡 Tips:

- Railway free tier এ 500 hours/month (প্রায় 24/7)
- Automatic HTTPS
- Custom domain add করতে পারবেন later
- Real-time logs দেখতে পারবেন Railway dashboard-এ

**Happy Deploying! 🎉**
