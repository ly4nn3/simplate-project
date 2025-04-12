import { renderEquipmentTags } from "../utils/recipeUtils.js";

export const renderDietaryTags = (recipe) => {
    if (!recipe || !recipe.dietary) return '';
    
    const dietTags = [];
    
    if (recipe.dietary.glutenFree) dietTags.push('<span class="diet-tag gluten-free">Gluten Free</span>');
    if (recipe.dietary.dairyFree) dietTags.push('<span class="diet-tag dairy-free">Dairy Free</span>');
    if (recipe.dietary.vegetarian) dietTags.push('<span class="diet-tag vegetarian">Vegetarian</span>');
    if (recipe.dietary.vegan) dietTags.push('<span class="diet-tag vegan">Vegan</span>');
    if (recipe.dietary.lowFodmap) dietTags.push('<span class="diet-tag low-fodmap">Low FODMAP</span>');
    
    // Check diets
    if (Array.isArray(recipe.dietary.diets)) {
        recipe.dietary.diets.forEach(diet => {
            switch(diet.toLowerCase()) {
                case 'paleolithic':
                case 'paleo':
                    dietTags.push('<span class="diet-tag paleo">Paleo</span>');
                    break;
                case 'primal':
                    dietTags.push('<span class="diet-tag primal">Primal</span>');
                    break;
                case 'whole 30':
                    dietTags.push('<span class="diet-tag whole30">Whole30</span>');
                    break;
                case 'ketogenic':
                    dietTags.push('<span class="diet-tag keto">Keto</span>');
                    break;
            }
        });
    }
    
    return dietTags.length > 0 
        ? `<div class="dietary-tags">${dietTags.join('')}</div>` 
        : '';
};

export const renderRecipeDetails = (recipe) => {
    if (!recipe || typeof recipe !== "object") {
        return `<div class="error">Recipe details not available</div>`;
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

        <div class="recipe-source">
            <p>Source: <a href="${recipe.source?.url || '#'}" target="_blank">
                ${recipe.source?.name || recipe.source?.credits || 'Unknown'}
            </a></p>
        </div>
    `;

    // Ingredients
    const recipeIngredients = `
        <div class="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul>
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
        return '<li>No ingredients available</li>';
    }
    
    return ingredients.map(ingredient => {
        const amount = ingredient.amount || '';
        const unit = ingredient.unit || '';
        const name = ingredient.originalName || ingredient.name || '';
        
        return `<li>${amount} ${unit} ${name}</li>`;
    }).join('');
};

const renderInstructions = (instructions) => {
    if (!instructions) {
        return '<p>No instructions available</p>';
    }
    
    if (typeof instructions === 'string') {
        if (instructions.includes('<ol>') || instructions.includes('<ul>')) {
            return `<div class="instruction-steps">${instructions}</div>`;
        }
        const steps = instructions.split('\n').filter(step => step.trim());
        return `
            <ol class="instruction-steps">
                ${steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
    }
    
    if (Array.isArray(instructions) && instructions.length > 0) {
        const allSteps = [];
        
        instructions.forEach(section => {
            if (section.name && section.name.length > 0 && 
                !section.name.match(/^(crust|filling|sauce|topping)$/i)) {
                allSteps.push(section.name);
            }
            
            if (Array.isArray(section.steps)) {
                section.steps.forEach(step => {
                    if (step.step) {
                        allSteps.push(step.step);
                    }
                });
            }
        });

        if (allSteps.length > 0) {
            return `
                <ol class="instruction-steps">
                    ${allSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            `;
        }
    }
    
    return '<p>No instructions available</p>';
};

export default renderRecipeDetails;