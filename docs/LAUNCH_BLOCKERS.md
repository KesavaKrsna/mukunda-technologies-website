# Launch blockers and open items (29 Sep 2026)

## Must be filled in before go-live (placeholders in the legal pages)
Search for `[PLACEHOLDER:` in `public/privacy.html` and `public/terms.html`. Each is highlighted yellow on the page.
1. **CIPC registration number** (privacy and terms)
2. **Registered physical address** (privacy and terms)
3. **Information Officer name** (privacy) and confirmation that the Information Officer is **registered with the Information Regulator** (https://eservices.inforegulator.org.za)
4. **VAT number**, or confirmation that the company is not VAT registered (terms)

The legal pages are complete otherwise, but they should not be published with the yellow placeholders showing. They have not been reviewed by a lawyer; a review within 2 to 4 weeks is recommended.

## Other blockers and follow-ups
- **Hosting:** Vercel needs Founder action (project, a paid plan for commercial use, add the three domains) and the GoDaddy DNS change (see `DNS_STEPS.md`).
- **info@ mailbox:** the Titan session has been expired since 21 Sep. Log in and confirm mail arrives; the contact page relies on email only.
- **DMARC:** delete the duplicate `p=none` record. Also check the extra Amazon SES inbound MX record.
- **Company facts:** the site says "Mukunda Technologies (Pty) Ltd" and "South Africa" and nothing more. It shows no city, founder, year or team, and no phone or social links (Founder decision).
- **Logo:** the supplied file `attached_assets/logo-horizontal_1790462775272.png` is not a valid image (see PR description). The site uses a text wordmark. Please supply a real logo file (SVG or PNG) if you want it in the header.
- **Product wording** was set from the Founder's decisions and our locked facts; please re-read the four product cards before launch.
