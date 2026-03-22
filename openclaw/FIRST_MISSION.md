# First Mission Prompt for OpenClaw

## What This Is

This is the first message Joe sends to his OpenClaw agent via Telegram to kick off the "Ron" experiment. It is designed to be bounded, safe, and clear. The agent will research and report back — it will not take any action, spend any money, or sign up for anything.

## Before Sending This

Make sure your OpenClaw agent has the MEMORY.md file loaded. Copy the contents of MEMORY.md into your OpenClaw workspace at:

```
~/.openclaw/workspace/MEMORY.md
```

This gives your agent context about who you are so it does not start from zero.

## The Mission Prompt

Copy and paste this entire block into Telegram as a single message to your OpenClaw agent:

---

**MISSION: Research Income Opportunities**

I want you to act as my research assistant. Your job is to identify realistic income opportunities that fit my background. Here is what you need to know about me:

I am 71 years old. I have decades of experience in general contracting and construction. I currently manage a large multi-building estate property in the Pacific Northwest. I am building a digital property manual (a web application) with the help of another AI called Manus. I am interested in how AI tools can create new opportunities, but I am not a coder.

Your task is to research and come back to me with exactly 5 ideas for generating income that match my experience and situation. For each idea, I need:

1. What the opportunity is (one sentence)
2. Why it fits my background (two sentences)
3. What it would take to start (time, money, tools)
4. What the realistic income range is (monthly, not fantasy numbers)
5. One real example of someone doing this successfully

Rules you must follow:
- Do NOT sign up for anything
- Do NOT spend any money
- Do NOT take any action beyond web research
- Do NOT expand this task beyond what I asked
- When you are done, present your 5 ideas and stop
- Wait for my response before doing anything else

Go.

---

## What Happens Next

The agent will research and come back with 5 ideas. Joe reviews them. If any look promising, Joe can either:

1. Ask OpenClaw to dig deeper into one specific idea (another bounded prompt)
2. Bring the idea to Manus for deep analysis, business planning, and building

## Follow-Up Prompt Template (For After Review)

If Joe likes one of the ideas, here is a follow-up to send:

---

**FOLLOW-UP: Deep Dive on Idea [NUMBER]**

I want you to go deeper on idea [NUMBER] from your research. Specifically:

1. Who are the competitors already doing this?
2. What platforms or tools would I need?
3. What are the first 3 steps to get started?
4. What are the biggest risks or downsides?
5. Is there a way to test this with minimal investment before committing?

Same rules as before — research only, no actions, no spending, no sign-ups. Report back and wait.

---
