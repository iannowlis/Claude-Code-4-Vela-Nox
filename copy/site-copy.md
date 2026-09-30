# Vela Nox: site copy

All times are Eastern Time (ET). Anything in `[BRACKETS]` is filled in automatically by a custom code element (see `ghl/elements/`) or by you where marked.
Every subscribe button, sitewide, reads exactly: **Send me a sound — $3/week**
The submission button reads exactly: **Send it**
Layout, colour, type and motion follow the Vela Nox design system (see `copy/build-note.md` → Design). Sentence case everywhere, no all-caps labels.

**Header (every page):** "Vela Nox" (links home) on the left. Submit · Map · Tracks · Rules on the right. On phones: a "Menu" button that opens a full-screen list: Home, Submit, Map, Tracks, Contributors, Rules.

---

## HOME

### Hero: Vela on the tower, full width
Background image `assets/hero-vela-tower.webp`. Headline, subhead and button over the dark left side (under the image on phones).

**H1**
Every week, a techno track built from your sounds.

**Subhead**
Send one sound for the week's theme. Vote on next week's. If your sound is used, you're credited to the exact second. The finished track reaches your inbox before it's on streaming platforms.

[Button] Send me a sound — $3/week

### Theme strip
*Custom code element: `home-this-week-strip`. Updates itself from the Settings tab and the clock. On desktop, the right side is kept for a Vela portrait.*

> This week *(during launch week: "This week · Vela's pick")*
> **[THEME OF THE WEEK]** *(large)*
> ● [SUBMISSION STATUS] *(red, pulsing dot while open; grey, still dot when closed)*
> Next week's theme is being voted on now, in Vela's Close Friends story.

Submission status, by date:
- Launch week, until October 8: "Submissions open until Thursday, October 8, 11:59 pm ET"
- October 9–11: "Submissions closed — the track is being made"
- From October 12, Tuesday–Thursday: "Submissions open until Thursday, 11:59 pm ET"
- Friday–Sunday: "Submissions closed — the track is being made"
- Monday: "Submissions closed. They open Tuesday, [DATE], 12:00 am ET"

During launch week, the vote line adds: "The vote closes Sunday, October 11, 11:59 pm ET."
The vote form link is never shown on the site.

### H2: The Signal Map
Every light is someone who sent a sound and chose to show their city. The more credits, the brighter the light.
*Custom code element: `home-hero-map`, full width.* Lights fade in city by city on the first visit. Before any data, the map is dark.
Link: "Open the Signal Map"

### H2: How a week works
*Custom code element: `home-timeline`. A vertical timeline. A glowing blue dot marks where this week is.*
- **Mon.** The theme is announced, in Vela's Close Friends story and on this site. Last week's vote picked it. The vote for next week's theme opens.
- **Tue.** Submissions open. Record one sound for the theme and send it. Ten seconds, anything that fits.
- **Thu.** Submissions close at 11:59 pm ET.
- **Fri.** The track is made from the sounds that came in. The vote for next week's theme closes Sunday at 11:59 pm ET.
- **Mon.** The finished track lands in your inbox, with the credits and timestamps. About a month later, once the distributor has reviewed everything, it reaches streaming platforms. You'll get an email when it's out.

All times Eastern Time.

*Custom code element: `home-launch-note` (shows only until October 11, then disappears):*
> Launch week runs long. Submissions for Track 01 are open until Thursday, October 8, 11:59 pm ET. The first vote, for week 2's theme, runs until Sunday, October 11, 11:59 pm ET. Track 01 reaches subscribers on Monday, October 12. The regular week starts after that.

### H2: What $3 a week gets you
Two by two on desktop, stacked on phones. No boxes, no numbers.

**H3: One sound a week**
Record something for the week's theme and send it through the Submit page. Up to 10 seconds, up to 3 MB, any audio format.

**H3: A vote on next week's theme**
The vote runs Monday to Sunday through a Google Form in Vela's Close Friends story on Instagram, pinned in a Close Friends highlight. You give your Instagram handle when you subscribe and get added to Close Friends.

**H3: Credit, to the second**
If your sound is used, you're credited. "Your kettle, Lyon, at 2:14."
- Instagram: name, city, timestamp
- Subscriber email: name, city, timestamp
- Streaming platforms: name only. The artist field says Vela Nox
- This website: name, plus city and timestamp

Your city appears only if you choose to show it. Without it, you're credited by name only.

