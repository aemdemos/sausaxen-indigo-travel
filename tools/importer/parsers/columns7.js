/* global WebImporter */
export default function parse(element, { document }) {
  // Outer container and row detection
  const outerContainer = element.querySelector('.container');
  if (!outerContainer) return;
  const row = outerContainer.querySelector('.row');
  if (!row) return;
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: heading and description
  const leftCol = columns[0];
  let leftContentElements = [];
  // Find the content area within leftCol
  // This is to guard against wrapping containers
  const possibleContent = leftCol.querySelector('.c-free-text__content .container .row .col-xs-12.col-md-8');
  let heading, para;
  if (possibleContent) {
    heading = possibleContent.querySelector('h2');
    para = possibleContent.querySelector('p');
  } else {
    heading = leftCol.querySelector('h2');
    para = leftCol.querySelector('p');
  }
  if (heading) leftContentElements.push(heading);
  if (para) leftContentElements.push(para);
  
  // Right column: badge images
  const rightCol = columns[1];
  let badgeImgs = [];
  // Find the image columns
  // Defensive: look for .col-xs-6 > img
  const imgCols = rightCol.querySelectorAll('.col-xs-6');
  imgCols.forEach(col => {
    const img = col.querySelector('img');
    if (img) badgeImgs.push(img);
  });

  // If fallback needed, look for any images
  if (badgeImgs.length === 0) {
    badgeImgs = Array.from(rightCol.querySelectorAll('img'));
  }
  
  // Table header matches spec exactly
  const headerRow = ['Columns (columns7)'];
  // Compose table: two columns, first is left content, second is badges array
  const cells = [
    headerRow,
    [leftContentElements, badgeImgs]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
