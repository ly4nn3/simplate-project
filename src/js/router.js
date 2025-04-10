import { initializeKitchen } from "./kitchen.js";
import { getRecipesByAppliance } from "./services/api/recipeService.js";

// Router function for different views
export const router = async (path) => {
    const basePath = path.split("?")[0];
    // Parse appliance type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const applianceType = urlParams.get("type");
    const routes = {
        "/": "Kitchen", // Kitchen view home page
        // Recipe routing
        "/recipes": "Recipes",
        // Other routes
        "/book": "Book", // Book recommendation page
        "/about": "About", // About page
    };

    const view = routes[basePath] || routes["/"];

    const app = document.getElementById("app");

    // View rendering switch
    try {
        switch (view) {
        case "Kitchen":
            app.innerHTML = await renderKitchen();

            requestAnimationFrame(() => {
                const kitchen = initializeKitchen();
                getRecipesByAppliance("").then((recipes) => {
                    if (recipes) {
                        kitchen.highlightActiveAppliances(recipes);
                    }
                });
            });
            break;
        case "Recipes":
            app.innerHTML = await renderRecipes(applianceType);
            break;
        case "Book":
            app.innerHTML = await renderBook();
            break;
        case "About":
            app.innerHTML = await renderAbout();
            break;
        default:
            app.innerHTML = await renderKitchen();
            initializeKitchen();
        }
    } catch {
        app.innerHTML = `
            <div class="error">
                <h2>Error loading page</h2>
                <button data-navigate="/">Return to Kitchen</button>
            </div>
        `;
    }
};

const renderKitchen = async () => {
    return `
        <div class="kitchen">
            <div class="kitchen-layout">
                <!-- Base kitchen -->
                <div class="base-kitchen"></div>
                
                <!-- Interactive elements -->
                <div class="interactive-zones">
                    <div class="oven-active" data-navigate="/recipes?type=oven"></div>
                    <div class="stove-active" data-navigate="/recipes?type=stove"></div>
                    <div class="microwave-active" data-navigate="/recipes?type=microwave"></div>
                    <div class="ricecooker-active" data-navigate="/recipes?type=ricecooker"></div>
                    <div class="board-active" data-navigate="/recipes?type=board"></div>
                    <div class="book-aa" data-navigate="/book"></div>
                </div>

                <!-- + more interactive elements -->
            </div>
        </div>
    `;
};

// Recipe view
const renderRecipes = async (applianceType) => {
    // Capitalize first letter only
    const capitalizedType = applianceType
        ? applianceType.charAt(0).toUpperCase() +
          applianceType.slice(1).toLowerCase()
        : "";

    return `
        <div class="recipes">
            <button data-navigate="/" class="back-button">Back to Kitchen</button>
            
            <div class="wip-container">
                <h2>${capitalizedType} Recipes</h2>
                <div class="wip-message">
                    <p>🚧 Work in Progress 🚧</p>
                    <p>Coming soon: Delicious ${capitalizedType} recipes!</p>
                    <!-- Add placeholder for future gif -->
                    <div class="gif-placeholder">
                        <img src="/assets/images/work-in-progress.gif" alt="Work in Progress GIF" width="200" height="200">
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Book view
const renderBook = async () => {
    return `
        <div class="book">
            <button data-navigate="/" class="back-button">Back to Kitchen</button>
            
            <div class="wip-container">
                <h2>Today's Book Recommendation</h2>
                <div class="wip-message">
                    <p>🚧 Work in Progress 🚧</p>
                    <p>Coming soon: Curated cookbook recommendations!</p>
                    <div class="gif-placeholder">
                        <img src="/assets/images/work-in-progress.gif" alt="Work in Progress GIF" width="200" height="200">
                    </div>
                </div>
            </div>
        </div>
    `;
};

// About view
const renderAbout = async () => {
    return `
        <div class="about">
            <h1>About Simplate</h1>
        </div>
    `;
};
