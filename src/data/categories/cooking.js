export const COOKING_CATEGORIES = {
    stove: {
        methods: [
            "simmer",
            "boil",
            "fry",
            "saute",
            "cook over",
            "heat oil",
            "high heat",
            "medium heat",
            "low heat",
            "pot",
            "pan",
            " skillet",
            "melt",
            "stir",
        ],
        ingredients: [
            "pasta",
            "noodle",
            "spaghetti",
            "fettuccine",
            "linguine",
            "penne",
            "bigoli",
            "risotto",
        ],
        dishes: ["sauce", "gravy"],
    },

    oven: {
        methods: [
            "bake",
            "roast",
            "broil",
            "preheat",
            "°f",
            "°c",
            "degrees",
            "oven",
        ],
        ingredients: [
            "baked potato",
            "roasted potato",
            "baked sweet potato",
            "roasted sweet potato",
        ],
        dishes: [
            "muffin",
            "cake",
            "bread",
            "cookie",
            "pie",
            "pastry",
            "brownie",
            "roasted",
            "gratin",
            "soufflé",
            "pudding",
            "casserole",
            "lasagna",
            "quiche",
        ],
    },

    microwave: {
        methods: [
            "microwave",
            "90 second",
            "90 seconds",
            "minute and a half",
            "1 min 30 sec",
        ],
        dishes: ["90 second cookie", "microwave cookie", "mug cake"],
    },

    board: {
        methods: ["chop", "dice", "slice", "cut", "mince"],
    },

    ricecooker: {
        methods: ["rice cooker"],
    },
};

export const COOKING_PRIORITY = [
    "stove",
    "oven",
    "microwave",
    "board",
    "ricecooker",
];

export const COOKING_COMBOS = {
    "stove+oven": ["stove", "oven"],
    "oven+stove": ["oven", "stove"],

    "stove+board": ["stove", "board"],
    "oven+board": ["oven", "board"],
};

export const COMBO_INDICATORS = {
    "stove+oven": [
        "transfer to oven",
        "place in oven",
        "move to oven",
        "pour into baking",
        "bake for",
        "into a baking",
    ],

    "oven+stove": ["sauté", "saute", "heat a pan", "on the stove"],
};
