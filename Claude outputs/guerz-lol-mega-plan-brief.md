# Brief for Plexi: the guerz.lol Mega Plan

**Cloudflare platform + discoverability, merged into one piece of work**

Prepared by Bonnie (Claude) for Guerz and Plexi · September 30, 2026
Status: input brief for the merge session. Not the final plan.

---

## 0. How to use this brief

Plexi, this is the handoff from Bonnie's side. Guerz will attach every source file mentioned here (see Appendix A).

The brief does five things:

1. **Sets the priority stack** that the mega plan has to fit inside. Section 2 matters more than anything else here.
2. **Reports what the live site actually looks like right now.** These checks were run today against the real repo and the live domain. One finding changes the shape of the migration plan (Section 3).
3. **Inventories the three existing Cloudflare roadmaps** and recommends what to keep, cut and merge.
4. **Proposes a merged structure**: a Platform track and a Discoverability track, with every task written out, task IDs and exit gates.
5. **Lists what needs research or verification.** That's your lane, and nothing in the final piece should state a platform limit as fact until it's been checked.

**Labels used throughout:**

- **VERIFIED** means Bonnie checked it directly today against the repo, the live site or DNS.
- **EVIDENCE** means strong signs, but it still needs confirming in a dashboard.
- **UNVERIFIED** means it came from an earlier roadmap version or from memory, and needs research.
- **DECISION** means it's Guerz's call.

---

## 1. The one-paragraph version

Guerz has three near-duplicate Cloudflare roadmaps: an original single-file zine, a dark "field plan" v2, and the zine v2 that's live on the toolshed now. They share about 85% of their content. The merge is mostly deduplication plus a few upgrades: better exit gates, rollback discipline, both export formats, and stable task IDs so saved progress survives. The genuinely new part is a **Discoverability track** (Search Console, Bing, Lighthouse, on-page SEO hygiene, community posting) that runs in parallel and doesn't depend on any migration. Today's checks also show that **guerz.lol already appears to be served by Cloudflare, not GitHub Pages**. So the "migrate from GitHub Pages" phases probably need re-scoping into "verify, consolidate and harden what's already there." And all of it sits *below* the fCC Responsive Web Design v9 Certification Exam in priority.

---

## 2. Priority stack (fixed; the plan has to fit inside this)

| Rank | What | Why it's here | Notes for the plan |
|---|---|---|---|
| **1** | **freeCodeCamp Responsive Web Design v9 Certification Exam** | Guerz's golden prize. He fell off it for almost a month through no choice of his own and is recommitting now, with real determination. | The mega plan must never compete with cert study for prime energy. If a week gets tight, mega-plan work drops first. |
| **2** | **Full Sail University: Web Development B.S.** (started Sept 28, 2026, online, accelerated) | Degree coursework. The first class, *Creative Presentation*, is a lighter load. | That lighter first class is the window for the cert push. Use it for the cert, not for Cloudflare. |
| **3** | **The Mega Plan** (this brief) | Real, useful, portfolio-building work. | A supporting lane with a hard time cap (Section 9). |
| **4** | **Student programs** (GitHub Education / Student Developer Pack; a Cloudflare student offering) | Guerz is eligible, and these are long-standing programs. | No rush. Guerz has been clear he's patient here. Put them in the plan as "activate when a phase actually needs them," never as tasks to do now. |

**Working-style guardrails.** These come from how Guerz works best; please keep them in the final piece:

- **One next task at a time.** The "Pick my next task" button is the core feature, not a gimmick.
- **Exit gates** on every phase, so "done" is testable instead of a vibe.
- **Energy-aware:** every phase needs at least one task that fits a low-energy day (20 minutes or less, low cognitive load).
- **No more plan versions after this.** This merge is the last planning pass. The next step after it ships is doing Phase 0, not writing v4.
- **Plain language, no jargon without a one-line definition.** Guerz is an advanced beginner: don't over-explain basics, but don't skip context or gotchas either.

---

## 3. Big finding: guerz.lol already appears to be served by Cloudflare

All three roadmaps assume guerz.lol is **hosted on GitHub Pages with Cloudflare in front**, and that the project is to *move hosting* to a Cloudflare Worker. Today's checks say otherwise.

### Evidence (checked Sept 30, 2026)

