export type ItemCondition = 
  | "MINT"
  | "NEAR_MINT"
  | "VERY_GOOD_PLUS"
  | "VERY_GOOD"
  | "GOOD_PLUS"
  | "GOOD"
  | "FAIR"
  | "POOR";

export type Format = 
  | "VINYL"
  | "CD"
  | "CASSETTE"
  | "DIGITAL"
  | "OTHER";

export interface Item {
  id: string;
  title: string;
  artists: string[];
  tracks: string[];
  price: number;
  format: Format;
  ownerId: string;
  condition?: ItemCondition;
  notes?: string;
}
