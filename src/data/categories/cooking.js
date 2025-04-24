export const COOKING_CATEGORIES = {
    stove: {
        methods: [
            "simmer", "boil", "fry", "saute", "cook over",
            "heat oil", "high heat", "medium heat", "low heat",
        ],
        ingredients: [
            "pasta", "noodle", "spaghetti", "fettuccine", "linguine",
            "penne", "bigoli", "risotto",
        ],
        dishes: []
    },

    oven: {
        methods: [
            "bake", "roast", "broil", "preheat",
            "°f", "°c", "degrees",
        ],
        ingredients: [
            "baked potato", "roasted potato", "baked sweet potato",
            "roasted sweet potato",
        ],
        dishes: [
            "muffin", "cake", "bread", "cookie", "pie",
            "pastry", "brownie", "roasted", "gratin", "soufflé",
        ]
    },

    microwave: {
        methods: [
            "microwave", "90 second", "90 seconds", "minute and a half",
            "1 min 30 sec",
        ],
        dishes: ["90 second cookie", "microwave cookie", "mug cake"]
    },

    board: {
        methods: ["chop", "dice", "slice", "cut", "mince"]
    },

    ricecooker: {
        methods: ["rice cooker"]
    }
};

export const COOKING_PRIORITY = [
    "stove",
    "oven",
    "microwave",
    "board",
    "ricecooker"
];