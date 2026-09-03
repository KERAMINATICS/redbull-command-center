# Dashboard site

A single static `index.html` (Chart.js from a CDN, no build step, no backend). This is what
you deploy to Vercel — not the repository root.

## Why the original deploy failed

Vercel saw `requirements.txt` at the repo root and assumed this was a Python **web service**,
then looked for a server entrypoint (`app.py`, `main.py`, etc.) that doesn't exist — this
project only ever produced static outputs (CSVs, charts, docs), never a running server. This
`site/` folder sidesteps that entirely: it's pure HTML/CSS/JS, so Vercel has nothing Python to
misdetect.

## Deploy this folder specifically

**Option A — one repo, set the root directory (recommended):**
1. Push the whole `redbull-channel-analytics/` repo to GitHub as-is.
2. In Vercel: **Add New → Project → Import** your repo.
3. Before deploying, expand **Root Directory** and set it to `site`.
4. Framework preset: **Other**. Leave build command and output directory blank.
5. Deploy. Vercel will only ever see this folder — the root `requirements.txt` is invisible to it.

**Option B — separate repo:**
Copy just this `site/` folder into its own GitHub repo and import that repo directly with the
same "Other" framework preset. Simplest if you don't want the two concerns (analysis vs. site)
in one place.

## Before you deploy

Open `index.html`, search for `YOUR-USERNAME`, and replace the three `repo` link targets near
the bottom of the `<script>` block with your actual GitHub repo URL, e.g.:

```js
const repo = "https://github.com/kartikbhise/redbull-channel-analytics";
```

## Local preview

No install needed — just open `index.html` in a browser, or serve it:

```bash
cd site
python3 -m http.server 8000
# visit http://localhost:8000
```
