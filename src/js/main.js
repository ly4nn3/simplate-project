import { router } from "./router.js";
import { initializeKitchen } from "./kitchen.js";
import { initializeOfflineIndicator } from "./components/offlineIndicator.js";

const handleNavigation = (path) => {
    history.pushState(null, null, path);
    router(path);
};

window.addEventListener("DOMContentLoaded", () => {
    router(window.location.pathname + window.location.search);
    initializeKitchen();
    initializeOfflineIndicator();

    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-navigate]");
        if (target) {
            e.preventDefault();
            const path = target.dataset.navigate;
            handleNavigation(path);
        }
    });
});

window.addEventListener("popstate", () => {
    router(window.location.pathname + window.location.search);
});
