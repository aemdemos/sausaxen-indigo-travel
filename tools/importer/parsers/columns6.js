/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the deepest container > row with two cols
  let col1 = null;
  let col2 = null;

  // Try to find the deepest .container > .container > .row
  let containers = element.querySelectorAll('.container');
  let row = null;
  for (let i = containers.length - 1; i >= 0; i--) {
    const r = containers[i].querySelector('.row');
    if (r && r.querySelector('.col-md-8') && r.querySelector('.col-md-4')) {
      row = r;
      break;
    }
  }
  if (!row) {
    // fallback: any .row with two columns
    row = element.querySelector('.row');
  }
  if (row) {
    col1 = row.querySelector('.col-md-8');
    col2 = row.querySelector('.col-md-4');
    // fallback: just take two divs under row
    if ((!col1 || !col2) && row.children.length >= 2) {
      const divs = Array.from(row.children).filter(child => child.nodeType === 1 && child.tagName === 'DIV');
      if (divs.length >= 2) {
        col1 = divs[0];
        col2 = divs[1];
      }
    }
  }

  // Defensive: if any col is missing, fallback to empty div
  if (!col1) {
    col1 = document.createElement('div');
  }
  if (!col2) {
    col2 = document.createElement('div');
  }

  // Construct table, header is EXACTLY 'Columns (columns6)'
  const cells = [
    ['Columns (columns6)'],
    [col1, col2],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
