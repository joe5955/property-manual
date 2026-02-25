# Property Manual Todo List

## Camp Kitchen
- [ ] **Rinnai Water Heater:** Document Serial Number
- [ ] **Rinnai Water Heater:** Document Installation Date / Age

## Farm House
- [ ] **Exterior:** Photo of the Farm House
- [ ] **Electrical:** Photo of the Farm House Panel
- [ ] **Water:** Photo of the Farm House Shutoff Valve

## Main House
- [ ] **Exterior:** Photo of the Main House
- [ ] **Electrical:** Photo of the Main House Panel
- [ ] **Water:** Photo of the Main House Shutoff Valve

## Features
- [ ] **Maintenance Log:** Create a dashboard to view and add maintenance records
- [ ] **Item Integration:** Link maintenance history to individual items (e.g., Rinnai Water Heater)

## Bugs
- [ ] **Navigation Issue:** Only Main House shows under Buildings and Structures - need to display all buildings
- [ ] **Photo Review Page:** Images not displaying - only empty spaces showing

## New Features
- [x] **Workflow Guide Page:** Create a dedicated page for photo upload procedures and best practices
- [x] **Photo Upload Form:** Create form for pasting batch photo descriptions
- [x] **Google Keep Guide:** Add Google Keep integration instructions to workflow page
- [x] **Missing Photos:** Photos 27, 28, 29, 30, 32, 33, 35, 36, 37, 38, 39, 40, 41 not displaying (13 photos) - Fixed by re-uploading with fresh CDN URLs

## Current Task
- [x] **Integrate 56 New Photos:** Add photos from PDF upload to appropriate manual sections (Main House, Farm House, Beach House, Chalet, Camp Kitchen, Madrona House, Boat House, Picnic Shelter, Well Systems, Irrigation, Utility Buildings, Water Storage)

## Bugs to Fix
- [x] **HTML Nesting Error:** Fix invalid nesting where <p> contains <div> in Section page markdown rendering

## Content Corrections
- [x] **Farm House:** Remove Main House disconnect/water heater photo (incorrectly categorized)
- [x] **Beach House:** Move water heater photo to Camp Kitchen (incorrectly categorized)
- [x] **Beach House:** Fix Water Systems Photos section - only showing 1 of 5 photos

## Missing Photos Issues
- [ ] **The Chalet:** Propane stove and appliance photos from first batch not showing in section

## Documentation & Archive
- [x] **GitHub Archive:** Create new GitHub repository to archive task thread and documentation
- [x] **Dashboard:** Add "Last Updated" date showing when any content was last modified
- [x] **Home Page:** Move last updated date above greeting, format as "Version MM/DD/YYYY"
- [x] **Workflow Guide Section:** Add new section to manual with user instructions (photo upload, content updates, procedures)
- [x] **Main House:** Add washer/dryer photos and specifications to appliances section
- [ ] **Water Shutoff Access:** Replace wooden plank cover with proper access lid/cover
- [x] **Automatic Date Display:** Make "Last Updated" date show today's date automatically instead of manual JSON updates
- [x] **Main House Photos:** Move irrigation system photos (panel, controller, map) to bottom of photo gallery in sequential order
- [x] **Main House Structure:** Move "Valve Boxes & Shutoffs" subsection from Appliances to Water Systems section
- [x] **Boat House:** Add comprehensive electrical system documentation (main interior panel, Main House dock panel, boat house dock panel, ramp panel with outlets)
- [x] **Navigation Structure:** Reorganize sections - Emergency and Workflow Guide under dashboard, reorder properties: Main House, Chalet, Camp Kitchen, Picnic Shelter, Beach House, Farm House, Caretaker's House, Madrona House, Boat House, then remaining sections
- [x] **Main House:** Reorder subsections to place Appliances above Irrigation System
- [x] **Main House:** Delete "Water Systems Photos" subsection (contains duplicate photos)
- [x] **Home Page:** Fix React DOM nesting error - <p> cannot contain nested <div>
- [x] **Home Page:** Upload estate photo to CDN and update hero section background image
- [x] **Home Page:** Redesign hero section to show estate photo as prominent header image above greeting
- [ ] **Home Page:** Make hero section full-width for more dramatic visual impact

## Beach House Photo Integration
- [x] **Find New Beach House Photos:** Check Photo Review for newly uploaded Beach House photos (uploaded ~10 min ago)
- [x] **Integrate Beach House Photos:** Add new photos to Beach House section in manual-data.json
- [x] **Upload Beach House Photos:** Uploaded 14 photos to CDN (appliances: 8, laundry: 4, water heater: 2)
- [x] **Add Laundry Subsection:** Created new Laundry subsection with Maytag washer and dryer photos

## Photo Display Bug Fix
- [x] **Investigate Photo Display Issue:** Debug why photos added to manual-data.json don't display on website
- [x] **Fix Photo Rendering:** Ensure photos render correctly in Section.tsx component
- [x] **Document Root Cause:** Create permanent solution to prevent recurring photo display issues

**ROOT CAUSE:** Section.tsx was missing code to render subsection.images[] array
**FIX:** Added image rendering logic after subsection content (lines 183-203 in Section.tsx)
**RESULT:** All subsection photos now display correctly in 2-column grid with captions

## GitHub Content Integration
- [x] **Fresh Clone Repository:** Clone joe5955/property-manual repository to get latest content
- [x] **Discover All Photos:** Find all building photos in the repository (Main House, Farm House, Madrona, etc.)
- [x] **Upload Photos to CDN:** Use manus-upload-file to upload all photos and get CDN URLs (118 photos uploaded)
- [x] **Integrate Content:** Add photos and any new content to manual-data.json (118 photos across 9 buildings)
- [x] **Verify Display:** Check that all photos display correctly on the website (verified Caretaker House & Farm House - all photos rendering correctly)

## Camp Kitchen Photos Missing
- [x] **Check GitHub Repository:** Find all Camp Kitchen photos in the repository (found 14 photos in Photo Review)
- [x] **Upload Missing Photos:** Upload Camp Kitchen photos to CDN (already uploaded via Photo Upload Form)
- [x] **Integrate Photos:** Add photos to Camp Kitchen section in manual-data.json (added to images[] arrays)
- [x] **Verify Display:** Check that Camp Kitchen photos display correctly (all 14 photos rendering in 4 subsections)
