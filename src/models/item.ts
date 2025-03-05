export enum ItemCondition {
  MINT = "mint",
  NEAR_MINT = "near_mint",
  VERY_GOOD_PLUS = "very_good_plus",
  VERY_GOOD = "very_good",
  GOOD_PLUS = "good_plus",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
}

export enum Format {
  Vinyl = "vinyl",
  CD = "cd",
  Cassette = "cassette",
  Digital = "digital",
  Other = "other",
};

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
