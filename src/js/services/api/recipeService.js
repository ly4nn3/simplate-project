import { API_CONFIG } from "../../constants/apiConfig.js";
import { getCachedRecipes, cacheRecipes } from "../cache/recipeCache.js";
import { getRequiredAppliances } from "../../utils/equipmentUtils.js";
import { processRecipe } from "../../utils/recipeUtils.js";

export async function getRecipesByAppliance(applianceType) {
    try {
        // Check cache first
        const cachedRecipes = getCachedRecipes();
        console.log('Cache check:', {
            hasCachedRecipes: !!cachedRecipes,
            recipesCount: cachedRecipes?.length
        });

        if (cachedRecipes) {
            if (applianceType) {
                return cachedRecipes.filter((recipe) => {
                    const requiredAppliances = getRequiredAppliances(recipe);
                    return requiredAppliances.has(applianceType.toLowerCase());
                });
            }
            return cachedRecipes;
        }

        // Log the API request URL (remove API key for security)
        const apiUrl = `${API_CONFIG.SPOONACULAR.BASE_URL}${API_CONFIG.SPOONACULAR.ENDPOINTS.RANDOM_RECIPES}?number=${API_CONFIG.SPOONACULAR.PARAMS.DEFAULT_RECIPE_COUNT}&apiKey=${API_CONFIG.SPOONACULAR.API_KEY}`;
        console.log('Fetching from:', apiUrl.replace(API_CONFIG.SPOONACULAR.API_KEY, 'HIDDEN_KEY'));

        const response = await fetch(apiUrl);
        
        console.log('API Response:', {
            status: response.status,
            ok: response.ok,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('API Data:', {
            hasRecipes: !!data.recipes,
            recipesCount: data.recipes?.length,
            sampleRecipe: data.recipes?.[0] ? {
                title: data.recipes[0].title,
                hasInstructions: !!data.recipes[0].analyzedInstructions?.length,
                instructionsCount: data.recipes[0].analyzedInstructions?.length
            } : null
        });

        // Process recipes
        if (data.recipes && Array.isArray(data.recipes)) {
            const processedRecipes = data.recipes.map(processRecipe);
            console.log('Processed recipes:', {
                count: processedRecipes.length,
                sampleProcessed: processedRecipes[0] ? {
                    title: processedRecipes[0].title,
                    hasInstructions: !!processedRecipes[0].instructions?.length
                } : null
            });


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
