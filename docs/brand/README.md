# Brand assets

- `logo-pack/` : the Founder's original 12 PNGs, untouched (source of truth). Not published (docs/ is in .vercelignore).
- `derived/` : assets created by us from the pack. `logo-horizontal-light-bg-derived*.png` = the pack's `logo-horizontal-transparent.png` with the low-saturation beige (right half of the M + wordmark) recoloured to site navy #061e32; alpha channel and the orange/yellow parts are untouched. Recorded as DERIVED, not supplied by the brand owner. Currently unused on the site (every header/footer/hero is dark) - kept for light backgrounds (documents, email, light pages).
- Published assets in public/assets/ were generated from logo-pack/ (cropped to content, Lanczos-resized 1x/2x/3x; icons cropped from icon.png). Not scripted in this repo.

Note: the pack is raster PNG only. No SVG/vector was supplied.
