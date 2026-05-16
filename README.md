# Hasnain Haroon — Personal Portfolio

> **Civil Engineer + Structural Analyst + AI Researcher**  
> Built with HTML · CSS · JavaScript | Deployable on GitHub Pages

---

## 📁 Folder Structure

```
portfolio/
├── index.html       ← Main website file
├── style.css        ← All styling
├── script.js        ← Animations & interactivity
├── profile.jpg      ← YOUR PHOTO (add this!)
├── resume.pdf       ← YOUR RESUME (add this!)
└── README.md        ← This file
```

---

## 🚀 How to Deploy on GitHub Pages

### Step 1 — Create a GitHub Account
Go to https://github.com and sign up (or log in).

### Step 2 — Create a Repository
1. Click the **"+"** button → **"New repository"**
2. Name it exactly: `YOUR_USERNAME.github.io`
   - Example: if your GitHub username is `hasnainharoon`, name it `hasnainharoon.github.io`
3. Set it to **Public**
4. Click **"Create repository"**

### Step 3 — Upload Your Files
**Option A — Using GitHub Website (easiest):**
1. Open your new repository
2. Click **"uploading an existing file"** or **"Add file" → "Upload files"**
3. Drag and drop all files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `profile.jpg` (your photo)
   - `resume.pdf` (your CV)
4. Scroll down and click **"Commit changes"**

**Option B — Using Git (command line):**
```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repository **Settings**
2. Click **"Pages"** in the left sidebar
3. Under **"Branch"**, select `main` and click **Save**
4. Wait 1-2 minutes

### Step 5 — Visit Your Site 🎉
Your portfolio is live at:  
**`https://YOUR_USERNAME.github.io`**

---

## ✏️ How to Edit Content

### Change Your Name / Bio
Open `index.html` and search for text you want to change.
Edit directly and re-upload.

### Add Your Photo
- Name your photo file exactly `profile.jpg`
- Upload it to the same folder
- The badge in the hero section will automatically show it

### Add Your Resume
- Name your CV file exactly `resume.pdf`
- Upload it to the same folder
- The download buttons will work automatically

### Update Social Links
In `index.html`, search for `YOUR_GITHUB` and `YOUR_LINKEDIN` and replace with your actual usernames.

### Add Certifications
In `index.html`, find the `<!-- CERTIFICATIONS -->` section and edit the `.cert-card` divs.

### Add New Projects
In `index.html`, find the project grid section and copy-paste a `.project-card` block.

### Change the Color Accent
In `style.css`, find `--accent: #f0a500;` and change the hex code to any color.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#f0a500` | Gold highlights, borders |
| `--bg` | `#0a0c10` | Main background |
| `--surface` | `#171d28` | Cards & panels |
| Font (headings) | Syne | Bold modern display |
| Font (mono) | DM Mono | Labels, tags, code |
| Font (italic) | Crimson Pro | Taglines, subtext |

---

## 📱 Browser Support
Chrome · Firefox · Safari · Edge · Mobile browsers ✅

---

*Built with precision for Hasnain Haroon · 2026*
