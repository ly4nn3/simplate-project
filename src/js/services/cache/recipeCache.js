import { CACHE_KEYS, CACHE_DURATION } from "../../constants/apiConfig.js";

export function getCachedResponse() {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.RECIPES);

        if (!cached) {
            return null;
        }

        const parsedCache = JSON.parse(cached);

        if (
            !parsedCache.data ||
            !parsedCache.timestamp ||
            Date.now() - parsedCache.timestamp > CACHE_DURATION.RECIPES
        ) {
            localStorage.removeItem(CACHE_KEYS.RECIPES);
            return null;
        }

        return parsedCache.data;
    } catch {
        localStorage.removeItem(CACHE_KEYS.RECIPES);
        return null;
    }
}

export function cacheResponse(data) {
    try {
        if (!data || !data.recipes || !Array.isArray(data.recipes)) {
            throw new Error("Invalid API response data for caching");
        }

        const cacheData = {
            data,
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEYS.RECIPES, JSON.stringify(cacheData));
        return true;
    } catch {
        localStorage.removeItem(CACHE_KEYS.RECIPES);
        return false;
    }
}
