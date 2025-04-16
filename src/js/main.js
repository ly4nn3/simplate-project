import { router } from "./router.js";
import { initializeKitchen } from "./kitchen.js";
import { initializeOfflineIndicator } from "./components/offlineIndicator.js";
import { Header } from "./components/Header.js";

class App {
    constructor() {
        this.header = null;
        this.kitchen = null;
        this.cleanupFunctions = new Set();
    }

    handleNavigation = (path) => {
        history.pushState(null, null, path);
        router(path);
    };

    handleClick = (e) => {
        const target = e.target.closest("[data-navigate]");
        if (target) {
            e.preventDefault();
            this.handleNavigation(target.dataset.navigate);
        }
    };

    handlePopState = () => {
        router(window.location.pathname + window.location.search);
    };

    initialize() {
        // Initialize components
        this.header = new Header();
        this.cleanupFunctions.add(() => this.header.destroy());

        // Initialize router
        const currentPath = window.location.pathname + window.location.search;
        router(currentPath);

        // Initialize kitchen
        this.kitchen = initializeKitchen();
        if (this.kitchen?.cleanup) {
            this.cleanupFunctions.add(this.kitchen.cleanup);
        }

        // Initialize offline indicator
        const offlineCleanup = initializeOfflineIndicator();
        if (offlineCleanup) {
            this.cleanupFunctions.add(offlineCleanup);
        }

        document.addEventListener("click", this.handleClick);
        window.addEventListener("popstate", this.handlePopState);

        this.cleanupFunctions.add(() => {
            document.removeEventListener("click", this.handleClick);
            window.addEventListener("popstate", this.handlePopState);
        });
    }

    cleanup() {
        this.cleanupFunctions.forEach((cleanup) => cleanup());
        this.cleanupFunctions.clear();
        this.header = null;
        this.kitchen = null;
    }
}

const app = new App();
window.addEventListener("DOMContentLoaded", () => app.initialize());
window.addEventListener("beforeunload", () => app.cleanup());

// for testing/external access if needed
export { app };
