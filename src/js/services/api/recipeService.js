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

export async function getRecipeById(recipeId, applianceType) {
    try {
        const cachedResponse = getCachedResponse();
        
        if (cachedResponse && cachedResponse.recipes) {
            const cachedRecipe = cachedResponse.recipes.find(
                recipe => recipe.id === parseInt(recipeId)
            );
            
            if (cachedRecipe) {
                const processed = processRecipe(cachedRecipe);
                if (applianceType) {
                    processed.equipment = {
                        ...processed.equipment,
                        primary: applianceType
                    };
                }
                return processed;
            }
        }
        
        // If not in cache, fetch API
        const response = await fetch(
            `${API_CONFIG.SPOONACULAR.BASE_URL}/recipes/${recipeId}/information?apiKey=${API_CONFIG.SPOONACULAR.API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const recipeData = await response.json();
        
        try {
            const existingCache = getCachedResponse() || { recipes: [] };
            
            const recipeIndex = existingCache.recipes.findIndex(r => r.id === parseInt(recipeId));
            
            if (recipeIndex >= 0) {
                existingCache.recipes[recipeIndex] = recipeData;
            } else {
                existingCache.recipes.push(recipeData);
            }
            
            cacheResponse(existingCache);
        } catch {
            return [];
        }
        
        const processed = processRecipe(recipeData);
        if (applianceType) {
            processed.equipment = {
                ...processed.equipment,
                primary: applianceType
            };
        }
        return processed;
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        throw error;
    }
}