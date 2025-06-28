/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icons container (should handle variations)
  const iconsWrapper = element.querySelector('.c-cvp-icons__items');
  if (!iconsWrapper) return;

  // Get all icon items (direct children)
  const iconItems = Array.from(iconsWrapper.children).filter(child => child.classList.contains('c-cvp-icon-item'));
  if (!iconItems.length) return;

  // For each column, combine ALL content (icon + text) in source order
  const columnsRow = iconItems.map(item => {
    const cellContent = [];
    // Include all immediate children of the item in order
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // For content wrappers, preserve their children
        if (node.classList.contains('c-cvp-icon-item__content')) {
          Array.from(node.childNodes).forEach(contentNode => {
            if (contentNode.nodeType === Node.ELEMENT_NODE) {
              cellContent.push(contentNode);
            } else if (contentNode.nodeType === Node.TEXT_NODE && contentNode.textContent.trim()) {
              const span = document.createElement('span');
              span.textContent = contentNode.textContent;
              cellContent.push(span);
            }
          });
        } else {
          // e.g. image or other
          cellContent.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        cellContent.push(span);
      }
    });
    // If cellContent is empty, fallback to the whole item
    if (!cellContent.length) cellContent.push(item);
    return cellContent;
  });

  // Header row as per block requirements
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(table);
}
