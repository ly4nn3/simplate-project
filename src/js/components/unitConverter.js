let currentUnit = "us";

export const toggleUnit = () => {
    currentUnit = currentUnit === "us" ? "metric" : "us";
    return currentUnit;
};

export const getCurrentUnit = () => {
    return currentUnit;
};

export const formatMeasurement = (ingredient) => {
    if (!ingredient.measures) {
        return {
            amount: ingredient.amount || "",
            unit: ingredient.unit || "",
        };
    }

    const measurement = ingredient.measures[currentUnit];

    if (!measurement) {
        return {
            amount: ingredient.amount || "",
            unit: ingredient.unit || "",
        };
    }

    if (
        ["handful", "large", "sprig", "cloves", ""].includes(
            measurement.unitLong
        )
    ) {
        return {
            amount: ingredient.amount || "",
            unit: ingredient.unit || "",
        };
    }

    return {
        amount: measurement.amount || "",
        unit: measurement.unitShort || "",
    };
};