| Check | Result | Label |
|---|---|---|
| Nameservers for guerz.lol | `destiny.ns.cloudflare.com`, `norm.ns.cloudflare.com` | VERIFIED |
| A records for guerz.lol | `104.21.26.250`, `172.67.139.177`, which are Cloudflare proxy addresses (orange-cloud proxied) | VERIFIED |
| Response headers from guerz.lol | `server: cloudflare`, `cf-cache-status: HIT`, `cache-control: public, max-age=0, must-revalidate`. **None** of GitHub's usual headers (`x-github-request-id`, `via: varnish`) | VERIFIED |
| `https://gitguerz.github.io/` | Returns **404 from GitHub**. If GitHub Pages were publishing this site with the custom domain, it would redirect to guerz.lol. | VERIFIED |
| `https://guerz.lol/playbook.html` | `307` redirect to `https://guerz.lol/playbook` (extension stripped). GitHub Pages doesn't do this; Cloudflare's static hosting (Workers static assets / Pages) does. | VERIFIED behavior, EVIDENCE of cause |
| The live homepage | Still the *older* version (no "Full Sail University" text), which is expected because Guerz hasn't pushed today's changes yet. | VERIFIED |
| Repo | Contains `.github/workflows/static.yml`, a GitHub Actions workflow that deploys to **GitHub Pages** on every push to `main`. | VERIFIED |

### What this probably means (EVIDENCE, confirm in dashboards)

- guerz.lol is being served by a **Cloudflare Worker with static assets, or Cloudflare Pages**, not by GitHub Pages.
- The GitHub Pages workflow may still run on every push, but it's no longer what visitors see.
- **Critical unknown:** *how* the Cloudflare deployment gets updated. If it's connected to the GitHub repo (Workers Builds or Pages Git integration), then pushing to `main` updates the live site. If it was a one-time manual deploy (for example with `wrangler`), **pushing to GitHub won't change guerz.lol at all.** That could also explain some of the "nothing changed" frustration from earlier weeks.

### Five-minute verification for Guerz (do this before the merge is finalized)

1. **Cloudflare dashboard → Workers & Pages.** Is there a project serving guerz.lol? Note its name, whether it's a Worker or a Pages project, and whether it says "Connected to GitHub" (and which repo and branch).
2. In that project, check **Settings → Domains & Routes / Custom domains** and confirm `guerz.lol` is attached there.
3. **GitHub → gitguerz/gitguerz.github.io → Settings → Pages.** Is Pages enabled? What's the source?
4. **GitHub → the repo → Actions tab.** Is the "static" workflow running on pushes, and is it passing or failing?
5. After Guerz's next push to `main`, **reload guerz.lol in a private window** and see whether the new homepage appears (the three split cards, "Full Sail University — Day One" bar).

### How this reshapes the plan

- The old **Phase 1 ("Create the parallel universe")** and **Phase 4 ("Move production")** assume a migration hasn't happened. If step 1 confirms Cloudflare is already serving, those phases turn into **"verify and document what exists," "one deploy pipeline only,"** and **"production hardening"** (Section 8 writes them as conditional).
- A new task becomes the most important one in the whole plan: **retire the duplicate pipeline.** Two deploy systems (GitHub Pages Actions plus Cloudflare) is exactly the "maybe it went somewhere" confusion the roadmaps warn about.
- Guerz's new README currently says "Hosting: GitHub Pages" and "GitHub Actions rebuilds guerz.lol." Bonnie is flagging that as possibly wrong until verified.

---

## 4. Current state of guerz.lol (verified today unless marked)

### Repo and structure

- **Repo:** `github.com/gitguerz/gitguerz.github.io`, branch `main`. Local clone: `~/gitguerz/gitguerz.github.io`. This is now the one source of truth.
- **Stack:** plain HTML, CSS and vanilla JS, no framework, no build step. One shared `styles.css` for the whole site. The homepage now has zero inline or internal CSS; the other pages still have some.
- **Domain:** guerz.lol. Registrar is Porkbun (per Guerz; UNVERIFIED today). **DNS is on Cloudflare** (VERIFIED).
- **Structure, reorganized Sept 29–30 (uncommitted at time of writing, being pushed):**

| Path | What |
|---|---|
| `index.html` | Homepage: day-one story cards, welcome, current phase, GuerzBook |
| `about.html` | About |
| `playbooks.html` | Playbooks landing |
| `playbooks/web-dev-playbook.html` | fCC-based Web Dev Playbook (renamed from `playbook.html`) |
| `playbooks/fullsail-playbook.html` | Full Sail playbook (moved from the root) |
| `fcc-build-archive.html` + `fcc-build-archive/` | Build archive: 39 build folders |
| `sandbox.html` + `sandbox/` | Sandbox: 16 experiment folders |
| `toolshed.html` + `toolshed/` | Tools: Turntable Line, **Cloudflare Field Plan (the zine v2)**, Quality Control Desk, WP Workshop, plus preview thumbnails |
| `Banners/` | Page banner images |
| `guerzbook.js` | Guestbook front end |
| `theme.js`, `projects.js` | Day/night toggle; code viewer for archive and sandbox |
| `sitemap.xml`, `robots.txt`, `CNAME`, `.gitignore`, `.github/workflows/static.yml` | Site plumbing |

