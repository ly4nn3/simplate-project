export const initializeKitchen = () => {
    const kitchen = document.querySelector(".kitchen-layout");
    if (!kitchen) return null;

    let resizeTimeout;

    const updateKitchenSprite = () => {
        if (!kitchen) return;

        const currentWidth = kitchen.offsetWidth;

        const scaleRatio = currentWidth / 884;

        const elements = [
            { selector: ".base-kitchen", yPos: -2 },
            { selector: ".board-active", yPos: -726 },
            { selector: ".book-aa", yPos: -1450 },
            { selector: ".microwave-active", yPos: -2174 },
            { selector: ".oven-active", yPos: -2898 },
            { selector: ".ricecooker-active", yPos: -3622 },
            { selector: ".stove-active", yPos: -4346 },
        ];

        elements.forEach((item) => {
            const element = kitchen.querySelector(item.selector);
            if (element) {
                try {
                    const computedStyle = window.getComputedStyle(element);
                    const currentBgImage = computedStyle.backgroundImage;

                    if (
                        currentBgImage === "none" ||
                        !currentBgImage.includes("kitchen-interactive.png")
                    ) {
                        element.style.backgroundImage =
                            "url(kitchen-interactive.png)";
                    }

                    const bgWidth = 884 * scaleRatio;
                    const bgHeight = 5068 * scaleRatio;

                    const xPos = -2 * scaleRatio;
                    const yPos = item.yPos * scaleRatio;

                    element.style.position = "absolute";
                    element.style.top = "0";
                    element.style.left = "0";
                    element.style.width = "100%";
                    element.style.height = "100%";
                    element.style.backgroundRepeat = "no-repeat";
                    element.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
                    element.style.backgroundPosition = `${xPos}px ${yPos}px`;

                    if (
                        item.selector === ".base-kitchen" ||
                        item.selector === ".book-aa"
                    ) {
                        element.style.opacity = "1";
                    }
                } catch {
                    return null;
                }
            }
        });
    };

    // Add sparkles~ ✨
    const addSparkles = (element) => {
        const type = element.className.split(" ")[0];

        // Create sparkle container outside clipped element
        const sparkleContainer = document.createElement("div");
        sparkleContainer.className = `sparkle-container ${type}-sparkles`;
        element.parentNode.appendChild(sparkleContainer);

        // Create sparkles in container
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
        if (!recipes || !Array.isArray(recipes)) return;

        const activeAppliances = new Set(
            recipes.map((recipe) => recipe.equipment.primary).filter(Boolean)
        );

        const applianceElements = kitchen.querySelectorAll(
            ".interactive-zones [data-navigate]:not(.book-aa)"
        );

        applianceElements.forEach((element) => {
            const type = element.className.split("-")[0];

            if (activeAppliances.has(type)) {
                element.style.opacity = "1";
                element.classList.add("active", "hover-effect");
                element.setAttribute("data-active-reason", "recipe-match");
            } else {
                element.style.opacity = "0";
                element.classList.remove("active", "hover-effect");
                element.removeAttribute("data-active-reason");
            }
        });
    };

    const handleResize = () => {
        const interactiveElements = kitchen.querySelectorAll(
            ".interactive-zones [data-navigate]:not(.book-aa)"
        );
        interactiveElements.forEach((el) => {
            el.style.opacity = "0";
        });

        updateKitchenSprite();

        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            const activeElements = kitchen.querySelectorAll(".active");
            activeElements.forEach((el) => {
                if (!el.classList.contains("book-aa")) {
                    el.style.opacity = "1";
                }
            });
        }, 200);
    };

    const interactiveElements = kitchen.querySelectorAll("[data-navigate]");
    interactiveElements.forEach(addSparkles);

    updateKitchenSprite();

    window.addEventListener("resize", handleResize);

    return {
        highlightActiveAppliances,
    };
};
