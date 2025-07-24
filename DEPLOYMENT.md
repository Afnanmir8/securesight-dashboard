# SecureSight Dashboard - Deployment Guide

## 🚀 Deploy to GitHub and Vercel

Follow these steps to deploy your SecureSight Dashboard:

### 📁 Step 1: Prepare for GitHub

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SecureSight Dashboard with all features"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub.com](https://github.com)
   - Click "New repository"
   - Name: `securesight-dashboard`
   - Description: "CCTV monitoring dashboard with incident management and interactive timeline"
   - Set to Public or Private
   - Click "Create repository"

3. **Connect Local to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/securesight-dashboard.git
   git branch -M main
   git push -u origin main
   ```

### 🌐 Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `securesight-dashboard` repository
5. Configure environment variables (see below)
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### ⚙️ Step 3: Environment Variables for Vercel

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Database (Vercel Postgres or external DB)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Application
NEXT_PUBLIC_APP_NAME="SecureSight Dashboard"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV="production"

# Security
NEXTAUTH_SECRET="your-production-secret-key-32-chars-long"
NEXTAUTH_URL="https://your-app-name.vercel.app"
```

### 🗄️ Step 4: Database for Production

#### Option A: Vercel Postgres (Recommended)
1. In Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Copy the connection string to `DATABASE_URL`

#### Option B: External Database
- Use Neon, Supabase, or PlanetScale
- Update `DATABASE_URL` with the connection string

### 🔧 Step 5: Update Prisma for Production

1. **Update schema for production**:
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"  // Change from sqlite
     url      = env("DATABASE_URL")
   }
   ```

2. **Generate and deploy**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

### 📋 Complete Deployment Commands

```bash
# 1. Prepare and commit
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy to Vercel
vercel --prod

# 3. Set up database (after deployment)
npx prisma db push
npx prisma db seed
```

### 🎯 Post-Deployment Checklist

- [ ] ✅ Application loads correctly
- [ ] ✅ API endpoints work (`/api/incidents`)
- [ ] ✅ Database connections established
- [ ] ✅ Static assets load (thumbnails, videos)
- [ ] ✅ Incident resolution works
- [ ] ✅ Timeline is interactive

### 🔗 URLs After Deployment

- **GitHub Repository**: `https://github.com/YOUR_USERNAME/securesight-dashboard`
- **Live Application**: `https://YOUR_APP_NAME.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/YOUR_USERNAME/securesight-dashboard`

### 🛠️ Troubleshooting

**Common Issues:**

1. **Database Connection Error**:
   - Check `DATABASE_URL` in environment variables
   - Ensure database is accessible from Vercel

2. **Build Failures**:
   - Check TypeScript errors
   - Verify all dependencies in `package.json`

3. **Static Assets Not Loading**:
   - Ensure paths use `/public/` prefix
   - Check `next.config.ts` image settings

### 📱 Mobile and Performance

The dashboard is responsive and works on:
- ✅ Desktop browsers
- ✅ Tablet devices  
- ✅ Mobile phones
- ✅ Touch interactions for timeline

---

**Your SecureSight Dashboard is now ready for the world! 🚀**
