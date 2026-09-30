# Vela Nox: GoHighLevel build note

## 1. Stripe product and tags
- Connect Stripe in **Payments → Integrations**.
- In **Payments → Products**, create one product, "Vela Nox weekly", with one recurring price: **$3.00, every 1 week**. No trial, no coupons, and don't turn on promo codes on the order form.
- Build a funnel page (for example `/subscribe`) with a **2-step order form** for that product. Add a required custom field, **Instagram handle**, so the handle is collected at signup. Every subscribe button on the site links here and reads "Send me a sound — $3/week".
- Workflow **"Subscriber on"**. Trigger: order submitted or payment received for the product. Actions: add tag `vela-active`, grant the portal offer **Submit**, and create a task: "Add [Instagram handle] to Close Friends".
- Workflow **"Subscriber off"**. Trigger: the subscription ends (cancelled or expired). Actions: remove tag `vela-active`, revoke both portal offers (**Submit** and **Already sent**), and create a task: "Remove [Instagram handle] from Close Friends". Check that the trigger fires when access actually ends, not when the person clicks cancel.
- **Cancelling, per your Cancellation Policy:** turn on Stripe's customer portal, so the "manage subscription" link appears in Stripe billing emails, and set cancellations to take effect **at the end of the billing period**. That way access runs to the end of the paid week and there's no further charge. For cancellations by email, cancel in Stripe the same way (at period end). For refunds of charges made in error (within 14 days), refund in Stripe.
- **Price changes:** the policy promises at least 14 days' notice by email.

## 2. Gating the Submit page
GoHighLevel website pages can't require a login, so the real form lives in the **subscriber portal** (Memberships / Client Portal):
- **Offer "Submit"** → course "Submit" → one lesson containing the custom code element `portal-submit-panel`. It shows the theme, deadline, reminder and vote line, and loads the form only while submissions are open. Outside the window it shows the closed state.
- **Offer "Already sent"** → one lesson with `portal-already-sent`.
- The public website page `/submit` is written for non-subscribers: a short explanation, the subscribe button, and a "Log in to send your sound" link to the portal.
- The portal doesn't load the website's head code, so both portal elements carry the shared script inline. Rebuild and re-paste them whenever `src/` changes.
- Put the site footer at the bottom of both portal lessons.

## 3. The form
Build it in **Sites → Forms**. Create these custom contact fields first: Credit name, Instagram handle, Sound title, Sound description, Sound file (file upload), Show city (checkbox). City and Country are standard contact fields.
- Fields, labels and help text: see `copy/site-copy.md` → Submit. Put "Any audio format. 10 seconds max. 3 MB max." as the help text right next to the upload field.
- File upload: allow audio file types only, one file.
- The three required checkboxes are required fields. The city checkbox is optional.
- Add a text block directly above the button with the credit line. Button text: **Send it**.
- On submit: redirect to `/sent` (website page with `submit-sent-confirmation`, set to noindex).
- **Limits and what enforces them.** GoHighLevel can restrict the file type, but it can't read an audio file's length, and the size limit it applies may not be 3 MB. So the limits are stated on the form, and anything over 10 seconds or 3 MB is skipped when the sounds are reviewed. The time window is enforced twice: the form only loads while submissions are open, and the sheet marks anything that arrives outside the window as `late` and doesn't count it.

**One sound a week.** Workflow **"Sound received"**. Trigger: form submitted (this form).
1. If the contact has tag `sent-this-week`: stop. The sheet also marks the entry as `duplicate`.
2. Otherwise: add tag `sent-this-week`, revoke offer **Submit**, grant offer **Already sent**, and run a **Custom Webhook** action: POST to the Apps Script URL with this JSON body:
```json
{
  "secret": "PASTE_WEBHOOK_SECRET",
  "email": "{{contact.email}}",
  "credit_name": "{{contact.credit_name}}",
  "city": "{{contact.city}}",
  "country": "{{contact.country}}",
  "instagram": "{{contact.instagram_handle}}",
  "sound_title": "{{contact.sound_title}}",
  "description": "{{contact.sound_description}}",
  "file": "{{contact.sound_file}}",
  "show_city": "{{contact.show_city}}"
}
```
(Use the merge keys GoHighLevel shows for your custom fields. They may differ slightly from the ones above.)

