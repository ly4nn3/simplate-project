import { DIET_CATEGORIES } from "../../data/diet-categories.js";
import { filterRecipesByDiet } from "../utils/recipeUtils.js";

const FILTER_STORAGE_KEY = "selected_diet_filters";

export const renderDietFilter = (recipes, onFilterChange) => {
    const filterContainer = document.createElement("div");
    filterContainer.className = "diet-filter";

    const filterHTML = `
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

    filterContainer.innerHTML = filterHTML;

    const clearFiltersBtn = filterContainer.querySelector(".clear-filters-btn");
    const buttons = filterContainer.querySelectorAll(".diet-filter-tag");

    const selectedDiets = new Set(
        JSON.parse(localStorage.getItem(FILTER_STORAGE_KEY) || "[]")
    );

    const updateFilterState = () => {
        clearFiltersBtn.style.display =
            selectedDiets.size > 0 ? "block" : "none";
        localStorage.setItem(
            FILTER_STORAGE_KEY,
            JSON.stringify(Array.from(selectedDiets))
        );

        const filteredRecipes =
            selectedDiets.size > 0
                ? filterRecipesByDiet(recipes, Array.from(selectedDiets))
                : recipes;

        onFilterChange(filteredRecipes);
    };

    filterContainer.addEventListener("click", (e) => {
        const rect = filterContainer.getBoundingClientRect();
        if (e.clientX < rect.left + 40) {
            filterContainer.classList.toggle("active");
        }
    });

    filterContainer
        .querySelector(".diet-filter-tags")
        .addEventListener("click", (e) => {
            if (!e.target.classList.contains("diet-filter-tag")) return;

            const dietValue = e.target.dataset.diet;
            if (selectedDiets.has(dietValue)) {
                selectedDiets.delete(dietValue);
                e.target.classList.remove("active");
            } else {
                selectedDiets.add(dietValue);
                e.target.classList.add("active");
            }

            updateFilterState();
        });

    clearFiltersBtn.addEventListener("click", () => {
        selectedDiets.clear();
        buttons.forEach((button) => button.classList.remove("active"));
        updateFilterState();
    });

    buttons.forEach((button) => {
        if (selectedDiets.has(button.dataset.diet)) {
            button.classList.add("active");
        }
    });

    updateFilterState();

    return filterContainer;
};
