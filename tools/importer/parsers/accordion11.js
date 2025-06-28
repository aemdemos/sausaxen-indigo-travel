/* global WebImporter */
export default function parse(element, { document }) {
  // Create the Accordion header row exactly as in the example
  const cells = [
    ['Accordion']
  ];
  // Select all direct .c-accordion__item children of the element
  const items = element.querySelectorAll(':scope > .c-accordion__item');
  items.forEach((item) => {
    // Title cell: find the button then .item-title (reference the actual element)
    let titleCell = '';
    const button = item.querySelector('button.c-accordion__header-button');
    if (button) {
      const titleSpan = button.querySelector('.item-title');
      if (titleSpan) {
        titleCell = titleSpan;
      }
    }
    // Content cell: reference all child nodes of .c-accordion__content__details (preserving block structure)
    let contentCell = '';
    const details = item.querySelector('.c-accordion__content__details');
    if (details) {
      // Use all children including text nodes (skip pure whitespace)
      const nodes = Array.from(details.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      }
    }
    cells.push([
      titleCell,
      contentCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
