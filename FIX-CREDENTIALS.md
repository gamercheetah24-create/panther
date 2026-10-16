# Fix Credential Mismatch

## The Problem
Git is using credentials for `Nishanth3424` but your repo is under `gamercheetah24-create`.

## Solution: Update Remote URL

Run these commands:

```powershell
git remote set-url origin https://github.com/gamercheetah24-create/panther.git
git push -u origin main
```

If it still asks for credentials, use a Personal Access Token (see below).

---

## Alternative: Clear Old Credentials

If the above doesn't work, clear cached credentials:

**Windows:**
```powershell
git credential-manager-core erase
```

Then when you push, it will ask for credentials fresh.

---

## Using Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Panther Deployment"
4. Check `repo` checkbox
5. Click "Generate token"
6. **COPY THE TOKEN** (starts with `ghp_...`)
7. When Git asks for username: `gamercheetah24-create`
8. When Git asks for password: paste the token
