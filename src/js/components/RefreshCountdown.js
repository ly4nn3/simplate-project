export class RefreshCountdown {
    #type;
    #duration;
    #element;
    #updateInterval;
    #storageKey;
    #messages;

    constructor(type, duration) {
        this.#type = type;
        this.#duration = duration;
        this.#storageKey = type === "recipes" ? "cachedRecipes" : "cachedBooks";

        this.#messages = {
            recipes: {
                refresh: "Recipes refresh available!",
                countdown: "Recipes refresh in: ",
            },
            books: {
                refresh: "There's a new book recommendation!",
                countdown: "Book recommendation refresh in: ",
            },
        };

        this.#element = this.#createElement();
        this.#initializeTimer();
    }

    #createElement() {
        const container = document.createElement("div");
        container.classList.add("refresh-countdown");
        container.dataset.type = this.#type;
        return container;
    }

    #initializeTimer() {
        this.#updateDisplay();
        this.#updateInterval = setInterval(() => {
            requestAnimationFrame(() => this.#updateDisplay());
        }, 1000);
    }

    #formatTime(timeLeft) {
        const times = [
            { value: 24 * 60 * 60 * 1000, label: "d" },
            { value: 60 * 60 * 1000, label: "h" },
            { value: 60 * 1000, label: "m" },
            { value: 1000, label: "s" },
        ];

        let displayText = "";
        let remaining = timeLeft;

        times.forEach(({ value, label }) => {
            const amount = Math.floor(remaining / value);
            if (amount > 0 || displayText) {
                displayText += `<span class="time-digits">${amount}</span>${label} `;
            }
            remaining %= value;
        });

        return displayText.trim();
    }

    #updateDisplay() {
        const cached = localStorage.getItem(this.#storageKey);

        if (!cached) {
            this.#element.textContent = this.#messages[this.#type].refresh;
            return;
        }

        const parsedCache = JSON.parse(cached);

        if (this.#type === "books" && !parsedCache.viewed) {
            this.#element.textContent = this.#messages.books.refresh;
            return;
        }

        const timeLeft = Math.max(
            0,
            this.#duration - (Date.now() - parsedCache.timestamp)
        );

        if (timeLeft === 0) {
            this.#element.textContent = this.#messages[this.#type].refresh;
            return;
        }

        this.#element.innerHTML =
            this.#messages[this.#type].countdown + this.#formatTime(timeLeft);
    }

    get element() {
        return this.#element;
    }

    destroy() {
        if (this.#updateInterval) {
            clearInterval(this.#updateInterval);
            this.#updateInterval = null;
        }
        this.#element = null;
    }
}
