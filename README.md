# gitguerz.github.io

Source for [guerz.lol](https://guerz.lol) — Guerz's personal site: portfolio, build log, and a shed of live working tools.

Hosted on GitHub Pages. DNS is managed and proxied through Cloudflare; Porkbun is the domain registrar only, not the DNS provider.

## Pages

- `index.html` — home, current status, GuerzBook guestbook
- `about.html` — who this is, where to find Guerz elsewhere
- `playbook.html` — the self-directed web dev roadmap
- `fcc-build-archive.html` — freeCodeCamp build log
- `sandbox.html` — experiments
- `roadmaps.html` — "the tool shed": live tools built along the way, each downloadable and open-source

## Tools (linked from roadmaps.html)

- `the-turntable-line-discogs-seller-os-v2-6.html` — Discogs seller OS (single file)
- `cloudflare-field-plan/` — staged GitHub Pages → Cloudflare Workers migration plan
- `quality-control-desk/` — pre-publish site review checklist
- `wp-workshop/` — beginner WordPress workshop (hosted vs. self-hosted)

Each multi-file tool folder contains its own `index.html`, `app.js`, and `styles.css`. All are self-contained, localStorage-only apps — no backend, no accounts, no analytics beyond what's already on the main site.

## Shared assets

<<<<<<< HEAD
- `styles.css` — single source of truth for the main site's styling
- `theme.js` — shared day/night theme toggle, used across every page

## License
=======
```
index.html               → home
playbook.html             → learning roadmap
fcc-build-archive.html    → freeCodeCamp curriculum builds
sandbox.html              → interactive CSS/JS concept demos (Sandbox)
about.html                → about page
styles.css                → single site-wide stylesheet
theme.js                  → day/night toggle
guerzbook.js              → guestbook logic
projects.js               → build archive interactivity
sitemap.xml / robots.txt  → SEO
```

Nav order (top and footer) is: about → playbook → fcc build archive → sandbox → blogguerz (external).
>>>>>>> ca207d2ec84b340db54aa042b602a646aff5aa6d

Original writing, structure, templates, and visual design across this site and its tools are © 2026 Guerz, licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) unless a given tool's own linear notes say otherwise. Reusable code may be separately MIT-licensed on a per-tool basis. Third-party names, trademarks, and platform documentation referenced anywhere on the site remain the property of their owners.

## Commit changes

<<<<<<< HEAD
Standard flow: edit, commit, push to `main`. GitHub Pages serves directly from the branch.
=======
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

`guerz.lol` is **registered** through Porkbun, but DNS is managed and proxied through **Cloudflare** — the zone handles A/CNAME records, mail routing (MX + SPF/DKIM/DMARC), SSL cert validation, and Worker routes pointing `guerz.lol` and `www.guerz.lol` at `gitguerz.github.io`.

## License / usage

Personal project. Code is visible for learning-in-public purposes; not licensed for reuse.

---

*Site voice, design system, and roadmap are documented separately — this README covers the repository itself.*
>>>>>>> ca207d2ec84b340db54aa042b602a646aff5aa6d