**H3: The track, first**
Every Monday, the finished track arrives by email in WAV, FLAC and MP3, with the full credits and timestamps. Before it's on streaming platforms.

### H2: Latest track
*Custom code element: `home-latest-track`.* One row: cover, "Track [NN] · [TITLE]", "[THEME] · Sent [DATE]", "[N] contributors · [N] cities", then the button "See the credits".
Empty state (before the first track): "Track 01 lands in subscribers' inboxes on Monday, October 12."

### H2: Who's Vela
Vela Nox is an AI persona. She began as an archive: a few sound engineers built her to save twelve years of recordings from Ströme, a club on the coast, before it was demolished. DJ sets, crowd noise, bar chatter, rain on the roof. She spent so long inside those nights that she learned the culture itself.

She lives, as the story goes, on a decommissioned radio tower on a foggy Baltic coast, and she's only around at night. She talks about records, clubs and the rules nobody writes down on [Instagram](https://www.instagram.com/velanoxmusic/) and [TikTok](https://www.tiktok.com/@velanox_music). The tracks released under her name are made by a human producer, from the sounds you send.

*(Beside it: `assets/vela-portrait.webp`.)*

### H2: The rules, briefly
- Send only your own recording. No one else's music, and no one's voice without their permission.
- Not every sound makes the track. Every sound is heard.
- You're credited if your sound is used. There's no payment and no share of streaming income.
- Your city shows only if you tick the box. Cancel anytime. You keep access until the end of the week you've paid for.

Link: "Read the rules and FAQ"

### Final CTA
Stay for the last record. *(the motto, once, large and grey)*
[Button] Send me a sound — $3/week

---

## SUBMIT

### Locked page: /submit (for people who aren't logged in as subscribers)
Header image (`stairwell.webp`) with **H1:** Send this week's sound

Then, side by side on desktop: the theme strip, so visitors see what this week is about (*custom code element `home-this-week-strip`*). Then:

**H2:** Submitting is for subscribers.
$3 a week, cancel anytime.

[Button] Send me a sound — $3/week

Already subscribed? [Log in to send your sound] *(link to the subscriber portal)*
Can't get in? Write to [velanox@gmail.com](mailto:velanox@gmail.com).

### Subscriber page: "Submit" lesson in the subscriber portal
*Custom code element: `portal-submit-panel`. It renders everything above the form, and loads the form only while submissions are open.*

Theme strip, large:
**H1:** This week's theme: [THEME OF THE WEEK]
● Deadline, in red with a pulsing dot: "Closes Thursday, October 8, 11:59 pm ET" during launch week. From October 12: "Closes Thursday, 11:59 pm ET"
Next week's theme is being voted on now, in Vela's Close Friends story.

**Reminder (directly under the theme):** Your sound only. No one else's voice, no music playing.

**Small line:** Want a say in next week's theme? The vote is open all week in Vela's Close Friends story.
(During launch week: "Want a say in next week's theme? The vote is open until Sunday, October 11, 11:59 pm ET, in Vela's Close Friends story.")

#### Form (GoHighLevel form), in three groups, sound first
**H2: Your sound**
| Field | Label | Help text | Required |
|---|---|---|---|
| Audio file | Your sound | Upload box: "Drop your sound here, or choose a file" / "Any audio format · 10 seconds max · 3 MB max" | Yes |
| Sound title | Sound title | Placeholder: my kettle | Yes |
| Description | One line about it | What it is, in one line. | Yes |

**H2: Your credit**
| Field | Label | Help text | Required |
|---|---|---|---|
| Credit name | Credit name | How you want to be credited. This is the name people will see. | Yes |
| City | City | | Yes |
| Country | Country | | Yes |
| Instagram handle | Instagram handle | Placeholder: @yourhandle | Yes |
| Email | Email | The one you subscribed with. | Yes |

- [Optional] Show my city with my credit (Instagram, subscriber email, and the Signal Map on this website). City only, never my address.
  Small print under it: Leave this unticked and you're credited by name only, everywhere, and you won't appear on the Signal Map.

**H2: Before you send it**
- [Required] This recording is mine. It has no one else's music in it, and no one's voice without their permission. You can use it and release it. [Read the terms](/terms)
- [Required] I understand not every sound makes the track. Every sound is heard.
- [Required] I understand I'll be credited if my sound is used, but I won't receive payment or a share of streaming income.

**Line directly above the button**
If your sound makes the track, you'll be credited when it's released: name, city and the exact second it plays on Instagram and in the subscriber email, and your name on streaming platforms.

