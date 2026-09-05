# gitguerz.github.io

Source repository for **[guerz.lol](https://guerz.lol)** — a personal developer portfolio, dev log, and living build archive, served via GitHub Pages.

---

## What this is

guerz.lol documents a self-taught, in-public path toward full-stack web development. The site itself is the artifact: every page is either a working demonstration of a concept just learned, or a log of the process getting there.

- **Portfolio** — coursework builds, cold builds, and interactive CSS/JS demonstrations
- **Dev log** — a running record of what's been learned, in the order it was learned
- **Living document** — pages are revised in place as skills improve; nothing here is "finished and frozen"

## Stack

| Layer | Tool |
|---|---|
| Hosting | GitHub Pages |
| DNS | Porkbun |
| Forms | Formspree (GuerzBook guestbook) |
| Persistence | `localStorage` (GuerzBook entries, theme preference) |
| Fonts | Platypi, Space Grotesk, Recursive, IBM Plex Mono |
| No build step | Static HTML/CSS/JS — no framework, no bundler |

## Site structure

```
index.html               → home
roadmap.html              → learning roadmap
fcc-build-archive.html    → freeCodeCamp curriculum builds
guerzbox.html             → interactive CSS/JS concept demos (Guerzbox)
guerzography.html         → about page
styles.css                → single site-wide stylesheet
theme.js                  → day/night toggle
guerzbook.js              → guestbook logic
projects.js               → build archive interactivity
sitemap.xml / robots.txt  → SEO
```

Nav order (top and footer) is: roadmap → fcc build archive → guerzbox → guerzography → blogguerz (external).

## Design tokens

```css
--peach:  #e8b48f   /* day accent */
--lavender: #b3a8cc /* night accent */
--cream:  #fdf5ee   /* day background */
--ink:    #17131f   /* deep purple-black, night background */
--panel:  #221d2d
```

Brand mark: lowercase double-story `{g}` set in Platypi (weight 666), inside a hexagonal badge.

## Local development

No build tooling required — this is a static site.

```bash
git clone https://github.com/gitguerz/gitguerz.github.io.git
cd gitguerz.github.io
open index.html   # or serve with any static file server
```

Changes to `main` deploy automatically via GitHub Pages.

## DNS

`guerz.lol` is registered and managed through **Porkbun**, pointed at GitHub Pages via the standard `A`/`ALIAS` records for `gitguerz.github.io`.

## License / usage

Personal project. Code is visible for learning-in-public purposes; not licensed for reuse.

---

<<<<<<< HEAD
*Site voice, design system, and roadmap are documented separately — this README covers the repository itself.*
=======
*Site voice, design system, and roadmap are documented separately — this README covers the repository itself.*
>>>>>>> a6c9cb2e70466ee56cf461c9c2cb5b5dafba0b25
