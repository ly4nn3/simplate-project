import { KITCHEN_ASSETS } from "../../data/kitchen/assets.js";
import {
    COOKING_CATEGORIES,
    COOKING_PRIORITY,
    COOKING_COMBOS,
    COMBO_INDICATORS,
} from "../../data/categories/cooking.js";
import { EQUIPMENT_CATEGORIES } from "../../data/categories/equipment.js";

export function categorizeEquipment(equipmentList) {
    if (!Array.isArray(equipmentList)) {
        return {
            display: [],
            required: [],
            optional: [],
            specialized: [],
            hasSpecializedEquipment: false,
        };
    }

    const categorized = {
        display: [],
        required: [],
        optional: [],
        specialized: [],
    };

    // Sets for lookups
    const specializedSet = new Set(EQUIPMENT_CATEGORIES.specialized);
    const essentialSet = new Set(EQUIPMENT_CATEGORIES.essential);
    const optionalSet = new Set(EQUIPMENT_CATEGORIES.optional);

    equipmentList.forEach((item) => {
        if (!item) return;

        const equipment = item.toLowerCase();
        let foundInAssets = false;

        // asset categories
        for (const [data] of Object.entries(KITCHEN_ASSETS.equipment)) {
            if (data.equipment.includes(equipment)) {
                categorized.display.push(equipment);
                foundInAssets = true;
                break;
            }
        }

        if (!foundInAssets) {
            if (essentialSet.has(equipment)) {
                categorized.required.push(equipment);
            } else if (optionalSet.has(equipment)) {
                categorized.optional.push(equipment);
            } else if (specializedSet.has(equipment)) {
                categorized.specialized.push(equipment);
            }
        }
    });

    return {
        ...categorized,
        hasSpecializedEquipment: categorized.specialized.length > 0,
    };
}

export function identifyPrimaryEquipment(recipe) {
    if (!recipe?.analyzedInstructions?.[0]?.steps) return null;

    const steps = recipe.analyzedInstructions[0].steps;
    const fullInstructions = steps
        .map((step) => step.step.toLowerCase())
        .join(" ");

    for (const [comboName, indicators] of Object.entries(COMBO_INDICATORS)) {
        if (
            indicators.some((phrase) =>
                fullInstructions.includes(phrase.toLowerCase())
            )
        ) {
            return comboName;
        }
    }

    const detectedCategories = [];

    for (const category of COOKING_PRIORITY) {
        if (
            COOKING_CATEGORIES[category]?.methods.some((method) =>
                fullInstructions.includes(method.toLowerCase())
            )
        ) {
            detectedCategories.push(category);
        }
    }

    if (detectedCategories.length > 1) {
        for (const [comboName, categories] of Object.entries(COOKING_COMBOS)) {
            if (categories.every((cat) => detectedCategories.includes(cat))) {
                return comboName;
            }
        }
    }

    return (
        checkIngredientBasedCategory(recipe) ||
        checkCookingMethod(steps) ||
        checkSpecificEquipment(steps)
    );
}

function checkIngredientBasedCategory(recipe) {
    const ingredients = recipe.extendedIngredients || [];
    const title = recipe.title?.toLowerCase() || "";

    // ingredients
    for (const [category, rules] of Object.entries(COOKING_CATEGORIES)) {
        if (
            rules.ingredients?.some((term) =>
                ingredients.some(({ name, original }) => {
                    const ingredientName = name.toLowerCase();
                    const originalDesc = original.toLowerCase();
                    return (
                        ingredientName.includes(term) ||
                        originalDesc.includes(term)
                    );
                })
            )
        ) {
            return category;
        }

        // dishes in title
        if (rules.dishes?.some((term) => title.includes(term))) {
            return category;
        }
    }

    return null;
}

function checkCookingMethod(steps) {
    const fullInstructions = steps
        .map((step) => step.step.toLowerCase())
        .join(" ");

    // cooking priority
    for (const category of COOKING_PRIORITY) {
        const methods = COOKING_CATEGORIES[category]?.methods;
        if (!methods) continue;

        // board recipes handling
        if (methods.some((method) => fullInstructions.includes(method))) {
            if (category === "board") {
                const hasOven = COOKING_CATEGORIES.oven.methods.some((m) =>
                    fullInstructions.includes(m)
                );
                const hasStove = COOKING_CATEGORIES.stove.methods.some((m) =>
                    fullInstructions.includes(m)
                );

                if (hasOven || hasStove) continue;
            }
            return category;
        }
    }

    return null;
}

function checkSpecificEquipment(steps) {
    const equipmentMentioned = new Set(
        steps.flatMap(
            (step) => step.equipment?.map((eq) => eq.name.toLowerCase()) || []
        )
    );

    // priorty order
    for (const category of COOKING_PRIORITY) {
        const categoryEquipment = KITCHEN_ASSETS.equipment[category]?.equipment;
        if (categoryEquipment?.some((eq) => equipmentMentioned.has(eq))) {
            return category;
        }
    }

    return null;
}
