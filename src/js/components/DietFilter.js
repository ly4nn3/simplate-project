import { DIET_CATEGORIES } from "../../data/diet-categories.js";
import { filterRecipesByDiet } from "../utils/recipeUtils.js";

const FILTER_STORAGE_KEY = "selected_diet_filters";

export const renderDietFilter = (recipes, onFilterChange) => {
    const filterContainer = document.createElement("div");
    filterContainer.className = "diet-filter";

    filterContainer.innerHTML = `
        <div class="diet-filter-tags">
            ${Object.entries(DIET_CATEGORIES)
        .map(
            ([key, value]) => `
                <button class="diet-filter-tag ${value.className}" data-diet="${key}">
                    ${value.display}
                </button>
            `
        )
        .join("")}
        </div>
        <div class="diet-filter-controls">
            <button class="clear-filters-btn" style="display: none;">Clear Filters</button>
        </div>
    `;

    filterContainer.addEventListener("click", (e) => {
        const rect = filterContainer.getBoundingClientRect();
        const isClickingTab = e.clientX < rect.left + 40;

        if (isClickingTab) {
            filterContainer.classList.toggle("active");
        }
    });

    const savedFilters = JSON.parse(
        localStorage.getItem(FILTER_STORAGE_KEY) || "[]"
    );
    const selectedDiets = new Set(savedFilters);

    const buttons = filterContainer.querySelectorAll(".diet-filter-tag");
    const clearFiltersBtn = filterContainer.querySelector(".clear-filters-btn");

    const updateClearButtonVisibility = () => {
        clearFiltersBtn.style.display =
            selectedDiets.size > 0 ? "block" : "none";
    };

    const saveFilters = () => {
        localStorage.setItem(
            FILTER_STORAGE_KEY,
            JSON.stringify(Array.from(selectedDiets))
        );
    };

    const clearFilters = () => {
        selectedDiets.clear();
        buttons.forEach((button) => button.classList.remove("active"));
        updateClearButtonVisibility();
        saveFilters();
        onFilterChange(recipes);
    };

    buttons.forEach((button) => {
        const dietValue = button.dataset.diet;
        if (selectedDiets.has(dietValue)) {
            button.classList.add("active");
        }
    });
    updateClearButtonVisibility();

    if (selectedDiets.size > 0) {
        const filteredRecipes = filterRecipesByDiet(
            recipes,
            Array.from(selectedDiets)
        );
        onFilterChange(filteredRecipes);
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const dietValue = button.dataset.diet;

            if (selectedDiets.has(dietValue)) {
                selectedDiets.delete(dietValue);
                button.classList.remove("active");
            } else {
                selectedDiets.add(dietValue);
                button.classList.add("active");
            }

            updateClearButtonVisibility();
            saveFilters();

            const filteredRecipes =
                selectedDiets.size > 0
                    ? filterRecipesByDiet(recipes, Array.from(selectedDiets))
                    : recipes;

            onFilterChange(filteredRecipes);
        });
    });

    clearFiltersBtn.addEventListener("click", clearFilters);

    return filterContainer;
};
