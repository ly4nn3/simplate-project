import { EQUIPMENT_CATEGORIES } from "../../data/equipment-categories.js";
import { RECIPE_CATEGORIES } from "../../data/recipe-categories.js";

const { hasAsset, general, specialized } = EQUIPMENT_CATEGORIES;
const { ingredientBased, dishTypes, cookingIndicators, primaryEquipment } =
    RECIPE_CATEGORIES;

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
    const specializedSet = new Set(specialized);
    const essentialSet = new Set(general.essential);
    const optionalSet = new Set(general.optional);

    equipmentList.forEach((item) => {
        if (!item) return;

        const equipment = item.toLowerCase();
        let foundInAssets = false;

        // asset categories
        for (const category of Object.values(hasAsset)) {
            if (category.equipment.includes(equipment)) {
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
    for (const { name, original } of ingredients) {
        const ingredientName = name.toLowerCase();
        const originalDesc = original.toLowerCase();

        if (
            ingredientBased.oven.some(
                (term) =>
                    ingredientName.includes(term) ||
                    originalDesc.includes("in the oven")
            )
        ) {
            return "oven";
        }

        if (
            ingredientBased.stove.some((term) => ingredientName.includes(term))
        ) {
            return "stove";
        }
    }

    // title
    if (dishTypes.microwave?.some((term) => title.includes(term))) {
        return "microwave";
    }

    if (dishTypes.oven.some((term) => title.includes(term))) {
        return "oven";
    }

    return null;
}

function checkCookingMethod(steps) {
    const fullInstructions = steps
        .map((step) => step.step.toLowerCase())
        .join(" ");

    // microwave first
    if (
        cookingIndicators.microwave.some((indicator) =>
            fullInstructions.includes(indicator)
        )
    ) {
        return "microwave";
    }

    // other appliances
    for (const [appliance, indicators] of Object.entries(cookingIndicators)) {
        if (appliance === "microwave") continue;

        if (
            indicators.some((indicator) => fullInstructions.includes(indicator))
        ) {
            if (appliance === "board") {
                const hasOven = cookingIndicators.oven.some((i) =>
                    fullInstructions.includes(i)
                );
                const hasStove = cookingIndicators.stove.some((i) =>
                    fullInstructions.includes(i)
                );

                if (hasOven || hasStove) continue;
            }
            return appliance;
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

    // non-board first
    for (const [appliance, equipmentList] of Object.entries(primaryEquipment)) {
        if (
            appliance !== "board" &&
            equipmentList.some((eq) => equipmentMentioned.has(eq))
        ) {
            return appliance;
        }
    }

    // board last
    return primaryEquipment.board.some((eq) => equipmentMentioned.has(eq))
        ? "board"
        : null;
}
