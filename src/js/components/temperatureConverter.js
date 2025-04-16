const PATTERNS = {
    fahrenheit: /(\d+)\s*(?:degrees?|°)\s*F?\b/gi,
    celsius: /(\d+)\s*(?:degrees?|°)\s*C\b/gi,
};

const TEMP_RANGES = {
    fahrenheit: { min: 200, max: 500 },
    celsius: { min: 100, max: 260 },
};

const conversions = {
    toMetric: (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9),
    toImperial: (celsius) => Math.round((celsius * 9) / 5 + 32),
};

export const convertTemperature = (text, targetUnit) => {
    if (!text) return text;

    if (targetUnit === "metric") {
        return text.replace(PATTERNS.fahrenheit, (match, temp) => {
            const temperature = parseInt(temp);
            const { min, max } = TEMP_RANGES.fahrenheit;

            if (temperature >= min && temperature <= max) {
                return `${conversions.toMetric(temperature)}°C `;
            }
            return match;
        });
    }

    return text.replace(PATTERNS.celsius, (match, temp) => {
        const temperature = parseInt(temp);
        const { min, max } = TEMP_RANGES.celsius;

        if (temperature >= min && temperature <= max) {
            return `${conversions.toImperial(temperature)}°F`;
        }
        return match;
    });
};

export const batchConvertTemperatures = (texts, targetUnit) => {
    if (!Array.isArray(texts)) return [];
    return texts.map((text) => convertTemperature(text, targetUnit));
};
