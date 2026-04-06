# PasharDokan UI

Next.js POS Frontend for Bangladesh grocery shops.

## Deploy to Render

### Option 1: Deploy from GitHub (Recommended)

1. **Push code to GitHub** (already done)
2. Go to [render.com](https://render.com) → Create New → **Web Service**
3. Connect your GitHub repo `PasharDokan_UI`
4. Configure:
   - **Name**: `pashar-dokan-ui`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: `Node`
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://pashardokan-api.onrender.com`
6. Click **Deploy**

### Option 2: Deploy from CLI

```bash
# Install render CLI
npm install -g render-cli

# Login
render-cli login

# Deploy
render deploy --repo https://github.com/asifuzzamanshanto/PasharDokan_UI.git
```

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://pashardokan-api.onrender.com` |

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript