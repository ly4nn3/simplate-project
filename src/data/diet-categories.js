export const DIET_CATEGORIES = {
    normal: {
        display: "Normal",
        className: "normal",
    },
    "gluten free": {
        display: "Gluten Free",
        className: "gluten-free",
    },
    ketogenic: {
        display: "Keto",
        className: "keto",
    },
    "lacto ovo vegetarian": {
        display: "Vegetarian",
        className: "vegetarian",
    },
    vegan: {
        display: "Vegan",
        className: "vegan",
    },
    "dairy free": {
        display: "Dairy Free",
        className: "dairy-free",
    },
    primal: {
        display: "Primal",
        className: "primal",
    },
    paleolithic: {
        display: "Paleo",
        className: "paleo",
    },
    pescatarian: {
        display: "Pescatarian",
        className: "pescatarian",
    },
    "whole 30": {
        display: "Whole30",
        className: "whole30",
    },
    "fodmap friendly": {
        display: "Low FODMAP",
        className: "low-fodmap",
    },
};

export const getDietDisplayName = (dietKey) => {
    const diet = DIET_CATEGORIES[dietKey.toLowerCase()];
    return diet ? diet.display : dietKey;
};

export const getDietClassName = (dietKey) => {
    const diet = DIET_CATEGORIES[dietKey.toLowerCase()];
    return diet ? diet.className : dietKey.toLowerCase().replace(/\s+/g, "-");
};

export const getAllDietOptions = () => {
    return Object.values(DIET_CATEGORIES).map((diet) => ({
        value: diet.className,
        label: diet.display,
    }));
};
