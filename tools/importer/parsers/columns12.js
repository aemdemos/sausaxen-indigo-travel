/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container and row for columns
  const container = element.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row.u-flex-wrapper');
  if (!row) return;

  // Get all immediate column elements
  const cols = Array.from(row.querySelectorAll(':scope > .col-md-6.u-flex'));
  if (!cols.length) return;

  // Prepare header: one cell only, regardless of column count
  const cells = [
    ['Columns (columns12)']
  ];
  // Each column's cell: collect ALL its direct content (not just .c-card__inner)
  // This makes it robust and future proof for more complex layouts
  const contentRow = cols.map((col) => {
    // Gather all children of the col into one fragment per cell
    const fragment = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      fragment.appendChild(node);
    });
    return fragment;
  });
  cells.push(contentRow);

  // Create the table block and replace the original section
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
