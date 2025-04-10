import { API_CONFIG } from "../../constants/apiConfig.js";
import { getCachedRecipes, cacheRecipes } from "../cache/recipeCache.js";
import { getRequiredAppliances } from "../../utils/equipmentUtils.js";
import { processRecipe } from "../../utils/recipeUtils.js";

export async function getRecipesByAppliance(applianceType) {
    try {
        // Check cache first
        const cachedRecipes = getCachedRecipes();

        if (cachedRecipes) {
            if (applianceType) {
                return cachedRecipes.filter((recipe) => {
                    const requiredAppliances = getRequiredAppliances(recipe);
                    return requiredAppliances.has(applianceType.toLowerCase());
                });
            }
            return cachedRecipes;
        }

        const response = await fetch(
            `${API_CONFIG.SPOONACULAR.BASE_URL}${API_CONFIG.SPOONACULAR.ENDPOINTS.RANDOM_RECIPES}?number=${API_CONFIG.SPOONACULAR.PARAMS.DEFAULT_RECIPE_COUNT}&apiKey=${API_CONFIG.SPOONACULAR.API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

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
    } catch {
        return [];
    }
}
