export class RefreshCountdown {
    constructor(type, duration) {
        this.type = type; // 'recipes' or 'books'
        this.duration = duration;
        this.element = this.createElement();
        this.updateInterval = null;
        this.initializeTimer();
    }

    createElement() {
        const container = document.createElement("div");
        container.classList.add("refresh-countdown");
        container.dataset.type = this.type;
        return container;
    }

    initializeTimer() {
        this.updateDisplay();
        this.updateInterval = setInterval(() => this.updateDisplay(), 1000);
    }

    updateDisplay() {
        const cached = localStorage.getItem(
            this.type === "recipes" ? "cachedRecipes" : "cachedBooks"
        );

        if (!cached) {
            this.element.textContent =
                this.type === "recipes"
                    ? "Recipes refresh available!"
                    : "There's a new book recommendation!";
            return;
        }

        const parsedCache = JSON.parse(cached);
        const timestamp = parsedCache.timestamp;
        const timeLeft = Math.max(0, this.duration - (Date.now() - timestamp));

        if (timeLeft === 0) {
            this.element.textContent =
                this.type === "recipes"
                    ? "Recipes refresh available!"
                    : "There's a new book recommendation!";
            return;
        }

        if (this.type === "books") {
            if (!parsedCache.viewed) {
                this.element.textContent = "There's a new book recommendation!";
                return;
            }
            this.element.innerHTML = `Book recommendation refresh in: ${this.formatTime(timeLeft)}`;
            return;
        }

        this.element.innerHTML = `Recipes refresh in: ${this.formatTime(timeLeft)}`;
    }

    formatTime(timeLeft) {
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor(
            (timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
        );
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

        let displayText = "";
        if (days > 0)
            displayText += `<span class="time-digits">${days}</span>d `;
        if (hours > 0)
            displayText += `<span class="time-digits">${hours}</span>h `;
        if (minutes > 0)
            displayText += `<span class="time-digits">${minutes}</span>m `;
        displayText += `<span class="time-digits">${seconds}</span>s`;

        return displayText;
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}
