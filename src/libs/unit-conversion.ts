// ── Unit definitions ──────────────────────────────────────────────────────────

export type UnitCategory = "weight" | "volume" | "count";

export interface Unit {
  label: string;       // display label e.g. "tbsp"
  fullName: string;    // e.g. "Tablespoon"
  category: UnitCategory;
  /** Grams per unit for weight; ml per unit for volume; null for count */
  factor: number | null;
}

export const UNITS: Unit[] = [
  // ── Weight (exact) ──────────────────────────────────────────────────────────
  { label: "g",   fullName: "Gram",      category: "weight", factor: 1       },
  { label: "kg",  fullName: "Kilogram",  category: "weight", factor: 1000    },
  { label: "oz",  fullName: "Ounce",     category: "weight", factor: 28.35   },
  { label: "lb",  fullName: "Pound",     category: "weight", factor: 453.6   },

  // ── Volume (ml per unit — multiply by density to get grams) ─────────────────
  { label: "ml",   fullName: "Milliliter",  category: "volume", factor: 1    },
  { label: "L",    fullName: "Liter",       category: "volume", factor: 1000 },
  { label: "tsp",  fullName: "Teaspoon",    category: "volume", factor: 5    },
  { label: "tbsp", fullName: "Tablespoon",  category: "volume", factor: 15   },
  { label: "fl oz",fullName: "Fluid Ounce", category: "volume", factor: 29.6 },
  { label: "cup",  fullName: "Cup",         category: "volume", factor: 240  },

  // ── Count (user must specify gram equivalent manually) ───────────────────────
  { label: "piece",   fullName: "Piece",   category: "count", factor: null },
  { label: "slice",   fullName: "Slice",   category: "count", factor: null },
  { label: "clove",   fullName: "Clove",   category: "count", factor: null },
  { label: "pinch",   fullName: "Pinch",   category: "count", factor: null },
  { label: "handful", fullName: "Handful", category: "count", factor: null },
  { label: "bunch",   fullName: "Bunch",   category: "count", factor: null },
  { label: "can",     fullName: "Can",     category: "count", factor: null },
  { label: "strip",   fullName: "Strip",   category: "count", factor: null },
];

// ── Density presets (g/ml) ────────────────────────────────────────────────────
// Used for volume → gram conversion

export interface DensityPreset {
  label: string;
  density: number; // g per ml
}

export const DENSITY_PRESETS: DensityPreset[] = [
  { label: "Water / liquid",  density: 1.00  },
  { label: "Milk",            density: 1.03  },
  { label: "Oil / fat",       density: 0.92  },
  { label: "Honey / syrup",   density: 1.40  },
  { label: "All-purpose flour", density: 0.53 },
  { label: "Sugar (white)",   density: 0.85  },
  { label: "Brown sugar",     density: 0.72  },
  { label: "Salt",            density: 1.22  },
  { label: "Cocoa powder",    density: 0.60  },
  { label: "Rice (dry)",      density: 0.75  },
  { label: "Oats (dry)",      density: 0.34  },
];

// ── Conversion helpers ────────────────────────────────────────────────────────

/**
 * Convert quantity + unit → grams.
 * For volume units, pass densityGPerMl (defaults to 1.0 = water).
 * For count units, pass gramsOverride directly.
 * Returns null if conversion is not possible without more info.
 */
export function toGrams(
  quantity: number,
  unit: Unit,
  densityGPerMl: number = 1.0,
  gramsOverride?: number
): number | null {
  if (quantity <= 0) return null;

  switch (unit.category) {
    case "weight":
      return quantity * unit.factor!;

    case "volume":
      // ml × density = grams
      return quantity * unit.factor! * densityGPerMl;

    case "count":
      // Must be provided by user
      return gramsOverride != null && gramsOverride > 0
        ? gramsOverride
        : null;
  }
}

/**
 * Build the display string stored as displayQuantity.
 * e.g. quantity=2, unit="tbsp" → "2 tbsp"
 */
export function toDisplayQuantity(quantity: number, unit: Unit): string {
  return `${quantity} ${unit.label}`;
}

export const UNIT_BY_LABEL = Object.fromEntries(
  UNITS.map((u) => [u.label, u])
) as Record<string, Unit>;

export const UNITS_BY_CATEGORY = {
  weight: UNITS.filter((u) => u.category === "weight"),
  volume: UNITS.filter((u) => u.category === "volume"),
  count:  UNITS.filter((u) => u.category === "count"),
};