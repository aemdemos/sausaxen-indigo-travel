/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icons block wrapper
  const iconsWrapper = element.querySelector('.c-cvp-icons__items');
  if (!iconsWrapper) return;

  // Get all icon item columns
  const iconItems = Array.from(iconsWrapper.children);

  // For each column, gather all child elements (filter out whitespace-only text nodes)
  const cols = iconItems.map((iconItem) => {
    // Aggregate all non-empty child nodes
    const children = Array.from(iconItem.childNodes).filter(
      node =>
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
    );
    // If only one node, just return it, otherwise, return the array
    return children.length === 1 ? children[0] : children;
  });

  // Build the block header row exactly as specified
  const headerRow = ['Columns (columns2)'];
  const cells = [headerRow, cols];

  // Create and replace the table using the provided helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
