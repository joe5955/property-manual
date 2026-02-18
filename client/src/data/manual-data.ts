import manualDataJson from './manual-data.json';

export interface ManualItem {
  id: string;
  title: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ManualSubsection {
  id: string;
  title: string;
  content: string;
  items?: ManualItem[];
  intro?: string;
}

export interface ManualSection {
  id: string;
  title: string;
  content: string;
  subsections?: ManualSubsection[];
  intro?: string;
}

export interface ManualData {
  title: string;
  metadata: {
    created: string;
    updated: string;
    owner: string;
  };
  sections: ManualSection[];
}

export const manualData: ManualData = manualDataJson as ManualData;
