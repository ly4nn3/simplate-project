import { API_CONFIG } from "../../constants/apiConfig.js";
import { getCachedRecipes, cacheRecipes } from "../cache/recipeCache.js";
import { getRequiredAppliances } from "../../utils/equipmentUtils.js";
import { processRecipe } from "../../utils/recipeUtils.js";

export async function getRecipesByAppliance(applianceType) {
    try {
        // Log cache check
        const cachedRecipes = getCachedRecipes();
        console.log('Cache status:', cachedRecipes ? 'Found cached recipes' : 'No cached recipes');

        if (cachedRecipes) {
            if (applianceType) {
                return cachedRecipes.filter((recipe) => {
                    const requiredAppliances = getRequiredAppliances(recipe);
                    return requiredAppliances.has(applianceType.toLowerCase());
                });
            }
            return cachedRecipes;
        }

        // Log API request
        console.log('Making API request...');
        const response = await fetch(
            `${API_CONFIG.SPOONACULAR.BASE_URL}${API_CONFIG.SPOONACULAR.ENDPOINTS.RANDOM_RECIPES}?number=${API_CONFIG.SPOONACULAR.PARAMS.DEFAULT_RECIPE_COUNT}&apiKey=${API_CONFIG.SPOONACULAR.API_KEY}`
        );

        console.log('API response status:', response.status);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received recipes count:', data.recipes?.length || 0);

        // Process recipes
        if (data.recipes && Array.isArray(data.recipes)) {
            const processedRecipes = data.recipes.map(processRecipe);

            cacheRecipes(processedRecipes);

            // Return filtered/all recipes
            if (applianceType) {
                return processedRecipes.filter((recipe) => {
                    const requiredAppliances = getRequiredAppliances(recipe);
                    return requiredAppliances.has(applianceType.toLowerCase());
                });
            }

            return processedRecipes;
        }

        return [];
    } catch (error) {
        console.error('Recipe service error:', error);
        return [];
    }
}
