/* global WebImporter */
export default function parse(element, { document }) {
  // Get all <li> items (cards)
  const listItems = Array.from(element.querySelectorAll('ol > li'));

  // Header row should be a single column, exactly as in the example
  const headerRow = ['Cards (cards14)'];

  // Each card row should have two columns: [image/icon (empty), content]
  const rows = listItems.map((li) => {
    // Use <p> inside <li> if present for content
    const p = li.querySelector('p');
    const content = p || li;
    return ['', content];
  });

  // Build table: header is a single cell array, rest are arrays of two cells
  const tableArray = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
