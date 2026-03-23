# Spec Sheet Prompts for OpenClaw

These are copy-paste prompts a contractor can send to their OpenClaw agent (via Telegram) when they have a spec sheet or equipment label to process.

---

## Prompt 1: Quick Equipment Lookup

Send this when you have a model number and want pricing and specs fast.

```
I have a piece of equipment I need you to look up. Here are the details:

Brand: [BRAND NAME]
Model Number: [MODEL NUMBER]
Type: [e.g., Water Heater, HVAC Unit, Electrical Panel]

Use your web search tool to find:
1. The full spec sheet for this exact model
2. The current retail price at Home Depot, Lowes, and any local suppliers
3. The warranty length
4. Any known issues or recalls

Give me the results in a simple list. Do not sign up for anything.
```

---

## Prompt 2: Photo-Based Spec Sheet Reading

Send this along with a photo of the spec sheet or label. Note: Your OpenClaw agent needs image processing capability for this to work. If it cannot read images, use Prompt 1 instead with the details you can read off the label yourself.

```
I just took a photo of an equipment label on my jobsite. I need you to:

1. Read everything on this label — brand, model, serial number, specs, ratings
2. Search for the current price of this exact model
3. Find where I can buy it locally near [YOUR CITY, STATE]
4. Tell me the warranty information

Here is the photo: [ATTACH PHOTO]
```

---

## Prompt 3: Price Comparison Shopping

Send this when you need to find the cheapest source for materials or equipment.

```
I need to buy the following for a job. Use your web search tool to find the best price for each item. Search Home Depot, Lowes, and any online suppliers. Give me the price and where to buy it.

Item 1: [DESCRIPTION AND MODEL IF KNOWN]
Item 2: [DESCRIPTION AND MODEL IF KNOWN]
Item 3: [DESCRIPTION AND MODEL IF KNOWN]

My location is [YOUR CITY, STATE]. I need these within [TIMEFRAME].
Do not sign up for anything or make any purchases.
```

---

## Prompt 4: Material Takeoff from a Description

Send this when you know what you are building and need a materials list with costs.

```
I am building the following and need a complete materials list with estimated costs:

Project: [DESCRIBE WHAT YOU ARE BUILDING]
Size: [DIMENSIONS]
Location: [CITY, STATE for local pricing]

Give me:
1. A complete materials list with quantities
2. Estimated cost for each item based on current prices
3. Total materials cost
4. Where to buy each item locally

Use your web search tool to find current prices. Do not guess — search for real prices. Do not sign up for anything.
```

---

## Prompt 5: Quick Bid from Known Costs

Send this when you already have your costs and just need the bid formatted.

```
I need you to calculate a bid for me. Here are my costs:

Materials: $[AMOUNT]
Labor: [HOURS] hours at $[RATE]/hour
Subcontractors: $[AMOUNT]
Equipment rental: $[AMOUNT]
Permits: $[AMOUNT]

Apply the following markup:
- Contingency: [X]%
- Overhead: [X]%
- Profit: [X]%

Give me the total bid amount and break it down line by line. Format it professionally so I can show it to a client.
```

---

## Tips for Getting Better Results from Your Agent

1. **Always say "Use your web search tool"** — gpt-4o-mini needs to be told explicitly to search.
2. **One task at a time** — Do not send 5 things in one message. Send one, wait for the answer, then send the next.
3. **Include your location** — For pricing, always include your city and state so it finds local suppliers.
4. **Be specific** — "Rheem XE50T06ST45U1" gets better results than "50 gallon water heater."
5. **If it just chats at you** — Restart with: "Stop. Use your web search tool to search for [EXACT THING]. Report what you find."

---

## Limitations to Know

- **gpt-4o-mini cannot read photos** directly in most OpenClaw setups. You will need to read the label yourself and type in the details.
- **Some websites block bots** (Home Depot, Amazon). If the agent gets a 403 error, ask it to try a different source.
- **The agent cannot make purchases** — it can only research and report. You make all buying decisions.
- **Prices it finds may not be exact** — always verify before committing to a bid.
