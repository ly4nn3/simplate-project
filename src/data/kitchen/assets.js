export const KITCHEN_ASSETS = {
    sprites: {
        base: { yPos: -2, alwaysVisible: true },
        board: { yPos: -726 },
        book: { yPos: -1450, alwaysVisible: true },
        microwave: { yPos: -2174 },
        oven: { yPos: -2898 },
        ricecooker: { yPos: -3622 },
        stove: { yPos: -4346 },
    },

    equipment: {
        stove: {
            equipment: [
                "pot",
                "frying pan",
                "wok",
                "saucepan",
                "dutch oven",
                "skillet",
            ],
            selector: ".stove-active",
        },
        oven: {
            equipment: [
                "baking pan",
                "baking sheet",
                "casserole dish",
                "roasting pan",
            ],
            selector: ".oven-active",
        },
        microwave: {
            equipment: ["microwave-safe dish", "microwave plate"],
            selector: ".microwave-active",
        },
        board: {
            equipment: ["cutting board", "chopping board"],
            selector: ".board-active",
        },
        ricecooker: {
            equipment: ["rice cooker"],
            selector: ".ricecooker-active",
        },
    },
};
