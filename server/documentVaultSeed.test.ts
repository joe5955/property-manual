import { describe, expect, it } from "vitest";
import documentSeed from "./data/document-vault-seed.json";

describe("Document Vault recovery seed", () => {
  it("contains the full GitHub-recovered inventory", () => {
    expect(documentSeed).toHaveLength(15);
    expect(documentSeed.filter((document) => document.category === "estimate")).toHaveLength(3);
    expect(documentSeed.filter((document) => document.category === "manual")).toHaveLength(11);
    expect(documentSeed.some((document) => document.title === "OPALCO Property Power Map")).toBe(true);
  });

  it("has unique storage keys and complete metadata", () => {
    const storageKeys = documentSeed.map((document) => document.fileKey);
    expect(new Set(storageKeys).size).toBe(storageKeys.length);

    for (const document of documentSeed) {
      expect(document.title.trim().length).toBeGreaterThan(0);
      expect(document.filename.toLowerCase().endsWith(".pdf")).toBe(true);
      expect(document.mimeType).toBe("application/pdf");
      expect(document.fileUrl).toMatch(/^(\/manus-storage\/|https:\/\/)/);
      expect(document.building.trim().length).toBeGreaterThan(0);
    }
  });

  it("preserves the three Esary roofing estimates in property storage", () => {
    const estimates = documentSeed.filter((document) => document.category === "estimate");
    expect(estimates.map((document) => document.building).sort()).toEqual([
      "Beach House",
      "Main House",
      "Picnic Shelter",
    ]);
    for (const estimate of estimates) {
      expect(estimate.fileUrl).toMatch(/^\/manus-storage\//);
      expect(estimate.fileSize).toBeGreaterThan(290_000);
    }
  });
});