### Guestbook (GuerzBook)

- `guerzbook.js` talks to a **`workers.dev` Worker**, uses **KV**, and sends email notifications through **Formspree**. It also references `localStorage`. VERIFIED from the code.
- The Worker's own source, bindings and CORS rules haven't been inspected. That's exactly what task M3.1 is for.

### SEO inventory (VERIFIED)

| Page | description | canonical | og:title | og:image | twitter:card | JSON-LD |
|---|---|---|---|---|---|---|
| index.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (Person + WebSite) |
| about.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| playbooks.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| playbooks/web-dev-playbook.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| playbooks/fullsail-playbook.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| fcc-build-archive.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| sandbox.html | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| toolshed.html | ✓ | ✓ | ✓ | ✓ | ✓ | **✗ missing** |

Canonical URLs and `og:url` already point at the new, reorganized paths.

**Gaps found:**

- **No `404.html`.** Visitors who hit a dead link get a generic page.
- **Stale title:** `playbooks/web-dev-playbook.html` is titled "Web Dev **v3** Playbook," but the page is v.4.
- **`sitemap.xml` has no `<lastmod>` dates.** It does list the new paths.
- **Toolshed has no JSON-LD.**
- **Moved URLs:** the old `playbook.html`, root `fullsail-playbook.html`, root `quality-control-desk/`, root `wp-workshop/` and `the-turntable-line-discogs-seller-os-v2-6.html` will stop existing after the push. Any links or search results pointing at them will break unless redirects are added.
- **No analytics script in any page's HTML**, and Cloudflare isn't injecting one either. So "don't add tracker number two" becomes "decide whether you want tracker number *one*."
- **`robots.txt`** is correct: it allows everything and points to the sitemap.

**Image weight** is the biggest performance problem:

| File | Size |
|---|---|
| Banners/banner-sandbox.png | **2,817 KB** |
| Banners/banner-playbook.png | 1,929 KB |
| Banners/banner-fcc-build-archive.png | 1,870 KB |
| Banners/banner-about.png | 1,852 KB |
| Banners/banner-index.png | 1,837 KB |
| toolshed thumbs (4) | 86–142 KB each |
| og-banner.png | 39 KB |

Each banner is roughly 10× what a banner should weigh. Converting them to WebP or AVIF at the display size is likely the single biggest Lighthouse win on the site. Separately, Guerz is considering **removing the banner from the homepage only** (the toolshed has none), so that's a pending DECISION.

---

## 5. Source inventory: the three roadmaps

