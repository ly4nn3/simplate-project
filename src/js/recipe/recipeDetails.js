import {
    toggleUnit,
    formatMeasurement,
    getCurrentUnit,
    convertMeasurementsInText,
} from "../components/unitConverter.js";
import { convertTemperature } from "../components/temperatureConverter.js";
import {
    renderEquipmentTags,
    renderDietaryTags,
} from "../utils/recipeUtils.js";
import { createPrintButton } from "../components/PDFDownload.js";

let currentRecipe = null;

export const renderRecipeDetails = (recipe) => {
    currentRecipe = recipe;

    if (!recipe || typeof recipe !== "object") {
        return "<div class=\"error\">Recipe details not available</div>";
    }

    // Header
    const recipeHeader = `
        <div class="recipe-header">
            <div class="header-content">
                <h2>${recipe.title}</h2>
                <div class="recipe-meta">
                    <span>⏲️ ${recipe.readyInMinutes} minutes</span>
                    <span>🍽️ ${recipe.servings} servings</span>
                </div>
            </div>
            <div class="header-image">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
        </div>
    `;

    // Image and tags
    const recipeTagsSection = `
        <div class="recipe-tags">
            <div class="tags-group">
                <div class="tags-content">
                    ${renderDietaryTags(recipe)}
                </div>
            </div>
            <div class="tags-group">
                <div class="tags-content">
                    ${renderEquipmentTags(recipe)}
                </div>
            </div>
        </div>
        ${createPrintButton()}
        <div class="recipe-source">
            <p>Source: <a href="${recipe.source?.url || "#"}" target="_blank">
                ${recipe.source?.name || recipe.source?.credits || "Unknown"}
            </a></p>
        </div>
    `;

    // Ingredients
    const hasConvertibleMeasurements = (ingredients) => {
        if (!Array.isArray(ingredients)) return false;

        return ingredients.some((ingredient) => {
            const usUnit = ingredient.measures?.us?.unitShort;
            const metricUnit = ingredient.measures?.metric?.unitShort;

            return (
                (usUnit && metricUnit && usUnit !== metricUnit) ||
                ingredient.measures?.us?.amount !==
                    ingredient.measures?.metric?.amount
            );
        });
    };

    const recipeIngredients = `
        <div class="recipe-ingredients">
            <div class="ingredients-header">
                <h2>Ingredients</h2>
                ${
    hasConvertibleMeasurements(
        recipe.ingredients || recipe.extendedIngredients
    )
        ? `<button id="unit-toggle" class="unit-toggle-btn">
                           Switch to ${getCurrentUnit() === "us" ? "Metric" : "US"}
                       </button>`
        : ""
}
            </div>
            <ul id="ingredients-list">
                ${renderIngredients(recipe.ingredients || recipe.extendedIngredients)}
            </ul>
        </div>
    `;

    // Instructions
    const recipeInstructions = `
        <div class="recipe-instructions">
            <h2>Instructions</h2>
            ${renderInstructions(recipe.instructions || recipe.analyzedInstructions)}
        </div>
    `;

    // Combined
    return `
        <div class="recipe-details-content">
            ${recipeHeader}
            
            <div class="recipe-content">
                ${recipeTagsSection}
                
                <div class="recipe-info">
                    ${recipeIngredients}
                    ${recipeInstructions}
                </div>
            </div>
        </div>
    `;
};

const renderIngredients = (ingredients) => {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return "<li>No ingredients available</li>";
    }

    return ingredients
        .map((ingredient) => {
            const { amount, unit } = formatMeasurement(ingredient);
            const name = ingredient.originalName || ingredient.name || "";
            return `<li>${amount} ${unit} ${name}</li>`;
        })
        .join("");
};

const handleUnitToggle = () => {
    const newUnit = toggleUnit();
    const toggleBtn = document.getElementById("unit-toggle");
    const ingredientsList = document.getElementById("ingredients-list");
    const instructionsContainer = document.querySelector(
        ".recipe-instructions"
    );

    if (toggleBtn && ingredientsList) {
        toggleBtn.textContent = `Switch to ${newUnit === "us" ? "Metric" : "US"}`;

        if (currentRecipe) {
            // Update ingredients
            ingredientsList.innerHTML = renderIngredients(
                currentRecipe.ingredients || currentRecipe.extendedIngredients
            );

            // Update instructions with converted temperatures
            if (instructionsContainer) {
                instructionsContainer.innerHTML = `
                    <h2>Instructions</h2>
                    ${renderInstructions(currentRecipe.instructions || currentRecipe.analyzedInstructions)}
                `;
            }
        } else {
            return "No recipe data available";
        }
    }
};

const setupUnitToggle = () => {
    const toggleBtn = document.getElementById("unit-toggle");

    if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleUnitToggle);
        toggleBtn.addEventListener("click", handleUnitToggle);
    } else {
        return "Toggle button not found";
    }
};

const renderInstructions = (instructions) => {
    if (!instructions) {
        return "<p>No instructions available</p>";
    }

    const currentUnit = getCurrentUnit();

    if (typeof instructions === "string") {
        // Apply both conversions in sequence
        let convertedText = instructions;
        convertedText = convertMeasurementsInText(convertedText);
        convertedText = convertTemperature(convertedText, currentUnit);

        if (convertedText.includes("<ol>") || convertedText.includes("<ul>")) {
            return `<div class="instruction-steps">${convertedText}</div>`;
        }
        const steps = convertedText.split("\n").filter((step) => step.trim());
        return `
            <ol class="instruction-steps">
                ${steps.map((step) => `<li>${step}</li>`).join("")}
            </ol>
        `;
    }

    if (Array.isArray(instructions) && instructions.length > 0) {
        const allSteps = [];

        instructions.forEach((section) => {
            if (
                section.name &&
                section.name.length > 0 &&
                !section.name.match(/^(crust|filling|sauce|topping)$/i)
            ) {
                const convertedName = convertTemperature(
                    convertMeasurementsInText(section.name),
                    currentUnit
                );
                allSteps.push(convertedName);
            }

            if (Array.isArray(section.steps)) {
                section.steps.forEach((step) => {
                    if (step.step) {
                        const convertedStep = convertTemperature(
                            convertMeasurementsInText(step.step),
                            currentUnit
                        );
                        allSteps.push(convertedStep);
                    }
                });
            }
        });

        if (allSteps.length > 0) {
            return `
                <ol class="instruction-steps">
                    ${allSteps.map((step) => `<li>${step}</li>`).join("")}
                </ol>
            `;
        }
    }

    return "<p>No instructions available</p>";
};

export default renderRecipeDetails;
export { setupUnitToggle };
