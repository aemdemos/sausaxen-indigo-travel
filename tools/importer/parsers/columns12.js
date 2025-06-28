/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns row container
  const columnsWrapper = element.querySelector('.c-flexible-wrapper .container .row.u-flex-wrapper');
  if (!columnsWrapper) return;

  // Get all direct column divs
  const columnEls = Array.from(columnsWrapper.children).filter((col) => col.classList.contains('col-md-6'));
  if (columnEls.length === 0) return;

  // Extract the content from each column (prefer the .c-card__inner)
  const columnCells = columnEls.map((col) => {
    const cardInner = col.querySelector('.c-card__inner');
    return cardInner || col;
  });

  // The header row must have EXACTLY ONE CELL
  // The data row must have a cell for each column
  const rows = [
    ['Columns (columns12)'],
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // After table is created, set the header cell's colspan to match the number of data columns
  const headerRow = table.querySelector('tr:first-child th');
  if (headerRow && columnCells.length > 1) {
    headerRow.setAttribute('colspan', columnCells.length);
  }

  element.replaceWith(table);
}
