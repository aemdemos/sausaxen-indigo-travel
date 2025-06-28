/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest row that contains the two columns (text and logo)
  let contentRow = null;
  let columns = null;
  // Search for div.container > div.row that has two direct >div children
  const containerRows = element.querySelectorAll('div.container > div.row');
  for (const row of containerRows) {
    const directCols = row.querySelectorAll(':scope > div');
    if (directCols.length === 2) {
      columns = directCols;
      contentRow = row;
      break;
    }
  }
  // Fallback: try to find any row with two columns
  if (!columns) {
    const rows = element.querySelectorAll('div.row');
    for (const row of rows) {
      const directCols = row.querySelectorAll(':scope > div');
      if (directCols.length === 2) {
        columns = directCols;
        contentRow = row;
        break;
      }
    }
  }
  // Defensive: if not exactly 2 columns found, exit function
  if (!columns || columns.length !== 2) {
    return;
  }

  // Use the entire column elements as cells, preserving all nested structure
  const headerRow = ['Columns (columns6)'];
  const contentRowArr = [columns[0], columns[1]];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRowArr
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
