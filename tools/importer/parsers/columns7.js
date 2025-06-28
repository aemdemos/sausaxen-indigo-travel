/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost content row containing the columns
  const mainRow = element.querySelector('.c-free-text__content .container .row');
  if (!mainRow) return;

  // Find left and right columns
  const leftCol = mainRow.querySelector('.col-xs-12.col-md-8');
  const rightCol = mainRow.querySelector('.col-xs-12.col-md-4');

  // Prepare leftCol content
  let leftContent = '';
  if (leftCol) {
    // Use all children as content (heading and paragraph)
    leftContent = Array.from(leftCol.childNodes).filter(node =>
      (node.nodeType === 1 && (node.tagName.match(/^H[1-6]$/) || node.tagName === 'P'))
    );
    // If nothing found, fallback to the column itself
    if (leftContent.length === 0) leftContent = [leftCol];
  }

  // Prepare rightCol images as an array (side by side)
  let rightImages = '';
  if (rightCol) {
    // rightCol structure is <div class="row"><div class="col-xs-6">...</div><div class="col-xs-6">...</div></div>
    const innerRow = rightCol.querySelector('.row');
    if (innerRow) {
      rightImages = Array.from(innerRow.querySelectorAll('img'));
      if (rightImages.length === 0) rightImages = [rightCol];
    } else {
      // fallback
      rightImages = [rightCol];
    }
  }

  // Construct the block table as 2 columns: left (text), right (badges)
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns7)'],
    [leftContent, rightImages]
  ], document);

  element.replaceWith(table);
}
