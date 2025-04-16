export const createPrintButton = () => {
    return `
        <button 
            onclick="window.print()" 
            class="print-recipe-btn"
            aria-label="Print or save recipe as PDF">
            🖨️ Print / Save PDF
        </button>
    `;
};
