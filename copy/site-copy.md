# Vela Nox: site copy

All times are Eastern Time (ET). Anything in `[BRACKETS]` is filled in automatically by a custom code element (see `ghl/elements/`) or by you where marked.
Every subscribe button, sitewide, reads exactly: **Send me a sound — $3/week**
The submission button reads exactly: **Send it**

**Navigation (every page):** Home · Submit · The Signal Map · Tracks & Credits · Contributors · Rules & FAQ · [button] Send me a sound — $3/week

---

## HOME

**H1 (hero headline)**
Your sound could be in this week's techno track.

**Hero subhead**
$3 a week. Send one sound for the week's theme. Vote on next week's. If your sound is used, you're credited to the exact second. The finished track reaches your inbox before it's on streaming platforms.

[Button] Send me a sound — $3/week

### This week strip
*Custom code element: `home-this-week-strip`. Updates itself from the Settings tab and the clock.*

> This week: **[THEME OF THE WEEK]**
> [SUBMISSION STATUS]
> Next week's theme is being voted on now, in Vela's Close Friends story.

Submission status shown, by date:
- Launch week, until October 8: "Submissions open until Thursday, October 8, 11:59 pm ET"
- October 9–11: "Submissions closed — the track is being made"
- From October 12, Tuesday–Thursday: "Submissions open until Thursday, 11:59 pm ET"
- Friday–Sunday: "Submissions closed — the track is being made"
- Monday: "Submissions closed. They open Tuesday, [DATE], 12:00 am ET"

During launch week, the vote line adds: "The vote closes Sunday, October 11, 11:59 pm ET."
The vote form link is never shown on the site.

### H2: How a week works
1. **Monday.** The theme is announced, in Vela's Close Friends story and on this site. Last week's vote picked it.
2. **Tuesday to Thursday.** Record one sound for the theme and send it. The form closes Thursday at 11:59 pm ET.
3. **Monday to Sunday.** The vote for next week's theme runs all week in Vela's Close Friends story. It closes Sunday at 11:59 pm ET. You're voting for next week, not this one.
4. **Friday to Sunday.** The track is made from the sounds that came in.
5. **The next Monday.** The finished track lands in your inbox, with the credits and timestamps. It reaches streaming platforms one to three weeks later.

*Custom code element: `home-launch-note` (shows only until October 11, then disappears):*
> Launch week runs long. Submissions for Track 01 are open until Thursday, October 8, 11:59 pm ET. The first vote, for week 2's theme, runs until Sunday, October 11, 11:59 pm ET. Track 01 reaches subscribers on Monday, October 12. The regular week starts after that.

### H2: What $3 a week gets you
Four things. That's the whole list.

**H3: One sound a week**
Record something for the week's theme and send it through the Submit page. One sound, up to 10 seconds, up to 3 MB, any audio format.

**H3: A vote on next week's theme**
The vote runs Monday to Sunday through a Google Form in Vela's Close Friends story on Instagram, pinned in a Close Friends highlight. You give your Instagram handle when you subscribe and get added to Close Friends. You'll need an Instagram account for this.

**H3: Credit, to the second**
If your sound is used, you're credited.
- **Instagram:** your credit name, your city and the exact second it plays. "Your kettle, Lyon, at 2:14."
- **Subscriber email:** credit name, city and timestamp.
- **Streaming platforms:** your credit name only, in the release credits or notes where the platform allows it. The artist field says Vela Nox.
- **This website:** credit name, city and timestamp on the track's credits page and on the Signal Map.

Your city only appears if you choose to show it.

**H3: The track, first**
Every Monday, the finished track arrives by email. Download it in WAV, FLAC or MP3, with the full credits and timestamps. It gets to you before it's on streaming platforms.

### H2: The Signal Map
Every light is someone who sent a sound and chose to show their city. The more credits, the brighter the light. The fixed point on the coast is the tower.

*Custom code element: `home-map-preview`* → link: "Open the Signal Map"
Empty state: "The map is dark. The first signals arrive with the first track."

### H2: Latest transmission
*Custom code element: `home-latest-track`.* Shows cover, "Track [NN] · [TITLE]", theme, date sent, "[N] contributors · [N] cities", and the link "See who's in it, second by second".
Empty state (before the first track): "Track 01 lands in subscribers' inboxes on Monday, October 12."

### H2: The rules, briefly
- Send only your own recording. No one else's music, and no one's voice without their permission.
- Not every sound makes the track. Every sound is heard.
- You're credited if your sound is used. There's no payment and no share of streaming income.
- Your city shows only if you tick the box. Cancel anytime. You keep access until the end of the week you've paid for.