**Weekly reset (Tuesday, 12:00 am ET).** Workflow **"New week"**. Trigger: tag `sent-this-week` removed. If the contact has `vela-active`: revoke **Already sent** and grant **Submit**. To run it, schedule a bulk action every week (Contacts → filter by tag `sent-this-week` → Remove tag).

## 4. Google Sheet
Create the sheet, open **Extensions → Apps Script**, paste `apps-script/Code.gs`, and run `setup()` once. That creates the tabs and headers, sets the sheet's time zone to ET, and logs the webhook secret. Then **Deploy → New deployment → Web app**, execute as **me**, access **Anyone**. Paste the `/exec` URL into `ghl/site-head.html` (`dataUrl`) and into the webhook action.

**Don't use "Publish to web" on this sheet.** The Contributors and Submissions tabs hold emails. The site only reads the web app, and the web app only sends out public fields.

| Tab | Columns | Who fills it |
|---|---|---|
| **Settings** | key · value · note | You. `current_week`, `theme`, `theme_note`, `status_override` (auto / open / closed), `deadline_override` |
| **Contributors** | credit name · instagram handle · email · city · country · show city · remove from public · lat · lng · first seen · last seen | The form, automatically. You set `remove from public` to "yes" for opt-out requests |
| **Tracks** | number · title · theme · date sent · streaming links · cover image · cover alt text · waveform · type · example marks · preview audio | You, weekly. Leave `type` empty for real releases |
| **Credits** | track · contributor · sound title · timestamp | You, weekly. `contributor` must match the credit name exactly. `timestamp` like `2:14` |
| **Submissions** | week · contributor · sound title · received · status · email · description · file · city · country · show city · instagram handle | The form, automatically. `status` is ok / duplicate / late |

**Notes**
- **One place for the weekly settings:** the Settings tab. Change `theme` and `current_week` every Monday, and every page updates within about 5 minutes. The submission status and deadline follow the ET clock by themselves, including the launch-week dates and the switch to the regular week on October 12. Use `status_override` or `deadline_override` only if a week runs differently.
- **Tracks:** a track appears on the site once its `date sent` is today or earlier (ET). Enter the date on the Monday the email goes out.
- **The test transmission (Tumult):** `setup()` adds one row: number `0`, title `Tumult`, theme `Test transmission`, type `demo`. A `demo` row is always shown (no date needed) but never counts as a release: it isn't in the counters, it never lights the map, it has no contributor credits, and it isn't a filter on the Signal Map. Its page says it's a track by the human producer behind Vela Nox, not built from subscriber sounds. Its `waveform` and `example marks` are ready: paste the contents of `preview/tumult-waveform.json` into `waveform`, and `0:31, 1:46, 2:06, 3:31, 4:12` into `example marks` (the intro lift, the build, the main section, the breakdown and the drop). For `preview audio`, upload the 128 kbps preview of Tumult to GoHighLevel's media library and paste its link. The test transmission is the only track with a play button: as it plays, a playhead crosses the waveform and each example mark lights up. Real releases never get a player. When you replace the audio, run the new file through `tools/waveform-peaks.html` and I can re-pick the marks. Streaming links and a cover work as for any track. To retire it later, delete the row. Until then it sits in its own "Test transmission" block under the real releases.
- **Covers:** until a track has a `cover image`, the site shows its number ("02") in a dark square instead, and hides that square on phones on the track page.
- **Streaming links:** one per line, `Label | https://…`.
- **Waveform:** open `tools/waveform-peaks.html` on your computer, pick the finished track, and paste the text it gives you into the `waveform` column. The audio never has to be public. (An audio URL also works, but only if its host allows cross-origin reads. Otherwise the site draws a flat line with the markers on it.)
- **Credit names:** keep them unique. If two people want the same one, ask one of them to change it. If someone changes their credit name, update the old name in Credits too.
- **Map positions:** each city is geocoded to its center and rounded to two decimals. Contributors you add by hand get positions when you run `geocodeMissing()`.
- **What's calculated automatically:** levels (Static 0, Signal 1+, Frequency 5+, Broadcast 10+ credits), brightness, the counters, contributor and city counts per track, and this week's pool. Only people who ticked "show city" are included in city counts and on the map. Contributors credited counts everyone credited, as a number only.

