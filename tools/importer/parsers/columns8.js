/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column wrappers (image and text)
  const row = element.querySelector('.row.no-gutters.u-flex-wrapper');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // LEFT COLUMN: Image
  let imgEl = null;
  const imgCol = cols[0];
  if (imgCol && imgCol.style && imgCol.style.backgroundImage) {
    const imgUrlMatch = imgCol.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (imgUrlMatch && imgUrlMatch[1]) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrlMatch[1];
      imgEl.alt = '';
      imgEl.loading = 'lazy';
    }
  }

  // RIGHT COLUMN: Card content + Button wrapper
  const textCol = cols[1];
  let textCellContent = [];
  // Use the .c-card__content (text) and .c-button-wrapper (buttons) if present
  const card = textCol.querySelector('.c-card');
  if (card) {
    const content = card.querySelector('.c-card__content');
    if (content) textCellContent.push(content);
    const buttons = card.querySelector('.c-button-wrapper');
    if (buttons) textCellContent.push(buttons);
  } else {
    // Fallback: add all children
    textCellContent = Array.from(textCol.children);
  }

  // Compose table: block header, then row with two columns
  const cells = [
    ['Columns (columns8)'],
    [imgEl, textCellContent]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