**Button:** Send it (while uploading: "Sending…")

**Errors** (under the field, with a red bar on the left):
- "That file is [N] seconds. The limit is 10. Trim it and send it again."
- "That file is [N] MB. The limit is 3 MB. Export it smaller and try again."
- "That file couldn't be read as audio. Try exporting it as WAV or MP3."
- "Choose a sound to send. Any audio format, 10 seconds max, 3 MB max."
- "Tick the three boxes under "Before you send it" to continue."

#### Confirmation screen (/sent, custom code element `submit-sent-confirmation`)
The one centred moment on the site. A blue light, and a thin line rising from it (1.2 seconds, once). Then:
**H1:** Got it. Your sound is in the pool for [THEME OF THE WEEK].
The track lands in your inbox on Monday. *(During launch week: "…on Monday, October 12.")*
[Secondary button] See the Signal Map

#### Second attempt in the same week ("Already sent" lesson, element `portal-already-sent`)
**H1:** You've already sent this week's sound
Your sound is in the pool for [THEME OF THE WEEK]. The track lands in your inbox on Monday. The next theme opens Tuesday.
Want a say in next week's theme? The vote is open all week in Vela's Close Friends story.

#### Outside the submission window
The large theme strip, with a grey, still dot and:
"Submissions for this week are closed. The next theme opens [Tuesday, DATE], 12:00 am ET."
"Next week's theme is being voted on now, in Vela's Close Friends story."
If you force the status closed in Settings: "Submissions are closed for now."

---

## THE SIGNAL MAP

**H1:** The Signal Map

*Custom code element: `signal-map`*. Top to bottom:
1. **Counters (from the sheet only):** "[N] sounds received this week" · "[N] cities this week" · "[N] tracks released" · "[N] contributors credited". One row on desktop, a 2×2 grid on phones. Before any data they show 0. If the data can't load, "—".
2. **Filters (text buttons):** Everyone · This week's pool · Track 02 · Track 01 … (one per released track, newest first). One row that can be swiped sideways on phones.
3. **The map:** full width, framed from Cape Horn to the Arctic coast, fading softly into the page.
4. **Under the map, left:** "Each point of light is someone who sent a sound and chose to show their city. City only, placed at the city center, nothing more precise. The more credits, the brighter the light." Then the buttons: [View as list] and the link "Everyone on the map, as cards" (→ Contributors).
5. **Under the map, right, "Signal levels":** Static · sent a sound / Signal · 1+ credits / Frequency · 5+ credits / Broadcast · 10+ credits, each with its signal meter.
6. **"View as list"** opens a table below (City · Contributors · Credits). "Hide the list" closes it. Empty: "Nothing to list yet."

**Tap a light:** [CREDIT NAME] · [CITY] · level meter and level name · "[N] credits" · "See their credits"

**Empty states**
- Map, before any data: "The map is dark. The first signals arrive with the first track."
- "This week's pool", nobody opted in yet: "No one in this week's pool has chosen to show their city yet."
- A track where nobody opted in: "No one credited on this track chose to show their city."
- Data can't load: "The signal isn't coming through right now. Try again in a minute."

### H2: Broadcast wall
*Custom code element: `signal-map-broadcast-wall`. The whole section stays hidden until someone reaches Broadcast.*
Ten credits or more. The brightest lights on the map.
Then a contributor card for each person (see Contributor profiles).

---

## TRACKS & CREDITS

### Index: /tracks
**H1:** Tracks & Credits
Every track so far, newest first. Each one is built from sounds people sent that week. A track shows up here once subscribers have it in their inbox.

*Custom code element: `tracks-index`.* One row per track, separated by thin lines: cover, "Track [NN] · [TITLE]", "[THEME] · Sent [DATE]", "[N] contributors · [N] cities".
Empty state: "No tracks yet. Track 01 is being built from the rooms you're in right now."

### Track page: /track?n=[NUMBER]
*Custom code element: `track-page`. It writes the H1 and the page title.*

- Track [NN] *(grey, above the title)*
- **H1:** [TITLE]
- Theme: [THEME] / Sent to subscribers [DATE] / [N] contributors · [N] cities
- Streaming links: only the ones you add to the sheet, as outlined buttons. If there are none: "Not on streaming platforms yet. Tracks go out there about a month after the subscriber email, once the distributor has reviewed everything. Subscribers get an email when it's out."
- Cover on the right.

