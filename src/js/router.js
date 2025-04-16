import { initializeKitchen } from "./kitchen.js";
import { showBookModal } from "./bookModal.js";
import {
    getDisplayedRecipes,
    updateDisplayedRecipes,
    renderRecipeCards,
    filterRecipesByDiet,
} from "./utils/recipeUtils.js";
import {
    getRecipesByAppliance,
    getRecipeById,
} from "./services/api/recipeService.js";
import {
    renderRecipeDetails,
    setupUnitToggle,
} from "./recipe/recipeDetails.js";
import { renderDietFilter } from "./components/DietFilter.js";

const ROUTES = {
    "/": "Kitchen",
    "/recipes": "Recipes",
    "/book": "Book",
    "/documentation": "Documentation",
};

const ERROR_TEMPLATE = (message, applianceType = "") => `
    <div class="error">
        <h2>${message}</h2>
        <div class="recipes-controls">
            <button data-navigate="/" class="back-button">Back to Kitchen</button>
            ${
    applianceType
        ? `
                <button data-navigate="/recipes?type=${applianceType}">Return to Recipes</button>
            `
        : ""
}
        </div>
    </div>
`;

const KITCHEN_TEMPLATE = `
    <div class="kitchen-container">
        <div class="kitchen">
            <div class="kitchen-layout">
                <div class="base-kitchen"></div>
                <div class="interactive-zones">
                    <div class="oven-active" data-navigate="/recipes?type=oven"></div>
                    <div class="stove-active" data-navigate="/recipes?type=stove"></div>
                    <div class="microwave-active" data-navigate="/recipes?type=microwave"></div>
                    <div class="ricecooker-active" data-navigate="/recipes?type=ricecooker"></div>
                    <div class="board-active" data-navigate="/recipes?type=board"></div>
                    <div class="book-aa" data-navigate="/book"></div>
                </div>
            </div>
        </div>
        <div id="diet-filter-container"></div>
    </div>
`;

const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const setupDietFilter = async (container, recipes, onFilter, applianceType) => {
    if (!container || !recipes) return;

    const filter = renderDietFilter(recipes, (filteredRecipes) => {
        if (onFilter) onFilter(filteredRecipes, applianceType);
    });

    container.appendChild(filter);
};

const handleKitchenView = async () => {
    const app = document.getElementById("app");
    app.innerHTML = KITCHEN_TEMPLATE;

    requestAnimationFrame(async () => {
        const kitchen = initializeKitchen();
        const recipes = await getRecipesByAppliance("");

        if (recipes) {
            kitchen.highlightActiveAppliances(recipes);
            const filterContainer = document.getElementById(
                "diet-filter-container"
            );
            await setupDietFilter(filterContainer, recipes, (filtered) => {
                kitchen.highlightActiveAppliances(filtered);
            });
        }
    });
};

const handleRecipesView = async (applianceType) => {
    const allRecipes = await getRecipesByAppliance(applianceType);
    const savedFilters = JSON.parse(
        localStorage.getItem("selected_diet_filters") || "[]"
    );
    const filteredRecipes =
        savedFilters.length > 0
            ? filterRecipesByDiet(allRecipes, savedFilters)
            : allRecipes;

    const displayedRecipes = getDisplayedRecipes(
        filteredRecipes,
        applianceType
    );
    const capitalizedType = capitalizeFirst(applianceType);

    const html = `
        <div class="recipes">
            <h2>${capitalizedType} Recipes</h2>
            <span class="recipe-count">[ ${filteredRecipes.length} recipe(s) available ]</span>
            <div class="recipes-controls">
                <button data-navigate="/" class="back-button">Back to Kitchen</button>
                <button id="randomize-recipes" class="randomize-button">Show Different Recipes</button>
            </div>
            <div id="diet-filter-container"></div>
            <div class="recipes-grid">${renderRecipeCards(displayedRecipes)}</div>
        </div>
    `;

    document.getElementById("app").innerHTML = html;

    requestAnimationFrame(() => {
        const randomizeButton = document.getElementById("randomize-recipes");
        if (randomizeButton) {
            randomizeButton.addEventListener("click", () => {
                const newRecipes = updateDisplayedRecipes(
                    filteredRecipes,
                    applianceType
                );
                document.querySelector(".recipes-grid").innerHTML =
                    renderRecipeCards(newRecipes);
            });
        }

        const filterContainer = document.getElementById(
            "diet-filter-container"
        );
        setupDietFilter(filterContainer, allRecipes, (newFiltered) => {
            const newDisplayed = getDisplayedRecipes(
                newFiltered,
                applianceType
            );
            document.querySelector(".recipes-grid").innerHTML =
                renderRecipeCards(newDisplayed);
            document.querySelector(".recipe-count").textContent =
                `[ ${newFiltered.length} recipe(s) available ]`;
        });
    });
};

const handleRecipeDetailView = async (recipeId, applianceType) => {
    if (!recipeId) {
        return ERROR_TEMPLATE("Recipe ID required", applianceType);
    }

    try {
        const recipe = await getRecipeById(recipeId, applianceType);
        if (!recipe) {
            return ERROR_TEMPLATE("Recipe not found", applianceType);
        }

        const effectiveType = recipe.equipment?.primary || applianceType;
        const capitalizedType = capitalizeFirst(effectiveType);

        const html = `
            <div class="recipe-detail-page">
                <div class="recipes-controls">
                    <button data-navigate="/" class="back-button">Back to Kitchen</button>
                    <button data-navigate="/recipes?type=${effectiveType || ""}" class="back-button">
                        Return to ${capitalizedType} Recipes
                    </button>
                </div>
                ${renderRecipeDetails(recipe)}
            </div>
        `;

        requestAnimationFrame(setupUnitToggle);
        return html;
    } catch {
        return ERROR_TEMPLATE("Error loading recipe details", applianceType);
    }
};

export const router = async (path) => {
    const basePath = path.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const applianceType = urlParams.get("type");
    const recipeId = urlParams.get("id");

    const view = ROUTES[basePath] || ROUTES["/"];
    const app = document.getElementById("app");

    try {
        switch (view) {
        case "Kitchen":
            await handleKitchenView();
            break;
        case "Recipes":
            if (recipeId) {
                app.innerHTML = await handleRecipeDetailView(
                    recipeId,
                    applianceType
                );
            } else {
                await handleRecipesView(applianceType);
            }
            break;
        case "Book":
            showBookModal();
            history.pushState({}, "", "/");
            break;
        default:
            await handleKitchenView();
        }
    } catch {
        app.innerHTML = ERROR_TEMPLATE("Error loading page");
    }
};
