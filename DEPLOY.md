# Putting your site on a domain

Your site is static (HTML/CSS/JS), so you can host it for free and point a domain at it.

---

## 1. Get a domain

Buy a domain from any registrar, e.g.:

- [Cloudflare](https://www.cloudflare.com/products/registrar/) — at-cost pricing, good DNS
- [Namecheap](https://www.namecheap.com)
- [Porkbun](https://porkbun.com)
- [Google Domains](https://domains.google) (now Squarespace)

Pick something like `karangupta.dev`, `karangupta.ca`, or `kgupta.io`.

---

## 2. Host the site (free options)

Upload your project folder. All of these support **custom domains** and **HTTPS** on the free tier.

### Option A: Netlify (easiest – drag & drop)

1. Go to [netlify.com](https://www.netlify.com) and sign up (free).
2. Drag and drop your **PersonalWebsite** folder (the one with `index.html`, `styles.css`, `script.js`) onto the Netlify dashboard.
3. Netlify gives you a URL like `random-name-123.netlify.app`.
4. To use your own domain: **Site settings → Domain management → Add custom domain** → enter your domain and follow the DNS steps below.

### Option B: Vercel

1. Go to [vercel.com](https://vercel.com) and sign up.
2. Install Vercel CLI: `npm i -g vercel` (or use the web “Import Project” if you push the site to GitHub first).
3. In your project folder run: `vercel` and follow the prompts.
4. Add your domain in the project **Settings → Domains**.

### Option C: GitHub Pages

1. Create a repo on GitHub (e.g. `username/username.github.io` for a site at `https://username.github.io`, or any repo name).
2. Push your project files (just the site files; no need for `node_modules` or backup folders).
3. **Settings → Pages** → Source: “Deploy from a branch” → branch `main`, folder `/ (root)`.
4. For a custom domain: **Settings → Pages** → Custom domain → set your domain, then add the DNS records they show you.

### Option D: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com).
2. Create a project → **Direct Upload** → upload a zip of your project folder (or connect a Git repo).
3. After deploy, go to **Custom domains** → Add your domain (especially easy if the domain is on Cloudflare).

---

## 3. Point your domain to the host (DNS)

After you add the custom domain in the host’s dashboard, they’ll tell you what to set at your domain registrar.

**Typical setup:**

- **Netlify / Vercel / similar:**  
  Add a **CNAME** record:  
  - Name: `@` (or `www` if you use www)  
  - Value: `your-site.netlify.app` (or the host’s URL they give you).  

  For the **root** domain (e.g. `karangupta.dev` without www), some hosts need an **A** record to their IP; the host’s “Custom domain” instructions will say exactly what to add.

- **Cloudflare (as registrar or DNS):**  
  If you use Cloudflare for DNS, they often configure this for you when you add the domain in Pages.

At the registrar, open **DNS** or **Manage DNS** and add the records the host asks for. Changes can take from a few minutes up to 48 hours.

---

## 4. Resume PDF

If you use **Netlify/Vercel/Cloudflare Pages**, put `KaranGuptaResume.pdf` in the same folder as `index.html` and deploy that folder. The link `KaranGuptaResume.pdf` in your header will then work. Same for GitHub Pages: add the PDF to the repo in the same directory as `index.html`.

---

## Quick path (no Git)

1. Buy a domain (e.g. Cloudflare or Namecheap).
2. Sign up at **Netlify** and drag-and-drop your **PersonalWebsite** folder.
3. In Netlify: **Domain management → Add custom domain** → enter your domain.
4. At your domain registrar, add the CNAME (or A) record Netlify shows you.
5. Wait for DNS to update; your site will be live at your domain with HTTPS.

That’s it.