| | **v1: the original zine** | **v2 dark: the "Field Plan"** | **v2 zine (live now)** |
|---|---|---|---|
| File(s) | `cloudflare-guerz-lol-roadmap.html` (single file, CSS and JS inline) | `index.html` + `styles.css` + `app.js` (dark) | `index.html` + `styles.css` + `app.js` (zine), live at `toolshed/cloudflare-field-plan/` |
| Look | Orange graph-paper zine, monospace, hard shadows | Dark "field notebook", teal accents, rounded cards, Cabinet Grotesk and Satoshi from Fontshare (external CDN) | Same zine look as v1, restyled into external files |
| Phases | 8 (0–7) | 7 (0–6; merges private tools and AI) | 8 (0–7) |
| Tasks | 45 | 33, plus 8 safety checks | 45, plus 8 safety checks |
| Task IDs shown | Yes (P0.1…) | No | Yes (P0.1…) |
| Storage key | `guerz-cloudflare-roadmap-v1` | `guerz-cloudflare-roadmap-v2` | `guerz-cloudflare-roadmap-zine-v2` |
| Export | JSON | **Markdown (Obsidian-ready)** | JSON |
| Import | JSON | None | JSON |
| Theme toggle | No | Yes (dark/light) | No |
| Unique strengths | "Today's 30-minute sprint" box; free-tier reality footer; bonus-output task (PDF build log / rendered Markdown / accessibility tree); concrete example numbers | Tightest wording; "exit gate" phrasing; **rollback note in Phase 0**; **secret audit before cutover**; "last reviewed" date; parking lot with an "official reality checks" disclosure | Stable IDs; difficulty chips and legend; pen-test gate; toast feedback; import/export; the look matches the toolshed thumbnail and the site's brutalist vibe |
| Weaknesses | Inline CSS/JS (against Guerz's clean-code rule); states platform limits as fact; assumes a Cloudflare proxy and Worker without checking | External font CDN (privacy leaning, and off-brand for guerz.lol); no import; no task IDs; less playful | States some limits as fact; no Markdown export; no rollback-note task |
| Shared across all three | Prime directive ("GitHub remains source of truth; staging first; don't touch live DNS casually"), the guestbook "split-brain" framing, D1 recommendation, Turnstile + Siteverify, OG image via Browser Rendering + R2, Access-protected private tools, "AI dessert, not dinner," the parking lot, CC BY-NC-SA 4.0 license block, credit to Perplexity for research and drafting | | |

**Honest summary:** the content is basically solved. What's left is choosing the best phrasing per task, fixing the hosting assumption, and adding discoverability.

---

## 6. Keep / cut / merge matrix

| Feature | Recommendation | Source |
|---|---|---|
| Zine visual style (orange, graph paper, hard shadows, chips) | **Keep** as the only look | v1 / zine v2 |
| Dark field-notebook style | **Cut** (external fonts, off-brand) | v2 dark |
| Dark/light theme toggle | **Parking lot** (nice, not needed) | v2 dark |
| Task IDs visible on every task | **Keep** | v1 / zine v2 |
| Difficulty chips + legend | **Keep** | v1 / zine v2 |
| "Done means done" → rename to **"Exit gate"** with v2 dark's sharper wording | **Merge** | all |
| Rollback note as a Phase 0 task | **Keep, add** | v2 dark |
| Secret audit before production | **Keep** | v2 dark / zine v2 |
| Pen-test / pressure-test gate (8 checks) | **Keep** (identical in both v2s) | v2 dark / zine v2 |
| JSON export + import | **Keep** | v1 / zine v2 |
| Markdown export for Obsidian | **Keep, add** alongside JSON | v2 dark |
| "Pick my next task" + Focus mode + filter + open/close notes | **Keep** | all |
| "Today's 30-minute sprint" box | **Keep, but make it dynamic:** it shows the first three unchecked tasks under the 20-minute tag | v1 |
| Free-tier reality footer | **Keep only after Plexi verifies every number**, with a "last verified" date | v1 / v2 dark |
| Bonus-output task (PDF build log / rendered Markdown / a11y tree) | **Parking lot** | v1 |
| Separate AI phase | **Merge** into the private-tools phase as one task | v2 dark |
| License / credits block | **Keep** (zine wording), add "last reviewed" date | all |
| Hosting-migration phases as written | **Rewrite as conditional** (Section 3) | all |
| Discoverability track | **Add** (new) | — |

---

## 7. Recommended decisions (Guerz can override any of these)

1. **One look: the zine.** It matches guerz.lol's brutalist style and the existing toolshed thumbnail, and needs no external fonts.
2. **Two tracks, one page:** Track **M** (Platform) and Track **D** (Discoverability). The filter dropdown gets "Platform," "Discoverability" and "All." Track D can start immediately; Track M starts with Phase M0 (verification).
3. **Replace in place:** the mega piece lives at `toolshed/cloudflare-field-plan/`, so the toolshed card, link and URL stay the same. Retitle it to something like *"guerz.lol Field Plan: Platform + Discoverability."* The exact name is Guerz's DECISION.
4. **Keep saved progress:** new storage key `guerz-field-plan-v3`. On first load, read the old zine key (`guerz-cloudflare-roadmap-zine-v2`) and map old task IDs to new ones using the crosswalk in Appendix B, so nothing Guerz has already checked gets lost.
5. **Both exports:** JSON (backup/restore) and Markdown (Obsidian checklist).
6. **No platform limit stated as fact** without a "last verified" date and source link.
7. **Guerz's code standards apply to the final files:** plain HTML/CSS/JS; external `styles.css` and `app.js`; **no inline or internal CSS**; **a comment explaining every line of code** (non-negotiable for Guerz, he needs to reread it later); accessible (skip link, `role="progressbar"` with `aria-valuenow`, `aria-live` toast, visible focus, 44px targets, reduced-motion support, print styles).

---

## 8. Proposed merged plan (full task list)

Tag key for every task: `[20m]` = low-energy friendly, 20 minutes or less · `[build]` = hands-on session · `[spicy]` = production risk · `[verify]` = research/confirmation. **Conditional** phases change depending on the Section 3 verification.

### Track M: Platform

#### M0 · Freeze the present `[foundations]`

*Capture what exists before touching anything. Several "facts" in older versions were assumptions; this phase turns them into evidence.*

- **M0.1** `[20m]` Confirm the active Cloudflare zone for guerz.lol and record the nameservers. *(Already observed: Cloudflare NS; just confirm in the dashboard.)*
- **M0.2** `[20m]` Export or screenshot every DNS record into a dated note.
- **M0.3** `[20m]` **Identify exactly what serves guerz.lol:** Worker with static assets, or Pages project? Project name? Connected to GitHub, and which branch? *(Section 3, steps 1–2.)*
- **M0.4** `[20m]` **Check GitHub Pages and Actions status:** is Pages enabled, and is the `static.yml` workflow still running and passing? *(Section 3, steps 3–4.)*
- **M0.5** `[20m]` Locate the GuerzBook Worker (the `workers.dev` URL in `guerzbook.js`), its KV binding and the Formspree form. Record names, never secret values.
- **M0.6** `[20m]` Create the `Cloudflare Lab Log` note in Obsidian: what changed, proof, rollback, what I learned.
- **M0.7** `[20m]` Write a **rollback note:** current host, exact DNS records, deploy path, how to restore.
- **M0.8** `[20m]` Decide on **one** analytics tool or none. *(Currently none in the HTML.)*

**Exit gate:** Guerz can draw the full path domain → DNS → host → deploy pipeline, and knows how to reverse it without guessing.

#### M1 · Preview environment `[staging]` *(conditional)*

*If M0.3 shows guerz.lol is **not** on Cloudflare yet, this is the original "parallel universe" phase. If it **is** already on Cloudflare, it becomes "get a safe preview URL for branch work."*

- **M1.1** `[20m]` Tag the current state and create the branch `feat/cloudflare-staging` (copy-ready git commands in a notes drawer, every line commented).
- **M1.2** `[build]` *If not yet on Cloudflare:* create a Worker project with static assets. *If already on Cloudflare:* find and document its config file and settings.
- **M1.3** `[build]` Get a preview or `workers.dev` URL serving the branch. Ugly but reachable counts.
- **M1.4** `[build]` Confirm it serves the existing static files unchanged. No framework rewrite.
- **M1.5** `[20m]` Parity checks in a private window: homepage, CSS, JS, theme toggle, internal links, 404, sitemap, robots, metadata, mobile.

**Exit gate:** A non-production URL shows a working copy of the site while guerz.lol stays untouched.

#### M2 · One boring deploy pipeline `[CI/CD]`

- **M2.1** `[20m]` Connect only this one repo to Cloudflare's Git integration, with least access. *(Skip if M0.3 shows it's already connected.)*
- **M2.2** `[20m]` Document the build and deploy settings in the repo README: root directory, commands, where previews appear, the deploy ritual.
- **M2.3** `[20m]` Push one harmless change. Verify the browser, build log and commit SHA all agree.
- **M2.4** `[20m]` **Retire the second pipeline.** If Cloudflare is the host, disable GitHub Pages and remove or disable `static.yml`. One pipeline only. *(Guerz DECISION, but strongly recommended.)*
- **M2.5** `[20m]` Cross-browser pass: Safari, Firefox, Chrome and a phone.

