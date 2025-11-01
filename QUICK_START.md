# Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

Open browser to: **http://localhost:8080**

That's it! 🎉

---

## ✅ Verify Everything Works

### Check the App Loads
- [ ] Landing page shows "Transform Claims Chaos" heading
- [ ] Two CTA buttons: "User" and "Team"
- [ ] No errors in browser console

### Check API Works
Open new terminal and run:
```bash
# Test API health
curl http://localhost:8080/api/health

# Test getting claims
curl http://localhost:8080/api/claims

# Test getting queues
curl http://localhost:8080/api/queues
```

You should see JSON responses (not errors).

---

## 🗺️ Navigation

| URL | Purpose |
|---|---|
| `/` | Landing page |
| `/upload` | User claim form |
| `/upload-confirmation` | Success page |
| `/team` | Team claims list |
| `/team/claims/:id` | Claim details |
| `/dashboard` | Dashboard (placeholder) |

---

## 📝 File Structure

```
client/                          # Frontend React app
├── pages/                        # Route pages
│   ├── LandingPage.tsx
│   ├── UploadPage.tsx
│   ├── TeamClaimsPage.tsx
│   └── ClaimDetailPage.tsx
├── components/                   # Reusable components
│   ├── claims/                   # Claims-specific
│   ├── shared/                   # Shared UI components
│   └── ui/                       # Pre-built UI library
├── api/                          # API wrappers
│   └── claims.ts                 # Claims API calls
└── App.tsx                       # Main app router

server/                          # Backend Express app
├── index.ts                      # Server setup
├── routes/                       # API routes
│   ├── claims.ts                 # Claims endpoints
│   ├── queues.ts                 # Queues endpoints
│   └── demo.ts                   # Example endpoint
└── node-build.ts                 # Production entry point

shared/                          # Shared code
└── api.ts                        # Shared types

.env                             # Default configuration
.env.development                 # Dev environment vars
.env.production                  # Production environment vars
```

---

## 🔧 Common Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server (hot reload) |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm typecheck` | Check TypeScript |
| `pnpm test` | Run tests |
| `pnpm format.fix` | Format code |

---

## 🚀 Deploy to Production

### Quick Deploy to Fly.io

```bash
# 1. Install Fly CLI (first time only)
brew install flyctl

# 2. Initialize (creates fly.toml)
fly launch

# 3. Deploy
fly deploy

# 4. View logs
fly logs
```

For other platforms (Vercel, Netlify, Render, Railway), see `DEPLOYMENT.md`

---

## 🆘 Troubleshooting

### "Failed to fetch" errors?
- Check browser Network tab
- Verify API calls going to `/api/claims` (not `http://localhost:8000`)
- Check server is running: `curl http://localhost:8080/api/health`

### Port 8080 already in use?
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### TypeScript errors?
```bash
pnpm typecheck
# Fix any errors shown
```

### Can't install dependencies?
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📚 Learn More

- **Full setup guide**: See `DEPLOYMENT.md`
- **Configuration details**: See `CONFIG_SUMMARY.md`
- **API reference**: Check `server/routes/` files
- **Type definitions**: Check `shared/api.ts`

---

## 💡 Next Steps

1. ✅ Get app running locally (you are here!)
2. 🔗 Connect to real backend (update `.env` files)
3. 🗄️ Add database (replace mock data in `server/routes/`)
4. 🔐 Add authentication (implement JWT or OAuth)
5. 🚀 Deploy to production (see `DEPLOYMENT.md`)

---

## 🎯 Key Points

- **Frontend & Backend**: Integrated in single app
- **No Database Yet**: Uses mock data (ready to swap for real DB)
- **Relative URLs**: API calls use `/api` (works anywhere)
- **Hot Reload**: Code changes auto-reload in dev mode
- **Production Ready**: Can deploy to any Node.js host

---

Happy coding! 🚀

