import { API_CONFIG } from "../../constants/apiConfig.js";
import { getCachedResponse, cacheResponse } from "../cache/bookCache.js";
import { processBook } from "../../utils/bookUtils.js";

export async function getDailyBook() {
    try {
        const cachedResponse = getCachedResponse();

        if (cachedResponse) {
            return processBook(cachedResponse.books[0][0]);
        }

        const randomOffset = Math.floor(Math.random() * 1000) + 1;
        const url = `${API_CONFIG.BIGBOOK.BASE_URL}${API_CONFIG.BIGBOOK.ENDPOINTS.SEARCH_BOOKS}?api-key=${API_CONFIG.BIGBOOK.API_KEY}&number=1&offset=${randomOffset}&genres=${API_CONFIG.BIGBOOK.PARAMS.DEFAULT_GENRES}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        cacheResponse(data);

        if (data && data.books && data.books[0] && data.books[0][0]) {
            return processBook(data.books[0][0]);
        }

        return null;
    } catch {
        return null;
    }
}
