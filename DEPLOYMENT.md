# 🚀 Complete Deployment Guide - Panther Protocol

## Step-by-Step Instructions for GitHub Pages Deployment

### Prerequisites
- ✅ GitHub account (you have this!)
- ✅ Git installed on your computer
- ✅ Your Panther app code ready

---

## PART 1: Initial Setup (One-Time)

### Step 1: Install Git (if not already installed)

**Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run the installer (use default settings)
3. Open PowerShell or Command Prompt

**Mac:**
1. Open Terminal
2. Type: `git --version` (if it shows a version, you're good!)
3. If not, install from: https://git-scm.com/download/mac

**Verify Installation:**
```bash
git --version
```
You should see something like: `git version 2.x.x`

---

### Step 2: Configure Git (One-Time Setup)

Open PowerShell/Terminal and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

(Use the same email as your GitHub account)

---

## PART 2: Create GitHub Repository

### Step 3: Create New Repository on GitHub

1. **Go to GitHub.com** and log in
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Fill in the details:**
   - **Repository name:** `panther` (or `panther-protocol` or any name you like)
   - **Description:** "Zero Friction Workout App"
   - **Visibility:** Choose **Public** (required for free GitHub Pages)
   - **DO NOT** check "Add a README file" (we'll add files manually)
   - **DO NOT** add .gitignore or license
5. **Click "Create repository"**

---

### Step 4: Copy Repository URL

After creating the repo, GitHub will show you a page with setup instructions. You'll see a URL like:
```
https://github.com/YOUR-USERNAME/panther.git
```

**Copy this URL** - you'll need it in the next step!

---

## PART 3: Upload Your Code to GitHub

### Step 5: Open Terminal in Your Project Folder

**Windows:**
1. Open File Explorer
2. Navigate to: `C:\Users\nisha\Downloads\panther-complete\panther-complete`
3. Click in the address bar, type `powershell`, press Enter

**Mac:**
1. Open Finder
2. Navigate to your project folder
3. Right-click → "New Terminal at Folder"

---

### Step 6: Initialize Git Repository

In the terminal, run these commands **one at a time**:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Panther Protocol v5.0"
```

---

### Step 7: Connect to GitHub and Push

Replace `YOUR-USERNAME` with your actual GitHub username:

```bash
# Add GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/panther.git

# Rename main branch (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**You'll be asked to log in:**
- GitHub may ask for your username and password
- For password, you'll need a **Personal Access Token** (see Step 8 below)

---

### Step 8: Create Personal Access Token (if needed)

If GitHub asks for a password:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Name it:** "Panther Deployment"
4. **Select scopes:** Check `repo` (this gives full repository access)
5. **Click "Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## PART 4: Deploy to GitHub Pages

### Step 9: Update Vite Config for Deployment

Your `vite.config.js` should have the base path. If your repo is named `panther`, keep it as is. If different, update it:

```javascript
// vite.config.js
base: '/YOUR-REPO-NAME/',
```

---

### Step 10: Build and Deploy

Run this command in your project folder:

```bash
npm run deploy
```

This will:
1. Build your app for production
2. Deploy it to GitHub Pages automatically

**First time:** You may need to authorize GitHub Pages. Follow the prompts.

---

### Step 11: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. Scroll down to **"Pages"** (left sidebar)
4. Under **"Source"**, select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
5. Click **"Save"**

---

### Step 12: Wait and Access Your Site

1. **Wait 1-2 minutes** for GitHub to build your site
2. Your site will be available at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```
   Example: `https://johndoe.github.io/panther/`

3. **Check it:** Click the link GitHub shows you, or visit the URL above

---

## PART 5: Make It a Web App on iPhone

### Step 13: Add to iPhone Home Screen

1. **Open Safari** on your iPhone (not Chrome!)
2. **Navigate to your website:** `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
3. **Tap the Share button** (square with arrow pointing up)
4. **Scroll down and tap "Add to Home Screen"**
5. **Edit the name** if you want (e.g., "Panther")
6. **Tap "Add"**

Your app icon will appear on your home screen! 🎉

---

### Step 14: Test as Web App

1. **Tap the icon** on your home screen
2. It should open **fullscreen** (no Safari browser bars)
3. The logo should appear correctly
4. Everything should work like a native app!

---

## PART 6: Future Updates

### When You Make Changes:

1. **Make your code changes**
2. **In terminal, run:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push
   npm run deploy
   ```
3. **Wait 1-2 minutes** for GitHub to update
4. **Refresh your website** - changes will be live!

---

## Troubleshooting

### ❌ "Repository not found"
- Check your repository name matches
- Make sure repository is **Public**

### ❌ "Authentication failed"
- Use Personal Access Token instead of password
- Make sure token has `repo` scope

### ❌ "Site not loading"
- Wait 2-3 minutes after first deploy
- Check GitHub Pages settings (should be `gh-pages` branch)
- Clear browser cache

### ❌ "Logo not showing"
- Make sure `panther-logo.svg` is in the `public` folder
- Check the path in `vite.config.js` matches your repo name

### ❌ "404 Error"
- Check the base path in `vite.config.js` matches your repo name
- Make sure you're visiting the correct URL

---

## Quick Reference

**Your website URL:**
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

**Deploy command:**
```bash
npm run deploy
```

**Update code:**
```bash
git add .
git commit -m "Your message"
git push
npm run deploy
```

---

## Need Help?

- GitHub Docs: https://docs.github.com/en/pages
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics

---

**🎉 Congratulations!** Your Panther Protocol app is now live on the web and ready to use as a web app on iPhone!
