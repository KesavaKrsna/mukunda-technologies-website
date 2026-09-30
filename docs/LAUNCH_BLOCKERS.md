# Launch blockers and open items (updated 30 Sep 2026)

## Legal items still open
1. **Lawyer review** of the privacy notice and terms: recommended within 2 to 4 weeks. Not yet reviewed by a lawyer. This is not a launch blocker.

No `[PLACEHOLDER` strings remain on the site.

**Done (30 Sep 2026):**
- CIPC certificate COR14.3 (issued 20 Jul 2026): registration number 2021/797500/07 and registered office 10 Clifton Street, Crystal Park, Benoni, Gauteng, 1515 are in the privacy notice, terms, footer and Organization JSON-LD. The director's ID number and tax number are deliberately not published.
- **Information Regulator Information Officer registration certificate** (issued 30 Sep 2026): registration number 2026-068061, registered 30 September 2026; Kgositsile Katlego Mogane appointed Information Officer. Shown in the privacy notice. Copy of the certificate kept outside the repo (Founder docs folder).
- VAT: the terms say the company is not registered for VAT and any prices quoted are not subject to VAT.
- **Legal name** is "Mukunda Technologies (Pty) Ltd" (Regulator record shows (PTY) LTD) in the legal pages, footer and JSON-LD `legalName`. The brand/display name stays "Mukunda Technologies". "t/a Brilliant Link" (on the Regulator record) is deliberately NOT used anywhere on the site.
- Legal pages are version 1.2, last updated 30 September 2026.

## Other blockers and follow-ups
- **Hosting:** Vercel needs Founder action (project, a paid plan for commercial use, add the three domains) and the GoDaddy DNS change (see `DNS_STEPS.md`).
- **info@ mailbox:** the Titan session has been expired since 21 Sep. Log in and confirm mail arrives; the contact page relies on email only.
- **DMARC:** delete the duplicate `p=none` record. Also check the extra Amazon SES inbound MX record.
- **Company facts:** the site now shows the CIPC name, registration number and registered office. It shows no founder, year or team, and no phone or social links (Founder decision).
- **Logo:** done. The Founder's logo pack is integrated (see `brand/README.md`). It is PNG only; an SVG master would be better.
- **Product wording** was set from the Founder's decisions and our locked facts; please re-read the four product cards before launch.
