# Vela Nox: GoHighLevel paste-in kit

Everything here is pasted into GoHighLevel as-is. It's built from the same files as the preview, so the live site looks and works exactly like it. Don't edit these files by hand: change `src/`, `preview/template.html` or `copy/legal/`, then run `node tools/build.mjs && node tools/kit.mjs`.

## 1. Once, for the whole site

1. **Settings → Custom CSS:** paste all of `1-custom-css.css`. It loads the fonts and every style, and keeps every page night blue.
2. **Settings → Tracking code → Footer:** paste all of `2-footer-code.html`. At the top, fill in:
   - `dataUrl`: the Apps Script web app URL (ends in `/exec`)
   - `portalUrl`: the subscriber portal login link
   - `subscribeUrl` stays `/subscribe` unless the order form page has another URL
3. **Settings → Favicon:** upload `assets/favicon-64.png`.

## 2. Upload the images

Upload the six files listed in `images.txt` to the media library. In each page file, replace every `https://REPLACE-WITH-IMAGE-URL/name.webp` with the link GoHighLevel gives that image. Use your editor's find and replace:

| Image | Used on |
|---|---|
| `hero-vela-tower.webp` | Home (hero) |
| `vela-portrait.webp` | Home ("Who's Vela") |
| `stairwell.webp` | Submit |
| `vault.webp` | Tracks & Credits |
| `strands-texture.webp` | Contributors, Sent |
| `stromen-ruins.webp` | Rules & FAQ |

The logo is built into the files, so there's nothing to upload for it.

## 3. The pages

Create each page with the URL below. Then, on each one:
- add one full-width section with its padding set to 0 (section, row and column),
- add one **Custom Code** element and paste the whole file into it,
- turn off GoHighLevel's own header and footer for that page. Each file has its own header, footer and phone menu.

| File | Page URL |
|---|---|
| `pages/01-home.html` | `/` |
| `pages/02-submit.html` | `/submit` |
| `pages/03-signal-map.html` | `/signal-map` |
| `pages/04-tracks.html` | `/tracks` |
| `pages/05-track.html` | `/track` (one page for every track, opened as `/track?n=1`) |
| `pages/06-contributors.html` | `/contributors` |
| `pages/07-rules-faq.html` | `/rules-faq` |
| `pages/08-terms.html` | `/terms` |
| `pages/09-privacy.html` | `/privacy` |
| `pages/10-cancellation.html` | `/cancellation` |
| `pages/11-sent.html` | `/sent` (the form redirects here; set it to noindex) |

**The order form page (`/subscribe`)** is built with GoHighLevel's own order form. Put `pages/12-header-only.html` in a Custom Code element at the very top and `pages/13-footer-only.html` at the very bottom, so it matches the rest of the site.

## 4. The subscriber portal

The portal doesn't load the site's Custom CSS or footer code, so these two files carry their own:
- `portal/portal-submit-panel.html` goes in the "Submit" lesson. Fill in `dataUrl` and `portalUrl`, and replace both `FORM_ID` values with the submission form's ID.
- `portal/portal-already-sent.html` goes in the "Already sent" lesson. Fill in `dataUrl` and `portalUrl`.

## If something looks off

- **A white gap or border around a page:** the section, row or column still has padding or a max width. Set them all to 0 and full width.
- **The header scrolls away instead of staying at the top:** a section setting is cutting it off (usually "overflow"). Tell me which page and I'll adjust it.
- **The map, counters or tracks say the signal isn't coming through:** check `dataUrl` in the footer code, and that the Apps Script is deployed with access set to "Anyone".
