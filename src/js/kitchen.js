import { getRequiredAppliances } from "./utils/equipmentUtils.js";

export const initializeKitchen = () => {
    const kitchen = document.querySelector(".kitchen-layout");
    if (!kitchen) return null;

    // Add sparkles~ ✨
    const addSparkles = (element) => {
        const type = element.className.split(" ")[0];

        // Create sparkle container outside the clipped element
        const sparkleContainer = document.createElement("div");
        sparkleContainer.className = `sparkle-container ${type}-sparkles`;
        element.parentNode.appendChild(sparkleContainer);

        // Create sparkles in the container
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement("span");
            sparkle.className = `sparkle sparkle-${type}`;
            sparkle.textContent = "✨";
            sparkleContainer.appendChild(sparkle);
        }

        element.addEventListener("mouseenter", () => {
            sparkleContainer.classList.add("show-sparkles");
            if (
                !element.classList.contains("book-aa") &&
                !element.classList.contains("active")
            ) {
                element.style.opacity = "1";
            }
        });

        element.addEventListener("mouseleave", () => {
            sparkleContainer.classList.remove("show-sparkles");
            if (
                !element.classList.contains("book-aa") &&
                !element.classList.contains("active")
            ) {
                element.style.opacity = "0";
            }
        });
    };

    const highlightActiveAppliances = (recipes) => {
        console.log('Highlighting appliances for recipes:', recipes?.length);
        if (!recipes || !Array.isArray(recipes)) {
            console.log('No recipes provided for highlighting');
            return;
        }

        const allAppliances = new Set();

        recipes.forEach((recipe) => {
            const requiredAppliances = getRequiredAppliances(recipe);
            console.log('Required appliances for recipe:', {
                recipeTitle: recipe.title,
                appliances: Array.from(requiredAppliances)
            });
            requiredAppliances.forEach((appliance) => allAppliances.add(appliance));
        });

        console.log('All required appliances:', Array.from(allAppliances));

        const applianceElements = kitchen.querySelectorAll(
            ".interactive-zones [data-navigate]:not(.book-aa)"
        );
        
        console.log('Found appliance elements:', applianceElements.length);

        applianceElements.forEach((element) => {
            const type = element.className.split("-")[0];
            console.log('Element details:', {
                fullClassName: element.className,
                extractedType: type,
                matchFound: allAppliances.has(type),
                allAppliances: Array.from(allAppliances)
            });
    
            if (allAppliances.has(type)) {
                element.style.opacity = "1";
                element.classList.add("active", "hover-effect");
                console.log(`Activated ${type}`);
            } else {
                element.style.opacity = "0";
                element.classList.remove("active", "hover-effect");
                console.log(`Deactivated ${type}`);
            }
        });
    };

    // Initialize sparkles
    const interactiveElements = kitchen.querySelectorAll("[data-navigate]");
    interactiveElements.forEach(addSparkles);

    return {
        highlightActiveAppliances,
    };
};
