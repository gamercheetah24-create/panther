# Fix Branch Name Issue

## The Problem
You created a commit on `master` branch but tried to push to `main`. 

## The Solution
Run these commands **one at a time** in PowerShell:

```powershell
git branch -M main
git push -u origin main
```

That's it! This will:
1. Rename your `master` branch to `main`
2. Push to GitHub

---

## If you get authentication errors:

You'll need a Personal Access Token. Here's how:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Panther Deployment"
4. Check the `repo` box
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When Git asks for password, paste the token (not your GitHub password)
