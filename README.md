# hippoplot.com

Static public website for HippoPlot (MOHA TECHNOLOGIES LLC). No build step: Cloudflare Pages serves these files as-is.

- `/` index.html, `/about` about.html, `/support` support.html, `/privacy` privacy.html, `/terms` terms.html
- `404.html` is returned for unknown URLs (it also stops Pages from treating the site as a single-page app).
- `_headers` sets security headers; `sitemap.xml` and `robots.txt` are for search engines.
- Shared styles: `assets/site.css`. Header and footer are repeated in each page; keep them in sync when editing.
