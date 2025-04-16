const ERROR_TEMPLATE = `
    <div class="modal-content book-modal">
        <button class="modal-close">&times;</button>
        <div class="book-error">
            <h2>No book recommendation available</h2>
            <p>Please try again later.</p>
        </div>
    </div>
`;

const BOOK_DEFAULTS = {
    id: 0,
    title: "",
    subtitle: "",
    image: "",
    genres: [],
};

export function processBook(book) {
    if (!book || typeof book !== "object") {
        throw new Error("Invalid book data");
    }

    const { id, title, subtitle, image, genres } = book;

    return {
        id: id || BOOK_DEFAULTS.id,
        title: title || BOOK_DEFAULTS.title,
        subtitle: subtitle || BOOK_DEFAULTS.subtitle,
        image: image || BOOK_DEFAULTS.image,
        genres: Array.isArray(genres) ? genres : BOOK_DEFAULTS.genres,
    };
}

export const renderBookModal = (book) => {
    if (!book) return ERROR_TEMPLATE;

    const { title, subtitle, image, genres } = book;

    const genresHTML = genres
        .map((genre) => `<span class="genre-tag">${genre}</span>`)
        .join("");

    return `
        <div class="modal-content book-modal">
            <button class="modal-close">&times;</button>
            <h2>Today's Book Recommendation</h2>
            <div class="book-content">
                <div class="book-image">
                    <img 
                        src="${image}" 
                        alt="${title}"
                        width="250" 
                        height="auto"
                        loading="lazy"
                    >
                </div>
                <div class="book-details">
                    <h3>${title}</h3>
                    ${subtitle ? `<p>${subtitle}</p>` : ""}
                    <div class="book-genres">
                        ${genresHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
};
