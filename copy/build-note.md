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
| **Tracks** | number · title · theme · date sent · streaming links · cover image · cover alt text · waveform | You, weekly |
| **Credits** | track · contributor · sound title · timestamp | You, weekly. `contributor` must match the credit name exactly. `timestamp` like `2:14` |
| **Submissions** | week · contributor · sound title · received · status · email · description · file · city · country · show city · instagram handle | The form, automatically. `status` is ok / duplicate / late |

**Notes**
- **One place for the weekly settings:** the Settings tab. Change `theme` and `current_week` every Monday, and every page updates within about 5 minutes. The submission status and deadline follow the ET clock by themselves, including the launch-week dates and the switch to the regular week on October 12. Use `status_override` or `deadline_override` only if a week runs differently.
- **Tracks:** a track appears on the site once its `date sent` is today or earlier (ET). Enter the date on the Monday the email goes out.
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
| `home-this-week-strip` | Home, under the hero |
| `home-launch-note` | Home, under "How a week works" |
| `home-map-preview` | Home, Signal Map section |
| `home-latest-track` | Home, Latest transmission section |
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

**Page look (native GoHighLevel sections):** background #0c1524 (deep navy), with #060a12 for alternating sections. Text is #b3b8be (fog grey), headings #e6e8ea. Accent and buttons are #ff8a1e (sodium orange). Borders and dividers are #3a3936 (raw concrete). Fonts: IBM Plex Sans for text, IBM Plex Mono for labels and times. Night only, with no light version.

## 6. Every Monday
1. Settings: set `current_week` and `theme` (the vote winner). Clear `theme_note` after launch week.
2. Tracks: add last week's track row (with `date sent` = today), plus its Credits rows.
3. Send the early-access email.
4. About a month later, when a track is live on streaming platforms, add its links to `streaming links` and email subscribers that it's out. (A GoHighLevel email campaign to tag `vela-active` works for this.)

---

# Left out, assumed, or needing your attention

1. **Legal text edits (as you asked):** dated September 30, 2026; operator "Vela Nox, based in Boston, Massachusetts"; governing law Massachusetts, United States; the 18+ sections removed from the Terms (old §2) and the Privacy Policy (old §8), with the sections renumbered. `[YOUR DOMAIN]` is still a placeholder (Terms intro and §2, Privacy intro). Fill it in `copy/legal/*.txt` and rebuild.
2. **Terms §7 and the release timing disagree.** It says "Streaming release usually follows one to three weeks after the early-access email". The site now says about a month, as you told me. I haven't changed your legal text, so update §7 yourself if you want them to match.
3. **How the site follows your legal text.** Terms §5 and Privacy §3 show the timestamp on this website only for people who opted in. So people who didn't opt in are listed by credit name only on track pages: no timestamp, no sound title, no waveform marker. They still count in the contributor numbers and appear in the Streaming credits list. The opt-out wording now says "Signal Map and public website credits", as the policies do.
4. **Additions to Rules & FAQ, taken from your legal text:** no unlawful, hateful, harassing, sexually explicit or harmful sounds; how to cancel; and that payments are non-refundable except for charges made in error.
5. **No minimum age.** With the 18+ requirement removed, nothing stops children from subscribing. In the US, collecting personal information from under-13s triggers COPPA (parental consent and other obligations). Consider at least a 13+ requirement.
6. **Domain.** `[YOUR DOMAIN]` is still a placeholder in the legal text. Add the real domain in GoHighLevel when you connect it.
7. **Monday status line.** The Home strip only had wording for "open" and "closed — the track is being made". On Mondays neither is true, so it says "Submissions closed. They open Tuesday, [DATE], 12:00 am ET".
8. **Launch-week vote timing on Home.** Added "The vote closes Sunday, October 11, 11:59 pm ET." to the strip's vote line during launch week, so the Home page uses the launch dates as required. It drops off on October 12.
9. **"When is it on Spotify?"** is written as "When is it on streaming platforms?", because of the rule against naming brands. Switch it back if you prefer your wording.
10. **FAQ "When is the deadline?"** was added so the FAQ shows the launch-week deadline, as required.
11. **Images.** Waiting for yours. For now, the hero is type only and covers show a plain concrete block. Each cover gets alt text from the `cover alt text` column.
12. **Extra sheet columns and a fifth tab.** A Settings tab (the one place for the weekly settings), plus private columns (status, email, file, and so on) and a `remove from public` column for opt-out requests.
13. **"Cities" counts** only count people who chose to show their city, so no one's city is revealed indirectly.
14. **Check in your GoHighLevel plan:** whether portal lessons accept custom code, whether there's a "subscription ended" trigger, and whether the form's redirect to `/sent` works from inside the portal. The build above works if all three do.
15. **Testimonials and subscriber counts.** Intentionally none. There's no real data for them.