**Exit gate:** edit → commit → push → deploy → verify is repeatable from memory, and there's exactly one way the site gets published.

#### M3 · GuerzBook: one source of truth `[security-sensitive]`

*Wording from v2 dark / zine v2. The storage choice is a DECISION: KV (already in use, ships fastest) vs D1 (SQLite tables, better for moderation and database practice; all three versions recommend D1).*

- **M3.1** `[20m]` Read the existing Worker before replacing anything: storage, CORS rules, why Formspree exists, what `localStorage` is doing in `guerzbook.js`.
- **M3.2** `[build]` Create a staging D1 database and a minimal `guestbook_entries` table (id, name, message, created_at, status). No emails unless genuinely needed.
- **M3.3** `[build]` `GET /api/guestbook` returns approved entries only; never pending, moderation or admin fields.
- **M3.4** `[build]` `POST /api/guestbook` validates server-side: lengths, required fields, content type, malformed JSON.
- **M3.5** `[build]` Turnstile, with every token verified server-side through Siteverify. Site key in the front end; secret in Worker secrets, never Git.
- **M3.6** `[build]` Server-side rate limiting on `POST /api/guestbook`. Test normal use, bursts and rejection. *(Plexi: verify which rate-limit option exists on Free.)*
- **M3.7** `[build]` Run the abuse test matrix on staging (see Pen-test gate below).
- **M3.8** `[20m]` Keep Formspree until the new path survives a test week; retire it after.

**Exit gate:** Valid entries are verified and stored once; public reads show approved entries only; bad input fails safely.

#### M4 · Production: cutover or hardening `[spicy]` *(conditional)*

*If M0.3 shows guerz.lol is not on Cloudflare yet: this is the cutover. If it already is: this becomes production hardening, and M4.5 turns into "confirm the domain attachment."*

