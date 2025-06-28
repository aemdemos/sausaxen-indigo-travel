/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the columns from the inner container structure
  let col1 = null;
  let col2 = null;
  // Look for nested containers/rows/columns
  const rows = element.querySelectorAll('.container .row');
  for (const row of rows) {
    const cols = row.querySelectorAll('.col-md-8, .col-md-4');
    if (cols.length === 2) {
      col1 = cols[0];
      col2 = cols[1];
      break;
    }
  }
  // Fallback: if not found, pick the first two columns matching col-md-8/col-md-4
  if (!col1 || !col2) {
    const cols = element.querySelectorAll('.col-md-8, .col-md-4');
    if (cols.length >= 2) {
      col1 = cols[0];
      col2 = cols[1];
    }
  }
  // Fallback: use the whole element in one column if no columns
  if (!col1) {
    col1 = element;
  }
  if (!col2) {
    col2 = document.createElement('div');
  }
  // Table header as specified
  const headerRow = ['Columns (columns6)'];
  const contentRow = [col1, col2];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
