# Manus + OpenClaw Team Workflow

## The Idea

Joe works with two AI agents. Each has different strengths. Instead of picking one, they work as a team — with Joe always in charge.

## Who Does What

| Role | Agent | Strengths | How Joe Talks to It |
|---|---|---|---|
| **Field Agent** | OpenClaw (via Telegram) | Always on, quick tasks, daily check-ins, reminders, short research, conversational | Telegram on phone or laptop |
| **Workshop Agent** | Manus (via browser) | Deep research, building websites, writing documents, complex analysis, code, file management | Browser on phone or laptop |
| **Boss** | Joe | All decisions, all approvals, all direction | Talks to both agents directly |

## How They Work Together

Think of it like a construction crew. Joe is the general contractor. OpenClaw is the guy on site who can run errands, check things, and report back. Manus is the architect's office — where the blueprints get drawn, the research gets done, and the heavy lifting on documents and code happens.

**Neither agent talks to the other directly.** Joe is always the bridge. This is intentional — it keeps Joe in control and prevents runaway chains of AI talking to AI.

## The Workflow Loop

Here is how a typical task flows through the team:

**Step 1 — Joe has an idea or question.** He sends it to whichever agent fits best. Quick question or daily task goes to OpenClaw via Telegram. Complex research or building something goes to Manus.

**Step 2 — The agent does bounded work.** It researches, writes, builds, or analyzes — but only within the scope Joe defined. It does not expand the scope on its own.

**Step 3 — The agent reports back.** It presents findings, options, or deliverables to Joe. It does not act on them.

**Step 4 — Joe reviews and decides.** He approves, rejects, or redirects. If the next step involves the other agent, Joe carries the information over.

**Step 5 — Repeat.** The loop continues with Joe steering.

## Example: The "Ron" Approach (Finding a Business Opportunity)

Here is how Joe could run the same experiment Robby Houston did, but safely:

**Round 1 — Research (OpenClaw via Telegram):**
Joe sends the first mission prompt (see FIRST_MISSION.md). OpenClaw researches and comes back with ideas. Joe reviews them.

**Round 2 — Deep Analysis (Manus):**
Joe picks the most promising idea and brings it to Manus. Manus does competitive analysis, builds a business plan, creates financial projections, and drafts a landing page.

**Round 3 — Refinement (OpenClaw):**
Joe sends the business plan summary back to OpenClaw and asks it to poke holes in it, suggest improvements, or research specific questions that came up.

**Round 4 — Build (Manus):**
Joe approves the plan. Manus builds the website, writes the copy, sets up the payment flow. Everything gets pushed to GitHub.

**Round 5 — Launch Prep (Both):**
OpenClaw helps Joe draft social media posts and outreach messages. Manus prepares email templates and documentation. Joe decides when and how to launch.

## What This Is NOT

This is not an autonomous money-making machine. This is Joe using two capable tools, staying in the driver's seat, and building something real with AI assistance. The thrill is in watching the agents work and seeing what they come up with — but Joe always holds the keys.
