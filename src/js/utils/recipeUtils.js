import { DIET_CATEGORIES } from "../../data/diet-categories.js";
import {
    categorizeEquipment,
    identifyPrimaryEquipment,
} from "./equipmentUtils.js";

export function processRecipe(recipe) {
    if (!recipe || typeof recipe !== "object") {
        throw new Error("Invalid recipe data");
    }

    let imageUrl = recipe.image || "";

    if (
        imageUrl &&
        (imageUrl.endsWith(".") || !imageUrl.match(/\.(jpg|jpeg|png|gif)$/i))
    ) {
        imageUrl = imageUrl.endsWith(".")
            ? `${imageUrl}jpg`
            : `${imageUrl}.jpg`;
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

    const equipment = {
        ...categorizeEquipment(Array.from(equipmentFound)),
        primary: identifyPrimaryEquipment(recipe) || null,
    };

    const dietary = {
        glutenFree: Boolean(recipe.glutenFree),
        dairyFree: Boolean(recipe.dairyFree),
        vegan: Boolean(recipe.vegan),
        vegetarian: Boolean(recipe.vegetarian),
        lowFodmap: Boolean(recipe.lowFodmap),
        diets:
            recipe.diets && recipe.diets.length > 0 ? recipe.diets : ["normal"],
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

    return {
        id: recipe.id || 0,
        title: recipe.title || "",
        image: imageUrl || "",
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
        instructions: recipe.instructions || "",
        analyzedInstructions: recipe.analyzedInstructions,
    };
}

export function filterRecipesByDiet(recipes, selectedDiets) {
    if (!Array.isArray(recipes) || !Array.isArray(selectedDiets)) {
        return [];
    }

    return recipes.filter((recipe) => {
        if (!recipe?.dietary) return false;

        return selectedDiets.every((diet) => {
            if (diet in recipe.dietary) {
                return recipe.dietary[diet] === true;
            }

            return recipe.dietary.diets.includes(diet.toLowerCase());
        });
    });
}

export function getAllDiets(recipe) {
    if (!recipe?.dietary) return [];

    const diets = [...recipe.dietary.diets];

    Object.entries(recipe.dietary).forEach(([key, value]) => {
        if (key !== "diets" && value === true) {
            diets.push(key.toLowerCase());
        }
    });

    return diets;
}

export function categorizeRecipesByEquipment(recipes) {
    if (!Array.isArray(recipes)) return {};

    const categorized = {
        stove: [],
        oven: [],
        microwave: [],
        board: [],
        ricecooker: [],
        specialized: [],
        basic: [],
    };

    recipes.forEach((recipe) => {
        if (recipe.equipment.primary) {
            categorized[recipe.equipment.primary].push(recipe);
        } else if (recipe.equipment.hasSpecializedEquipment) {
            categorized.specialized.push(recipe);
        } else {
            categorized.basic.push(recipe);
        }
    });

    return categorized;
}

export const getRandomRecipes = (recipes, count = 6) => {
    if (!Array.isArray(recipes) || recipes.length === 0) {
        return [];
    }

    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getDisplayedRecipes = (allRecipes, applianceType) => {
    if (!Array.isArray(allRecipes) || allRecipes.length === 0) {
        return [];
    }

    const storageKey = `displayed_${applianceType}_recipes`;
    let displayedRecipes;

    try {
        const storedRecipeIds = localStorage.getItem(storageKey);

        if (storedRecipeIds) {
            const ids = JSON.parse(storedRecipeIds);
            displayedRecipes = allRecipes.filter((recipe) =>
                ids.includes(recipe.id)
            );

            if (displayedRecipes.length < Math.min(6, allRecipes.length)) {
                displayedRecipes = getRandomRecipes(allRecipes);
                localStorage.setItem(
                    storageKey,
                    JSON.stringify(displayedRecipes.map((r) => r.id))
                );
            }
        } else {
            displayedRecipes = getRandomRecipes(allRecipes);
            localStorage.setItem(
                storageKey,
                JSON.stringify(displayedRecipes.map((r) => r.id))
            );
        }
    } catch {
        displayedRecipes = getRandomRecipes(allRecipes);
    }

    return displayedRecipes;
};

export const updateDisplayedRecipes = (allRecipes, applianceType) => {
    if (!Array.isArray(allRecipes) || allRecipes.length === 0) {
        return [];
    }

    const storageKey = `displayed_${applianceType}_recipes`;
    const newRecipes = getRandomRecipes(allRecipes);

    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(newRecipes.map((r) => r.id))
        );
    } catch {
        return [];
    }

    return newRecipes;
};

export const renderDietaryTags = (recipe, compact = false) => {
    if (!recipe || !recipe.dietary) return "";

    const dietTags = new Set();

    const booleanToDietKey = {
        glutenFree: "gluten free",
        dairyFree: "dairy free",
        vegan: "vegan",
        vegetarian: "lacto ovo vegetarian",
        lowFodmap: "fodmap friendly",
    };

    const allDiets = new Set([
        ...Object.entries(recipe.dietary)
            .filter(([key, value]) => value === true && booleanToDietKey[key])
            .map(([key]) => booleanToDietKey[key]),
        ...(recipe.dietary.diets || []).map((diet) => diet.toLowerCase()),
    ]);

    allDiets.forEach((dietKey) => {
        if (DIET_CATEGORIES[dietKey]) {
            dietTags.add(
                `<span class="diet-tag ${DIET_CATEGORIES[dietKey].className}">
                    ${DIET_CATEGORIES[dietKey].display}
                </span>`
            );
        }
    });

    if (compact) {
        return Array.from(dietTags).join("");
    }

    return dietTags.size > 0
        ? `<div class="dietary-tags">${Array.from(dietTags).join("")}</div>`
        : "";
};

export const renderEquipmentTags = (recipe) => {
    if (!recipe || !recipe.equipment) {
        return "";
    }

    const primary = recipe.equipment.primary
        ? `<span class="equipment-tag primary">${recipe.equipment.primary}</span>`
        : "";

    const display = Array.isArray(recipe.equipment.display)
        ? recipe.equipment.display
            .filter((item) => item !== recipe.equipment.primary)
            .map((item) => `<span class="equipment-tag">${item}</span>`)
            .join("")
        : "";

    const specialized = Array.isArray(recipe.equipment.specialized)
        ? recipe.equipment.specialized
            .map(
                (item) =>
                    `<span class="equipment-tag specialized">⚠️ ${item}</span>`
            )
            .join("")
        : "";

    return `${primary}${display}${specialized}`;
};

export const renderRecipeCards = (recipes) => {
    if (!Array.isArray(recipes) || recipes.length === 0) {
        return "<div class=\"no-recipes\">No recipes found.</div>";
    }

    return recipes
        .map(
            (recipe) => `
            <div class="recipe-card" data-navigate="/recipes?id=${recipe.id}">
                <img src="${recipe.image}" alt="${recipe.title}" width="350" height="auto">
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span>⏲️ ${recipe.readyInMinutes} minutes</span>
                        <span>🍽️ ${recipe.servings} servings</span>
                    </div>
                    <div class="recipe-equipment">
                        ${renderEquipmentTags(recipe)}
                    </div>
                    <div class="recipe-dietary-tags">
                        ${renderDietaryTags(recipe, true)}
                    </div>
                </div>
            </div>
        `
        )
        .join("");
};
