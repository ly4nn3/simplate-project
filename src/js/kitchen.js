import { createSidebar } from "./components/Sidebar.js";
import { getRecipesByAppliance } from "./services/api/recipeService.js";
import { renderDietFilter } from "./components/DietFilter.js";

const SPRITE_CONFIG = [
    { selector: ".base-kitchen", yPos: -2, alwaysVisible: true },
    { selector: ".board-active", yPos: -726 },
    { selector: ".book-aa", yPos: -1450, alwaysVisible: true },
    { selector: ".microwave-active", yPos: -2174 },
    { selector: ".oven-active", yPos: -2898 },
    { selector: ".ricecooker-active", yPos: -3622 },
    { selector: ".stove-active", yPos: -4346 },
];

const BASE_SPRITE_WIDTH = 884;
const BASE_SPRITE_HEIGHT = 5068;

export const initializeKitchen = () => {
    const kitchen = document.querySelector(".kitchen-layout");
    if (!kitchen) return null;

    const sidebar = createSidebar();
    document.querySelector(".kitchen-container").appendChild(sidebar.element);

    let resizeTimeout;

    // Sprite
    const updateKitchenSprite = () => {
        if (!kitchen) return;

        const scaleRatio = kitchen.offsetWidth / BASE_SPRITE_WIDTH;
        const bgWidth = BASE_SPRITE_WIDTH * scaleRatio;
        const bgHeight = BASE_SPRITE_HEIGHT * scaleRatio;

        SPRITE_CONFIG.forEach(({ selector, yPos, alwaysVisible }) => {
            const element = kitchen.querySelector(selector);
            if (!element) return;

            try {
                const computedStyle = window.getComputedStyle(element);
                if (
                    !computedStyle.backgroundImage.includes(
                        "kitchen-interactive.png"
                    )
                ) {
                    element.style.backgroundImage =
                        "url(kitchen-interactive.png)";
                }

                Object.assign(element.style, {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${bgWidth}px ${bgHeight}px`,
                    backgroundPosition: `${-2 * scaleRatio}px ${yPos * scaleRatio}px`,
                    opacity: alwaysVisible ? "1" : element.style.opacity,
                });
            } catch {
                return `Failed to update sprite: ${selector}`;
            }
        });
    };

    // Sparkles ✨
    const addSparkles = (element) => {
        const type = element.className.split(" ")[0];
        const sparkleContainer = document.createElement("div");
        sparkleContainer.className = `sparkle-container ${type}-sparkles`;

        const sparklesHTML = Array(3)
            .fill("<span class=\"sparkle sparkle-" + type + "\">✨</span>")
            .join("");
        sparkleContainer.innerHTML = sparklesHTML;
        element.parentNode.appendChild(sparkleContainer);

        const handleMouseEnter = async () => {
            sparkleContainer.classList.add("show-sparkles");

            if (
                !element.classList.contains("book-aa") &&
                !element.classList.contains("active")
            ) {
                element.style.opacity = "1";
            }

            if (!element.classList.contains("book-aa")) {
                const type = element.className.split("-")[0];
                const recipes = await getRecipesByAppliance(type);
                sidebar.updateTooltip(type, recipes.length);
            }
        };

        const handleMouseLeave = () => {
            sparkleContainer.classList.remove("show-sparkles");

            if (
                !element.classList.contains("book-aa") &&
                !element.classList.contains("active")
            ) {
                element.style.opacity = "0";
            }

            sidebar.updateTooltip();
        };

        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    };

    const highlightActiveAppliances = (recipes) => {
        if (!Array.isArray(recipes)) return;

        const activeAppliances = new Set(
            recipes.map((recipe) => recipe.equipment.primary).filter(Boolean)
        );

        kitchen
            .querySelectorAll(
                ".interactive-zones [data-navigate]:not(.book-aa)"
            )
            .forEach((element) => {
                const type = element.className.split("-")[0];
                const isActive = activeAppliances.has(type);

                element.style.opacity = isActive ? "1" : "0";
                element.classList.toggle("active", isActive);
                element.classList.toggle("hover-effect", isActive);

                if (isActive) {
                    element.setAttribute("data-active-reason", "recipe-match");
                } else {
                    element.removeAttribute("data-active-reason");
                }
            });
    };

    const handleResize = () => {
        const interactiveElements = kitchen.querySelectorAll(
            ".interactive-zones [data-navigate]:not(.book-aa)"
        );

        interactiveElements.forEach((el) => (el.style.opacity = "0"));
        updateKitchenSprite();

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            kitchen.querySelectorAll(".active").forEach((el) => {
                if (!el.classList.contains("book-aa")) {
                    el.style.opacity = "1";
                }
            });
        }, 200);
    };

    const cleanup = [];
    kitchen.querySelectorAll("[data-navigate]").forEach((element) => {
        cleanup.push(addSparkles(element));
    });

    updateKitchenSprite();

    const initializeFilters = async () => {
        const recipes = await getRecipesByAppliance("");
        if (!recipes) return;

        highlightActiveAppliances(recipes);

        const filterContainer = document.getElementById(
            "diet-filter-container"
        );
        if (filterContainer) {
            const recipes = await getRecipesByAppliance("");
            if (recipes) {
                filterContainer.appendChild(
                    renderDietFilter(recipes, highlightActiveAppliances)
                );
            }
        }

        sidebar.setLoadingComplete();
    };

    initializeFilters();

    window.addEventListener("resize", handleResize);

    return {
        highlightActiveAppliances,
        cleanup: () => {
            window.removeEventListener("resize", handleResize);
            cleanup.forEach((fn) => fn());
        },
    };
};