## 5. Custom code elements
Run `node tools/build.mjs` after changing anything in `src/`, then paste from `ghl/`.

| Paste | Where |
|---|---|
| `ghl/legal/terms.html`, `privacy.html`, `cancellation.html` | `/terms`, `/privacy`, `/cancellation` (one Custom Code element each) |
| `ghl/site-head.html` | Website settings → Head tracking code (whole site, once). Fill in `dataUrl`, `subscribeUrl`, `portalUrl` |
| `home-hero-map` | Home hero: a full-width section with no padding. Put the H1, subhead and button in a text block over its lower-left (under it on phones) |
| `home-this-week-strip` | Home, under the hero. Also at the top of the locked `/submit` page |
| `home-timeline` | Home, "How a week works" |
| `home-launch-note` | Home, under the timeline |
| `home-latest-track` | Home, "Latest track" section |
| `signal-map` | Signal Map page (`/signal-map`) |
| `signal-map-broadcast-wall` | Signal Map page, last section |
| `tracks-index` | `/tracks` |
| `track-page` | `/track` (one page for every track, which reads `?n=`) |
| `contributors` | `/contributors` |
| `faq-deadline-answer`, `faq-vote-answer` | Rules & FAQ (`/rules-faq`), under those questions |
| `submit-sent-confirmation` | `/sent` |
| `portal-submit-panel` (replace `FORM_ID` twice) | Portal lesson "Submit" |
| `portal-already-sent` | Portal lesson "Already sent" |

If you use different page URLs, change `paths` in `src/vela.js` and rebuild. The map shows subscriber cities only, with no fixed points or lines. It uses d3-geo and a world outline from cdn.jsdelivr.net, and fonts from Google Fonts. Nothing else is loaded from outside.

## 6. Design (from the Vela Nox design system)
The site head code loads the fonts and defines the tokens; it also paints every page `--night`, so no white page flashes. Style the native GoHighLevel sections to match:

