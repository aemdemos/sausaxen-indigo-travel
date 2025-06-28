/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icons block wrapper
  const iconsWrapper = element.querySelector('.c-cvp-icons__items');
  if (!iconsWrapper) return;

  // Get all columns (icon items)
  const iconItems = Array.from(iconsWrapper.children).filter(child => child.classList.contains('c-cvp-icon-item'));

  // For each column, gather all direct children (img, content, etc.)
  const columns = iconItems.map(item => {
    // Gather all direct children (preserves markup and text)
    const cellContent = Array.from(item.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
      return false;
    });
    // If empty, return empty string (shouldn't happen)
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  });

  // Header row: single cell, exactly as in the example
  const headerRow = ['Columns (columns2)'];

  // Table structure: header row, then one row with each column as a cell
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columns
  ], document);

  element.replaceWith(table);
}