Link: "Read the rules and FAQ"

### H2 (final CTA): Stay for the last record.
[Button] Send me a sound — $3/week

---

## SUBMIT

### Public page: /submit (for people who aren't logged in as subscribers)

**H1:** Send this week's sound

The Submit form is for subscribers. For $3 a week, you send one sound for that week's theme. If it's used, you're credited to the second.

[Button] Send me a sound — $3/week

Already subscribed? [Log in to send your sound] *(link to the subscriber portal)*
Can't get in? Write to [velanox@gmail.com](mailto:velanox@gmail.com).

### Subscriber page: "Submit" lesson in the subscriber portal
*Custom code element: `portal-submit-panel`. It renders everything above the form, and loads the form only while submissions are open.*

**H1 (large):** This week's theme: [THEME OF THE WEEK]
**Deadline:** "Closes Thursday, October 8, 11:59 pm ET" during launch week. From October 12: "Closes Thursday, 11:59 pm ET"

**Reminder (directly under the theme):** Your sound only. No one else's voice, no music playing.

**Small line:** Want a say in next week's theme? The vote is open all week in Vela's Close Friends story.
(During launch week: "Want a say in next week's theme? The vote is open until Sunday, October 11, 11:59 pm ET, in Vela's Close Friends story.")

#### Form (GoHighLevel form)
| Field | Label | Help text | Required |
|---|---|---|---|
| Email | Email | The one you subscribed with. | Yes |
| Credit name | Credit name | How you want to be credited. This is the name people will see. | Yes |
| City | City | Just the city. | Yes |
| Country | Country | | Yes |
| Instagram handle | Instagram handle | @yourhandle | Yes |
| Sound title | Sound title | For example: my kettle | Yes |
| Description | One line about the sound | What it is, in one line. | Yes |
| Audio file | Your sound | Any audio format. 10 seconds max. 3 MB max. | Yes |

**Checkboxes**
- [Required] This recording is mine. It has no one else's music in it, and no one's voice without their permission. You can use it and release it. [Read the terms](/terms)
- [Required] I understand not every sound makes the track. Every sound is heard.
- [Required] I understand I'll be credited if my sound is used, but I won't receive payment or a share of streaming income.
- [Optional] Show my city with my credit (Instagram, subscriber email, and the Signal Map on this website). City only, never my address.
  Small print under it: Leave this unticked and you're credited by name only, everywhere, and you won't appear on the Signal Map.

**Line directly above the button**
If your sound makes the track, you'll be credited when it's released: name, city and the exact second it plays on Instagram and in the subscriber email, and your name on streaming platforms.

**Button:** Send it

#### Confirmation screen (/sent, custom code element `submit-sent-confirmation`)
Got it. Your sound is in the pool for [THEME OF THE WEEK]. The track lands in your inbox on Monday.
(During launch week: "Got it. Your sound is in the pool for [THEME OF THE WEEK]. The track lands in your inbox on Monday, October 12.")

#### Second attempt in the same week ("Already sent" lesson, element `portal-already-sent`)
**H1:** You've already sent this week's sound
This week's theme: [THEME OF THE WEEK]. The track lands in your inbox on Monday.
Want a say in next week's theme? The vote is open all week in Vela's Close Friends story.

#### Outside the submission window
**Label:** Submissions closed
**H1:** This week's theme: [THEME OF THE WEEK]
Friday to Sunday: "The track is being made from this week's sounds. The form opens again [Tuesday, DATE], 12:00 am ET."
Monday: "The form opens again [Tuesday, DATE], 12:00 am ET."
Then: "Next week's theme is being voted on now, in Vela's Close Friends story."
If you force the status closed in Settings: "The form is closed for now. It opens again with the next theme."

---

## THE SIGNAL MAP

**H1:** The Signal Map

Each point of light is someone who sent a sound and chose to show their city. City only, placed at the city center. Nothing more precise than that.
The fixed point on the coast is Vela's tower. When a track goes out, a thin line runs from every credited city to it. Those are the transmissions.

*Custom code element: `signal-map`* (counters, filter, map, legend)

**Counters (from the sheet only)**
- Sounds received this week
- Cities this week
- Tracks released
- Contributors credited

Before any data: counters show 0. If the data can't load, they show "—".

**Filter, labeled "Show":** All signals · This week's pool · The cities in Track [NN] · [TITLE] (one per released track)

**Tap a light:** [CREDIT NAME] · [CITY] · [LEVEL] · [N] credits · "Open profile"