- **M4.1** `[20m]` Production pre-flight checklist in the Lab Log: assets, 404, GuerzBook, robots, sitemap, metadata, Safari, CORS, rollback.
- **M4.2** `[build]` Test on a staging hostname first, if available.
- **M4.3** `[20m]` Write the rollback steps *before* touching the custom domain.
- **M4.4** `[20m]` Secret audit: nothing in Git history, HTML, build output or responses. Rotate anything exposed; deleting a line isn't enough.
- **M4.5** `[spicy]` Attach, or confirm, guerz.lol on the Cloudflare project. Only while calm, fed and un-rushed.
- **M4.6** `[20m]` Curl checks for homepage, robots, sitemap, API and a deliberate missing page. Save the output as proof.
- **M4.7** `[20m]` Keep the previous configuration documented for 30 days.

**Exit gate:** The domain serves the intended project, one pipeline deploys it, and rollback is written and tested.

#### M5 · One visual experiment: an OG image `[fun + SEO]`

*Doubles as an SEO task: better link previews on socials and forums help discoverability.*

- **M5.1** `[20m]` Create an R2 bucket for generated assets (`og/`, `screenshots/`, `pdf/`).
- **M5.2** `[build]` Make one 1200×630 OG-card page or template that's readable at thumbnail size.
- **M5.3** `[build]` Render it once with Browser Rendering, store it in R2 under a stable name (e.g. `og/home-v1.png`) and verify it.
- **M5.4** `[20m]` Point the homepage's `og:image` at the stored image's absolute URL and check it in a private tab and a link-preview debugger.
- **M5.5** `[20m]` Only then add one scheduled refresh, after checking current limits.

**Exit gate:** One generated image is used by the live site, and normal visits never trigger a browser render.

#### M6 · Private tools, then one AI job `[later]`

- **M6.1** `[20m]` Pick one boring, clear private subdomain (`lab`, `tools`, `admin` or `inventory`).
- **M6.2** `[build]` Protect it with Cloudflare Access (one-time PIN email or GitHub login).
- **M6.3** `[20m]` Test signed-in and signed-out access separately. Being denied without auth is a success.
- **M6.4** `[build]` Build a tiny private Lab dashboard (static JSON is enough; no database for v1).
- **M6.5** `[20m]` Choose the next private tool: GuerzBook moderation **or** a vinyl-inventory scratchpad. Only one.
- **M6.6** `[build]` One AI job, prototyped privately, used ten times, then keep, iterate or kill.

**Exit gate:** One private tool solves a real repeated problem, or it was deliberately stopped. Both count as wins.

#### Pen-test / pressure-test gate (before any public guestbook change goes live)

1. Malformed JSON gets a controlled 4xx response, not a stack trace.
2. Oversized name or message input is rejected server-side.
3. HTML or script-like input displays as text, never as markup.
4. Missing, invalid, expired, reused and forged Turnstile tokens all fail.
5. Cross-origin requests from arbitrary origins are refused.
6. Burst posts slow down or fail safely without breaking normal use.
7. Public endpoints expose no secrets, pending entries or admin data.
8. Rollback was tested from the written note, not from memory.

---

### Track D: Discoverability (new; can start now, runs in parallel)

*None of these depend on the platform track. Most are `[20m]`, which makes them good low-energy-day wins. Order matters: measure, fix the weight, clean up, then get indexed, then get seen.*

#### D0 · Baseline `[measure]`

- **D0.1** `[20m]` Run Lighthouse (mobile) on all 8 main pages and record Performance, Accessibility, Best Practices and SEO scores in the Lab Log.
- **D0.2** `[20m]` Screenshot the scores. This is the "before" picture for a future dev.to post.

**Exit gate:** A dated baseline exists for every main page.

#### D1 · Lose the weight `[performance]`

- **D1.1** `[20m]` **DECISION:** keep or remove the homepage banner.
- **D1.2** `[build]` Convert the remaining banners to WebP or AVIF at their display size (target: a few hundred KB, down from about 2 MB). Keep the `width` and `height` attributes. *(Plexi: suggest a free, local, privacy-friendly tool, e.g. Squoosh CLI or `cwebp`, with commented commands.)*
- **D1.3** `[20m]` Re-run Lighthouse on the heaviest page and compare against D0.

**Exit gate:** No image on the site is over roughly 300 KB, and the Performance scores improved.

#### D2 · On-page hygiene `[cleanup]`

