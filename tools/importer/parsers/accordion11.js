/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as per spec
  const rows = [['Accordion']];
  // Select all accordion items
  const items = element.querySelectorAll(':scope > .c-accordion__item');
  items.forEach((item) => {
    // Title cell: from button > .item-title span
    let titleCell;
    const btn = item.querySelector('h3 button');
    if (btn) {
      const titleSpan = btn.querySelector('.item-title');
      if (titleSpan) {
        // Use the original span element to preserve formatting
        titleCell = titleSpan;
      } else {
        // Fallback in case structure changes
        titleCell = document.createElement('span');
        titleCell.textContent = btn.textContent.trim();
      }
    } else {
      // Defensive fallback
      titleCell = document.createElement('span');
      titleCell.textContent = '';
    }
    // Content cell: use .c-accordion__content__details directly
    let contentCell;
    const details = item.querySelector('.c-accordion__content__details');
    if (details) {
      contentCell = details;
    } else {
      // fallback: use the content region if present
      const region = item.querySelector('.c-accordion__content');
      contentCell = region || document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });
  // Create and swap table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
