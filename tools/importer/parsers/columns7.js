/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main inner .container > .row for the block content
  const mainContainer = element.querySelector('.container > .row');
  if (!mainContainer) return;
  
  // Find the two primary columns: text and badges
  const textCol = mainContainer.querySelector('.col-xs-12.col-md-8');
  const badgeCol = mainContainer.querySelector('.col-xs-12.col-md-4');
  if (!textCol || !badgeCol) return;

  // Grab all children in textCol (heading + paragraph)
  const textColContent = Array.from(textCol.childNodes).filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()))
    .map((n) => n);

  // Find badge images in badgeCol
  const imgRow = badgeCol.querySelector('.row');
  let badgeImgs = [];
  if (imgRow) {
    badgeImgs = Array.from(imgRow.querySelectorAll('img'));
  } else {
    badgeImgs = Array.from(badgeCol.querySelectorAll('img'));
  }

  // Respect the table header naming exactly
  const headerRow = ['Columns (columns7)'];
  // Build the second row with two columns: [left text, right badges]
  const contentRow = [textColContent, badgeImgs];

  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
