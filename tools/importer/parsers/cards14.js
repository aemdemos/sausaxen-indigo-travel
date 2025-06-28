/* global WebImporter */
export default function parse(element, { document }) {
  // Create the correct header row: single cell with the block name
  const headerRow = ['Cards (cards14)'];
  const rows = [];

  // Find the <ol> containing the disclaimers (cards)
  const ol = element.querySelector('ol');
  if (!ol) return;

  // Each <li> is one card: two columns, first is image/icon (none here, so empty), second is full disclaimer text
  ol.querySelectorAll('li').forEach(li => {
    // Gather all direct children (usually <p>, possibly more)
    const cellContents = Array.from(li.childNodes).filter(n => (
      n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    ));
    // Structure: [image/icon, text content]
    rows.push(['', cellContents.length === 1 ? cellContents[0] : cellContents]);
  });

  // The block array must have a single-cell header row, and each card row with two cells
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(block);
}
