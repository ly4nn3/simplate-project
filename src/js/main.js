import { router } from "./router.js";

// Initialize router on load
window.addEventListener("DOMContentLoaded", () => {
    router(window.location.pathname);
});

// Back and forward on browser
window.addEventListener("popstate", () => {
    router(window.location.pathname);
});

// For navigation within views
// To be modified
document.addEventListener("click", (e) => {
    const navigateElement = e.target.closest("[data-navigate]");

    if (navigateElement) {
        const path = navigateElement.dataset.navigate;
        history.pushState(null, null, path);
        router(path);
    }
});
