import { RefreshCountdown } from "./RefreshCountdown.js";
import { CACHE_DURATION } from "../constants/apiConfig.js";

export class Header {
    constructor() {
        this.element = document.querySelector("header");
        this.initializeHeader();
    }

    initializeHeader() {
        const leftSection = document.createElement("div");
        leftSection.classList.add("header-left");
        leftSection.innerHTML = this.element.innerHTML;

        const rightSection = document.createElement("div");
        rightSection.classList.add("header-right");

        this.recipeCountdown = new RefreshCountdown(
            "recipes",
            CACHE_DURATION.RECIPES
        );
        this.bookCountdown = new RefreshCountdown(
            "books",
            CACHE_DURATION.BOOKS
        );

        rightSection.appendChild(this.recipeCountdown.element);
        rightSection.appendChild(this.bookCountdown.element);

        this.element.innerHTML = "";
        this.element.appendChild(leftSection);
        this.element.appendChild(rightSection);
    }

    destroy() {
        if (this.recipeCountdown) this.recipeCountdown.destroy();
        if (this.bookCountdown) this.bookCountdown.destroy();
    }
}
