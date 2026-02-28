# Deployment Guide — Are You Fumbling A Baddie?

This guide walks you through deploying the app to **Cloudflare Pages** with a **KV namespace** for storing quiz result stats.

---

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) (v18+)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed globally:
  ```bash
  npm install -g wrangler
  ```
- Your project pushed to a **GitHub** (or GitLab) repository

---

## Option A: Deploy via Cloudflare Dashboard (Recommended)

### 1. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/are-you-fumbling-a-baddie.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Select the **Pages** tab
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select the **are-you-fumbling-a-baddie** repository

### 3. Configure Build Settings

| Setting              | Value           |
| -------------------- | --------------- |
| **Framework preset** | None            |
| **Build command**    | `npm run build` |
| **Build output directory** | `dist`    |
| **Root directory**   | `/` (default)   |
| **Node.js version**  | `18` or higher  |

> If the Node version isn't an option in the UI, add an environment variable:
> `NODE_VERSION` = `18`

Click **Save and Deploy**.

### 4. Create a KV Namespace

The app uses Cloudflare KV to store how many people got each quiz result.

1. In the Cloudflare Dashboard, go to **Workers & Pages** → **KV**
2. Click **Create a namespace**
3. Name it `fumble-results` (or whatever you like)
4. Copy the **Namespace ID** — you'll need it next

### 5. Bind KV to Your Pages Project

1. Go to **Workers & Pages** → select your **are-you-fumbling-a-baddie** project
2. Go to **Settings** → **Functions** → **KV namespace bindings**
3. Add a binding:
   - **Variable name**: `RESULTS`
   - **KV namespace**: select `fumble-results`
4. Click **Save**

### 6. Update `wrangler.toml` (for local dev)

Open `wrangler.toml` and replace the placeholder KV ID with your actual one:

```toml
[[kv_namespaces]]
binding = "RESULTS"
id = "paste-your-actual-kv-namespace-id-here"
```

### 7. Redeploy

After binding KV, trigger a redeploy:
- Push a new commit, **or**
- Go to your Pages project → **Deployments** → click **Retry deployment** on the latest deploy

Your app is now live at:
```
https://are-you-fumbling-a-baddie.pages.dev
```

---

## Option B: Deploy via Wrangler CLI

### 1. Log In to Cloudflare

```bash
wrangler login
```

This opens a browser window for authentication.

### 2. Create the KV Namespace

```bash
wrangler kv namespace create "RESULTS"
```

Copy the output ID and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "RESULTS"
id = "the-id-from-the-command-above"
```

### 3. Build the Project

```bash
npm install
npm run build
```

### 4. Deploy

```bash
wrangler pages deploy dist
```

On first run, Wrangler will ask you to create a new project or link to an existing one. Select **Create a new project** and name it `are-you-fumbling-a-baddie`.

### 5. Bind KV Namespace

After the first deploy, bind KV through the dashboard (Step 5 in Option A above), or use:

```bash
wrangler pages project edit are-you-fumbling-a-baddie
```

Then redeploy:

```bash
npm run build && wrangler pages deploy dist
```

---

## Custom Domain (Optional)

1. Go to **Workers & Pages** → your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `fumble.yourdomain.com`)
4. Cloudflare will automatically configure DNS if the domain is on Cloudflare

---

## Local Development

Run the full stack locally (with KV simulation):

```bash
npm run build
wrangler pages dev dist
```

Or for just the frontend with hot reload:

```bash
npm run dev
```

> Note: `npm run dev` runs Vite's dev server without the Cloudflare Functions / KV layer. Use `wrangler pages dev` to test the `/api/submit` endpoint locally.

---

## Project Structure Reference

```
├── dist/                  # Build output (auto-generated)
├── functions/
│   └── api/
│       └── submit.js      # Serverless function for saving results to KV
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   └── data/
├── index.html
├── package.json
├── vite.config.js
└── wrangler.toml          # Cloudflare Pages config
```

---

## Troubleshooting

| Problem | Fix |
| ------- | --- |
| Build fails with Node version error | Set `NODE_VERSION=18` in Pages environment variables |
| `/api/submit` returns 500 | Make sure KV binding `RESULTS` is set in Pages settings |
| KV data not persisting | Verify the namespace ID in `wrangler.toml` matches the one in the dashboard |
| Styles look broken | Clear cache and redeploy — ensure `dist/` contains the CSS assets |
| Functions not executing | Confirm `functions/` directory is at the project root (not inside `src/`) |

---

## Useful Commands

```bash
# Install dependencies
npm install

# Dev server (frontend only)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy with Wrangler
wrangler pages deploy dist

# Local dev with Cloudflare Functions + KV
wrangler pages dev dist

# Check KV contents
wrangler kv key list --namespace-id YOUR_KV_ID

# View deployment logs
wrangler pages deployment tail
```