- **D2.1** `[20m]` Add a `404.html` styled like the site, with links home.
- **D2.2** `[20m]` Fix the stale title on `playbooks/web-dev-playbook.html` ("v3" → "v4").
- **D2.3** `[20m]` Add JSON-LD to `toolshed.html`.
- **D2.4** `[20m]` Add `<lastmod>` dates to `sitemap.xml`, and add the toolshed tool pages if they should be indexed.
- **D2.5** `[20m]` Double-check that every page's `og:image` and description is page-specific, not copy-pasted.
- **D2.6** `[build]` **Redirects for moved URLs:** `playbook.html` → `playbooks/web-dev-playbook.html`, and the root `fullsail-playbook.html`, `quality-control-desk/`, `wp-workshop/` and `the-turntable-line-…html` → their new homes. *(Plexi: the right method depends on the host. Cloudflare static hosting supports a `_redirects` file; verify which applies after M0.3.)*

**Exit gate:** No dead ends: every old link lands somewhere real, and every page describes itself properly.

#### D3 · Get indexed `[search engines]`

- **D3.1** `[20m]` Google Search Console: add guerz.lol as a **Domain property**, verified with a **DNS TXT record in Cloudflare** (not the URL-prefix method). It survives any future hosting change.
- **D3.2** `[20m]` Submit `https://guerz.lol/sitemap.xml`.
- **D3.3** `[20m]` Bing Webmaster Tools: import the site from Search Console. *(Plexi: verify the import flow is still offered.)*
- **D3.4** `[20m]` Request indexing for the homepage, the build archive and both playbooks.

**Exit gate:** Both consoles show the site verified and the sitemap processed.

#### D4 · Get seen `[community]` *(sequenced with the cert, see Section 9)*

- **D4.1** `[20m]` fCC community forum: a first introduction/progress post linking the build archive. *(Guerz has already planned this.)*
- **D4.2** `[20m]` GitHub profile README: who he is, and links to guerz.lol, the build archive and the playbooks.
- **D4.3** `[20m]` Refresh social bios with one consistent line and the guerz.lol link. *(Guerz is already doing this.)*
- **D4.4** `[build]` First dev.to post. Best candidates: *"I passed the fCC RWD v9 cert: what the build archive taught me"* (after the cert), or the D0→D1 Lighthouse before/after story.
- **D4.5** `[20m]` Activate the GitHub Student Developer Pack **when a phase needs something in it**, not before.
- **D4.6** `[20m]` Look into the Cloudflare student offering **when a phase needs it**, not before.

**Exit gate:** Three places on the internet point back to guerz.lol, and each came from real work, not filler.

#### D5 · Monthly check-in `[maintenance]`

- **D5.1** `[20m]` Once a month: Search Console coverage, impressions and clicks, then fix anything flagged.
- **D5.2** `[20m]` Once a month: re-run Lighthouse on the homepage and one heavy page.

---

## 9. Proposed weekly shape (cert first)

This is a proposal for Plexi and Guerz to finalize together, not a fixed schedule.

- **Cert study is the default activity on any study day.** The mega plan never takes a prime-energy block while the cert is unclaimed.
- **Full Sail coursework** follows its own schedule. *Creative Presentation* being lighter is the reason the cert push can happen now.
- **Mega plan cap: one "Lab Night" a week**, 60–90 minutes at most, until the cert is claimed. It starts with **M0** (the most valuable thing in the whole plan right now) and **D3** (a one-time setup that works in the background from then on).
- **`[20m]` tasks** are allowed on low-energy days as small wins. They're never required.
- **After the cert:** raise the cap, and D4.4 (the dev.to post) becomes the victory lap. The cert *is* the best networking content Guerz will have this year.
- **Student programs** stay parked until a phase actually calls for them.

---

## 10. Research and verification list for Plexi

Please verify each item, date it, and cite the official source. Anything unverifiable gets removed from the final piece rather than guessed.

1. **Workers Free plan limits:** requests per day, CPU time per request, and whether static-asset requests are free and unmetered.
2. **Browser Rendering on Free:** daily browser time, concurrency, and whether it's available on Free at all.
3. **Cron Triggers on Free:** how many per account.
4. **Snippets:** confirm "not available on Free."
5. **Rate limiting on Free:** WAF rate-limiting rules (how many, what matching) vs the Workers rate-limiting binding. Which is the right fit for M3.6?
6. **D1, KV and R2 free allowances**, in plain numbers.
7. **Turnstile:** free-tier status, and the current Siteverify requirements.
8. **Workers Builds / Git integration on Free:** does it deploy automatically on push, and does it make preview URLs for branches?
9. **Workers static assets vs Pages:** which one produces the `.html` → extensionless `307` redirect seen on guerz.lol, and which one supports a `_redirects` file? This helps confirm Section 3 and pick the method for D2.6.
10. **Cloudflare Web Analytics** for a proxied site: automatic injection vs a manual snippet, and privacy implications. Needed for M0.8.
11. **Google Search Console Domain property** verified through a DNS TXT record when DNS is on Cloudflare: the current steps.
12. **Bing Webmaster Tools:** is "import from Google Search Console" still offered?
13. **GitHub Student Developer Pack:** current verification process with a Full Sail enrollment, and what's in it that's relevant (domains, hosting, tools).
14. **Cloudflare student offering:** does it exist under that name, what's included, and how eligibility works.
15. **fCC forum norms** for a first post: which category, and self-promotion etiquette.

