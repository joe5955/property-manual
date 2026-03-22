# Safety Rules and Operating Guardrails

## Why This Document Exists

Joe learned the hard way that an AI agent on a schedule with open-ended instructions can burn through resources fast. A scheduled Manus task ran every 5 minutes, morphed its own scope, and cost $1,000 in credits before it was caught. This document exists to prevent that from happening again — with either Manus or OpenClaw.

## The Core Principle

**Joe initiates. Agents respond. Joe approves. Then the next step happens.**

No agent runs unsupervised. No agent expands its own scope. No agent spends money without explicit permission.

## Rules for OpenClaw (Telegram Agent)

| Rule | What It Means |
|---|---|
| No scheduled tasks | Joe starts every conversation. The agent does not wake up and do things on its own. |
| No financial actions | The agent does not buy, subscribe, invest, or commit money. Ever. Not even free trials. |
| No scope expansion | If Joe asks for 5 ideas, the agent delivers 5 ideas and stops. It does not "also" do related tasks. |
| Report and wait | After completing a task, the agent presents results and waits for Joe's next instruction. |
| Explain before acting | If a task requires using a tool (web search, file creation, exec command), the agent says what it is about to do first. |
| No silent failures | If something goes wrong, the agent tells Joe immediately instead of trying to fix it on its own. |

## Rules for Manus (Browser/Sandbox Agent)

| Rule | What It Means |
|---|---|
| No recurring schedules | Do not set up scheduled tasks that repeat. One-time delayed tasks are acceptable only with Joe's explicit approval. |
| No cascading tasks | A single task does one thing. It does not spawn follow-up tasks or expand into new projects. |
| Confirm before spending | Any action that could cost money (API calls, service sign-ups, cloud hosting) requires Joe's approval first. |
| Push to GitHub | All work products go to the GitHub repo so Joe has a permanent record. Nothing lives only in the sandbox. |
| Ask when uncertain | If the instructions are ambiguous, ask Joe rather than guessing. |

## The OpenClaw Config Safety Settings

For Joe's OpenClaw installation on the ThinkPad, these settings in `~/.openclaw/openclaw.json` help enforce safety:

```json
"tools": {
    "exec": {
        "ask": "auto"
    }
}
```

Setting `ask` to `"auto"` means the agent will request approval before running potentially destructive commands. This is safer than `"off"` (which lets it run anything without asking) while still allowing it to do useful work.

**Do NOT set `ask` to `"off"` unless you fully understand what the agent might execute.** For the "Ron" experiment, `"auto"` is the right setting — the agent can still search the web and create files, but it will check with Joe before running system commands.

## What to Do If Something Goes Wrong

**If OpenClaw starts doing something unexpected:**
1. Send "STOP" in Telegram. The agent should halt.
2. If it does not stop, restart the gateway: `openclaw gateway --force`
3. Check what it did: look in `~/.openclaw/workspace/` for any new files.
4. Report what happened to Manus so we can adjust the instructions.

**If Manus starts expanding scope or burning credits:**
1. Close the task immediately.
2. Do not let it continue running.
3. Start a new task and explain what went wrong.

## The $0 Rule

Until Joe explicitly says otherwise, both agents operate under the "$0 rule": every task must be completable with zero dollars spent. Research, writing, planning, and analysis are all free. The moment something would cost money, the agent stops and asks.