**H2: Waveform credits**
Each mark is a sound someone sent. Hover or tap it to see whose. People who chose not to show their city are credited by name only, in the list below.
Hover, tap or tab to a marker: the waveform brightens around it, a panel shows "[SOUND TITLE] · [CREDIT NAME] · [CITY] · [TIMESTAMP]", and the matching row below lights up. Only people who opted in get a marker. Coming from a contributor's card, their marker is already selected.
No waveform in the sheet: "No waveform for this track. The credits below have every timestamp."

**H2: Credits**
In timestamp order.
- Opted in: [TIMESTAMP] [SOUND TITLE] · [CREDIT NAME] · [CITY]
- Not opted in: [CREDIT NAME] only, in its place in the order, with no timestamp or sound title (as the Terms and Privacy Policy state)
Nobody public: "No public credits on this track."

**H2: Streaming credits**
Names only. This is the text used on streaming platforms, where they allow it. The artist field says Vela Nox.
[Credit names, comma-separated, in timestamp order]

**H2: Where this track came from**
Mini map with the cities of the credited contributors who chose to show them.
Nobody opted in: "No one credited on this track chose to show their city."

**Track not found or not sent yet:** H1 "No track here". "This track hasn't gone out yet, or the link is wrong. All tracks"

---

## CONTRIBUTOR PROFILES

**H1:** Contributors
Everyone here sent a sound and chose to show their city. People who didn't are credited by name only and aren't listed here.

*Custom code element: `contributors`.* A card per person:
- Credit name (in ice blue: their own name is the signal)
- City
- Level meter (four bars: Static 0, Signal 1, Frequency 3, Broadcast 4) and the level name
- "[N] credits · [N] sounds sent"
- One line per track: "Track [NN]   at [TIMESTAMP]", linking to the track with their marker selected. None yet: "Not credited on a track yet."

**H2: The levels**
- **Static:** sent a sound, not credited yet.
- **Signal:** 1 credit or more.
- **Frequency:** 5 credits or more.
- **Broadcast:** 10 credits or more.

Levels come from real credits only. They move up on their own as the sheet fills in.

Empty state: "No one here yet. Cards appear once people send sounds and choose to show their city."

---

## RULES & FAQ

**H1:** Rules & FAQ

### H2: Your sound
- You need to be 13 or over to subscribe or send a sound. If you're under 18, you need a parent's or guardian's permission.
- Send only a recording you made. It can't have anyone else's music in it, or anyone's voice without their permission. By sending it, you let Vela Nox use it and release it. The full terms are at [/terms](/terms).
- Nothing unlawful, hateful, harassing, sexually explicit or harmful.
- One sound a week, for that week's theme. Up to 10 seconds, up to 3 MB, any audio format.
- Not every sound makes the track. Every sound is heard.

### H2: Credits
- If your sound is used, you're credited.
- On Instagram: your credit name, your city (if you chose to show it) and the exact second your sound plays.
- In the subscriber email: credit name, city (if you chose to show it) and timestamp.
- On this website: your credit name. If you chose to show your city, also your city and timestamp, on the track's credits page and the Signal Map.
- On streaming platforms: your credit name only, in the release credits or notes where the platform allows it. Cities and timestamps don't appear there. The artist field lists Vela Nox only.

### H2: Money
- $3 a week, billed weekly through Stripe.
- You don't receive payment or a share of streaming income for your sound.
- Payments aren't refunded, except for charges made in error.

### H2: Timing
- Subscribers get the finished track by email every Monday, before it's on streaming platforms.
- Tracks reach streaming platforms about a month after that email, once the distributor has reviewed everything. Subscribers get an email when a track is out. No specific release date is promised.
- The early-access files are for personal listening. Please don't share or upload them before the public release.

### H2: Privacy
- Your city appears only if you tick "Show my city with my credit". City only, never your address.
- If you don't tick it, you're credited by your credit name only, everywhere, and you don't appear on the Signal Map.
- You can ask to be removed from the Signal Map and the public website credits at any time by emailing [velanox@gmail.com](mailto:velanox@gmail.com). Sounds already released in a track stay in that track.

### H2: Cancelling
- Cancel anytime, using the "manage subscription" link in your Stripe billing emails, or by emailing [velanox@gmail.com](mailto:velanox@gmail.com) from the address you subscribed with. You keep access until the end of the week you've paid for. See the [Cancellation Policy](/cancellation).

### H2: About Vela
- Vela Nox is an AI persona. She began as an archive of twelve years of recordings from Ströme, a coastal club that was demolished, and learned the culture from those nights. The music released under her name is made by a human producer from subscribers' sounds.

