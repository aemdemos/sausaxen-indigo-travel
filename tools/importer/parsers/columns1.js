/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract left column (content)
  const contentWrapper = element.querySelector('.c-hero-header-key-callout__content-wrapper');
  let leftColNodes = [];
  if (contentWrapper) {
    const body = contentWrapper.querySelector('.c-content-container__body');
    if (body) {
      leftColNodes = Array.from(body.childNodes).filter(node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0);
    } else {
      leftColNodes = Array.from(contentWrapper.childNodes).filter(node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0);
    }
  }

  // 2. Extract right column (image)
  const imageWrapper = element.querySelector('.c-hero-header-key-callout__image-wrapper');
  let rightColNode = null;
  if (imageWrapper) {
    const style = imageWrapper.getAttribute('style') || '';
    let imageUrl = null;
    let match = style.match(/--image-large: url\('([^']+)'/);
    if (!match) match = style.match(/--image-medium: url\('([^']+)'/);
    if (!match) match = style.match(/--image-small: url\('([^']+)'/);
    if (match) {
      imageUrl = match[1];
    }
    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = '';
      rightColNode = img;
    } else {
      rightColNode = imageWrapper;
    }
  }

  // 3. Build table: header is single column, second row has two columns
  const cells = [];
  // Header row: one column only
  cells.push(['Columns (columns1)']);
  // Content row: two columns
  cells.push([leftColNodes, rightColNode]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