**Legend (H2 not needed; sits under the map)**
- Static: sent a sound, not credited yet (faint)
- Signal: 1+ credits (brighter)
- Frequency: 5+ credits (brighter still)
- Broadcast: 10+ credits (brightest)

**Empty states**
- Map, before any data: "The map is dark. The first signals arrive with the first track."
- "This week's pool", nobody opted in yet: "No one in this week's pool has chosen to show their city yet."
- A track where nobody opted in: "No one credited on this track chose to show their city."
- Data can't load: "The signal isn't coming through right now. Try again in a minute."

### H2: Broadcast wall
*Custom code element: `signal-map-broadcast-wall`. The whole section stays hidden until someone reaches Broadcast.*
Ten credits or more. The brightest lights on the map.
Card per person: credit name (H3), city, number of credits, "Open profile".

---

## TRACKS & CREDITS

### Index: /tracks
**H1:** Tracks & Credits
Every track so far, newest first. Each one is built from sounds people sent that week. A track shows up here once subscribers have it in their inbox.

*Custom code element: `tracks-index`.* Card per track (H3): cover, "Track [NN] · [TITLE]", "Theme: [THEME]", "Sent to subscribers [DATE]", "[N] contributors · [N] cities".
Empty state: "No tracks yet. Track 01 is being built from the rooms you're in right now."

### Track page: /track?n=[NUMBER]
*Custom code element: `track-page`. It writes the H1 and the page title.*

- Label: Track [NN]
- **H1:** [TITLE]
- Theme: [THEME] · Sent to subscribers [DATE] · [N] contributors · [N] cities
- Streaming links: only the ones you add to the sheet. If there are none: "Not on streaming platforms yet. That usually takes one to three weeks after the subscriber email."

**H2: Waveform credits**
Each mark is a sound someone sent. Hover or tap it to see whose.
Marker label: [SOUND TITLE] · [CREDIT NAME] · [CITY, if opted in] · [TIMESTAMP]
No waveform in the sheet: "No waveform for this track. The credits below have every timestamp."

**H2: Credits**
In timestamp order: [TIMESTAMP] [SOUND TITLE] · [CREDIT NAME] · [CITY, if opted in]
Nobody public: "No public credits on this track."

**H2: Streaming credits**
Names only. This is the list used on streaming platforms, where they allow it. The artist field says Vela Nox.
[One credit name per line, in timestamp order]

**H2: Where this track came from**
Mini map with the credited cities and their transmission lines.
Nobody opted in: "No one credited on this track chose to show their city."

**Track not found or not sent yet:** H1 "No track here". "This track hasn't gone out yet, or the link is wrong. All tracks"

---

## CONTRIBUTOR PROFILES

**H1:** Contributors
Everyone here sent a sound and chose to show their city. People who didn't are credited by name only and aren't listed here.

*Custom code element: `contributors`.* Card per person (H3 = credit name):
- City
- Level: Static, Signal, Frequency or Broadcast
- Sounds sent: [N]
- Credits: [N]
- Tracks: "Track [NN] · [TITLE] at [TIMESTAMP]", one per line. None yet: "Not credited on a track yet."

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
- Send only a recording you made. It can't have anyone else's music in it, or anyone's voice without their permission. By sending it, you let Vela Nox use it and release it. The full terms are at [/terms](/terms).
- One sound a week, for that week's theme. Up to 10 seconds, up to 3 MB, any audio format.
- Not every sound makes the track. Every sound is heard.

### H2: Credit, not payment
- If your sound is used, you're credited. You don't receive payment or a share of streaming income.
- On Instagram: your credit name, your city (if you chose to show it) and the exact second your sound plays.
- In the subscriber email: credit name, city (if you chose to show it) and timestamp.
- On this website: credit name, city (if you chose to show it) and timestamp, on the track's credits page and the Signal Map.
- On streaming platforms: your credit name only, in the release credits or notes where the platform allows it. Cities and timestamps don't appear there. The artist field lists Vela Nox only.

### H2: Your city and your name
- Your city appears only if you tick "Show my city with my credit". City only, never your address.
- If you don't tick it, you're credited by your credit name only, everywhere, and you don't appear on the Signal Map.
- You can ask to be removed from the map and the public credits at any time by emailing [velanox@gmail.com](mailto:velanox@gmail.com). Sounds already released in a track stay in that track.

### H2: The track and streaming
- Subscribers get the finished track by email every Monday, before it's on streaming platforms.
- Tracks reach streaming platforms one to three weeks after that email. No specific release date is promised.
- The early-access files are for personal listening. Please don't share or upload them before the public release.

### H2: Vela
- Vela Nox is an AI persona. The music is made by a human producer from subscribers' sounds.

