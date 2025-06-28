/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row that contains the columns
  const row = element.querySelector('.row.u-flex-wrapper');
  if (!row) return;
  // Get all direct column elements
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-md-6'));

  // Gather the content of each column
  const cells = columns.map(col => {
    const cardInner = col.querySelector('.c-card__inner');
    if (cardInner) {
      return cardInner;
    }
    return '';
  });

  // Only continue if we have at least one column
  if (cells.length === 0) return;

  // Structure the table: header row should be a single cell, content row has one cell per column
  const tableArr = [
    ['Columns (columns12)'],
    cells
  ];

  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
