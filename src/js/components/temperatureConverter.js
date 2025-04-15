export const convertTemperature = (text, targetUnit) => {
    if (!text) return text;

    const fahrenheitRegex = /(\d+)\s*(?:degrees?|°)\s*F?\b/gi;
    const celsiusRegex = /(\d+)\s*(?:degrees?|°)\s*C\b/gi;

    if (targetUnit === "metric") {
        return text.replace(fahrenheitRegex, (match, temp) => {
            if (temp >= 200 && temp <= 500) {
                const celsius = Math.round(((parseInt(temp) - 32) * 5) / 9);
                return `${celsius}°C `;
            }
            return match;
        });
    } else {
        return text.replace(celsiusRegex, (match, temp) => {
            if (temp >= 100 && temp <= 260) {
                const fahrenheit = Math.round((parseInt(temp) * 9) / 5 + 32);
                return `${fahrenheit}°F`;
            }
            return match;
        });
    }
};
