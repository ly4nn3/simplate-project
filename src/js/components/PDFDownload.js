// src/js/components/PDFDownload.js

export const createPrintButton = () => {
    return `
        <button 
            onclick="window.print()" 
            class="print-recipe-btn">
            🖨️ Print / Save PDF
        </button>
    `;
};