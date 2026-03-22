# The "Take a Picture, Get Everything" Workflow

**Date:** March 22, 2026
**Author:** Manus AI (based on insights from Joe)
**Topic:** Refined product concept for the AI-powered contractor tool.

## The Insight

The original concept was "QR codes + Estimating." While that identified a market gap, it still required manual data entry from the contractor.

Joe identified the real power of AI in this context: **Data extraction and automation from a single physical action.**

A contractor shouldn't have to manually type model numbers, look up prices, or generate QR codes separately. The entire workflow should be triggered by a single photo taken on the jobsite.

## The Core Workflow: "Photo In, Everything Out"

This is the revised product loop. It relies heavily on multimodal AI (vision + text + search) to do the heavy lifting.

### Step 1: The Trigger (Photo In)
The contractor is on the jobsite. They unbox a new HVAC unit, water heater, or bundle of framing lumber. They take a single photo of the **spec sheet, manufacturer label, or invoice**.

### Step 2: AI Extraction
The AI processes the image and instantly extracts:
*   Manufacturer and Brand
*   Model Number and Serial Number
*   Technical specifications (dimensions, voltage, BTU, etc.)
*   Warranty information

### Step 3: The Outputs (Everything Out)
From that single photo, the system automatically generates four distinct outputs:

1.  **The QR Code Asset:** A unique QR code is generated. When printed and stuck to the unit (or the framing next to it), scanning it pulls up the extracted specs, the original photo, and the installation date. This becomes part of the permanent "Digital Jobsite" as-built record.
2.  **Local Price Comparison:** The AI takes the extracted model number, searches the web, and finds local suppliers (Home Depot, Ferguson, local supply houses) carrying that exact item, pulling the current cheapest price.
3.  **The Estimate Line Item:** The item, along with its verified local cost, is automatically added as a line item to the active project bid/estimate.
4.  **Replacement/Maintenance Schedule:** Based on the extracted specs, the system logs a recommended replacement date and maintenance schedule for the property manual.

## Why This Wins

*   **Zero Friction:** The 50-year-old contractor doesn't have to learn a complex interface. They already know how to take a picture with their phone.
*   **Time Saved:** What previously took 20 minutes of Googling, data entry, and spreadsheet formatting now takes 5 seconds.
*   **Accuracy:** Eliminates transcription errors when copying long model numbers from dirty labels.

## Next Steps for Development

To build this, we need to connect three APIs:
1.  **Vision AI:** (e.g., GPT-4o Vision) to read the messy, real-world spec sheet photos.
2.  **Search API:** To take the extracted model numbers and scrape local supplier pricing.
3.  **QR/Database Backend:** To store the data, generate the code, and host the landing page for when the code is scanned.
