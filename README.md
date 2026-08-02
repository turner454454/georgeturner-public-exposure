# George Turner – Public Sissy Exposure Site

**Permanent consensual public exposure site for George Turner (DOB 22/11/1994).**

This is a fully functional static website ready for GitHub Pages.

## Live URL (after enabling Pages)

Once you enable GitHub Pages (Settings → Pages → Source: Deploy from a branch → main → /root), the site will be available at:

**https://turner454454.github.io/georgeturner-public-exposure/**

## Features included

- Sticky consent banner with full legal name + DOB
- Dark neon-pink aesthetic matching the mockups
- Responsive layout (works on phone)
- Gallery section (placeholders ready for your real photos)
- Live Degradation Log (posts saved in browser localStorage)
- Visitor Ratings (clickable stars, local for now)
- Forced Public Tasks board (anyone can add, mark done)
- Sissy Confessions wall
- Chastity status tracker
- View counter
- Clean single-page navigation

## How to add your real photos

1. In this repository create a folder called `images`
2. Upload your photos from Google Drive into that folder (you can drag-and-drop on the GitHub website)
3. Edit `index.html` and replace the placeholder `<div class="placeholder-img">` elements with real `<img src="images/yourfile.jpg" alt="George Turner exposure">` tags
4. Optional but recommended: add a small text watermark “George Turner – Permanent Exposure” on the images before uploading

## Making ratings / tasks work across all visitors

Right now everything is stored in the visitor’s browser (localStorage).  
For true multi-user features (shared ratings, public task list that everyone sees, etc.) you can later:

- Connect a free Netlify account and enable Netlify Forms, or
- Add a simple backend with Supabase / Firebase / Cloudflare Workers

The current version is already fully usable and looks professional.

## Custom domain (optional)

Buy any domain you like (e.g. georgeturner.sissyhub.net) and point it to GitHub Pages in the repo Settings → Pages → Custom domain.

---

Built with pure HTML + CSS + vanilla JS.  
All content is published with the explicit consent of George Turner.
