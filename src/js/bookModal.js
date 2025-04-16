import { getDailyBook } from "./services/api/bookService.js";
import { renderBookModal } from "./utils/bookUtils.js";
import { markBookAsViewed } from "./services/cache/bookCache.js"; // Add this import

export const showBookModal = async () => {
    let modalContainer = document.querySelector(".modal-container");
    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.className = "modal-container";
        document.body.appendChild(modalContainer);
    }

    try {
        modalContainer.innerHTML = `
            <div class="modal-content book-modal">
                <button class="modal-close">&times;</button>
                <div class="loading-container">
                    <div class="loading-message">Loading today's recommendation...</div>
                </div>
            </div>
        `;
        modalContainer.classList.add("active");

        const book = await getDailyBook();
        modalContainer.innerHTML = renderBookModal(book);

        markBookAsViewed();

        const closeButton = modalContainer.querySelector(".modal-close");
        const closeModal = () => {
            modalContainer.classList.remove("active");
        };

        closeButton.addEventListener("click", closeModal);

        modalContainer.addEventListener("click", (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (
                e.key === "Escape" &&
                modalContainer.classList.contains("active")
            ) {
                closeModal();
            }
        });
    } catch {
        modalContainer.innerHTML = renderBookModal(null);
    }
};
