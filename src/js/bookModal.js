import { getDailyBook } from "./services/api/bookService.js";
import { renderBookModal } from "./utils/bookUtils.js";
import { markBookAsViewed } from "./services/cache/bookCache.js";

const LOADING_TEMPLATE = `
    <div class="modal-content book-modal">
        <button class="modal-close">&times;</button>
        <div class="loading-container">
            <div class="loading-message">Loading today's recommendation...</div>
        </div>
    </div>
`;

export const showBookModal = async () => {
    let modalContainer = document.querySelector(".modal-container");
    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.className = "modal-container";
        document.body.appendChild(modalContainer);
    }

    const cleanup = setupModalEvents(modalContainer);

    try {
        modalContainer.innerHTML = LOADING_TEMPLATE;
        modalContainer.classList.add("active");

        const book = await getDailyBook();
        modalContainer.innerHTML = renderBookModal(book);
        markBookAsViewed();

        cleanup();
        setupModalEvents(modalContainer);
    } catch {
        modalContainer.innerHTML = "Failed to load book recommendation:";
    }
};

function setupModalEvents(modalContainer) {
    const closeModal = () => {
        modalContainer.classList.remove("active");
    };

    const handleClick = (e) => {
        if (
            e.target === modalContainer ||
            e.target.classList.contains("modal-close")
        ) {
            closeModal();
        }
    };

    const handleKeydown = (e) => {
        if (e.key === "Escape" && modalContainer.classList.contains("active")) {
            closeModal();
        }
    };

    modalContainer.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
        modalContainer.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleKeydown);
    };
}
