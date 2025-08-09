# Quick Deployment Guide

## 🚀 Option 1: Run Locally (Recommended to see the prototype)

```bash
# 1. Navigate to project directory
cd scaler/

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:3000 - Main landing page with AI funnel
# http://localhost:3000/dashboard - Analytics dashboard
```

## 🌐 Option 2: Deploy to Vercel (Easiest)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
# Follow prompts to create account and deploy
```

3. **Get live URL** - Vercel will provide a live link

## 🔧 Option 3: Deploy to Render

1. **Create account** at render.com
2. **Connect GitHub repo** (push code to GitHub first)
3. **Create new Web Service:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18
4. **Deploy** - Render will provide live URL

## 📦 Option 4: Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Upload to Netlify:**
   - Go to netlify.com
   - Drag and drop the `out` folder
   - Get instant live URL

## 🐳 Option 5: Docker Deployment

```bash
# Create Dockerfile first, then:
docker build -t scaler-funnel .
docker run -p 3000:3000 scaler-funnel
```

## 🎯 What You'll See

### Main Landing Page (/)
- Conversion-optimized landing page
- Smart email capture popups
- AI chatbot "Alex" in bottom right
- Real-time lead tracking
- Multiple conversion touchpoints

### Analytics Dashboard (/dashboard)  
- Funnel performance metrics
- Conversion trends and analytics
- Email sequence performance
- AI-powered insights
- Interactive charts and graphs

## 🔧 Quick Fixes if Issues

If you encounter errors:

1. **Node version issues:**
```bash
nvm use 18
# or update to Node 18+
```

2. **Dependency conflicts:**
```bash
npm ci --legacy-peer-deps
```

3. **Build errors:**
```bash
npm run build --verbose
```

## 📱 Features to Test

1. **Landing Page Engagement:**
   - Scroll down 50% and wait 60 seconds → email popup appears
   - Click chatbot → intelligent conversation flow
   - Fill email form → lead scoring in action

2. **AI Chatbot:**
   - Ask about "data science career"
   - Request "consultation booking" 
   - Say "I want to switch careers"

3. **Analytics Dashboard:**
   - View funnel conversion metrics
   - See email performance data
   - Check AI insights section

## 🚨 Important Notes

- This is a **prototype/demo** - some integrations are simulated
- **Email sending** is mocked (shows console logs)
- **Lead data** is stored in browser memory
- **Analytics data** is sample/mock data
- Ready for **real integrations** (SendGrid, analytics, CRM)

## 🎯 Best Way to Demo

1. **Run locally** first to see everything working
2. **Deploy to Vercel** for easy sharing
3. **Share the live link** with stakeholders
4. **Walk through** the user journey step by step

The prototype demonstrates the complete AI-powered funnel concept and is ready for production integration!