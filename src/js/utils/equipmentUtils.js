import { EQUIPMENT_CATEGORIES } from "../../data/equipment-categories.js";
import { RECIPE_CATEGORIES } from "../../data/recipe-categories.js";

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

    equipmentList.forEach((item) => {
        if (!item) return;

        const equipment = item.toLowerCase();

        let foundInAssets = false;

        for (const { equipment: equipmentList } of Object.values(
            EQUIPMENT_CATEGORIES.hasAsset
        )) {
            if (equipmentList.includes(equipment)) {
                categorized.display.push(equipment);
                foundInAssets = true;
                break;
            }
        }

        if (!foundInAssets) {
            if (EQUIPMENT_CATEGORIES.general.essential.includes(equipment)) {
                categorized.required.push(equipment);
            } else if (
                EQUIPMENT_CATEGORIES.general.optional.includes(equipment)
            ) {
                categorized.optional.push(equipment);
            } else if (EQUIPMENT_CATEGORIES.specialized.includes(equipment)) {
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

    // Check ingredients first
    const primaryFromIngredients = checkIngredientBasedCategory(recipe);
    if (primaryFromIngredients) return primaryFromIngredients;

    // Check cooking methods
    const primaryFromMethod = checkCookingMethod(steps);
    if (primaryFromMethod) return primaryFromMethod;

    // Check specific equipment
    return checkSpecificEquipment(steps);
}

function checkIngredientBasedCategory(recipe) {
    const ingredients = recipe.extendedIngredients || [];

    for (const ingredient of ingredients) {
        const ingredientName = ingredient.name.toLowerCase();
        const originalDesc = ingredient.original.toLowerCase();

        if (RECIPE_CATEGORIES.ingredientBased.oven.some((term) =>
                ingredientName.includes(term) || originalDesc.includes("in the oven"))) {
                return "oven";
            }

        if (RECIPE_CATEGORIES.ingredientBased.stove.some((term) =>
            ingredientName.includes(term))) {
            return "stove";
        }
    }

    if (recipe.title && RECIPE_CATEGORIES.dishTypes.microwave?.some(term =>
        recipe.title.toLowerCase().includes(term))) {
        return "microwave";
    }

    if (recipe.title && RECIPE_CATEGORIES.dishTypes.oven.some(term =>
        recipe.title.toLowerCase().includes(term))) {
        return "oven";
    }
    
    return null;
}

function checkCookingMethod(steps) {
    const fullInstructions = steps
        .map((step) => step.step.toLowerCase())
        .join(" ");

    if (RECIPE_CATEGORIES.cookingIndicators.microwave.some(
        indicator => fullInstructions.includes(indicator)
    )) {
        return "microwave";
    }

    for (const [appliance, indicators] of Object.entries(
        RECIPE_CATEGORIES.cookingIndicators
    )) {
        if (appliance === "microwave") continue;
        
        if (
            indicators.some((indicator) => fullInstructions.includes(indicator))
        ) {
            if (appliance === "board") {
                const hasOven = RECIPE_CATEGORIES.cookingIndicators.oven.some(
                    (i) => fullInstructions.includes(i)
                );
                const hasStove = RECIPE_CATEGORIES.cookingIndicators.stove.some(
                    (i) => fullInstructions.includes(i)
                );

                if (hasOven || hasStove) continue;
            }
            return appliance;
        }
    }
    return null;
}

function checkSpecificEquipment(steps) {
    const equipmentMentioned = new Set();

    steps.forEach((step) => {
        if (step.equipment) {
            step.equipment.forEach((eq) => {
                equipmentMentioned.add(eq.name.toLowerCase());
            });
        }
    });

    // Check equipment first (exclude board)
    for (const [appliance, equipmentList] of Object.entries(
        RECIPE_CATEGORIES.primaryEquipment
    )) {
        if (
            appliance !== "board" &&
            equipmentList.some((eq) => equipmentMentioned.has(eq))
        ) {
            return appliance;
        }
    }

    // Check board last
    if (
        RECIPE_CATEGORIES.primaryEquipment.board.some((eq) =>
            equipmentMentioned.has(eq)
        )
    ) {
        return "board";
    }

    return null;
}
