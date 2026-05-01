# Appliance Manual Link Validation

The Beach House section was opened in the running preview at `/section/beach-house`. The page text now includes manual links for the LG refrigerator, Bosch range search, Bosch dishwasher search, Bosch HMB5050/01 microwave support, Maytag MHW8200FC washer support, and Maytag dryer owner manual. Scrolling to the appliance area showed the refrigerator photos rendering in the appliance block immediately below the restored appliance details and links.

Automated validation was added in `server/applianceManualLinks.test.ts` to confirm restored manual link text exists across the affected Main House, Chalet, Camp Kitchen, Beach House, and Farm House appliance subsections, and to confirm newly restored manual links remain near their corresponding appliance photo markers.

Latest validation status: `pnpm test` passed with 5 test files and 13 tests.

## Farm House visual validation after placement cleanup

Checked `/section/farm-house` in the running preview after the manual-link placement cleanup. The rendered Kitchen Appliances content now shows the LG refrigerator and Premier range appliance photos with the restored manual links in the same appliance content flow: **“Manual: View Owner's Manual (PDF)”** appears with the LG refrigerator photo/label group, and **“Manual: Premier Electric Range Use & Care Manual and Installation Instructions (PDF)”** plus **“Range Use & Care Manual: Open PDF”** appear with the Premier electric range photo/manual/back-panel group. This confirms the links are visible in the rendered page near the associated appliance pictures.
