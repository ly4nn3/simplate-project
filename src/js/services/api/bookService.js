import { API_CONFIG } from "../../constants/apiConfig.js";
import { getCachedResponse, cacheResponse } from "../cache/bookCache.js";
import { processBook } from "../../utils/bookUtils.js";

const { BIGBOOK } = API_CONFIG;

export async function getDailyBook() {
    try {
        const cachedResponse = getCachedResponse();
        if (cachedResponse?.books?.[0]?.[0]) {
            return processBook(cachedResponse.books[0][0]);
        }

        const randomOffset = Math.floor(Math.random() * 1000) + 1;
        const url = new URL(
            `${BIGBOOK.BASE_URL}${BIGBOOK.ENDPOINTS.SEARCH_BOOKS}`
        );

        url.searchParams.append("api-key", BIGBOOK.API_KEY);
        url.searchParams.append("number", "1");
        url.searchParams.append("offset", randomOffset);
        url.searchParams.append("genres", BIGBOOK.PARAMS.DEFAULT_GENRES);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        cacheResponse(data);

        return data?.books?.[0]?.[0] ? processBook(data.books[0][0]) : null;
    } catch {
        return null;
    }
}
