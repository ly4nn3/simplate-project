// TODO: Weekly check to update more values
const CONVERSIONS = {
    volume: {
        cup: { metric: 240, unit: "ml" },
        tbsp: { metric: 15, unit: "ml" },
        tsp: { metric: 5, unit: "ml" },
    },
    weight: {
        oz: { metric: 28.35, unit: "g" },
        lb: { metric: 453.592, unit: "g" },
    },
};

const PATTERNS = {
    cup: /(\d+(?:\.\d+)?)\s*(?:cup|cups|c\.)\b/gi,
    tbsp: /(\d+(?:\.\d+)?)\s*(?:tablespoon|tablespoons|tbsp|T\.)\b/gi,
    tsp: /(\d+(?:\.\d+)?)\s*(?:teaspoon|teaspoons|tsp|t\.)\b/gi,
    oz: /(\d+(?:\.\d+)?)\s*(?:ounce|ounces|oz)\b/gi,
    lb: /(\d+(?:\.\d+)?)\s*(?:pound|pounds|lb)\b/gi,
    ml: /(\d+(?:\.\d+)?)\s*(?:ml|milliliters)\b/gi,
    g: /(\d+(?:\.\d+)?)\s*(?:g|grams)\b/gi,
};

const EXCLUDED_UNITS = new Set(["handful", "large", "sprig", "cloves", ""]);

let currentUnit = "us";

export const toggleUnit = () => {
    currentUnit = currentUnit === "us" ? "metric" : "us";
    return currentUnit;
};

export const getCurrentUnit = () => currentUnit;

export const formatMeasurement = (ingredient) => {
    if (!ingredient.measures) {
        return {
            amount: ingredient.amount || "",
            unit: ingredient.unit || "",
        };
    }

    const measurement = ingredient.measures[currentUnit];

    if (!measurement || EXCLUDED_UNITS.has(measurement.unitLong)) {
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

    if (currentUnit === "metric") {
        return convertToMetric(text);
    }
    return convertToUS(text);
};

function convertToMetric(text) {
    let result = text;

    // volumes
    Object.entries(CONVERSIONS.volume).forEach(([measure, conversion]) => {
        result = result.replace(PATTERNS[measure], (_, amount) => {
            const value = Math.round(parseFloat(amount) * conversion.metric);
            return `${value}${conversion.unit}`;
        });
    });

    // weights
    Object.entries(CONVERSIONS.weight).forEach(([measure, conversion]) => {
        result = result.replace(PATTERNS[measure], (_, amount) => {
            const value = Math.round(parseFloat(amount) * conversion.metric);
            return `${value}${conversion.unit}`;
        });
    });

    return result;
}

function convertToUS(text) {
    let result = text;

    // milliliters to cups/tbsp/tsp
    result = result.replace(PATTERNS.ml, (_, amount) => {
        const ml = parseFloat(amount);
        if (ml >= 240) {
            return `${(ml / CONVERSIONS.volume.cup.metric).toFixed(1)} cups`;
        }
        if (ml >= 15) {
            return `${Math.round(ml / CONVERSIONS.volume.tbsp.metric)} tablespoons`;
        }
        return `${Math.round(ml / CONVERSIONS.volume.tsp.metric)} teaspoons`;
    });

    // grams to pounds/ounces
    result = result.replace(PATTERNS.g, (_, amount) => {
        const g = parseFloat(amount);
        if (g >= CONVERSIONS.weight.lb.metric) {
            return `${(g / CONVERSIONS.weight.lb.metric).toFixed(1)} lb`;
        }
        return `${(g / CONVERSIONS.weight.oz.metric).toFixed(1)} oz`;
    });

    return result;
}
