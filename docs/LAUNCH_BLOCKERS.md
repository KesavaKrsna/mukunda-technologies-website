# Launch blockers and open items (29 Sep 2026)

## Must be filled in before go-live (placeholders still in the legal pages)
Search for `[PLACEHOLDER:` in `public/privacy.html` and `public/terms.html`. Each is highlighted yellow on the page.
1. **Information Officer name** (privacy): Founder to confirm he is the Information Officer.
2. **Information Officer registration with the Information Regulator** (privacy): register at https://eservices.inforegulator.org.za and confirm.
3. **VAT status** (terms): VAT number, or confirmation that the company is not VAT registered.

**Done (30 Sep 2026), from the CIPC certificate COR14.3 issued 20 Jul 2026:** registration number 2021/797500/07 and registered office 10 Clifton Street, Crystal Park, Benoni, Gauteng, 1515 are now in the privacy notice, terms, footer and Organization JSON-LD. The director's ID number and tax number are deliberately not published.

The company name is shown as "Mukunda Technologies", as CIPC shows it, with no "(Pty) Ltd". Confirm with the Founder whether the company is to be styled "(Pty) Ltd" before adding it anywhere.

The legal pages should not be published with the yellow placeholders showing. They have not been reviewed by a lawyer; a review within 2 to 4 weeks is recommended.

## Other blockers and follow-ups
- **Hosting:** Vercel needs Founder action (project, a paid plan for commercial use, add the three domains) and the GoDaddy DNS change (see `DNS_STEPS.md`).
- **info@ mailbox:** the Titan session has been expired since 21 Sep. Log in and confirm mail arrives; the contact page relies on email only.
- **DMARC:** delete the duplicate `p=none` record. Also check the extra Amazon SES inbound MX record.
- **Company facts:** the site now shows the CIPC name, registration number and registered office. It shows no founder, year or team, and no phone or social links (Founder decision).
- **Logo:** the supplied file `attached_assets/logo-horizontal_1790462775272.png` is not a valid image (see PR description). The site uses a text wordmark. Please supply a real logo file (SVG or PNG) if you want it in the header.
- **Product wording** was set from the Founder's decisions and our locked facts; please re-read the four product cards before launch.
