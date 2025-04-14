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
import { renderRecipeDetails } from "./recipe/recipeDetails.js";
import { renderDietFilter } from "./components/DietFilter.js";

export const router = async (path) => {
    const basePath = path.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const applianceType = urlParams.get("type");
    const recipeId = urlParams.get("id");

    const routes = {
        "/": "Kitchen",
        "/recipes": recipeId ? "RecipeDetail" : "Recipes",
        "/book": "Book",
        "/about": "About",
    };

    const view = routes[basePath] || routes["/"];

    const app = document.getElementById("app");

    try {
        switch (view) {
        case "Kitchen":
            app.innerHTML = await renderKitchen();

            requestAnimationFrame(() => {
                const kitchen = initializeKitchen();
                getRecipesByAppliance("").then((recipes) => {
                    if (recipes) {
                        kitchen.highlightActiveAppliances(recipes);

                        const filterContainer = document.getElementById(
                            "diet-filter-container"
                        );
                        if (filterContainer) {
                            getRecipesByAppliance("").then((recipes) => {
                                if (recipes) {
                                    filterContainer.appendChild(
                                        renderDietFilter(
                                            recipes,
                                            (filteredRecipes) => {
                                                kitchen.highlightActiveAppliances(
                                                    filteredRecipes
                                                );
                                            }
                                        )
                                    );
                                }
                            });
                        }
                    }
                });
            });
            break;
        case "Recipes":
            app.innerHTML = await renderRecipes(applianceType);
            break;
        case "RecipeDetail":
            app.innerHTML = await renderRecipeDetail(
                recipeId,
                applianceType
            );
            break;
        case "Book":
            showBookModal();
            history.pushState({}, "", "/");
            break;
        case "About":
            app.innerHTML = await renderAbout();
            break;
        default:
            app.innerHTML = await renderKitchen();
            initializeKitchen();
        }
    } catch {
        return `
            <div class="error">
                <h2>Error loading page</h2>
                <button data-navigate="/">Return to Kitchen</button>
            </div>
        `;
    }
};

const renderKitchen = async () => {
    return `
        <div class="kitchen-container">
            <div class="kitchen">
                <div class="kitchen-layout">
                    <!-- Base kitchen -->
                    <div class="base-kitchen"></div>
                    
                    <!-- Interactive elements -->
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
};

// Recipe cards view
const renderRecipes = async (applianceType) => {
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

    // Capitalize first letter only
    const capitalizedType = applianceType
        ? applianceType.charAt(0).toUpperCase() +
          applianceType.slice(1).toLowerCase()
        : "";

    const html = `
        <div class="recipes">
            <h2>${capitalizedType} Recipes</h2>
            <span class="recipe-count">[ ${filteredRecipes.length} recipe(s) available ]</span>
            <div class="recipes-controls">
                <button data-navigate="/" class="back-button">Back to Kitchen</button>
                <button id="randomize-recipes" class="randomize-button">Show Different Recipes</button>
            </div>
            <div id="diet-filter-container"></div>
            <div class="recipes-grid">
                ${renderRecipeCards(displayedRecipes)}
            </div>
        </div>
    `;

    setTimeout(() => {
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
        if (filterContainer) {
            filterContainer.appendChild(
                renderDietFilter(allRecipes, (newFilteredRecipes) => {
                    const newDisplayed = getDisplayedRecipes(
                        newFilteredRecipes,
                        applianceType
                    );
                    document.querySelector(".recipes-grid").innerHTML =
                        renderRecipeCards(newDisplayed);
                    document.querySelector(".recipe-count").textContent =
                        `[ ${newFilteredRecipes.length} recipe(s) available ]`;
                })
            );
        }
    }, 0);

    return html;
};

// Recipe detail view
const renderRecipeDetail = async (recipeId, applianceType) => {
    if (!recipeId) {
        return `
            <div class="error">
                <h2>Recipe ID required</h2>
                <div class="recipes-controls">
                    <button data-navigate="/" class="back-button">Back to Kitchen</button>
                    <button data-navigate="/recipes?type=${applianceType || ""}">Return to Recipes</button>
                </div>
            </div>
        `;
    }

    try {
        const recipe = await getRecipeById(recipeId, applianceType);

        if (!recipe) {
            return `
                <div class="error">
                    <h2>Recipe not found</h2>
                    <div class="recipes-controls">
                        <button data-navigate="/" class="back-button">Back to Kitchen</button>
                        <button data-navigate="/recipes?type=${applianceType || ""}">Return to Recipes</button>
                    </div>
                </div>
            `;
        }

        const effectiveType = recipe.equipment?.primary || applianceType;
        const capitalizedType = effectiveType
            ? effectiveType.charAt(0).toUpperCase() +
              effectiveType.slice(1).toLowerCase()
            : "All";

        return `
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
    } catch {
        return `
            <div class="error">
                <h2>Error loading recipe details</h2>
                <button data-navigate="/" class="back-button">Back to Kitchen</button>
                <button data-navigate="/recipes?type=${applianceType || ""}">Return to Recipes</button>
            </div>
        `;
    }
};

// About view
const renderAbout = async () => {
    return `
        <div class="about">
            <h1>About Simplate</h1>
        </div>
    `;
};
