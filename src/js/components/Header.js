import { RefreshCountdown } from "./RefreshCountdown.js";
import { CACHE_DURATION } from "../constants/apiConfig.js";

export class Header {
    #element;
    #recipeCountdown;
    #bookCountdown;

    constructor() {
        this.#element = document.querySelector("header");
        this.#initializeHeader();
    }

    #initializeHeader() {
        const headerContent = `
            <div class="header-left">
                ${this.#element.innerHTML}
            </div>
            <div class="header-right"></div>
        `;

        this.#element.innerHTML = headerContent;

        const rightSection = this.#element.querySelector(".header-right");

        this.#recipeCountdown = new RefreshCountdown(
            "recipes",
            CACHE_DURATION.RECIPES
        );
        this.#bookCountdown = new RefreshCountdown(
            "books",
            CACHE_DURATION.BOOKS
        );

        rightSection.append(
            this.#recipeCountdown.element,
            this.#bookCountdown.element
        );
    }

    destroy() {
        [this.#recipeCountdown, this.#bookCountdown].forEach((countdown) => {
            if (countdown) countdown.destroy();
        });

        this.#recipeCountdown = null;
        this.#bookCountdown = null;
    }
}
