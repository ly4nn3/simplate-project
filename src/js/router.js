// Router function for different views
export const router = async (path) => {
    const routes = {
        "/": "Kitchen", // Kitchen view home page
        // Recipe appliance routes
        "/oven-recipes": "OvenRecipes",
        "/stove-recipes": "StoveRecipes",
        "/microwave-recipes": "MicrowaveRecipes",
        "/toaster-recipes": "ToasterRecipes",
        // Other routes
        "/book": "Book", // Book recommendation page
        "/about": "About", // About page
    };

    // Default to "/" if path not found
    const view = routes[path] || routes["/"];

    // Reference app container
    const app = document.getElementById("app");

    // View rendering switch
    switch (view) {
        case "Kitchen":
            app.innerHTML = await renderKitchen();
            break;
        case "OvenRecipes":
            app.innerHTML = await renderOvenRecipes();
            break;
        case "StoveRecipes":
            app.innerHTML = await renderStoveRecipes();
            break;
        case "MicrowaveRecipes":
            app.innerHTML = await renderMicrowaveRecipes();
            break;
        case "ToasterRecipes":
            app.innerHTML = await renderToasterRecipes();
            break;
        case "Book":
            app.innerHTML = await renderBook();
            break;
        case "About":
            app.innerHTML = await renderAbout();
            break;
        default:
            app.innerHTML = await renderKitchen();
    }
};

// View rendering functions
// Kitchen view
const renderKitchen = async () => {
    return `
        <div class="kitchen">
            <h1>The Simplate Kitchen</h1>

            <div class="kitchen-layout">
            <!-- Oven, Stove, Microwave, Toaster -->
                <div class="oven" data-navigate="/oven-recipes">
                    <h2>Oven Recipes</h2>
                </div>

                <div class="stove" data-navigate="/stove-recipes">
                    <h2>Stove Recipes</h2>
                </div>

                <div class="microwave" data-navigate="/microwave-recipes">
                    <h2>Microwave Recipes</h2>
                </div>

                <div class="toaster" data-navigate="/toaster-recipes">
                    <h2>Toaster Recipes</h2>
                </div>
            </div>
        </div>
    `;
};

// Recipe view
const renderOvenRecipes = async () => {
    return `
        <div class="recipes oven-recipes">
            <h1>Oven Recipes</h1>
        </div>
    `;
};

const renderStoveRecipes = async () => {
    return `
        <div class="recipes stove-recipes">
            <h1>Stove Recipes</h1>
        </div>
    `;
};

const renderMicrowaveRecipes = async () => {
    return `
        <div class="recipes microwave-recipes">
            <h1>Microwave Recipes</h1>
        </div>
    `;
};

const renderToasterRecipes = async () => {
    return `
        <div class="recipes toaster-recipes">
            <h1>Toaster Recipes</h1>
        </div>
    `;
};

// Book view
const renderBook = async () => {
    return `
        <div class="book">
            <h1>Today's Book Recommendation</h1>
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
