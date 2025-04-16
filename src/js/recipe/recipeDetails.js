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
const conversionCache = new Map();
const SECTION_NAME_REGEX = /^(crust|filling|sauce|topping)$/i;

const createRecipeHeader = ({ title, readyInMinutes, servings, image }) => `
    <div class="recipe-header">
        <div class="header-content">
            <h2>${title}</h2>
            <div class="recipe-meta">
                <span>⏲️ ${readyInMinutes}m</span>
                <span>🍽️ ${servings}</span>
            </div>
        </div>
        <div class="header-image">
            <img loading="lazy" src="${image}" alt="${title}">
        </div>
    </div>`;

const createRecipeTagsSection = (recipe) => `
    <div class="recipe-tags">
        <div class="tags-group">
            <div class="tags-content">${renderDietaryTags(recipe)}</div>
        </div>
        <div class="tags-group">
            <div class="tags-content">${renderEquipmentTags(recipe)}</div>
        </div>
    </div>
    ${createPrintButton()}
    <div class="recipe-source">
        <p>Source: <a href="${recipe.source?.url || "#"}" target="_blank">
            ${recipe.source?.name || recipe.source?.credits || "Unknown"}
        </a></p>
    </div>`;

const hasConvertibleMeasurements = (ingredients) => {
    if (!Array.isArray(ingredients)) return false;

    // Check only first few ingredients for performance
    const checkLimit = Math.min(ingredients.length, 3);
    for (let i = 0; i < checkLimit; i++) {
        const measures = ingredients[i].measures;
        if (
            measures?.us?.unitShort !== measures?.metric?.unitShort ||
            measures?.us?.amount !== measures?.metric?.amount
        ) {
            return true;
        }
    }
    return false;
};

const renderIngredients = (ingredients) => {
    if (!Array.isArray(ingredients) || !ingredients.length) {
        return "<li>No ingredients available</li>";
    }

    const result = [];
    for (let i = 0; i < ingredients.length; i++) {
        const { amount, unit } = formatMeasurement(ingredients[i]);
        const name = ingredients[i].originalName || ingredients[i].name || "";
        result.push(`<li>${amount} ${unit} ${name}</li>`);
    }
    return result.join("");
};

const processInstructions = (text, currentUnit) => {
    const cacheKey = `${text}-${currentUnit}`;
    let processed = conversionCache.get(cacheKey);

    if (!processed) {
        processed = convertTemperature(
            convertMeasurementsInText(text),
            currentUnit
        );
        conversionCache.set(cacheKey, processed);
    }
    return processed;
};

const renderInstructions = (instructions) => {
    if (!instructions) return "<p>No instructions available</p>";

    const currentUnit = getCurrentUnit();

    if (typeof instructions === "string") {
        const convertedText = processInstructions(instructions, currentUnit);
        if (convertedText.includes("<ol>") || convertedText.includes("<ul>")) {
            return convertedText;
        }

        const steps = convertedText
            .split("\n")
            .filter((step) => step.trim())
            .map((step) => `<li>${step}</li>`)
            .join("");
        return `<ol class="instruction-steps">${steps}</ol>`;
    }

    if (Array.isArray(instructions) && instructions.length) {
        const steps = [];

        for (const section of instructions) {
            if (
                section.name?.length &&
                !SECTION_NAME_REGEX.test(section.name)
            ) {
                steps.push(
                    `<li>${processInstructions(section.name, currentUnit)}</li>`
                );
            }

            if (Array.isArray(section.steps)) {
                for (const step of section.steps) {
                    if (step.step) {
                        steps.push(
                            `<li>${processInstructions(step.step, currentUnit)}</li>`
                        );
                    }
                }
            }
        }

        return steps.length
            ? `<ol class="instruction-steps">${steps.join("")}</ol>`
            : "<p>No instructions available</p>";
    }

    return "<p>No instructions available</p>";
};

export const renderRecipeDetails = (recipe) => {
    if (!recipe || typeof recipe !== "object") {
        return "<div class=\"error\">Recipe details not available</div>";
    }

    currentRecipe = recipe;
    const ingredients = recipe.ingredients || recipe.extendedIngredients;
    const showUnitToggle = hasConvertibleMeasurements(ingredients);

    const unitToggleButton = showUnitToggle
        ? `<button id="unit-toggle" class="unit-toggle-btn">
            Switch to ${getCurrentUnit() === "us" ? "Metric" : "US"}
           </button>`
        : "";

    return `
        <div class="recipe-details-content">
            ${createRecipeHeader(recipe)}
            <div class="recipe-content">
                ${createRecipeTagsSection(recipe)}
                <div class="recipe-info">
                    <div class="recipe-ingredients">
                        <div class="ingredients-header">
                            <h2>Ingredients</h2>
                            ${unitToggleButton}
                        </div>
                        <ul id="ingredients-list">${renderIngredients(ingredients)}</ul>
                    </div>
                    <div class="recipe-instructions">
                        <h2>Instructions</h2>
                        ${renderInstructions(recipe.instructions || recipe.analyzedInstructions)}
                    </div>
                </div>
            </div>
        </div>`;
};

const handleUnitToggle = () => {
    const newUnit = toggleUnit();
    const elements = {
        toggleBtn: document.getElementById("unit-toggle"),
        ingredientsList: document.getElementById("ingredients-list"),
        instructionsContainer: document.querySelector(".recipe-instructions"),
    };

    if (!currentRecipe || !elements.toggleBtn || !elements.ingredientsList)
        return;

    requestAnimationFrame(() => {
        elements.toggleBtn.textContent = `Switch to ${newUnit === "us" ? "Metric" : "US"}`;
        elements.ingredientsList.innerHTML = renderIngredients(
            currentRecipe.ingredients || currentRecipe.extendedIngredients
        );

        if (elements.instructionsContainer) {
            elements.instructionsContainer.innerHTML = `
                <h2>Instructions</h2>
                ${renderInstructions(currentRecipe.instructions || currentRecipe.analyzedInstructions)}`;
        }
    });
};

export const setupUnitToggle = () => {
    const toggleBtn = document.getElementById("unit-toggle");
    if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleUnitToggle);
        toggleBtn.addEventListener("click", handleUnitToggle);
    }
};

export const cleanup = () => {
    conversionCache.clear();
    currentRecipe = null;
};

export default renderRecipeDetails;
