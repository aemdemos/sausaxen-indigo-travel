/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost row with two columns containing the actual content
  let layoutRow = null;
  // Search for the row with two columns that contain the actual block content
  const rows = element.querySelectorAll('.row');
  for (const row of rows) {
    const directCols = Array.from(row.children).filter(
      (child) => child.matches('[class*="col-"]')
    );
    if (directCols.length === 2) {
      layoutRow = row;
      break;
    }
  }
  if (!layoutRow) return; // Exit if expected structure not found

  // Get both column elements
  const columns = Array.from(layoutRow.children).filter(x => x.matches('[class*="col-"]'));
  const leftCol = columns[0];
  const rightCol = columns[1];

  // The block table needs the proper header and both columns as the content row
  const headerRow = ['Columns (columns6)'];
  const contentRow = [leftCol, rightCol];

  // Create the columns block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the entire source element with the new table
  element.replaceWith(block);
}
