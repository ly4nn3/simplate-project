import { API_CONFIG } from "../../constants/apiConfig.js";
import { getCachedResponse, cacheResponse } from "../cache/recipeCache.js";
import { processRecipe } from "../../utils/recipeUtils.js";

export async function getRecipesByAppliance(applianceType) {
    try {
        const cachedResponse = getCachedResponse();

        if (cachedResponse) {
            const processedRecipes = cachedResponse.recipes.map(processRecipe);

            if (applianceType) {
                return processedRecipes.filter(
                    (recipe) =>
                        recipe.equipment.primary === applianceType.toLowerCase()
                );
            }
            return processedRecipes;
        }

        const response = await fetch(
            `${API_CONFIG.SPOONACULAR.BASE_URL}${API_CONFIG.SPOONACULAR.ENDPOINTS.RANDOM_RECIPES}?number=${API_CONFIG.SPOONACULAR.PARAMS.DEFAULT_RECIPE_COUNT}&apiKey=${API_CONFIG.SPOONACULAR.API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        cacheResponse(data);

        if (data.recipes && Array.isArray(data.recipes)) {
            const processedRecipes = data.recipes.map(processRecipe);

            if (applianceType) {
                return processedRecipes.filter(
                    (recipe) =>
                        recipe.equipment.primary === applianceType.toLowerCase()
                );
            }

            return processedRecipes;
        }

        return [];
    } catch {
        return [];
    }
}