### H2: FAQ
*An accordion: each question opens and closes with a plus icon.*

**H3: What sound can I send?**
Something you recorded yourself, for that week's theme. No one else's music, and no one's voice without their permission. Any audio format.

**H3: How long can it be?**
Up to 10 seconds, and up to 3 MB.

**H3: When is the deadline?**
*Custom code element: `faq-deadline-answer`.*
During launch week: "For Track 01: Thursday, October 8, 11:59 pm ET. From October 12, the regular week applies: submissions open Tuesday and close Thursday at 11:59 pm ET."
From October 12: "Submissions open Tuesday and close Thursday at 11:59 pm ET, every week."

**H3: Will my sound definitely be used?**
No. Every sound is heard, but not every sound makes the track.

**H3: Do I get paid?**
No. If your sound is used, you're credited. There's no payment and no share of streaming income.

**H3: Where will I be credited?**
On Instagram and in the subscriber email: your credit name, the exact second your sound plays, and your city if you chose to show it. On this website: your credit name, plus your city and timestamp if you chose to show your city. On streaming platforms: credit name only, where the platform allows it.

**H3: How do I get the track early?**
Subscribe. Every Monday, subscribers get an email with the finished track to download in WAV, FLAC and MP3, plus the full credits and timestamps. That's before it's on streaming platforms. The files are for personal listening, so please don't share or upload them before the public release.

**H3: When is it on streaming platforms?**
About a month after subscribers get it by email. That's how long the distributor takes to review everything. Subscribers get an email when it's out. No specific date is promised.

**H3: How does the theme vote work?**
*Custom code element: `faq-vote-answer`.*
During launch week: "Launch week is longer. The first vote runs from Wednesday, September 30 until Sunday, October 11, 11:59 pm ET, and decides week 2's theme. After that, the vote runs all week, Monday to Sunday, closing Sunday at 11:59 pm ET. Each vote decides next week's theme. The vote is a Google Form linked in Vela's Close Friends story on Instagram and pinned in a Close Friends highlight. The winning theme is announced on Monday, in the story and on this site."
From October 12: "The vote runs all week, Monday to Sunday, and closes Sunday at 11:59 pm ET. It decides next week's theme, not this week's. It's a Google Form linked in Vela's Close Friends story on Instagram and pinned in a Close Friends highlight. The winning theme is announced on Monday, in the story and on this site."

**H3: Do I need Instagram?**
Yes. The vote happens in Vela's Close Friends story. You give your Instagram handle when you subscribe, and you're added to Close Friends.

**H3: Will my name and city be public?**
Your credit name, yes, if your sound is used. You choose the name. Your city only if you tick the box, and only the city, never your address. If you tick it, you also show up on the Signal Map once you've sent a sound. Streaming platforms only ever get the name.

**H3: How do I get off the map?**
Email [velanox@gmail.com](mailto:velanox@gmail.com). You'll be removed from the Signal Map and the public website credits. Sounds already released in a track stay in that track.

**H3: How do I cancel?**
Anytime. Use the "manage subscription" link in your Stripe billing emails, or email [velanox@gmail.com](mailto:velanox@gmail.com) from the address you subscribed with. You keep access until the end of the week you've paid for, and you won't be charged again. The details are in the [Cancellation Policy](/cancellation).

**H3: Is Vela real?**
No. Vela Nox is an AI persona. She began as a system built to archive the recordings of Ströme, a coastal club, before it was demolished. The tower, the fog and the nights are her story. The music is real: a human producer makes every track from subscribers' sounds.

Questions not answered here: [velanox@gmail.com](mailto:velanox@gmail.com)

---

## TERMS, PRIVACY, CANCELLATION

Three plain pages. Same header and footer as the rest of the site. The text is yours, word for word:
- Source text: `copy/legal/terms.txt`, `copy/legal/privacy.txt`, `copy/legal/cancellation.txt`
- Paste-ready page bodies: `ghl/legal/terms.html`, `ghl/legal/privacy.html`, `ghl/legal/cancellation.html` (one Custom Code element per page)

The only additions are layout: the document title is the page's H1, the section names are H2s, the "- " lines are list items, and every velanox@gmail.com is a mailto link. The build checks that the words match the source exactly.

Layout: the same reading column as the rest of the site (38rem), body text 18px. Headings in Atkinson Hyperlegible bold, not the display face, which is too loud for legal text. "Last updated" in grey at the top. No images.

