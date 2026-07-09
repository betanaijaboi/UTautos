export type BodyStyle = "coupe" | "suv" | "sedan" | "convertible" | "jet";

const SUV_KEYWORDS = [
  "urus", "cullinan", "bentayga", "dbx", "cayenne", "purosangue", "gls", "macan",
];
const CONVERTIBLE_KEYWORDS = [
  "spider", "gtc", "volante", "roadster", "cabrio",
];
const SEDAN_KEYWORDS = [
  "roma", "flying spur", "phantom", "ghost", "maybach s", "panamera",
  "db12", "continental gt", "12cilindri", "vanquish", "taycan",
];

export function getBodyStyle(modelName: string, catalogType: "car" | "jet"): BodyStyle {
  if (catalogType === "jet") return "jet";

  const name = modelName.toLowerCase();
  if (SUV_KEYWORDS.some((k) => name.includes(k))) return "suv";
  if (CONVERTIBLE_KEYWORDS.some((k) => name.includes(k))) return "convertible";
  if (SEDAN_KEYWORDS.some((k) => name.includes(k))) return "sedan";
  return "coupe";
}
