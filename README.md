# Tax Expanded - Complete Setup Guide

A beautiful tax calculator that detects your location and calculates sales tax in real-time. Backend hosted FREE on Render, no credit card needed.

## 🎯 What You Get

- **Beautiful UI** - Clean, responsive design with dark mode support
- **Real-time Tax Rates** - Automatically fetches current rates via your API
- **Location Detection** - Uses browser geolocation to find your exact location
- **No Backend Maintenance** - API hosted on free Render service (always running)
- **Graceful Fallbacks** - Works offline with cached rates if API is down
- **Works Everywhere** - All 50 US states supported

## 📁 Files You Have

### Backend (tax-api-server.js)
- Express.js API server
- Provides three endpoints:
  - `/api/tax-rates` - Get all state rates
  - `/api/tax-rate/:state` - Get specific state
  - `/api/tax-rate-by-location?lat=X&lng=Y` - Get rate by coordinates

### Frontend (tax-calculator-render.html)
- Standalone HTML file with embedded CSS & JavaScript
- No build process needed
- Just open in browser or Vellium

### Setup Files
- `package.json` - Node.js dependencies
- `.gitignore` - Git ignore rules
- `RENDER-DEPLOYMENT.md` - Deployment instructions

## 🚀 Quick Start (5 minutes)

### Step 1: Create GitHub Repository

```bash
# Create folder
mkdir tax-api
cd tax-api

# Initialize git
git init

# Copy all files here:
# - tax-api-server.js (rename to server.js)
# - package.json
# - .gitignore
# - tax-calculator-render.html

# Commit
git add .
git commit -m "Initial commit"
```

Push to GitHub:
1. Create new repo on GitHub.com
2. Follow their instructions to push your code

### Step 2: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign up (free, no credit card)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account
5. Select your `tax-api` repository
6. Fill in:
   - **Name:** `tax-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
7. Click **"Create Web Service"**

**Your API is now live!** You'll get a URL like: `https://tax-api.onrender.com`

### Step 3: Update Calculator

In `tax-calculator-render.html`, update the API URL:

```javascript
const API_BASE_URL = 'https://tax-api.onrender.com';
```

### Step 4: Use It!

- Open `tax-calculator-render.html` in your browser
- Or embed it in your Vellium browser
- It will automatically fetch tax rates from your Render API

## 📊 Architecture

```
User Opens Calculator (HTML)
    ↓
Browser Asks for Location Permission
    ↓
Gets GPS Coordinates
    ↓
Fetches from Your Render API
    ↓
API Returns Tax Rate
    ↓
Calculates & Displays Tax
```

If API is down:
```
Falls back to OpenStreetMap Nominatim
    ↓
Gets cached Tax Foundation rates
    ↓
Still calculates correctly!
```

## 💰 Cost Breakdown

| Service | Cost | Why Free |
|---------|------|----------|
| Render API | FREE | 50GB/month bandwidth, shared CPU is plenty |
| GitHub | FREE | Free public repositories |
| OpenStreetMap | FREE | No API key needed |
| Your Domain | FREE | Get tax-api.onrender.com |
| **TOTAL** | **$0** | All free! |

## 🔄 Updating Your API

When tax rates change:

1. Edit `server.js` (update the rates in `getTaxRates()`)
2. Commit: `git add . && git commit -m "Update rates"`
3. Push: `git push origin main`
4. Render automatically re-deploys! ✨

No manual server restarts needed!

## 📱 For Vellium Browser

Since you're building Vellium browser:

1. Save calculator as `tax-calculator.html`
2. Open via file:// protocol or serve from a simple server
3. Geolocation works just like any website
4. API calls work through your Render service

The calculator is completely self-contained - no build step needed!

## 🛠️ Testing Your API

```bash
# Test if API is running
curl https://tax-api.onrender.com/api/health

# Get all tax rates
curl https://tax-api.onrender.com/api/tax-rates

# Get specific state (e.g., Oklahoma)
curl https://tax-api.onrender.com/api/tax-rate/OK

# Get by coordinates
curl "https://tax-api.onrender.com/api/tax-rate-by-location?lat=35.34&lng=-97.49"
```

## 📈 Future Improvements

As your app grows, you can:

1. **Add Real Data Sources**
   - Integrate Tax Foundation API
   - Connect to state revenue APIs
   - Use TaxJar for even more accuracy

2. **Add Database**
   - Render offers free PostgreSQL
   - Store rate history
   - Track API usage

3. **Auto-Update Rates**
   - Use cron jobs to check for rate changes
   - Automatic updates 24/7

4. **Upgrade to Paid**
   - Only if you get 1000s of users
   - Render scales easily
   - Still affordable ($5-10/month for most apps)

## ⚠️ Limitations (Free Tier)

- Shared CPU (perfect for this use case)
- 0.5GB RAM (plenty)
- 50GB/month bandwidth (way more than needed)
- No auto-scaling (scales manually)

For Tax Expanded, free tier is MORE than enough!

## 🔐 Security Notes

- API is public (tax rates are public info anyway)
- No sensitive data stored
- HTTPS/SSL included free with Render
- Add rate limiting if needed:
  ```javascript
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use(limiter);
  ```

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Express.js Docs](https://expressjs.com)
- [Nominatim API](https://nominatim.org)
- [GitHub Docs](https://docs.github.com)

## 🎉 You're Done!

You now have:
✅ Beautiful calculator UI
✅ Dedicated API backend (always running, free)
✅ Real-time tax rates
✅ Location detection
✅ Zero monthly costs
✅ Production-ready app

Perfect for Vellium integration! 🚀

---

**Questions?** Check `RENDER-DEPLOYMENT.md` for detailed instructions.
