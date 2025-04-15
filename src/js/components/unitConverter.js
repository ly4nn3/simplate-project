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

export const convertMeasurementsInText = (text) => {
    if (!text) return text;

    let convertedText = text;

    const conversions = {
        cup: { metric: 240, unit: "ml" }, // 1 cup = 240ml
        tbsp: { metric: 15, unit: "ml" }, // 1 tbsp = 15ml
        tsp: { metric: 5, unit: "ml" }, // 1 tsp = 5ml
        oz: { metric: 28.35, unit: "g" }, // 1 oz = 28.35g
        lb: { metric: 453.592, unit: "g" }, // 1 lb = 453.592g
    };

    if (currentUnit === "metric") {
        convertedText = convertedText
            .replace(
                /(\d+(?:\.\d+)?)\s*(?:cup|cups|c\.)\b/gi,
                (match, amount) => {
                    const ml = Math.round(
                        parseFloat(amount) * conversions.cup.metric
                    );
                    return `${ml}${conversions.cup.unit}`;
                }
            )
            .replace(
                /(\d+(?:\.\d+)?)\s*(?:tablespoon|tablespoons|tbsp|T\.)\b/gi,
                (match, amount) => {
                    const ml = Math.round(
                        parseFloat(amount) * conversions.tbsp.metric
                    );
                    return `${ml}${conversions.tbsp.unit}`;
                }
            )
            .replace(
                /(\d+(?:\.\d+)?)\s*(?:teaspoon|teaspoons|tsp|t\.)\b/gi,
                (match, amount) => {
                    const ml = Math.round(
                        parseFloat(amount) * conversions.tsp.metric
                    );
                    return `${ml}${conversions.tsp.unit}`;
                }
            )
            .replace(
                /(\d+(?:\.\d+)?)\s*(?:ounce|ounces|oz)\b/gi,
                (match, amount) => {
                    const g = Math.round(
                        parseFloat(amount) * conversions.oz.metric
                    );
                    return `${g}${conversions.oz.unit}`;
                }
            )
            .replace(
                /(\d+(?:\.\d+)?)\s*(?:pound|pounds|lb)\b/gi,
                (match, amount) => {
                    const g = Math.round(
                        parseFloat(amount) * conversions.lb.metric
                    );
                    return `${g}${conversions.lb.unit}`;
                }
            );
    } else {
        convertedText = convertedText
            .replace(
                /(\d+(?:\.\d+)?)\s*(?:ml|milliliters)\b/gi,
                (match, amount) => {
                    const ml = parseFloat(amount);
                    if (ml >= 240) {
                        const cups = (ml / conversions.cup.metric).toFixed(1);
                        return `${cups} cups`;
                    } else if (ml >= 15) {
                        const tbsp = Math.round(ml / conversions.tbsp.metric);
                        return `${tbsp} tablespoons`;
                    } else {
                        const tsp = Math.round(ml / conversions.tsp.metric);
                        return `${tsp} teaspoons`;
                    }
                }
            )
            .replace(/(\d+(?:\.\d+)?)\s*(?:g|grams)\b/gi, (match, amount) => {
                const g = parseFloat(amount);
                if (g >= 453.592) {
                    const lbs = (g / conversions.lb.metric).toFixed(1);
                    return `${lbs} lb`;
                } else {
                    const oz = (g / conversions.oz.metric).toFixed(1);
                    return `${oz} oz`;
                }
            });
    }

    return convertedText;
};
