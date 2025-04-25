import { DIET_CATEGORIES } from "../../data/diet-categories.js";
import { COOKING_PRIORITY } from "../../data/categories/cooking.js";
import {
    categorizeEquipment,
    identifyPrimaryEquipment,
} from "./equipmentUtils.js";

const DEFAULT_RECIPE = {
    id: 0,
    title: "",
    readyInMinutes: 0,
    servings: 0,
    source: {
        url: "",
        name: "",
        credits: "",
        license: "",
    },
};

const BOOLEAN_TO_DIET = {
    glutenFree: "gluten free",
    dairyFree: "dairy free",
    vegan: "vegan",
    vegetarian: "lacto ovo vegetarian",
    lowFodmap: "fodmap friendly",
};

// Image processing
function processImageUrl(url) {
    if (!url) return "";
    if (!url.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return url.endsWith(".") ? `${url}jpg` : `${url}.jpg`;
    }
    return url;
}

// Equipment processing
function extractEquipment(recipe) {
    const equipmentFound = new Set();

    recipe.analyzedInstructions?.forEach((instruction) => {
        instruction.steps?.forEach((step) => {
            step.equipment?.forEach((item) => {
                if (item?.name) equipmentFound.add(item.name.toLowerCase());
            });
        });
    });

    return {
        ...categorizeEquipment(Array.from(equipmentFound)),
        primary: identifyPrimaryEquipment(recipe) || null,
    };
}

// Ingredient processing
function processIngredients(ingredients) {
    return (
        ingredients
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
            .filter(Boolean) || []
    );
}

// Main recipe processing
export function processRecipe(recipe) {
    if (!recipe || typeof recipe !== "object") {
        throw new Error("Invalid recipe data");
    }

    return {
        ...DEFAULT_RECIPE,
        ...recipe,
        image: processImageUrl(recipe.image),
        equipment: extractEquipment(recipe),
        ingredients: processIngredients(recipe.extendedIngredients),
        dietary: {
            glutenFree: Boolean(recipe.glutenFree),
            dairyFree: Boolean(recipe.dairyFree),
            vegan: Boolean(recipe.vegan),
            vegetarian: Boolean(recipe.vegetarian),
            lowFodmap: Boolean(recipe.lowFodmap),
            diets: recipe.diets?.length > 0 ? recipe.diets : ["normal"],
        },
    };
}

// Recipe filtering
export function filterRecipesByDiet(recipes, selectedDiets) {
    if (!Array.isArray(recipes) || !Array.isArray(selectedDiets)) return [];

    return recipes.filter(
        (recipe) =>
            recipe?.dietary &&
            selectedDiets.every((diet) =>
                diet in recipe.dietary
                    ? recipe.dietary[diet] === true
                    : recipe.dietary.diets.includes(diet.toLowerCase())
            )
    );
}

export function getAllDiets(recipe) {
    if (!recipe?.dietary) return [];

    return [
        ...recipe.dietary.diets,
        ...Object.entries(recipe.dietary)
            .filter(([key, value]) => key !== "diets" && value === true)
            .map(([key]) => key.toLowerCase()),
    ];
}

// Categorization
export function categorizeRecipesByEquipment(recipes) {
    if (!Array.isArray(recipes)) return {};

    const categories = COOKING_PRIORITY.reduce(
        (acc, category) => {
            acc[category] = [];
            return acc;
        },
        {
            specialized: [],
            basic: [],
        }
    );

    recipes.forEach((recipe) => {
        const category = recipe.equipment.primary
            ? recipe.equipment.primary
            : recipe.equipment.hasSpecializedEquipment
                ? "specialized"
                : "basic";

        if (category in categories) {
            categories[category].push(recipe);
        }
    });

    return categories;
}

// Recipe randomizer
export const getRandomRecipes = (recipes, count = 6) => {
    if (!Array.isArray(recipes) || recipes.length === 0) return [];
    return [...recipes]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, recipes.length));
};

// Display management
export const getDisplayedRecipes = (allRecipes, applianceType) => {
    if (!Array.isArray(allRecipes) || allRecipes.length === 0) return [];

    const storageKey = `displayed_${applianceType}_recipes`;

    try {
        const storedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
        let displayedRecipes = allRecipes.filter((recipe) =>
            storedIds.includes(recipe.id)
        );

        if (displayedRecipes.length < Math.min(6, allRecipes.length)) {
            displayedRecipes = getRandomRecipes(allRecipes);
            localStorage.setItem(
                storageKey,
                JSON.stringify(displayedRecipes.map((r) => r.id))
            );
        }

        return displayedRecipes;
    } catch {
        return getRandomRecipes(allRecipes);
    }
};

export const updateDisplayedRecipes = (allRecipes, applianceType) => {
    if (!Array.isArray(allRecipes) || allRecipes.length === 0) return [];

    const newRecipes = getRandomRecipes(allRecipes);
    try {
        localStorage.setItem(
            `displayed_${applianceType}_recipes`,
            JSON.stringify(newRecipes.map((r) => r.id))
        );
        return newRecipes;
    } catch {
        return [];
    }
};

// Rendering
export const renderDietaryTags = (recipe, compact = false) => {
    if (!recipe?.dietary) return "";

    const dietTags = new Set(
        [
            ...Object.entries(recipe.dietary)
                .filter(
                    ([key, value]) => value === true && BOOLEAN_TO_DIET[key]
                )
                .map(([key]) => BOOLEAN_TO_DIET[key]),
            ...(recipe.dietary.diets || []).map((diet) => diet.toLowerCase()),
        ]
            .map((dietKey) =>
                DIET_CATEGORIES[dietKey]
                    ? `<span class="diet-tag ${DIET_CATEGORIES[dietKey].className}">
                ${DIET_CATEGORIES[dietKey].display}
               </span>`
                    : null
            )
            .filter(Boolean)
    );

    return compact
        ? Array.from(dietTags).join("")
        : dietTags.size > 0
            ? `<div class="dietary-tags">${Array.from(dietTags).join("")}</div>`
            : "";
};

export const renderEquipmentTags = (recipe) => {
    if (!recipe?.equipment) return "";

    const tags = [];

    if (recipe.equipment.primary) {
        if (recipe.equipment.primary.includes("+")) {
            const categories = recipe.equipment.primary.split("+");
            categories.forEach((category) => {
                tags.push(
                    `<span class="equipment-tag primary">${category}</span>`
                );
            });
        } else {
            tags.push(
                `<span class="equipment-tag primary">${recipe.equipment.primary}</span>`
            );
        }
    }

    if (Array.isArray(recipe.equipment.specialized)) {
        tags.push(
            ...recipe.equipment.specialized.map(
                (item) =>
                    `<span class="equipment-tag specialized">⚠️ ${item}</span>`
            )
        );
    }

    return tags.join("");
};

export const renderRecipeCards = (recipes) => {
    if (!Array.isArray(recipes) || recipes.length === 0) {
        return "<div class=\"no-recipes\">No recipes found.</div>";
    }

    return recipes
        .map(
            (recipe) => `
        <div class="recipe-card" data-navigate="/recipes?id=${recipe.id}">
            <img 
                src="${recipe.image}" 
                alt="${recipe.title}" 
                width="350" 
                height="auto"
                loading="lazy"
            >
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
