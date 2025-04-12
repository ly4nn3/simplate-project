import {
    categorizeEquipment,
    identifyPrimaryEquipment,
} from "./equipmentUtils.js";

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

    const equipment = {
        ...categorizeEquipment(Array.from(equipmentFound)),
        primary: identifyPrimaryEquipment(recipe) || null,
    };

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
        diets: recipe.diets || [],
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
        instructions: recipe.instructions || "",
        analyzedInstructions: recipe.analyzedInstructions,
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
                </div>
            </div>
        `
        )
        .join("");
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
