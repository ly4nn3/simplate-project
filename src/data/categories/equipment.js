export const EQUIPMENT_CATEGORIES = {
    essential: [
        "knife",
        "chef's knife",
        "measuring cup",
        "measuring spoon",
        "bowl",
        "mixing bowl",
        "colander",
        "can opener",
        "peeler",
    ],
    optional: [
        "whisk",
        "grater",
        "box grater",
        "ladle",
        "tongs",
        "spatula",
        "slotted spoon",
        "kitchen scissors",
        "rolling pin",
        "sieve",
    ],
    specialized: [
        "ice cream machine",
        "food processor",
        "hand mixer",
        "stand mixer",
        "pressure cooker",
        "instant pot",
        "slow cooker",
        "bread machine",
        "pasta machine",
        "deep fryer",
        "airfryer",
        "waffled iron",
        "mandoline",
        "immersion blender",
        "panini press",
        "dehydrator",
        "blow torch",
        "meat grinder",
        "pizza stone",
        "grill",
    ],
};

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
