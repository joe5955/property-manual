# Fieldy → Manus → Property Manual: field-work workflow

**Status (October 2, 2026):** The Fieldy mobile app can capture and export conversations. The Manus Fieldy MCP connector currently fails before Fieldy login with `invalid_scope — cannot request scope admin`; no automatic synchronization is active. Until an authorized connection is working, send an individual exported note or copied transcript to Manus for review, then record the approved facts in **Property Tasks**. Do not use public share links for sensitive property conversations unless you deliberately accept that anyone with the link can read them.

## One-time setup on your phone

1. Pair the device **inside the Fieldy app**, not the phone's Bluetooth settings. Enable Bluetooth, microphone, and background-app permissions. Fieldy's [device guide](https://www.fieldy.ai/guides/fieldy-3) describes pairing and offline sync.
2. In Fieldy, create a custom summary template called **Property Field Log**. Per [Fieldy's template guide](https://intercom.help/fieldy/en/articles/11330884-templates), open a conversation, choose **Summarize → Custom Summary → Create a new Template**, enter the name and instructions below, then save. Menu wording may vary by app version.
3. Record a short test note, end it, wait until the transcript appears, choose the template, and compare its summary with what you actually said before using it as a source.

### Custom-template instructions (copy into Fieldy)

> Summarize this San Juan Estate property work note. For each distinct job, give: (1) location/building, (2) task title, (3) what was observed or done, (4) status: to do / in progress / complete **only when explicitly stated**, (5) actual work date and start/end times or **explicitly stated** elapsed labor hours/minutes, (6) people or vendor, if stated, (7) materials or equipment, if stated, (8) suggestions and follow-up, marked as suggestions rather than commitments, and (9) uncertainties or missing fields. Separate jobs into numbered entries. Quote the key statement for any completion or duration. Never use recording duration as labor time; never infer completion, location, or hours. If something is not stated, write "Not stated." Keep the summary concise and preserve the original transcript separately.

## A repeatable daily routine

1. Before a job or property walk, open the app and start a **new** transcription. State the date and location aloud. Ask other people for permission before recording their conversations where appropriate.
2. Speak in a consistent pattern: “Property log. Location: Pump House. Task: replace the filter. Started 9:15; finished 10:00. **Actual work time: 45 minutes. Status: complete.** Follow-up suggestion: check pressure next week.” If work continues another day, make a second note with the additional labor time.
3. End the transcription in the app. Review the generated transcript for names, buildings, times, and false completions. Generate a **Property Field Log** summary.
4. Handoff: use **Copy Transcript** or **Export as File** from the conversation menu and send only the relevant conversation to Manus with: “Extract property tasks from this Fieldy note. Show me any uncertainties, then update the property manual with confirmed location, work time, and completion.” Fieldy supports export in the app; the [desktop guide](https://www.fieldy.ai/guides/desktop-app) lists Text, PDF, JSON, and Markdown exports on desktop. A Fieldy public share link exposes that conversation to *anyone who has the link* until you make it private; prefer private file or transcript handoff.
5. Record the reviewed task in **Property Tasks**. Add a short Fieldy note reference (date/title), not the entire transcript. Enter **actual work time** for that task using the log form, and explicitly mark complete when verified. Do not count travel, idle time, or Fieldy's recording duration unless you deliberately define them as billable work.
6. Once a completed task describes a durable property improvement, deliberately curate a separate entry in **Work History** with the completion date and provenance. Work History is the permanent historical archive, not the live task queue.

## Data rules

- Property Tasks is the private, owner-only ledger for open work, time entries, completion, and suggestions. A task may have several dated time entries; totals are the sum of those entries.
- The task's status changes to **complete** only on the owner's explicit action. Reopening clears the completion timestamp but retains logged labor time.
- Use one task per distinct outcome. Group multiple sessions under one task, but split separate repairs into separate tasks.
- Review every AI-extracted duration and location; **never** equate a conversation's length with labor time.
- Do not paste broad, sensitive conversation transcripts into the site. Keep full transcripts in Fieldy or share a single relevant private export with Manus when needed.
- Back up live task/time rows separately from source code: GitHub tracks the application and this guide, **not** the database entries.

## Future direct connection

The existing Fieldy MCP connector points at Fieldy's [official MCP endpoint](https://api.fieldy.ai/mcp), but the OAuth authorization attempt failed with an unsupported `admin` scope. This is a connector/provider compatibility issue, not a phone-pairing issue; do not keep retrying or bypass authorization. Fieldy also offers an [official Public API](https://www.fieldy.ai/blog/introducing-fieldy-developer-platform-public-api-mcp) using a key created in mobile app **Settings → Developer Settings**. If the owner elects to connect it, use Manus's secure connector authorization flow—never paste the key in chat, commit it to GitHub, or put it in the website frontend. A future sync should read narrowly scoped notes, deduplicate by Fieldy conversation/task ID, stage proposed property tasks for owner review, and never auto-mark work complete or derive labor time from recording duration.
