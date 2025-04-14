export const createSidebar = () => {
    const sidebar = document.createElement("div");
    sidebar.className = "kitchen-sidebar";

    const initialContent = `
        <div class="sidebar-content">
            <h2>Welcome to Simplate</h2>
            <div class="status-text">Loading recipes...</div>
            <div class="">Filter recipes with the Dietary Preferences tab.</div>
            <div class="tooltip-content"></div>
        </div>
    `;

    sidebar.innerHTML = initialContent;

    const setLoadingComplete = () => {
        setTimeout(() => {
            const statusText = sidebar.querySelector(".status-text");
            const tooltipContent = sidebar.querySelector(".tooltip-content");

            if (statusText) {
                statusText.textContent = "Recipes loaded!";
            }
            if (tooltipContent) {
                tooltipContent.textContent =
                    "Hover over appliances to see their total recipes.";
            }
        }, 500);
    };

    const updateTooltip = (applianceType, recipeCount) => {
        const tooltipContent = sidebar.querySelector(".tooltip-content");
        if (!tooltipContent) return;

        if (!applianceType) {
            tooltipContent.textContent =
                "Hover over appliances to see total recipes";
            return;
        }

        const capitalizedType =
            applianceType.charAt(0).toUpperCase() + applianceType.slice(1);
        tooltipContent.textContent =
            recipeCount > 0
                ? `${capitalizedType}: ${recipeCount} recipes available`
                : `${capitalizedType}: No recipes available`;
    };

    return {
        element: sidebar,
        setLoadingComplete,
        updateTooltip,
    };
};
