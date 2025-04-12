import { EQUIPMENT_CATEGORIES } from "./equipment-categories.js";

export const RECIPE_CATEGORIES = {
    ingredientBased: EQUIPMENT_CATEGORIES.ingredientBased,
    dishTypes: EQUIPMENT_CATEGORIES.dishTypes,
    cookingIndicators: Object.fromEntries(
        Object.entries(EQUIPMENT_CATEGORIES.hasAsset).map(([key, value]) => [
            key,
            value.indicators,
        ])
    ),
    primaryEquipment: Object.fromEntries(
        Object.entries(EQUIPMENT_CATEGORIES.hasAsset).map(([key, value]) => [
            key,
            value.equipment,
        ])
    ),
};
