# Mukunda Technologies: corporate website

Static HTML/CSS/JS site for https://mukundatech.co.za. No build step and no runtime dependencies.

```
public/          the site: this is the only folder that is published
  index.html, about.html, products.html, solutions.html, contact.html,
  privacy.html, terms.html, 404.html
  styles.css, noscript.css, script.js
  assets/        self-hosted fonts, icons, OG image, Caterflow mark
  robots.txt, sitemap.xml, site.webmanifest
vercel.json      output folder, clean URLs, redirects (mukundatech.com and www -> apex), security headers
docs/            internal notes (not published): audit, launch checklist, DNS steps, launch blockers
scripts/         helper scripts (not published)
```

## Preview locally

```bash
python3 -m http.server 8000 --directory public
```
Open http://localhost:8000. Clean URLs (`/about`) are provided by Vercel; locally use `/about.html`.

## Deploy (Vercel)

Import the repo, leave framework as "Other", and Vercel will use `vercel.json` (output directory `public`). Then add the domain `mukundatech.co.za` (primary), `www.mukundatech.co.za` and `mukundatech.com`. See `docs/DNS_STEPS.md` and `docs/LAUNCH_BLOCKERS.md`.

## Contact

The site has no contact form. Visitors email info@mukundatech.co.za. There is nothing to configure and no secrets.

## Content rules

No prices, customers, testimonials or statistics unless they are verified and approved. Product statuses must match reality (Caterflow: live; BizOps: in development; OneProfile: partner-first pilot; My Roots: in development, not launched).
