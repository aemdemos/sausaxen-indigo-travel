/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the table rows
  const cells = [['Accordion']];

  // Select all direct accordion items
  const items = element.querySelectorAll(':scope > .c-accordion__item');
  items.forEach((item) => {
    // Title cell: The .c-accordion__header-button > .item-title
    let titleEl = item.querySelector('.c-accordion__header-button .item-title');
    // If not found, fallback to button text
    if (!titleEl) {
      const btn = item.querySelector('.c-accordion__header-button');
      titleEl = btn ? btn : document.createTextNode('');
    }

    // Content cell: The .c-accordion__content__details (include all direct content nodes)
    let contentEl = item.querySelector('.c-accordion__content__details');
    // Fallback: the .c-accordion__content if details not found
    if (!contentEl) {
      contentEl = item.querySelector('.c-accordion__content');
    }
    // If still not found, fallback to empty div
    if (!contentEl) {
      contentEl = document.createElement('div');
    }

    // Add row: each is [title, content]
    cells.push([titleEl, contentEl]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
