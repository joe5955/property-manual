# The Digital Jobsite Estimating Framework

**Date:** March 22, 2026
**Author:** Manus AI
**Topic:** Standardized estimating structure for small General Contractors (GCs)

## Overview

Based on industry research (NAHB, Procore, RSMeans), enterprise construction software relies on the 50-division CSI MasterFormat. However, this is too complex for small-to-midsize residential contractors. 

Small GCs estimate based on **project phases**, not material divisions. Our "Digital Jobsite" bid calculator will use this phase-based approach, which aligns perfectly with how a contractor walks through a jobsite.

## The 15-Phase Bid Structure

Our bid calculator will organize costs into these standard residential phases:

1.  **Site Prep & Permits:** Permits, engineering, surveys, grading, temporary utilities.
2.  **Foundation:** Excavation, concrete, rebar, waterproofing.
3.  **Framing:** Lumber, trusses, sheathing, structural steel, rough labor.
4.  **Roofing:** Shingles, underlayment, flashing, vents.
5.  **Exterior Openings:** Windows, exterior doors, garage doors.
6.  **Rough-In (MEP):** Plumbing, Electrical, HVAC (This is where the QR "X-Ray" system is heavily used).
7.  **Insulation:** Batt, spray foam, vapor barriers.
8.  **Drywall:** Board, tape, mud, texture, sanding.
9.  **Interior Finishes:** Paint, interior doors, baseboards, crown molding.
10. **Cabinets & Countertops:** Kitchen/bath cabinets, stone, installation.
11. **Flooring:** Hardwood, tile, carpet, underlayment.
12. **Appliances & Fixtures:** Lighting, plumbing fixtures, major appliances (Another key QR integration point).
13. **Exterior Finishes:** Siding, stucco, exterior trim, masonry.
14. **Landscaping:** Hardscape, planting, irrigation, driveway.
15. **Cleanup & Final:** Dumpsters, final clean, punch list.

## Cost Components Per Phase

Within each phase, the contractor inputs four variables:
*   **Materials:** Raw cost of goods.
*   **Labor:** Calculated as [Estimated Hours] × [Loaded Labor Rate].
*   **Subcontractors:** Flat bids from specialty trades.
*   **Equipment:** Rental costs (e.g., boom lift for framing).

*Note: The Loaded Labor Rate includes wages, taxes, insurance, workers comp, and benefits.*

## The Markup Engine

The final section of the bid applies the GC's markup to generate the final price to the client. The standard structure is:

1.  **Subtotal:** Sum of all 15 phases.
2.  **Contingency:** Typically 5-10% of the subtotal (for unexpected overruns).
3.  **Overhead:** Typically 8-15% (covers office, software, insurance, non-billable time).
4.  **Profit:** Typically 5-10% net margin.

*Note: Many small GCs combine Overhead and Profit into a single "O&P" line item, often targeting a 20-30% markup on the subtotal to achieve a 15-20% gross margin.*

## Integration with the QR "X-Ray" Module

When a contractor takes a photo of an appliance or material tag:
1.  The AI extracts the cost and specs.
2.  The AI automatically drops that item into the correct phase (e.g., a Rheem water heater goes into Phase 6: Rough-In or Phase 12: Appliances & Fixtures).
3.  The cost is added to the "Materials" column for that phase.
4.  The O&P markup is automatically applied to it in the final total.
