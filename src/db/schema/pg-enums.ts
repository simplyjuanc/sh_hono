import { pgEnum } from "drizzle-orm/pg-core";

export const ConditionEnum = pgEnum("condition", ["MINT", "NEAR_MINT", "VERY_GOOD_PLUS", "VERY_GOOD", "GOOD_PLUS", "GOOD", "FAIR", "POOR"],
);

export const FormatEnum = pgEnum("format", ["VINYL", "CD", "CASSETTE", "DIGITAL", "OTHER"]);
