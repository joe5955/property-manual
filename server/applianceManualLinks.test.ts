import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const manualDataPath = path.resolve(process.cwd(), "client/src/data/manual-data.json");
const manualData = JSON.parse(fs.readFileSync(manualDataPath, "utf8"));

type ManualSubsection = {
  id: string;
  title: string;
  content?: string;
  intro?: string;
};

function getSubsection(sectionId: string, subsectionId: string): ManualSubsection {
  const section = manualData.sections.find((candidate: any) => candidate.id === sectionId);
  expect(section, `Expected section ${sectionId} to exist`).toBeTruthy();

  const subsection = section.subsections.find((candidate: any) => candidate.id === subsectionId);
  expect(subsection, `Expected subsection ${sectionId}/${subsectionId} to exist`).toBeTruthy();

  return subsection;
}

function imageIndexes(markdown: string): number[] {
  return [...markdown.matchAll(/^!\[[^\]]*\]\([^)]+\)\s*$/gm)].map((match) => match.index ?? -1);
}

function manualLinkIndexes(markdown: string): number[] {
  return [...markdown.matchAll(/^\*\*[^*]*Manual[^*]*:\*\*\s*\[[^\]]+\]\([^)]+\).*$/gim)].map(
    (match) => match.index ?? -1,
  );
}

describe("appliance manual links", () => {
  it("keeps manual links restored in every appliance-focused section", () => {
    const expectedLinks = [
      ["main-house", "appliances", "KitchenAid Support Page"],
      ["main-house", "appliances", "49-8902.PDF"],
      ["main-house", "appliances", "5600003093_A.pdf"],
      ["main-house", "appliances", "400011314274EN.pdf"],
      ["main-house", "appliances", "W10151580B.pdf"],
      ["main-house", "appliances", "R1210_R1211_R1214_OM_EN_v02.pdf"],
      ["the-chalet", "appliances-chalet", "Whirlpool Manuals & Literature"],
      ["the-chalet", "appliances-chalet", "manualslib.com"],
      ["camp-kitchen", "appliances-camp", "Amana Manuals & Literature"],
      ["camp-kitchen", "appliances-camp", "GE Appliances Owner Manuals"],
      ["camp-kitchen", "appliances-camp", "owners-manual-6920187-RevA.pdf"],
      ["camp-kitchen", "water-heater-camp", "Rinnai Manuals Page"],
      ["beach-house", "appliances", "LG LRBP1031T Support & Manuals"],
      ["beach-house", "appliances", "Bosch Owner Manuals Search"],
      ["beach-house", "appliances", "Bosch Dishwasher Manuals Search"],
      ["beach-house", "appliances", "Bosch HMB5050/01 Support & Manuals"],
      ["beach-house", "appliances", "Maytag MHW8200FC Owner Support"],
      ["beach-house", "appliances", "1603405L"],
      ["farm-house", "kitchen-appliances-farm", "161181-1.pdf"],
      ["farm-house", "kitchen-appliances-farm", "Premier Electric Range Use & Care Manual"],
    ] as const;

    for (const [sectionId, subsectionId, expectedText] of expectedLinks) {
      const subsection = getSubsection(sectionId, subsectionId);
      const content = `${subsection.intro ?? ""}\n${subsection.content ?? ""}`;
      expect(content, `${sectionId}/${subsectionId} should include ${expectedText}`).toContain(expectedText);
    }
  });

  it("places restored manual links after the appliance photos in each Markdown appliance block", () => {
    const applianceSubsections = [
      ["main-house", "appliances"],
      ["the-chalet", "heating-chalet"],
      ["camp-kitchen", "appliances-camp"],
      ["camp-kitchen", "water-heater-camp"],
      ["beach-house", "appliances"],
      ["farm-house", "kitchen-appliances-farm"],
    ] as const;

    for (const [sectionId, subsectionId] of applianceSubsections) {
      const subsection = getSubsection(sectionId, subsectionId);
      const content = subsection.content ?? "";
      const blocks = content.split(/(?=^###\s+)/m).filter((block) => block.startsWith("### "));

      for (const block of blocks) {
        const manuals = manualLinkIndexes(block);
        if (manuals.length === 0) continue;

        const images = imageIndexes(block);
        expect(images.length, `${sectionId}/${subsectionId} block should have an appliance image before its manual link:\n${block}`).toBeGreaterThan(0);

        const lastImageIndex = Math.max(...images);
        for (const manualIndex of manuals) {
          expect(manualIndex, `${sectionId}/${subsectionId} manual link should follow its appliance image:\n${block}`).toBeGreaterThan(lastImageIndex);
          expect(
            manualIndex - lastImageIndex,
            `${sectionId}/${subsectionId} manual link should remain adjacent to the appliance photos:\n${block}`,
          ).toBeLessThan(700);
        }
      }
    }
  });
});
