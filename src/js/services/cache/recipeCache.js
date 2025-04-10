import { CACHE_KEYS, CACHE_DURATION } from "../../constants/apiConfig.js";

export function getCachedRecipes() {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.RECIPES);

        if (!cached) {
            return null;
        }

        const parsedCache = JSON.parse(cached);

        if (
            !parsedCache.recipes ||
            !parsedCache.timestamp ||
            Date.now() - parsedCache.timestamp > CACHE_DURATION.RECIPES
        ) {
            localStorage.removeItem(CACHE_KEYS.RECIPES);
            return null;
        }

        return parsedCache.recipes;
    } catch {
        localStorage.removeItem(CACHE_KEYS.RECIPES);
        return null;
    }
}

export function cacheRecipes(recipes) {
    try {
        if (!Array.isArray(recipes) || !recipes.length) {
            throw new Error("Invalid recipes data for caching");
        }

        const cacheData = {
            recipes,
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEYS.RECIPES, JSON.stringify(cacheData));
        return true;
    } catch {
        localStorage.removeItem(CACHE_KEYS.RECIPES);
        return false;
    }
}
