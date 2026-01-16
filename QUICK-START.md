# ⚡ Quick Start - Deploy in 5 Minutes

## Super Simple Version (If you just want it done!)

### 1. Create GitHub Repository
- Go to github.com
- Click "+" → "New repository"
- Name it: `panther`
- Make it **Public**
- Click "Create repository"

### 2. Open Terminal in Your Project Folder
**Windows:** Navigate to `panther-complete\panther-complete` folder, click address bar, type `powershell`, press Enter

**Mac:** Right-click folder → "New Terminal at Folder"

### 3. Run These Commands (Replace YOUR-USERNAME):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/panther.git
git push -u origin main
```

*(If asked for password, use a Personal Access Token - see full guide)*

### 4. Deploy to GitHub Pages:

```bash
npm run deploy
```

### 5. Enable GitHub Pages:
- Go to your repo on GitHub
- Settings → Pages
- Source: `gh-pages` branch
- Save

### 6. Wait 2 minutes, then visit:
```
https://YOUR-USERNAME.github.io/panther/
```

### 7. Add to iPhone:
- Open Safari
- Visit your site
- Share button → "Add to Home Screen"

**Done!** 🎉

---

**For detailed instructions, see DEPLOYMENT.md**
