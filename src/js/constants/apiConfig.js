export const API_CONFIG = {
    SPOONACULAR: {
        BASE_URL: "https://api.spoonacular.com",
        API_KEY: import.meta.env.VITE_SPOONACULAR,
        ENDPOINTS: {
            RANDOM_RECIPES: "/recipes/random",
        },
        PARAMS: {
            DEFAULT_RECIPE_COUNT: 100,
        },
    },
    BIGBOOK: {
        BASE_URL: "https://api.bigbookapi.com",
        API_KEY: import.meta.env.VITE_BIGBOOK,
        ENDPOINTS: {
            SEARCH_BOOKS: "/search-books",
        },
        PARAMS: {
            DEFAULT_GENRES: "cookbook,food,health,gardening",
        },
    },
};

export const CACHE_KEYS = {
    RECIPES: "cachedRecipes",
    BOOKS: "cachedBooks",
};

export const CACHE_DURATION = {
    RECIPES: 7 * 24 * 60 * 60 * 1000, // For 7 days
    BOOKS: 24 * 60 * 60 * 1000, // For 1 day
};
