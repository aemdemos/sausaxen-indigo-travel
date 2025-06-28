/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left-hand (content) cell
  const leftWrapper = element.querySelector('.c-hero-header-key-callout__content-wrapper');
  let leftCell = '';
  if (leftWrapper) {
    leftCell = leftWrapper;
  }

  // Get the right-hand (image) cell
  let rightCell = '';
  const imgWrapper = element.querySelector('.c-hero-header-key-callout__image-wrapper');
  if (imgWrapper) {
    // Extract background image url from style
    const styleAttr = imgWrapper.getAttribute('style') || '';
    let imgUrl = '';
    const largeMatch = styleAttr.match(/--image-large:\s*url\('([^']+)'\)/);
    const mediumMatch = styleAttr.match(/--image-medium:\s*url\('([^']+)'\)/);
    const smallMatch = styleAttr.match(/--image-small:\s*url\('([^']+)'\)/);
    if (largeMatch) {
      imgUrl = largeMatch[1];
    } else if (mediumMatch) {
      imgUrl = mediumMatch[1];
    } else if (smallMatch) {
      imgUrl = smallMatch[1];
    }
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      rightCell = img;
    }
  }

  // Compose the table cells
  // Header row must be a single column
  const headerRow = ['Columns (columns1)'];
  // Content row: two columns/cells (left, right)
  const contentRow = [leftCell, rightCell];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