### H2: Cancelling
- Cancel anytime. You keep access until the end of the week you've paid for. See the [Cancellation Policy](/cancellation).

### H2: FAQ

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
On Instagram, with your credit name, city and the exact second your sound plays. In the subscriber email, with credit name, city and timestamp. On this website, on the track's credits page and the Signal Map. On streaming platforms, by credit name only, where the platform allows it. Your city only appears if you chose to show it.

**H3: How do I get the track early?**
Subscribe. Every Monday, subscribers get an email with the finished track to download in WAV, FLAC and MP3, plus the full credits and timestamps. That's before it's on streaming platforms. The files are for personal listening, so please don't share or upload them before the public release.

**H3: When is it on streaming platforms?**
One to three weeks after subscribers get it by email. It depends on the distributor. No specific date is promised.

**H3: How does the theme vote work?**
*Custom code element: `faq-vote-answer`.*
During launch week: "Launch week is longer. The first vote runs from Wednesday, September 30 until Sunday, October 11, 11:59 pm ET, and decides week 2's theme. After that, the vote runs all week, Monday to Sunday, closing Sunday at 11:59 pm ET. Each vote decides next week's theme. The vote is a Google Form linked in Vela's Close Friends story on Instagram and pinned in a Close Friends highlight. The winning theme is announced on Monday, in the story and on this site."
From October 12: "The vote runs all week, Monday to Sunday, and closes Sunday at 11:59 pm ET. It decides next week's theme, not this week's. It's a Google Form linked in Vela's Close Friends story on Instagram and pinned in a Close Friends highlight. The winning theme is announced on Monday, in the story and on this site."

**H3: Do I need Instagram?**
Yes. The vote happens in Vela's Close Friends story. You give your Instagram handle when you subscribe, and you're added to Close Friends.

**H3: Will my name and city be public?**
Your credit name, yes, if your sound is used. You choose the name. Your city only if you tick the box, and only the city, never your address. If you tick it, you also show up on the Signal Map once you've sent a sound. Streaming platforms only ever get the name.

**H3: How do I get off the map?**
Email [velanox@gmail.com](mailto:velanox@gmail.com). You'll be removed from the map and the public credits. Sounds already released in a track stay in that track.

**H3: How do I cancel?**
Anytime. You keep access until the end of the week you've paid for. The details are in the [Cancellation Policy](/cancellation).

**H3: Is Vela real?**
No. Vela Nox is an AI persona. The music is made by a human producer from subscribers' sounds.

Questions not answered here: [velanox@gmail.com](mailto:velanox@gmail.com)

---

## TERMS, PRIVACY, CANCELLATION

Three plain pages. Same header and footer as the rest of the site. One H1 each, then your pasted text exactly as written, with no edits.

- **/terms** · H1: Terms · Body: `[PASTE TERMS TEXT]`
- **/privacy** · H1: Privacy Policy · Body: `[PASTE PRIVACY POLICY TEXT]`
- **/cancellation** · H1: Cancellation Policy · Body: `[PASTE CANCELLATION POLICY TEXT]`

Layout: one column, max width about 680px, body text 17px, line height 1.6, fog grey (#b3b8be) on deep navy (#0c1524). No images.

---

## FOOTER (every page, including the subscriber portal)

Vela Nox
[velanox@gmail.com](mailto:velanox@gmail.com)
[Instagram](https://www.instagram.com/velanoxmusic/) · [TikTok](https://www.tiktok.com/@velanox_music)
[Terms](/terms) · [Privacy](/privacy) · [Cancellation](/cancellation)
AI persona · music by humans

---

## SEO

### Page titles and meta descriptions
| Page | Title | Meta description |
|---|---|---|
| Home | Send a sound, hear it in a techno track \| Vela Nox | Send a sound for $3/week. If it makes Vela Nox's weekly community-built techno track, you're credited to the second it plays. |
| Submit (/submit) | Send this week's sound \| Vela Nox | Subscribers send one sound a week for the theme. Up to 10 seconds, any audio format. Vela Nox, $3/week. |
| The Signal Map | The Signal Map \| Vela Nox | Every city that has sent a sound to Vela Nox's weekly techno track, as points of light on a night map. |
| Tracks & Credits | Tracks & Credits \| Vela Nox | Every Vela Nox weekly techno track, with each contributor credited by name, city and the second their sound plays. |
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
| Track mini map | Night map with the cities of people credited on Track [NN], each connected to Vela's tower. |
| Vela's tower marker | Vela's tower |
| Waveform | Decorative. Each marker is a labeled button: "[sound title] · [credit name] · [city] · [timestamp]" |
