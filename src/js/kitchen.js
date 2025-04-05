export const initializeKitchen = () => {
    const kitchen = document.querySelector(".kitchen-layout");
    if (!kitchen) return;

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

        // Show sparkles when original element is hovered
        element.addEventListener("mouseenter", () => {
            sparkleContainer.classList.add("show-sparkles");
            if (!element.classList.contains("book-aa")) {
                element.style.opacity = "1";
            }
        });

        element.addEventListener("mouseleave", () => {
            sparkleContainer.classList.remove("show-sparkles");
            if (!element.classList.contains("book-aa")) {
                element.style.opacity = "0";
            }
        });
    };

    const interactiveElements = kitchen.querySelectorAll("[data-navigate]");
    interactiveElements.forEach(addSparkles);
};
