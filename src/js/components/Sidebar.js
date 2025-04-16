export const createSidebar = () => {
    const LOADING_TEXT = "Loading recipes...";
    const LOADED_TEXT = "Recipes loaded!";
    const HOVER_TEXT = "Hover over appliances to see their total recipes.";
    const DEFAULT_TOOLTIP = "Hover over appliances to see total recipes";

    const sidebar = document.createElement("div");
    sidebar.className = "kitchen-sidebar";

    const content = document.createElement("div");
    content.className = "sidebar-content";

    const title = document.createElement("h2");
    title.textContent = "Welcome to Simplate";

    const statusText = document.createElement("div");
    statusText.className = "status-text";
    statusText.textContent = LOADING_TEXT;

    const filterText = document.createElement("div");
    filterText.textContent = "Filter recipes with the Dietary Preferences tab.";

    const tooltipContent = document.createElement("div");
    tooltipContent.className = "tooltip-content";

    content.append(title, statusText, filterText, tooltipContent);
    sidebar.appendChild(content);

    const setLoadingComplete = () => {
        setTimeout(() => {
            statusText.textContent = LOADED_TEXT;
            tooltipContent.textContent = HOVER_TEXT;
        }, 500);
    };

    const updateTooltip = (applianceType, recipeCount) => {
        if (!applianceType) {
            tooltipContent.textContent = DEFAULT_TOOLTIP;
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
