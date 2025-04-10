// Debug the current environment
console.log('Vercel Environment:', {
    env: import.meta.env.VITE_VERCEL_ENV,
    targetEnv: import.meta.env.VITE_VERCEL_TARGET_ENV,
    url: import.meta.env.VITE_VERCEL_URL
});

export const API_CONFIG = {
    SPOONACULAR: {
        BASE_URL: "https://api.spoonacular.com",
        API_KEY: (() => {
            // Log environment info
            const env = import.meta.env.VITE_VERCEL_ENV;
            const apiKey = import.meta.env.VITE_SPOONACULAR;
            
            console.log(`Current environment: ${env}`);
            console.log(`API Key ${apiKey ? 'exists' : 'is missing'}`);
            
            // You might want to handle different environments differently
            if (env === 'preview' || env === 'development') {
                // Additional preview/development specific logic if needed
            }
            
            return apiKey;
        })(),
        ENDPOINTS: {
            RANDOM_RECIPES: "/recipes/random",
        },
        PARAMS: {
            DEFAULT_RECIPE_COUNT: 100,
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
