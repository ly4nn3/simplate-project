import { CACHE_KEYS, CACHE_DURATION } from "../../constants/apiConfig.js";

export function getCachedResponse() {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.BOOKS);

        if (!cached) {
            return null;
        }

        const parsedCache = JSON.parse(cached);

        if (
            !parsedCache.data ||
            !parsedCache.timestamp ||
            Date.now() - parsedCache.timestamp > CACHE_DURATION.BOOKS
        ) {
            localStorage.removeItem(CACHE_KEYS.BOOKS);
            return null;
        }

        return parsedCache.data;
    } catch {
        localStorage.removeItem(CACHE_KEYS.BOOKS);
        return null;
    }
}

export function cacheResponse(data) {
    try {
        if (!data || !data.books || !Array.isArray(data.books)) {
            throw new Error("Invalid API response data for caching");
        }

        const cacheData = {
            data,
            timestamp: Date.now(),
            viewed: false,
        };

        localStorage.setItem(CACHE_KEYS.BOOKS, JSON.stringify(cacheData));
        return true;
    } catch {
        localStorage.removeItem(CACHE_KEYS.BOOKS);
        return false;
    }
}

export function markBookAsViewed() {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.BOOKS);
        if (cached) {
            const parsedCache = JSON.parse(cached);
            parsedCache.viewed = true;
            localStorage.setItem(CACHE_KEYS.BOOKS, JSON.stringify(parsedCache));
        }
    } catch {
        return null;
    }
}