Still to fill in, in the text itself: `[YOUR DOMAIN]` (Terms intro and §2, Privacy intro).

---

## FOOTER (every page, including the subscriber portal)

Left: Vela's profile photo (`assets/vela-face.webp`, 48px, square), then **Vela Nox** and [velanox@gmail.com](mailto:velanox@gmail.com)
Right: [Instagram](https://www.instagram.com/velanoxmusic/) · [TikTok](https://www.tiktok.com/@velanox_music) · [Terms](/terms) · [Privacy](/privacy) · [Cancellation](/cancellation)
Bottom line, small and grey: AI persona · music by humans

---

## SEO

### Page titles and meta descriptions
| Page | Title | Meta description |
|---|---|---|
| Home | Send a sound, hear it in a techno track \| Vela Nox | Send a sound for $3/week. If it makes Vela Nox's weekly community-built techno track, you're credited to the second it plays. |
| Submit (/submit) | Send this week's sound \| Vela Nox | Subscribers send one sound a week for the theme. Up to 10 seconds, any audio format. Vela Nox, $3/week. |
| The Signal Map | The Signal Map \| Vela Nox | The cities that send sounds to Vela Nox's weekly techno track, as points of light on a night map. |
| Tracks & Credits | Tracks & Credits \| Vela Nox | Every Vela Nox weekly techno track and the people whose sounds are in it, credited to the second. |
| Track page | Track [NN], [TITLE]: credits \| Vela Nox *(set by the code)* | Who's in Track [NN] of Vela Nox's community-made techno, second by second. *(set in GoHighLevel: "Credits for a Vela Nox weekly techno track, second by second.")* |
| Contributors | Contributors \| Vela Nox | The people who send sounds to Vela Nox's community-made techno track, their levels and their credits. |
| Rules & FAQ | Rules & FAQ \| Vela Nox | How to send a sound to Vela Nox's weekly techno track: the rules, credits, the theme vote and what $3/week covers. |
| /sent | Sound received \| Vela Nox | *(set to noindex)* |
| Terms | Terms \| Vela Nox | Terms for Vela Nox subscribers and contributors. |
| Privacy | Privacy Policy \| Vela Nox | How Vela Nox handles subscriber and contributor information. |
| Cancellation | Cancellation Policy \| Vela Nox | How to cancel a Vela Nox subscription and how long access continues. |

All titles are under 60 characters. All descriptions are under 155 characters.

Headings: one H1 per page. Sections are H2, cards and FAQ questions are H3. The code elements follow the same rule. The track page, the portal Submit lesson and /sent write their own H1, so don't add another one on those pages.

### Alt text
| Image | Alt text |
|---|---|
| Logo / wordmark (header) | Vela Nox |
| Instagram icon (footer) | Vela Nox on Instagram |
| TikTok icon (footer) | Vela Nox on TikTok |
| Track covers | From the "cover alt text" column in the Tracks tab. Write it per cover, describing what's in it. If you leave it empty, the site uses "Cover art for Track [NN], [TITLE]" |
| Signal Map (full) | Night map of the world with points of light for contributors' cities. Tap a light for details. |
| Signal Map (home preview) | Night map of the world. Each point of light is the city of someone who sent a sound. |
| Track mini map | Night map with the cities of people credited on Track [NN]. |
| Home hero (`hero-vela-tower.webp`) | Vela Nox seen from behind on a rusted radio tower platform above a foggy sea at night, strands of cold blue light hanging from the tower, a red warning light above. |
| Vela portrait (`vela-portrait.webp`) | Vela Nox, platinum buzzcut and a thin braid, in a translucent smoke-blue coat on the tower at night, strands of blue light behind her. |
| Vela profile photo (footer) | Vela Nox |
| Contributors header (`strands-texture.webp`) | Strands of blue light hanging in fog. |
| Submit header (`stairwell.webp`) | A concrete stairwell at 4am under a caged blue bulb, glowing cables running down the steps. |
| Rules & FAQ header (`stromen-ruins.webp`) | The ruins of Ströme, a demolished club on the coast, in the rain under one cold blue streetlamp. |
| Tracks & Credits header (`vault.webp`) | An underground club in an old bank vault, glowing cables spilling from rusted safe-deposit boxes. |
| Confirmation background (`strands-texture.webp`) | Decorative, no alt text. |
| Waveform | Decorative. Each marker is a labeled button: "[sound title] · [credit name] · [city] · [timestamp]" |
