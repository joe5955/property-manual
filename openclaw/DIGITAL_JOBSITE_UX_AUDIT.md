# Digital Jobsite — UX Audit Report

**Auditor:** Manus AI (acting as a first-time contractor user)
**Date:** March 22, 2026
**Scope:** Full walkthrough of all 5 pages, every interactive element tested
**Verdict:** The site has strong bones and excellent research content, but a critical promise-delivery gap makes it unusable for real contractor work in its current state.

---

## The One-Sentence Summary

Digital Jobsite's home page promises AI-powered automation, persistent QR databases, and one-photo-does-everything magic — but every tool behind that promise is a manual form with no data persistence, no backend, and no AI.

---

## Overall Scorecard

| Page | Design | Functionality | Real-World Usability | Trust Score |
|------|--------|---------------|---------------------|-------------|
| Home | 9/10 | 7/10 | 6/10 | 4/10 |
| QR X-Ray System | 8/10 | 5/10 | 2/10 | 3/10 |
| Bid Calculator | 8/10 | 6/10 | 3/10 | 5/10 |
| Spec Scanner | 7/10 | 3/10 | 1/10 | 2/10 |
| Research Report | 9/10 | 9/10 | 8/10 | 9/10 |

The "Trust Score" measures whether the page delivers what it promises. The Research Report scores highest because it promises analysis and delivers analysis. The Spec Scanner scores lowest because it promises AI and delivers a form.

---

## Part 1: The Promise-Delivery Gap

This is the single most consequential problem with the site, and it runs through every page.

The home page makes five specific promises to contractors:

1. **"AI Reads It"** — Specs, model numbers, warranty info extracted instantly.
2. **"Costs auto-populate into your 15-phase estimate"** — From one photo.
3. **"Searchable database of every component"** — A persistent record.
4. **"Works offline"** — Scan with any phone camera.
5. **"One Photo Does It All"** — Photo in, QR code and pricing out.

None of these five promises are delivered by the current tools. The Spec Scanner has no AI. The Bid Calculator requires manual entry of every line item. There is no database — data vanishes on page refresh. There is no offline capability. And the "one photo" workflow requires the user to manually type everything the photo supposedly reads.

**Why this matters more than any individual bug:** Contractors are the most skeptical user base in technology. They have been burned by software that overpromises and underdelivers for decades. The research report on this very site documents this — contractors prefer pencil and paper because "it doesn't crash, doesn't need updates, and doesn't lose my data." When a contractor visits Digital Jobsite, reads the home page, gets excited, clicks through to the tools, and discovers the promises are aspirational rather than functional, the trust damage is permanent. They will not come back.

> The irony is sharp: the site's own research report identifies "promise-delivery gaps" as a key reason contractors distrust technology, and then the site itself commits the same error.

---

## Part 2: Page-by-Page Findings

### Home Page — Beautiful But Overselling

The home page is genuinely well-designed. The hero image of construction framing at dusk sets the right tone. "Take a Picture. Get Everything." is a strong, memorable headline. The "FOR GENERAL CONTRACTORS" badge immediately tells the visitor they are in the right place. The four-step workflow (Snap → AI Reads → QR Code → Build Bid) is clear and compelling. The Module 1 and Module 2 sections explain the value proposition effectively, and the research banner ("Why Contractors Go Broke Winning Bids") is a strong credibility play.

The problem is not what the home page does — it is what the home page says. Every claim about AI, automation, and databases sets expectations that the tools cannot meet. The fix is not to make the home page worse; it is to either upgrade the tools to match the promises, or rewrite the copy to match the tools.

There is also no footer with contact information, privacy policy, or terms of service. For a tool that handles construction bid data, this is a trust signal that is missing.

### QR X-Ray System — The Core Product Is Broken

The QR X-Ray form is clean and functional at the surface level. A contractor can enter a location, select a construction phase, type an equipment name and model number, upload a photo, add notes, and click "Generate QR Code." A QR code appears instantly with Save and Print buttons.

The problems are structural:

**No data persistence.** QR codes are stored in React state. Refresh the page and every code is gone. A contractor who spends an afternoon generating 50 QR codes for a jobsite loses all of them the moment they close the browser tab. This is not a minor inconvenience — it makes the tool completely unusable for its stated purpose.

