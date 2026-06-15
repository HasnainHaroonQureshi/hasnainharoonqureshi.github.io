# Hasnain Haroon — Personal Portfolio Website

**Live:** https://hasnainharoonqureshi.github.io/

---

## 📁 Folder Structure

```
portfolio/
├── index.html        ← Main HTML (all content)
├── style.css         ← All styles (dark theme, animations, responsive)
├── script.js         ← Interactivity (scroll, animations, form, cursor)
├── profile.jpg       ← YOUR PHOTO — add this file (see below)
├── resume.pdf        ← YOUR CV — add this file (see below)
└── README.md         ← This file
```

---

## 🚀 Deploy to GitHub Pages — Step by Step

### Step 1: Create a GitHub Account
- Go to https://github.com and sign up (if you haven't already)
- Your username should match what you want in the URL (e.g. `hasnainharoonqureshi`)

### Step 2: Create a New Repository
1. Click the **+** icon → **New repository**
2. Name it exactly: `hasnainharoonqureshi.github.io`
   _(Replace `hasnainharoonqureshi` with your actual GitHub username)_
3. Set it to **Public**
4. Click **Create repository**

### Step 3: Upload Your Files
**Option A — Upload via Browser (Easiest):**
1. Open your new repository on GitHub
2. Click **Add file** → **Upload files**
3. Drag and drop ALL files: `index.html`, `style.css`, `script.js`, `profile.jpg`, `resume.pdf`
4. Scroll down → Write commit message: `"Add portfolio website"`
5. Click **Commit changes**

**Option B — Using Git (Recommended):**
```bash
# In your portfolio folder:
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository → **Settings** tab
2. Scroll down to **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Branch: **main** | Folder: **/ (root)**
5. Click **Save**

### Step 5: Wait & Visit
- Wait **2–5 minutes** for GitHub to build your site
- Visit: `https://YOUR_USERNAME.github.io`
- 🎉 Your portfolio is live!

---

## 🖼️ Add Your Profile Photo

1. Find a professional photo of yourself
2. Rename it to exactly: `profile.jpg`
3. Place it in the same folder as `index.html`
4. Upload it to GitHub alongside the other files

**Tips:**
- Square or slightly taller than wide works best
- Minimum 400×400 pixels recommended
- Professional headshot (light background preferred)

---

## 📄 Add Your Resume PDF

1. Export your CV as a PDF
2. Rename it to exactly: `resume.pdf`
3. Place it in the same folder as `index.html`
4. Upload it to GitHub

---

## ✏️ How to Edit Content Later

### Change Personal Info
Open `index.html` and search (`Ctrl+F`) for:
- `hasnianharoon456@gmail.com` → replace with your email
- `hasnainharoonqureshi` → your GitHub username
- `+92 345 5039097` → your phone number
- LinkedIn URL → your actual LinkedIn profile

### Add Real Certifications
Find the `<!-- ── CERTIFICATIONS ──` section in `index.html`
Replace the placeholder `.cert-card` divs with your real credentials.

### Add New Projects
In the `projects-grid` div, copy a `project-card` block and update:
- Title, description, tech stack
- Change `project-status coming` to `project-status live` when live
- Add your GitHub link

### Add Internship Details
Find `.exp-card` blocks and edit the period, role, company, and description.

### Update Profile Picture
Just replace `profile.jpg` with a new file of the same name and re-upload.

---

## 🎨 Customize Colors

Open `style.css` and find the `:root` block at the top:

```css
--accent:   #00c4ff;   /* Main cyan color */
--accent-2: #4fffb0;   /* Green accent */
--accent-3: #ff6b35;   /* Orange accent */
--gold:     #f5c842;   /* CGPA gold */
```

Change these hex values to your preferred colors.

---

## 📧 Enable Real Contact Form (Optional)

The form currently uses `mailto:`. For a real backend:

1. Go to https://formspree.io → Sign up free
2. Create a new form → get your form ID (e.g. `xpwzqrjk`)
3. In `script.js`, find the contact form submit handler
4. Replace the `mailto` logic with:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ name, email, subject, message })
   });
   ```

---

## 🛠️ Common Issues

| Problem | Solution |
|---|---|
| Photo not showing | Make sure file is named exactly `profile.jpg` (lowercase) |
| Resume not downloading | Make sure file is named exactly `resume.pdf` (lowercase) |
| Site not updating | Clear browser cache or wait a few minutes after pushing |
| Page not found on GitHub | Check repository name matches `username.github.io` exactly |

---

## 📬 Contact

**Hasnain Haroon**
- Email: hasnianharoon456@gmail.com
- GitHub: https://github.com/hasnainharoonqureshi
- Web: https://hasnainharoonqureshi.github.io/
