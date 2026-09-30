# Vela Nox: subscriber website (GoHighLevel)

The subscriber site for Vela Nox's community-built weekly techno track.

| Path | What it is |
|---|---|
| `copy/site-copy.md` | Finished copy, page by page and section by section, including empty states and the SEO block |
| `copy/build-note.md` | GoHighLevel build note (Stripe, tags, portal gating, form, Google Sheet, code elements) and the list of what was left out |
| `apps-script/Code.gs` | Google Sheet data source: public JSON for the site, plus the webhook that receives form submissions |
| `src/vela.js`, `src/vela.css` | Source for the custom code elements (Signal Map, counters, waveform credits, profiles, submit panel) |
| `ghl/` | Paste-ready snippets, generated from `src/` with `node tools/build.mjs` |
| `tools/waveform-peaks.html` | Local tool that turns a finished track into waveform data for the Tracks tab |

Weekly edits happen only in the Google Sheet (Settings, Tracks and Credits tabs). Nothing on the site is sample data. Every number, name and point comes from the sheet.
