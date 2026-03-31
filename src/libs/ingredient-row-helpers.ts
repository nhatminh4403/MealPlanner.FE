import { nanoid } from "nanoid";
import { UNITS, toGrams, toDisplayQuantity } from "./unit-conversion";
import { IngredientRow, ConversionStatus } from "./recipe-form-types";
import { Unit } from "./interfaceDTO";

export function createEmptyRow(): IngredientRow {
  const defaultUnit = UNITS.find((u) => u.label === "g")!;
  return {
    key: nanoid(),
    name: "",
    quantityInput: 0,
    unit: defaultUnit,
    densityGPerMl: 1.0,
    gramsOverride: 0,
    quantityGrams: 0,
    displayQuantity: "0 g",
    nutritionId: null,
    nutritionData: null,
    conversionStatus: "empty",
    searchOpen: false,
  };
}

export function resolveRow(row: IngredientRow): IngredientRow {
  if (!row.unit || row.quantityInput <= 0) {
    return { ...row, quantityGrams: null, conversionStatus: "empty" };
  }

  let status: ConversionStatus = "ok";
  let grams: number | null = null;

  if (row.unit.category === "weight") {
    grams = toGrams(row.quantityInput, row.unit)!;
  } else if (row.unit.category === "volume") {
    if (row.densityGPerMl <= 0) {
      status = "needs-density";
    } else {
      grams = toGrams(row.quantityInput, row.unit, row.densityGPerMl)!;
    }
  } else if (row.unit.category === "count") {
    if (row.gramsOverride > 0) {
      grams = row.gramsOverride;
    } else {
      status = "needs-grams";
    }
  }

  return {
    ...row,
    quantityGrams: grams,
    displayQuantity: row.unit
      ? toDisplayQuantity(row.quantityInput, row.unit)
      : "",
    conversionStatus: status,
  };
}
