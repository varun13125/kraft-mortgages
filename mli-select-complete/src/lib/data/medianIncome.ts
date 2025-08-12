// Annual median renter household income (CAD) — placeholder examples.
export const MEDIAN_RENTER_INCOME: Record<string, number> = {
  "Vancouver, BC": 65000,
  "Surrey, BC": 62000,
  "Burnaby, BC": 63000,
  "Victoria, BC": 60000,
  "Calgary, AB": 64000,
  "Edmonton, AB": 60000,
  "Toronto, ON": 72000,
  "Mississauga, ON": 69000,
  "Brampton, ON": 68000,
  "Ottawa, ON": 68000,
  "Montreal, QC": 53000,
  "Quebec City, QC": 50000,
  "Winnipeg, MB": 52000,
  "Saskatoon, SK": 51000,
  "Halifax, NS": 52000
};

export const CITIES = Object.keys(MEDIAN_RENTER_INCOME).sort();