---

## 11. Open decisions for Guerz

1. **Storage for GuerzBook:** KV (already in place) or D1 (the recommendation in all three versions).
2. **Retire the GitHub Pages pipeline** once Cloudflare is confirmed as the host. Strongly recommended.
3. **Homepage banner:** keep or remove.
4. **Name of the mega piece.**
5. **Analytics:** Cloudflare Web Analytics, or none.
6. **Redirects for moved URLs:** yes (recommended) or accept a few dead links.

---

## 12. Build spec for the final artifact

- **Location:** `toolshed/cloudflare-field-plan/` (replace in place): `index.html`, `styles.css`, `app.js`.
- **Look:** zine (orange masthead, graph paper, hard shadows, chips), no external fonts.
- **Structure:** hero → prime directive → dashboard (progress + "Right now" + dynamic 30-minute sprint box) → toolbar (Show: All / Platform / Discoverability; open/close notes; focus mode) → Track M phases → Track D phases → pen-test gate → parking lot → verified limits footer ("last verified: DATE", with source links) → license and credits.
- **Tags:** `[20m]` / `[build]` / `[spicy]` / `[verify]` chips on every task, plus the difficulty legend.
- **Storage:** key `guerz-field-plan-v3`. On first load, migrate from `guerz-cloudflare-roadmap-zine-v2` using Appendix B. Wrap every `localStorage` call in try/catch.
- **Export:** JSON (backup) **and** Markdown (Obsidian checklist, with frontmatter). **Import:** JSON from v3 and from zine v2 (mapped).
- **Code standards (Guerz's rules):** no inline or internal CSS; external files only; **a comment on every line**; build DOM text with `textContent` rather than `innerHTML` where possible; accessible (skip link, progressbar ARIA, live-region toast, focus-visible, 44px targets, reduced motion, print).
- **Afterwards:** refresh the toolshed thumbnail if the look changes; update the toolshed card's title and description; add a "last reviewed" date.
- **License block:** keep the existing CC BY-NC-SA 4.0 wording and the credits (Guerz as author; Perplexity for research and drafting; add Claude for review and verification if Guerz wants).

---

## Appendix A: attachments Guerz is providing

| File | What it is |
|---|---|
| `cloudflare-guerz-lol-roadmap.html` | v1: original single-file zine (inline CSS/JS) |
| `index.html` + `styles.css` + `app.js` (dark, Fontshare fonts) | v2 dark "Field Plan" |
| `index.html` + `styles.css` + `app.js` (zine) | v2 zine, currently live at `toolshed/cloudflare-field-plan/` |
| This brief | `guerz-lol-mega-plan-brief.md` |

## Appendix B: task ID crosswalk (zine v2 → v3)

So saved progress carries over:

| zine v2 | → v3 | | zine v2 | → v3 |
|---|---|---|---|---|
| p0-1 | M0.1 | | p4-1 | M4.1 |
| p0-2 | M0.2 | | p4-2 | M4.2 |
| p0-3 | M0.5 | | p4-3 | M4.3 |
| p0-4 | M0.6 | | p4-4 | M4.4 |
| p0-5 | M0.8 | | p4-5 | M4.5 |
| p1-1 | M1.1 | | p4-6 | M4.6 |
| p1-2 | M1.2 | | p4-7 | M4.7 |
| p1-3 | M1.3 | | p5-1 | M5.1 |
| p1-4 | M1.4 | | p5-2 | M5.2 |
| p1-5 | M1.5 | | p5-3 + p5-4 | M5.3 |
| p2-1 | M2.1 | | p5-5 | M5.4 |
| p2-2 + p2-4 | M2.2 | | p5-6 | M5.5 |
| p2-3 | M2.3 | | p6-1 … p6-5 | M6.1 … M6.5 |
| p2-5 | M2.5 | | p7-1 … p7-4 | M6.6 (checked only if all four were checked) |
| p3-1 … p3-8 | M3.1 … M3.8 | | *(new)* | M0.3, M0.4, M0.7, M2.4, all of Track D |

Merge rule: where two old tasks map to one new task, the new task counts as done only if **both** old ones were done. Safety-gate checks carry over one-to-one (same eight statements).

---

*End of brief. Bonnie → Plexi, via Guerz.*