**The QR codes have no destination.** When scanned, the QR code encodes raw text data (location, equipment name, model number). It does not link to a hosted page. The home page promises "anyone can scan that wall and see exactly what's inside" — but scanning the QR code on a phone shows a block of plain text, not a page with photos, specs, and location data.

**Photos go nowhere.** The photo upload accepts a file, but the image is only held in browser memory. It is not uploaded to any server. The QR code does not link to the photo. The core promise — "snap a photo of the wires, pipes, and rough-ins behind it" — is not fulfilled because the photo is not stored or accessible.

**The "Construction Phase" label is truncated** to "Construc" on the form, which is a minor cosmetic issue but signals lack of polish.

### Bid Calculator — The Most Functional Tool, Still Unusable

The new 194-line-item version (on the dev server, not yet published) is a significant improvement over the original 4-field version. Each of the 15 construction phases now expands into trade-specific line items with description, category, quantity, unit, unit cost, and auto-calculated totals. The Expand All / Collapse All buttons work. Custom line items can be added per phase. The Markup & Totals section correctly calculates contingency, overhead, and profit.

However, several critical issues prevent real-world use:

**Negative values are accepted.** Entering -$500 for a building permit produces a grand total of -$625. The calculator happily generates a bid where the contractor pays the client. There is no input validation preventing negative numbers, which means a single typo (hitting the minus key) could produce a nonsensical bid.

**The Export/Print button is broken.** Clicking it caused a 195-second browser timeout. The PDF export — the primary output of the entire tool — does not work.

**No data persistence.** Same as the QR system. All 194 line items reset on page refresh. A contractor who spends two hours carefully filling in a bid loses everything if they accidentally close the tab, if their browser crashes, or if their phone loses connection. This is a dealbreaker.

**No markup vs. margin display.** The research report on this very site identifies the markup-vs-margin confusion as costing contractors $50,000 to $130,000 per year. The calculator shows markup percentages but does not show the equivalent margin. This was recommendation #2 in the research report's own list of 13 features to build.

**No waste factors.** The research report identifies waste factors as a critical missing element (30% of materials become waste), but there is no waste factor column in the calculator. This was recommendation #8.

**The published version is outdated.** The published site at digijobsite-3sqienlm.manus.space still shows the old 4-field-per-phase version. The new 194-item version exists only on the dev server.

### Spec Scanner — A UI Mockup of a Feature That Does Not Exist

The Spec Scanner presents a clean 6-step wizard interface: Take the Photo → Where Is It? → What Is It? → The Details → Cost & Notes → Your QR Code. The progress bar is well-designed. The instructions on what to photograph are helpful.

But there is no AI behind it. The "scanner" does not scan anything. It collects a photo and manual inputs through a multi-step form, but it does not perform OCR, does not extract model numbers, does not look up pricing, and does not auto-generate QR codes from the scan. It is a user interface for a feature that has not been built.

This is the page that the home page's "One Photo Does It All" promise points to. When a contractor arrives here expecting the AI magic described on the home page and finds a manual form, the credibility damage is the most severe of any page on the site.

### Research Report — The Standout Page

The Research Report is the strongest page on the site by a wide margin. The content is excellent — 18 sources, well-written analysis, compelling statistics, real contractor quotes, and actionable recommendations. The hero image is dramatic. The table of contents with anchor links works. The animated stat counters are engaging. The data tables (waste factors, overhead by company size, markup vs. margin math) are well-formatted and informative. The recommendation cards are clear and prioritized.

Two minor issues: the animated stat counters show slightly different numbers than the text (23% vs. 25% for bankruptcy rate, $119K vs. $130K for markup/margin loss). These are close enough to suggest rounding or animation targeting errors rather than factual errors, but they undermine the precision the report otherwise conveys. The page is also very long (12,700+ pixels) with no "back to top" button.

The research report succeeds because it promises analysis and delivers analysis. It does not overpromise. It is honest about the problems it describes and specific about the solutions it recommends. This is the model the rest of the site should follow.

---

## Part 3: The Consequences

### For the Product

The site currently exists in an uncomfortable middle ground. It is too polished to be a prototype but too incomplete to be a product. The home page sells a vision. The tools deliver forms. The research report builds credibility that the tools then erode.