One accent: **cold ice-blue light, everywhere** (buttons, links, focus, map lights, waveform markers, contributors' names, level meters, the glow on titles). No orange anywhere in the interface. This replaces the design file's sodium accent, to give the site its futuristic, cold-light look.

| Token | Hex | Use |
|---|---|---|
| `--night` | #070C16 | Page background everywhere, including funnel, checkout and portal pages |
| `--deep` | #0D1624 | Raised surfaces: theme strip, cards, the map sea |
| `--concrete` | #243048 | Borders, input outlines, list separators, map land |
| `--fog` | #8E9AAE | Secondary text, helper text |
| `--mist` | #E6EDF5 | Primary text and headings; links (1px `--fog` underline, ice-blue on hover) |
| `--ice` | #A6DCFF | The only accent: primary buttons (dark `--night` text, soft ice glow), link hover, keyboard focus, active filters, the timeline dot, map lights (Broadcast level glows near-white #E3F5FF), waveform markers, a contributor's own name, level meters, checkboxes, the confirmation light. Glow: `rgba(166, 220, 255, 0.32)` |
| `--beacon` | #E5483D | Only: the live submission deadline |

- **Fonts:** Big Shoulders Display 800 for page titles and the theme, 600 for section headings (never below 24px). Atkinson Hyperlegible for everything else. No monospace; numbers use tabular figures.
- **Type sizes (phone → desktop at 900px):** hero 44→88px, page H1 36→60px, H2 26→36px, H3 19→21px, body 17→18px, small 14→15px, theme 34→56px.
- **Shape:** radius 0 on buttons, inputs, panels and cards. No drop shadows; the only glow is the soft ice light on buttons and titles. One spacing rhythm on every page: each section gets 56px of padding above and below on phones, 80px on desktop. Between sections, a 1px concrete hairline across the content with a 48px glowing ice-blue tick on its left: paste the `section-divider` element at the top of every section after the first (or give the GoHighLevel section the custom class `vn-sep`).
- **Layout:** one left-aligned reading column (38rem) inside a 72rem page, side padding 20/40/64px. Only the Signal Map runs full width.
- **Buttons:** primary is ice-blue (#A6DCFF) with dark text and a soft ice glow, Atkinson bold 17px, padding 18×28px, full width on phones, lighter (#C9ECFF) on hover. Secondary ("See the credits", "See the Signal Map", "View as list") is transparent with a 1px concrete border.
- **Header:** "Vela Nox" in Big Shoulders 800 at 22px on the left; Home, Submit, Map, Tracks, Rules on the right (the current page underlined). "Vela Nox" also links home. Transparent over the home hero and the page header images, night with a bottom border once scrolled. On phones, a "Menu" text button opens a full-screen night panel with the links in Big Shoulders 36px.
- **Form (GoHighLevel form builder → Styles/Custom CSS):** night inputs, 52px tall, 1px concrete border that turns ice-blue on focus, bold 16px labels above, grey 14px help below, 28px between fields, square 22px checkboxes. Order: Your sound, then Your credit, then Before you send it (use the form's section/heading blocks for the three H2s).
- **FAQ:** GoHighLevel's FAQ/accordion element, with a thin plus icon that rotates when open.
- **Stripe checkout:** set the order form and checkout colors to the palette so paying doesn't jump to a white page.
- **Motion:** only the map's first-visit fade-in, the pulsing deadline dot, the confirmation line, waveform highlights and the accordion. All of them respect "reduce motion".
- **Images** (in `assets/`, made on Higgsfield from your multiview; upload them to GoHighLevel's media library):
  | File | Where |
  |---|---|
  | `hero-vela-tower.webp` (2200px) | Home hero, full-bleed background. Headline over the dark left side, a dark fade at the top behind the header |
  | `vela-portrait.webp` | Home, "Who's Vela", on the right of the text |
  | `vela-face.webp`, `vela-footer-96.png` | Footer photo (48px) |
  | `favicon-64.png`, `apple-touch-icon.png` | Site favicon and phone home-screen icon (GoHighLevel → Settings → favicon) |
  | `vault.webp` | Header image behind the "Tracks & Credits" title |
  | `stromen-ruins.webp` | Header image behind the "Rules & FAQ" title |
  | `strands-texture.webp` (also) | Header image behind the "Contributors" title |
  | `strands-texture.webp` | Background of the `/sent` confirmation page |
  | `stairwell.webp` | Header image behind the Submit page title ("Send this week's sound") |
  | `tower-strands.webp` | Spare. Not used on the site right now (the Signal Map page has no header image: the map is the visual) |
  Page header images: a section about 46% of the screen tall with the image as its background, a dark gradient into `--night` at the bottom, and the page H1 sitting on it. These pages open this way: Submit, Tracks & Credits, Contributors, Rules & FAQ. The Signal Map page doesn't: its title and intro sit side by side at the top, then the counters and filters, then the map, so it all fits on one screen. The first section under a header image gets 36px (phones) / 48px (desktop) of space above it. The Signal Map moved out of the home hero into its own full-width section under the theme strip.

**What only the preview shows (GoHighLevel limits):** the preview's upload box, which shows the file's length and a small waveform, checks the 10-second and 3 MB limits, and shows the red-bar error messages. The live GoHighLevel form loads in a frame that the site's code can't reach, so on the live site the upload field is GoHighLevel's own, restyled with the form's CSS. The limits are stated next to the field, and anything over is skipped at review, as before.

## 7. Every Monday
1. Settings: set `current_week` and `theme` (the vote winner). Clear `theme_note` after launch week.
2. Tracks: add last week's track row (with `date sent` = today), plus its Credits rows.
3. Send the early-access email.
4. About a month later, when a track is live on streaming platforms, add its links to `streaming links` and email subscribers that it's out. (A GoHighLevel email campaign to tag `vela-active` works for this.)

---

# Left out, assumed, or needing your attention

1. **Legal text edits (as you asked):** dated September 30, 2026; operator "Vela Nox, based in Boston, Massachusetts"; governing law Massachusetts, United States (Terms §14); minimum age 13, with parent or guardian permission for under-18s (Terms §2, Privacy §8); streaming release about one month after the early-access email, with an email to subscribers when it's out (Terms §8). `[YOUR DOMAIN]` is still a placeholder (Terms intro and §3, Privacy intro). Fill it in `copy/legal/*.txt` and rebuild.
2. **Parent or guardian permission for under-18s** was added to Terms §2, because minors usually can't enter a binding contract or pay on their own. Remove that sentence if you don't want it.
3. **How the site follows your legal text.** Terms §6 and Privacy §3 show the timestamp on this website only for people who opted in. So people who didn't opt in are listed by credit name only on track pages: no timestamp, no sound title, no waveform marker. They still count in the contributor numbers and appear in the Streaming credits list. The opt-out wording now says "Signal Map and public website credits", as the policies do.
4. **Additions to Rules & FAQ, taken from your legal text:** the 13+ age rule; no unlawful, hateful, harassing, sexually explicit or harmful sounds; how to cancel; and that payments are non-refundable except for charges made in error.
5. **Age check at checkout.** Nothing at checkout asks for age yet. Add a required checkbox to the order form: "I'm 13 or over, and if I'm under 18 I have a parent's or guardian's permission."
6. **Domain.** `[YOUR DOMAIN]` is still a placeholder in the legal text. Add the real domain in GoHighLevel when you connect it.
7. **Monday status line.** The Home strip only had wording for "open" and "closed — the track is being made". On Mondays neither is true, so it says "Submissions closed. They open Tuesday, [DATE], 12:00 am ET".
8. **Launch-week vote timing on Home.** Added "The vote closes Sunday, October 11, 11:59 pm ET." to the strip's vote line during launch week, so the Home page uses the launch dates as required. It drops off on October 12.
9. **"When is it on Spotify?"** is written as "When is it on streaming platforms?", because of the rule against naming brands. Switch it back if you prefer your wording.
10. **FAQ "When is the deadline?"** was added so the FAQ shows the launch-week deadline, as required.
11. **Images.** Waiting for yours. For now, the hero is the map (no photo), the space beside the theme strip is empty, the footer has no profile photo, and covers show a plain block. Each cover gets alt text from the `cover alt text` column.
12. **Extra sheet columns and a fifth tab.** A Settings tab (the one place for the weekly settings), plus private columns (status, email, file, and so on) and a `remove from public` column for opt-out requests.
13. **"Cities" counts** only count people who chose to show their city, so no one's city is revealed indirectly.
14. **Check in your GoHighLevel plan:** whether portal lessons accept custom code, whether there's a "subscription ended" trigger, and whether the form's redirect to `/sent` works from inside the portal. The build above works if all three do.
15. **Testimonials and subscriber counts.** Intentionally none. There's no real data for them.
16. **Where the design system and your earlier instructions differ.** I followed your instructions:
    - **Tower and transmission lines:** the design system puts a blinking red tower on the map and draws lines to it. You asked for subscriber locations only, so neither is on the map. The red beacon color now appears only on the live deadline. Say so if you want the tower back.
    - **Streaming timing:** the design's timeline says "1–3 weeks". The site says about a month, as you told me.
    - **Status wording:** the design's closed line is "Closed. The track is being made." The site keeps your content wording, "Submissions closed — the track is being made".
    - **Navigation:** the design lists four links (Submit, Map, Tracks, Rules). Contributors is reached from the map, from the credits, and from the phone menu.
17. **Not built (yet):** the waveform play button (only if you want to host a low-quality preview, which would put audio in public before streaming), and the Monday email template (build it in GoHighLevel's email builder with the same palette: night background, the title in Big Shoulders, tabular timestamps, and ice-blue WAV/FLAC/MP3 buttons).
18. **Your Vela Nox overview disagrees with the site in two places.** The site follows your later instructions: tracks reach streaming about a month after the email (the overview says one to three weeks), and there are no lines to a tower on the Signal Map (the overview describes them). If you reuse the overview elsewhere (press notes, pinned posts), update those two lines.
19. **Color and look changes from the design file (your go-ahead):** ice-blue is now the only accent color, everywhere, with a soft glow (no orange in the interface); the navy is darker; the home hero is a photo of Vela on the tower instead of the map (the map is its own section right below). The images are original. Your reference images were used only as a style direction in words, not as inputs, so nothing copies another artist's work.
