# hippoplot.com

Static public website for HippoPlot (MOHA TECHNOLOGIES LLC). No build step: Cloudflare Pages serves these files as-is.

- `/` index.html, `/about` about.html, `/support` support.html, `/privacy` privacy.html, `/terms` terms.html
- `404.html` is returned for unknown URLs (it also stops Pages from treating the site as a single-page app).
- `_headers` sets security headers; `sitemap.xml` and `robots.txt` are for search engines.
- Shared styles: `assets/site.css`. Homepage feature reel: `assets/reel.js` (vanilla JS, loaded only on `/`). App links: `_redirects` sends /business/*, /user/*, /feed, /settings, /map and /reset-password to `open-in-app.html` (HTTP 200), whose `assets/applink.js` hands the link to the app via hippoplot://. Account deletion: `/delete-account`. Header and footer are repeated in each page; keep them in sync when editing.
