# Mukunda Technologies website

A responsive corporate site for Mukunda Technologies, built from the supplied brand brief and logo.

## Run locally

This is a dependency-free static site. The configured Replit run command starts `server.py`, which binds to the platform-provided `PORT` and serves the site on all interfaces.

To run it locally:

```bash
python3 server.py
```

Then open `http://localhost:8000`. The server also exposes `/health` for a lightweight deployment check and serves the branded `404.html` for missing pages.

## Notes

- The logo is used from `attached_assets/logo-horizontal_1790462775272.png`.
- Product content is centralized in `script.js`.
- Dedicated pages are available at `about.html`, `solutions.html`, `products.html`, and `contact.html`.
- The contact form opens a pre-filled email in the visitor's email client. It does not claim delivery because no email backend is configured yet.
- See `AUDIT.md` for the pre-build audit and production approval items.