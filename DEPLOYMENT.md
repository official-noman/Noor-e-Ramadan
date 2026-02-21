# 🚀 Deployment Guide - Noor-e-Ramadan

## Option 1: Railway (Recommended - Easiest)

### Steps:

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Railway will auto-detect Node.js

3. **Set Environment Variables:**
   In Railway dashboard, go to Variables tab and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   LATITUDE=23.8103
   LONGITUDE=90.4125
   ```

4. **Get Your Live URL:**
   - Railway will provide a URL like: `https://your-app-name.up.railway.app`
   - Update `NEXT_PUBLIC_SOCKET_URL` in Railway variables to match your Railway URL

5. **Update Socket.io CORS:**
   The server.js already allows all origins, so it should work.

---

## Option 2: Render

### Steps:

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service:**
   - Connect your GitHub repo
   - Select "Web Service"
   - Choose your repository

3. **Configure:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node

4. **Set Environment Variables:**
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   PORT=10000
   LATITUDE=23.8103
   LONGITUDE=90.4125
   ```

5. **Get Your Live URL:**
   - Render provides: `https://your-app-name.onrender.com`

---

## Option 3: Vercel (Requires Modification)

Vercel doesn't support custom servers directly. You would need to:
- Use Vercel Serverless Functions for API routes
- Deploy Socket.io separately or use Vercel's Edge Functions

**Not recommended for this app** due to Socket.io requirements.

---

## 🔧 Post-Deployment Steps

1. **Update Client Socket URL:**
   After deployment, update the Socket.io client URL in `hooks/useSocket.ts`:
   ```typescript
   const socketInstance = io(
     process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000',
     // ...
   );
   ```

2. **Set NEXT_PUBLIC_SOCKET_URL:**
   In your hosting platform's environment variables, add:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-deployed-url.com
   ```

3. **Test:**
   - Visit your deployed URL
   - Check browser console for Socket.io connection
   - Verify prayer times are updating in real-time

---

## 📝 Quick Deploy Script (Railway CLI)

If you have Railway CLI installed:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

---

## 🎯 Recommended: Railway

**Why Railway?**
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Supports custom Node.js servers
- ✅ Automatic HTTPS
- ✅ Environment variable management
- ✅ Real-time logs

**Free Tier Limits:**
- 500 hours/month
- $5 credit/month
- Perfect for development/testing

---

## ⚠️ Important Notes

1. **Socket.io on Production:**
   - Make sure your hosting platform supports WebSockets
   - Railway and Render both support WebSockets

2. **Environment Variables:**
   - Never commit `.env` file
   - Always set variables in hosting platform dashboard

3. **CORS:**
   - Current server.js allows all origins (`origin: '*'`)
   - For production, consider restricting to your domain

4. **Port:**
   - Hosting platforms assign PORT automatically
   - Server.js now uses `process.env.PORT`

---

## 🔗 After Deployment

Your app will be live at:
- Railway: `https://your-app-name.up.railway.app`
- Render: `https://your-app-name.onrender.com`

Share this URL to access your app from anywhere! 🌍
