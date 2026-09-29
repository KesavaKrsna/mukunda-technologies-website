# DNS steps for go-live (Founder, GoDaddy)

Do these only after the Vercel project shows the domains as added and the preview has been approved. **Do not change MX, SPF, DKIM or DMARC records for email** except for the DMARC clean-up in step 6.

## Before you start
1. In Vercel: create the project from this repo (framework "Other"; `vercel.json` sets the output folder `public`). Use a Pro/Team plan (Hobby is non-commercial).
2. In Vercel > Project > Settings > Domains, add: `mukundatech.co.za` (set as primary), `www.mukundatech.co.za` (redirect to apex) and `mukundatech.com` (redirect to `https://mukundatech.co.za`). Vercel shows the exact DNS values to use. The values below are the usual ones; if Vercel shows different ones, use Vercel's.

## mukundatech.co.za (DNS at GoDaddy)
GoDaddy > My Products > mukundatech.co.za > DNS.
3. **A record, name `@`**: currently `34.111.179.208` (Replit). Change the value to `76.76.21.21` (or the value Vercel shows). TTL 600 seconds.
4. **`www`**: currently an A record to `34.111.179.208`. Delete it and add a **CNAME, name `www`, value `cname.vercel-dns.com`** (or the value Vercel shows).
5. **TXT records starting `replit-verify=`** (on `@` and on `www`): delete them after the site works. They are Replit leftovers.
6. **DMARC clean-up:** there are two TXT records at `_dmarc`. Keep `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` and delete the one that says only `v=DMARC1; p=none;`.
7. **Leave everything else alone**: the MX records (GoDaddy/Titan), the SPF TXT record (`v=spf1 include:secureserver.net -all`) and the Google verification TXT.
8. One extra MX record points at `inbound-smtp.eu-west-1.amazonaws.com` (priority 10). Find out whether anything you use depends on it (for example an old Amazon SES setup). If not, delete it, because it can send part of the incoming mail somewhere other than your Titan inbox. If you are unsure, leave it and ask us to look at it.

## mukundatech.com (DNS at Hostinger, if you want it to redirect)
9. Hostinger > Domains > mukundatech.com > DNS / Nameservers. The domain is parked at `ns1/ns2.dns-parking.com`.
10. Delete the existing parking `A` and `AAAA` records for `@` and any `www` record, then add **A, name `@`, value `76.76.21.21`** and **CNAME, name `www`, value `cname.vercel-dns.com`** (or Vercel's values). Keep the Hostinger MX records if you use that mailbox.
11. The redirect itself is in `vercel.json`: anything on mukundatech.com and www.mukundatech.com goes permanently to `https://mukundatech.co.za/...`.

## After the DNS change
12. Wait 10 to 60 minutes. In Vercel, the domains should turn to "Valid Configuration" and a certificate is issued automatically.
13. Open https://mukundatech.co.za, https://www.mukundatech.co.za (should redirect to the apex) and https://mukundatech.com (should redirect to the apex).
14. Send a test email to info@mukundatech.co.za from another address and confirm that it arrives (log in to Titan; the session has expired).
15. Google Search Console: add `https://mukundatech.co.za`, verify with a TXT record at GoDaddy, and submit `https://mukundatech.co.za/sitemap.xml`.

## Rollback
Change the `@` A record back to `34.111.179.208` and the `www` CNAME back to an A record with the same value. Email is not affected either way.
