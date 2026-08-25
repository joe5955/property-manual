import { readFile, writeFile } from "node:fs/promises";

const manualPath = new URL("../client/src/data/manual-data.json", import.meta.url);
const manual = JSON.parse(await readFile(manualPath, "utf8"));
const workflowSection = manual.sections.find((section) => section.id === "workflow-guide");

if (!workflowSection) {
  throw new Error("The workflow-guide section was not found in manual-data.json.");
}

const workflowContent = `# GitHub Photo Workflow

**Current procedure:** The GitHub repository is the single source of truth for property-manual source photos. The retired Photo Upload and Photo Review pages are not part of the current workflow.

## Quick Process

1. Capture clean photos and record the building, system, item, and location in a field note.
2. Name and place the files in the matching \`client/public/images/<building>/<category>/\` directory in GitHub.
3. Commit the source photos to the repository.
4. Upload the approved repository images to the CDN, then map their URLs and captions to the correct \`images\` array in \`manual-data.json\`.
5. Verify the live manual section before committing the completed update.

## Photo Standard

Use ordered, descriptive filenames such as \`01_dishwasher_bosch_closed.jpg\`. Keep the source image clean: do not use text overlays, collage layouts, arrows, or composite images. Create a new subsection when the existing section does not accurately describe the equipment or system.

## Full Guide

Open the [GitHub Photo Workflow](/workflow-guide) page for the current capture, archival, integration, and publication checklist.`;

workflowSection.content = workflowContent;
workflowSection.intro = "Current GitHub-first process for maintaining property-manual photos, captions, and section content.";
workflowSection.subsections = [
  {
    id: "github-photo-workflow",
    title: "GitHub Photo Workflow",
    content: workflowContent,
    items: [],
    intro: "Use this procedure for every new property photo batch."
  }
];
manual.metadata.updated = "August 25, 2026";

await writeFile(manualPath, `${JSON.stringify(manual, null, 2)}\n`);
console.log("Refreshed the workflow-guide content and metadata in manual-data.json.");