If a contractor finds this site through the research report (which is genuinely shareable and valuable), they will be impressed. If they then click "Try the Bid Calculator" expecting the tool to match the quality of the analysis, they will be disappointed. The research report is the site's best marketing asset and simultaneously its biggest liability, because it raises expectations the tools cannot meet.

### For the User

A contractor who tries to use Digital Jobsite for actual work today will hit these walls:

1. They generate QR codes for a jobsite. They close their browser. The codes are gone.
2. They spend two hours filling in a 194-line-item bid. Their phone dies. The bid is gone.
3. They try to export the bid as a PDF to hand to a client. The export button hangs.
4. They try to scan a spec sheet expecting AI extraction. They get a manual form.

Each of these failures costs the contractor time they cannot bill for, on a tool that promised to save them time.

### For Trust

The construction industry has a specific relationship with technology: deep skepticism earned through decades of software that overpromises and underdelivers. The research report on this site documents this dynamic in detail. The site then replicates it.

---

## Part 4: What to Fix, in Order

The following table prioritizes fixes by their impact on closing the promise-delivery gap, ordered from most critical to least.

| Priority | Fix | Effort | Impact | Why |
|----------|-----|--------|--------|-----|
| **1** | Add localStorage persistence to QR codes and Bid Calculator | Low | Critical | Without this, both tools are unusable. A contractor will never trust a tool that loses their work. |
| **2** | Fix the PDF export button | Low | Critical | The bid calculator's entire purpose is to produce a PDF bid. If the output is broken, the input is pointless. |
| **3** | Add input validation (no negatives, required fields) | Low | High | Prevents nonsensical bids and incomplete QR entries. |
| **4** | Rewrite home page copy to match current capabilities | Low | High | Remove AI claims, database claims, and offline claims. Replace with honest descriptions of what the tools actually do today. Add "Coming Soon" badges to planned features. |
| **5** | Show margin alongside markup in the Bid Calculator | Low | High | Directly implements the #1 recommendation from the site's own research. |
| **6** | Add waste factor column to Bid Calculator | Medium | High | Implements recommendation #8. Prevents the material underestimation the research identifies. |
| **7** | Publish the latest version | Trivial | High | The published site is running an older version without the 194-item Bid Calculator. |
| **8** | Fix stat counter animation targets on Research page | Trivial | Medium | 23% should be 25%, $119K should be $130K. Small but undermines credibility. |
| **9** | Add a backend (database, file storage, user accounts) | High | Transformative | This is the real unlock. With a backend, QR codes persist, photos are stored, bids are saved, and the Spec Scanner can eventually do real AI processing. |
| **10** | Build the AI Spec Scanner | High | Transformative | This is the vision. OCR + model number extraction + pricing lookup + auto-QR generation. But it requires a backend first. |

---

## Part 5: What the Site Gets Right

This audit is deliberately critical because the user asked for consequences, not compliments. But the site gets several important things right:

**The research is exceptional.** The 18-source analysis of construction estimating failure is genuinely valuable content that could stand alone as an industry resource. It demonstrates deep domain understanding.

**The design is professional.** The dark navy/amber "Blueprint Industrial" aesthetic is appropriate for the audience. The typography, spacing, and visual hierarchy are well-executed. This does not look like a template — it looks like a product.

**The 194-item Bid Calculator structure is correct.** The 15 phases, the trade-specific line items, the category breakdowns — this is how real residential construction estimates are organized. The structure demonstrates that someone understands the domain.

**The QR X-Ray concept is genuinely innovative.** The idea of QR-coding every stud bay before drywall goes up is a real problem worth solving. The concept is sound. The execution needs a backend.

**The Spec Scanner wizard flow is well-designed.** The 6-step progression (photo → location → identification → details → cost → QR code) is the right workflow. It just needs an engine behind it.

The foundation is strong. The gap is between vision and implementation. Closing that gap — starting with localStorage persistence and working up to a full backend — would transform Digital Jobsite from a promising demo into a tool contractors actually use.

---

*Audit conducted March 22, 2026. All findings based on hands-on testing of every interactive element across all 5 pages of the site.*
