// src/js/utils/bookUtils.js
export function processBook(book) {
    if (!book || typeof book !== "object") {
        throw new Error("Invalid book data");
    }

    return {
        id: book.id || 0,
        title: book.title || "",
        subtitle: book.subtitle || "",
        image: book.image || "",
        genres: Array.isArray(book.genres) ? book.genres : [],
    };
}

export const renderBookModal = (book) => {
    if (!book) {
        return `
            <div class="modal-content book-modal">
                <button class="modal-close">&times;</button>
                <div class="book-error">
                    <h2>No book recommendation available</h2>
                    <p>Please try again later.</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="modal-content book-modal">
            <button class="modal-close">&times;</button>
            <h2>Today's Book Recommendation</h2>
            <div class="book-content">
                <div class="book-image">
                    <img src="${book.image}" alt="${book.title}" width="250" height="auto">
                </div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    ${book.subtitle ? `<p>${book.subtitle}</p>` : ""}
                    <div class="book-genres">
                        ${book.genres
        .map(
            (genre) =>
                `<span class="genre-tag">${genre}</span>`
        )
        .join("")}
                    </div>
                </div>
            </div>
        </div>
    `;
};
