import { categorizeEquipment } from "./equipmentUtils.js";

export function processRecipe(recipe) {
    if (!recipe || typeof recipe !== "object") {
        throw new Error("Invalid recipe data");
    }

    const equipmentFound = new Set();

    if (recipe.analyzedInstructions?.length > 0) {
        recipe.analyzedInstructions.forEach((instruction) => {
            instruction.steps?.forEach((step) => {
                step.equipment?.forEach((item) => {
                    if (item?.name) {
                        equipmentFound.add(item.name.toLowerCase());
                    }
                });
            });
        });
    }

    const equipment = categorizeEquipment(Array.from(equipmentFound));

    const dietary = {
        glutenFree: Boolean(recipe.glutenFree),
        ketogenic: Boolean(recipe.ketogenic),
        vegan: Boolean(recipe.vegan),
        vegetarian: Boolean(recipe.vegetarian),
        pescetarian: Boolean(recipe.pescetarian),
        paleo: Boolean(recipe.paleo),
        primal: Boolean(recipe.primal),
        lowFodmap: Boolean(recipe.lowFodmap),
        whole30: Boolean(recipe.whole30),
    };

    const ingredients =
        recipe.extendedIngredients
            ?.map((ingredient) => {
                if (!ingredient) return null;

                return {
                    name: ingredient.originalName,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    measures: {
                        us: ingredient.measures?.us,
                        metric: ingredient.measures?.metric,
                    },
                };
            })
            .filter(Boolean) || [];

    const instructions =
        recipe.analyzedInstructions?.[0]?.steps
            .map((step) => {
                if (!step) return null;

                return {
                    number: step.number,
                    step: step.step,
                    equipment:
                        step.equipment?.map((eq) => eq.name.toLowerCase()) ||
                        [],
                };
            })
            .filter(Boolean) || [];

    return {
        id: recipe.id || 0,
        title: recipe.title || "",
        image: recipe.image || "",
        readyInMinutes: recipe.readyInMinutes || 0,
        servings: recipe.servings || 0,
        source: {
            url: recipe.sourceUrl || "",
            name: recipe.sourceName || "",
            credits: recipe.creditsText || "",
            license: recipe.license || "",
        },
        dietary,
        equipment,
        ingredients,
        instructions,
        analyzedInstructions: recipe.analyzedInstructions,
        summary: recipe.summary || "",
    };
}

export function filterRecipesByDiet(recipes, dietaryRestrictions) {
    if (!Array.isArray(recipes) || !Array.isArray(dietaryRestrictions)) {
        return [];
    }

    return recipes.filter((recipe) => {
        if (!recipe?.dietary) return false;

        return dietaryRestrictions.every(
            (restriction) => recipe.dietary[restriction] === true
        );
    });
}
