# guerz.lol

my corner of the world wide web: part web dev portfolio, part brain dump, part proof of life. i'm learning full-stack web development in public, and this repo is the whole site.

**live:** [guerz.lol](https://guerz.lol) · **blog:** [blogguerz.wordpress.com](https://blogguerz.wordpress.com)

---

## pages

| file | what it is |
|---|---|
| `index.html` | homepage + the GuerzBook (guestbook) |
| `about.html` | about me (formerly `guerzography.html`) |
| `playbooks.html` | landing page for both playbooks |
| `playbook.html` | the fCC playbook, six freeCodeCamp certs, one per module (formerly `roadmap.html`) |
| `fullsail-playbook.html` | the Full Sail Web Development B.S. playbook, month by month |
| `fcc-build-archive.html` | every fCC Responsive Web Design build, rebuilt and commented |
| `sandbox.html` | cold builds in tabbed code/preview format (formerly `guerzbox.html`) |
| `toolshed.html` | tools gallery: The Turntable Line, Cloudflare Field Plan, Quality Control Desk, WordPress 101 |
| `wp-workshop/` | WordPress 101 side quest workshop |

## shared files

| file | what it does |
|---|---|
| `styles.css` | one stylesheet for the whole site |
| `theme.js` | day/night toggle, remembers your pick with `localStorage` |
| `guerzbook.js` | guestbook front end, talks to a Cloudflare Worker + KV, with Formspree email notifications |
| `sitemap.xml` / `robots.txt` | tell search engines what's here |
| `CNAME` | points GitHub Pages at guerz.lol, **don't delete** |

## stack

- plain HTML, CSS, and vanilla JS, with no framework and no build step
- fonts: Platypi (headings), Space Grotesk (body), IBM Plex Mono (labels/tags)
- hosting: GitHub Pages
- domain + DNS: Porkbun
- guestbook backend: Cloudflare Workers + KV

## run it locally

```bash
# go into the repo folder (adjust the path if yours lives somewhere else)
cd ~/gitguerz/gitguerz.github.io

# start a tiny local web server on port 8000 using python's built-in module
python3 -m http.server 8000

# then open http://localhost:8000 in your browser
# press Ctrl + C in the terminal to stop the server
```

opening the `.html` files directly also works, but a local server behaves more like the live site. the guestbook fetch in particular only works properly over `http://`.

## deploy

push to `main`. GitHub Pages rebuilds the site automatically within a minute or two.

---

built by Guerz, with an assist from Claude on the GuerzBook and the build archive. view source is a love language.
