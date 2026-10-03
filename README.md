# guerz.lol

My corner of the world wide web: part web dev portfolio, part brain dump, part proof of life. I'm learning full-stack web development in public, and this repo is the whole site.

**Live:** [guerz.lol](https://guerz.lol) · **Blog:** [blogguerz.wordpress.com](https://blogguerz.wordpress.com)

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage: the day-one story, welcome, current phase, and the GuerzBook (guestbook) |
| `about.html` | About me |
| `playbooks.html` | Landing page for both playbooks |
| `playbooks/web-dev-playbook.html` | The Web Dev Playbook: six freeCodeCamp certs, one per module |
| `playbooks/fullsail-playbook.html` | The Full Sail Web Development B.S. playbook, month by month |
| `fcc-build-archive.html` | Every fCC Responsive Web Design build, rebuilt and commented |
| `sandbox.html` | HTML & CSS fundamentals + The Odin Project builds, in a tabbed code / preview format |
| `toolshed.html` | Tools gallery (see below) |

## Toolshed

| Folder / file | Tool |
|---|---|
| `toolshed/discogs-seller-operating-system-v2-6.html` | The Turntable Line: Discogs seller operating system |
| `toolshed/cloudflare-field-plan/` | Cloudflare Field Plan: GitHub Pages → Cloudflare Workers roadmap |
| `toolshed/quality-control-desk/` | Visibility & Quality Control Desk: search visibility + site review checklist |
| `toolshed/wp-workshop/` | WordPress 101 / The Blog Archive Engine: road map for blog.guerz.lol |
| `toolshed/roadmap-thumbs/` | Preview thumbnails for the toolshed cards |

## Folders

| Folder | What lives there |
|---|---|
| `Banners/` | Page banner images (capital B; GitHub Pages is case-sensitive) |
| `playbooks/` | Both playbook pages, plus `thumbs/` for their preview cards |
| *(fCC builds)* | Moved to their own repo, [freecodecamp-responsive-web-design-v9](https://github.com/gitguerz/freecodecamp-responsive-web-design-v9), live at [builds.guerz.lol](https://builds.guerz.lol). `fcc-build-archive.html` still shows the code + live previews |
| `sandbox/` | One folder per sandbox experiment |
| `toolshed/` | The tools listed above |

## Shared files

| File | What it does |
|---|---|
| `styles.css` | One stylesheet for the whole site; pages have no inline CSS |
| `theme.js` | Day/night toggle; remembers your pick with `localStorage` |
| `guerzbook.js` | Guestbook front end; talks to a Cloudflare Worker + KV, with Formspree email notifications |
| `projects.js` | Code viewer for the build archive and sandbox: line numbers, syntax colors, copy button, lazy previews |
| `sitemap.xml` / `robots.txt` | Tell search engines what's here |
| `CNAME` | Points GitHub Pages at guerz.lol. **Don't delete.** |
| `.github/workflows/static.yml` | Deploys the site to GitHub Pages on every push to `main` |
| `.gitignore` | Keeps macOS `.DS_Store` junk out of the repo |
| `_redirects` | Cloudflare redirects: old `/fcc-build-archive/<build>/` URLs → builds.guerz.lol (TOP builds → `sandbox/`) |
| `.assetsignore` | Files Cloudflare must not serve publicly (`.git`, README, etc.) |

## Stack

- Plain HTML, CSS, and vanilla JS: no framework, no build step
- Fonts: Recursive (titles), Space Grotesk (body), IBM Plex Mono (labels), Platypi (the {Guerz} name)
- Palette: peach `#F4AD7D`, lavender `#b3a8cc`, ink `#3a2b22`, burgundy `#6a1f2e`
- Hosting: GitHub Pages
- Domain + DNS: Porkbun
- Guestbook backend: Cloudflare Workers + KV

## Run it locally

```bash
# go into the repo folder
cd ~/gitguerz/gitguerz.github.io

# start a tiny local web server on port 8000 using Python's built-in module
python3 -m http.server 8000

# then open http://localhost:8000 in your browser
# press Ctrl + C in the terminal to stop the server
```

Opening the `.html` files directly also works, but a local server behaves more like the live site. The guestbook fetch in particular only works properly over `http://`.

## Deploy

```bash
git add -A                          # stage new, changed, and deleted files
git commit -m "what changed"        # save a snapshot with a message
git push                            # GitHub Actions rebuilds guerz.lol in a minute or two
```

**Edit only in this folder.** It's the one source of truth.

---

Built by Guerz, with an assist from Claude on the GuerzBook, the build archive, and the homepage cleanup. View source is a love language.
