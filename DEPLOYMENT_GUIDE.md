# Seekr Deployment Guide

## ✅ **Deployment Status: COMPLETE**

Your Seekr AI platform has been successfully deployed to GitHub Pages!

## 🌐 **Live Site**
- **Domain**: [seekr.study](https://seekr.study)
- **GitHub Pages URL**: [adikum26.github.io/Seekr](https://adikum26.github.io/Seekr)

## 📋 **What Was Done**

### 1. **Build Configuration**
- ✅ Created `public/CNAME` file with `seekr.study`
- ✅ Configured `vite.config.ts` with proper base path
- ✅ Fixed TypeScript linting errors
- ✅ Built production bundle (`npm run build`)

### 2. **GitHub Pages Deployment**
- ✅ Deployed to `gh-pages` branch
- ✅ Static files published to GitHub Pages
- ✅ CNAME file included in deployment

### 3. **Git Repository**
- ✅ All changes committed to `main` branch
- ✅ Pushed to GitHub remote

## 🔧 **DNS Configuration Required**

To make **seekr.study** work, you need to configure DNS records in your domain registrar (Porkbun):

### **Option A: Using A Records (Recommended for Apex Domain)**

Add these **A records** in Porkbun DNS settings:

```
Type: A
Host: @ (or leave blank for root domain)
Answer: 185.199.108.153
TTL: 600 (or default)

Type: A
Host: @
Answer: 185.199.109.153
TTL: 600

Type: A
Host: @
Answer: 185.199.110.153
TTL: 600

Type: A
Host: @
Answer: 185.199.111.153
TTL: 600
```

### **Option B: Using CNAME with www subdomain**

If you want to use `www.seekr.study`:

```
Type: CNAME
Host: www
Answer: adikum26.github.io
TTL: 600
```

Then redirect `seekr.study` → `www.seekr.study` in Porkbun settings.

## 🔐 **GitHub Repository Settings**

1. Go to: `https://github.com/AdiKum26/Seekr/settings/pages`
2. Verify settings:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` / `root`
   - **Custom domain**: `seekr.study`
   - **Enforce HTTPS**: ✅ Enabled (wait for DNS propagation first)

## 🚀 **How to Deploy Future Updates**

Whenever you make changes and want to update the live site:

```bash
# 1. Build the production version
npm run build

# 2. Deploy to GitHub Pages
npm run deploy

# 3. Commit and push source code changes
git add .
git commit -m "feat: Your update description"
git push origin main
```

## ⏱️ **DNS Propagation Time**

- **Initial setup**: 15 minutes - 48 hours
- **Check status**: Use [whatsmydns.net](https://www.whatsmydns.net) to verify
- **HTTPS certificate**: Will be provisioned automatically by GitHub after DNS is verified

## 🧪 **Testing**

While DNS propagates, you can test the deployment at:
- `https://adikum26.github.io/Seekr`

Once DNS is configured:
- `https://seekr.study`
- `https://www.seekr.study` (if using CNAME approach)

## ⚠️ **Important Notes**

### **Backend API Consideration**
Your app uses a backend API running on `localhost:3002` for PDF parsing. For production:

1. **Option A**: Deploy backend to a service (Heroku, Railway, Render)
2. **Option B**: Use serverless functions (Vercel, Netlify)
3. **Option C**: Migrate PDF parsing to AWS Lambda (aligns with your AWS architecture)

Update the API endpoint in `src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3002';
```

### **Environment Variables**
Make sure to set production environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key (for demo mode)

## 📞 **Need Help?**

If the domain doesn't work after 48 hours:
1. Verify DNS records in Porkbun are correct
2. Check GitHub Pages settings
3. Ensure CNAME file is in the `gh-pages` branch
4. Try disabling and re-enabling custom domain in GitHub settings

## 🎉 **Success Checklist**

- ✅ Production build created
- ✅ Deployed to GitHub Pages
- ✅ CNAME file configured
- ✅ Code committed and pushed
- ⏳ DNS records configured in Porkbun (TO DO)
- ⏳ Wait for DNS propagation
- ⏳ Verify HTTPS certificate

---

**Last Updated**: October 19, 2025
**Repository**: https://github.com/AdiKum26/Seekr
**Live Site**: https://seekr.study (pending DNS)

