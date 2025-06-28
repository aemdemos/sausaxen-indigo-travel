/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost row that contains the two main columns
  const mainRow = element.querySelector('.c-free-text__content > .container > .row');
  if (!mainRow) return;

  // Left column: .col-xs-12.col-md-8
  const leftCol = mainRow.querySelector('.col-xs-12.col-md-8');
  // Right column: .col-xs-12.col-md-4 > .row
  const rightColRow = mainRow.querySelector('.col-xs-12.col-md-4 > .row');

  let leftCellContent = [];
  if (leftCol) {
    // Use all children of leftCol, preserving structure
    leftCellContent = Array.from(leftCol.childNodes).filter(
      node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
    );
  }

  let rightCellContent = [];
  if (rightColRow) {
    // Get all .col-xs-6 image containers
    const imgDivs = rightColRow.querySelectorAll('.col-xs-6');
    // Add all images in order
    imgDivs.forEach(div => {
      const img = div.querySelector('img');
      if (img) rightCellContent.push(img);
    });
  }

  // The block header must match exactly:
  const headerRow = ['Columns (columns7)'];
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
