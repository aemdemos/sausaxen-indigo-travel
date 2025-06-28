/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icons items container
  const iconsItems = element.querySelector('.c-cvp-icons__items');
  if (!iconsItems) return;

  // Each icon item is a column
  const iconItems = Array.from(iconsItems.children).filter(e => e.classList.contains('c-cvp-icon-item'));

  // Collect the content for each column as an array
  const columns = iconItems.map(item => {
    const nodes = [];
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        nodes.push(node);
      }
    });
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  // The header row is a single cell (the block name)
  const headerRow = ['Columns (columns2)'];
  // The content row has one cell per column
  const contentRow = columns;
  const cells = [headerRow, contentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
