export interface Asset {
  id: string;
  name: string;
  type: string;
  group: string;
  icon: string;
  zone?: string;
  zoneInOut?: "In" | "Out";
  tags?: AssetTag[];
}

export interface AssetTag {
  id: string;
  name: string;
  zoneInOut: "In" | "Out";
  calculationType: "Addition" | "Subtraction" | "Ratio" | "Average";
}

export interface AssetNode extends Asset {
  position: { x: number; y: number };
}
