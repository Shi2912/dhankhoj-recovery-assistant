# DhanKhoj (धनखोज) — Deployment Guide

DhanKhoj is architected to support two deployment models:
1. **Unified Full-Stack Deployment (Recommended):** The Express backend serves the optimized React build (`client/dist`) and all API endpoints (`/api/*`) on a single port. No CORS configuration, no multiple domains, zero-hassle setup.
2. **Decoupled / Split Deployment:** The React client is hosted on a CDN (Vercel, Netlify) and the Express backend is hosted on a Node.js cloud runtime (Render, Railway, Fly.io).

---

## 🚀 Option 1: Render.com (Recommended — 1-Click Free Tier)

Render provides free hosting for web services and natively understands the included `render.yaml` blueprint.

### Method A: Automated via `render.yaml` Blueprint
1. Push your repository to **GitHub** or **GitLab**.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New + $\rightarrow$ Blueprint**.
3. Connect your repository. Render will automatically detect [`render.yaml`](./render.yaml).
4. Click **Apply**. Render will automatically build the client and start the server!

### Method B: Manual Web Service Setup on Render
1. In the Render Dashboard, click **New + $\rightarrow$ Web Service**.
2. Connect your Git repository.
3. Configure the settings:
   - **Name:** `dhankhoj`
   - **Region:** Singapore / Frankfurt / Oregon (any)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run build:all
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render binds automatically)
5. Click **Create Web Service**. Your app will be live at `https://dhankhoj-xxxx.onrender.com`.

---

## 🚄 Option 2: Railway.app (Instant Deploy)

Railway provides seamless full-stack Node.js hosting with persistent storage support.

1. Install Railway CLI or go to [railway.app](https://railway.app).
2. Click **New Project $\rightarrow$ Deploy from GitHub repo**.
3. Select the `unclaimed-asset-assistant` repository.
4. Set the build and start commands in **Settings $\rightarrow$ Build**:
   - **Build Command:** `npm run build:all`
   - **Start Command:** `npm start`
5. Under **Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
6. Click **Generate Domain** under **Networking**.

---

## ⚡ Option 3: Split Deployment (Vercel Frontend + Render Backend)

If you prefer deploying the frontend onto Vercel's global edge network:

### 1. Deploy the Backend to Render or Railway
- Deploy the `server/` directory:
  - **Root Directory:** `server`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
- Copy your live backend URL (e.g. `https://dhankhoj-api.onrender.com`).

### 2. Deploy Frontend to Vercel
- Go to [vercel.com](https://vercel.com) and import the repository.
- Set **Root Directory** to `client`.
- In **Environment Variables**, add:
  ```env
  VITE_API_BASE=https://dhankhoj-api.onrender.com/api
  ```
- Click **Deploy**. Vercel will build and distribute the React frontend across global CDNs!

---

## 🐳 Option 4: Docker Container (Google Cloud Run / AWS ECS / DigitalOcean)

A multi-stage [`Dockerfile`](./Dockerfile) is included in the project root. It bundles the frontend build and Node server into an optimized Alpine container under 180MB.

### 1. Build and Test Locally
```bash
# Build the Docker image
docker build -t dhankhoj:latest .

# Run the container
docker run -p 5000:5000 -e NODE_ENV=production dhankhoj:latest
```
Visit `http://localhost:5000` to verify.

### 2. Deploy to Google Cloud Run (Serverless Container)
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and submit image to Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dhankhoj

# Deploy with public access
gcloud run deploy dhankhoj \
  --image gcr.io/YOUR_PROJECT_ID/dhankhoj \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 5000 \
  --memory 1Gi
```

---

## 🖥️ Option 5: Self-Hosted Linux VPS (Ubuntu / Debian + Nginx + PM2)

If deploying on an AWS EC2, DigitalOcean Droplet, or Linode instance:

### 1. Setup Node.js on the Server
```bash
sudo apt update && sudo apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Clone & Build
```bash
git clone https://github.com/YOUR_USERNAME/unclaimed-asset-assistant.git
cd unclaimed-asset-assistant
npm run install:all
npm run build
```

### 3. Start with PM2 Process Manager
```bash
pm2 start server/src/index.js --name "dhankhoj" --env production
pm2 save
pm2 startup
```

### 4. Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/default`)
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Reload Nginx:
```bash
sudo systemctl restart nginx
```
Add free SSL with Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 Production Checklist

- [x] **Static Asset Optimization:** Vite bundles, minifies, and gzips assets in `client/dist`.
- [x] **Single-Service Express Route Fallback:** Express serves API endpoints and falls back to React SPA `index.html`.
- [x] **Zero Persistent Sensitive Docs:** OCR runs ephemerally in memory; no uploaded passbooks are retained.
- [x] **Masked Data:** Sensitive identifiers (`folioNumber`, `pfNumber`, `accountNumber`) are masked by default.
- [x] **Health Check Endpoint:** Automated monitoring via `GET /api/health`.
