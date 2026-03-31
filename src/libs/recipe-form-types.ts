// libs/recipe-form-types.ts  (new file)
import { Unit } from "./interfaceDTO";
import { IngredientNutritionDto } from "./interfaceDTO";

export type ConversionStatus = "ok" | "needs-density" | "needs-grams" | "empty";

export interface IngredientRow {
  // identity
  key: string; // stable React key (nanoid)

  // user inputs
  name: string;
  quantityInput: number; // what user typed
  unit: Unit | null; // selected Unit object

  // conversion helpers (only needed for volume/count)
  densityGPerMl: number; // default 1.0 (water); user-adjustable for volume units
  gramsOverride: number; // for count units — user specifies gram equivalent

  // resolved values (computed, sent to API)
  quantityGrams: number | null;
  displayQuantity: string; // e.g. "2 tbsp" or "150 g"

  // nutrition linking
  nutritionId: string | null;
  nutritionData: IngredientNutritionDto | null; // for inline preview only

  // UI state
  conversionStatus: ConversionStatus;
  searchOpen: boolean;
}
