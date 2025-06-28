/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row.u-flex-wrapper');
  if (!row) return;

  // Get all immediate child columns
  const cols = Array.from(row.children).filter(col => col.classList.contains('col-md-6'));

  // For each column, build the content cell by referencing existing DOM nodes
  const colCells = cols.map(col => {
    // Card inner
    const cardInner = col.querySelector('.c-card__inner');
    if (!cardInner) return document.createTextNode('');
    // Content block (contains h3)
    const contentBlock = cardInner.querySelector('.c-card__content');
    // Button wrapper (contains 1 or more links)
    const buttonWrapper = cardInner.querySelector('.c-button-wrapper-stack');

    const cellContent = [];
    if (contentBlock) {
      // Reference the h3 as a paragraph for flat structure
      const h3 = contentBlock.querySelector('h3');
      if (h3) {
        const p = document.createElement('p');
        p.textContent = h3.textContent;
        cellContent.push(p);
      }
    }
    if (buttonWrapper) {
      // All links in the button wrapper
      const links = Array.from(buttonWrapper.querySelectorAll('a'));
      links.forEach(link => cellContent.push(link));
    }
    // If cellContent is empty, insert empty string, else the array
    return cellContent.length ? cellContent : document.createTextNode('');
  });

  // Compose table
  const rows = [
    ['Columns (columns12)'],
    colCells
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
