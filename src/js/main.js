import { router } from "./router.js";
import { initializeKitchen } from "./kitchen.js";
import { initializeOfflineIndicator } from "./components/offlineIndicator.js";
import { Header } from "./components/Header.js";

let header;

const handleNavigation = (path) => {
    history.pushState(null, null, path);
    router(path);
};

window.addEventListener("DOMContentLoaded", () => {
    header = new Header();
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

window.addEventListener("beforeunload", () => {
    if (header) header.destroy();
});
