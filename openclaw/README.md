# OpenClaw Agent Configuration

This directory contains everything needed to run Joe's OpenClaw agent as part of the Manus + OpenClaw team. All files are in Markdown so they are readable, portable, and version-controlled.

## Files

| File | Purpose | Where It Goes |
|---|---|---|
| MEMORY.md | Agent profile — tells OpenClaw who Joe is, how he works, and what the rules are | Copy to `~/.openclaw/workspace/MEMORY.md` on the ThinkPad |
| FIRST_MISSION.md | The first prompt to send via Telegram — a bounded research task modeled after Robby Houston's "Ron" experiment | Read it here, copy the prompt into Telegram |
| TEAM_WORKFLOW.md | How Manus and OpenClaw work together as a team with Joe in charge | Reference document — read and understand the workflow |
| SAFETY_RULES.md | Hard rules to prevent runaway agents, scope creep, and accidental spending | Reference document — both agents follow these rules |
| README.md | This file | You are here |

## Quick Start

**Step 1:** Copy MEMORY.md to your OpenClaw workspace on the ThinkPad:

```bash
cp ~/property-manual/openclaw/MEMORY.md ~/.openclaw/workspace/MEMORY.md
```

If you cloned the repo fresh, pull first:

```bash
cd ~/property-manual
git pull
cp openclaw/MEMORY.md ~/.openclaw/workspace/MEMORY.md
```

**Step 2:** Restart your OpenClaw gateway so it picks up the new memory:

```bash
openclaw gateway --force
```

**Step 3:** Open Telegram and send the mission prompt from FIRST_MISSION.md to your agent.

**Step 4:** Wait for results. Review them. Decide what to do next. Bring promising ideas to Manus for deep analysis if needed.

## Updating These Files

As the project evolves, these files will be updated. Always pull the latest from GitHub before copying to your OpenClaw workspace:

```bash
cd ~/property-manual
git pull
```

All changes are tracked in Git history so nothing is ever lost.
