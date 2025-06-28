/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style
  function extractBgImageUrl(style) {
    if (!style) return null;
    // Prefer --image-large
    const regex = /--image-(large|medium|small): url\('([^']+)'/g;
    let match, url = null;
    while ((match = regex.exec(style)) !== null) {
      url = match[2];
      if (match[1] === 'large') break;
    }
    return url;
  }

  // Find grid container
  const container = element.querySelector('.container-grid');
  if (!container) return;

  // Identify columns
  const contentWrapper = container.querySelector('.c-hero-header-key-callout__content-wrapper');
  const imageWrapper = container.querySelector('.c-hero-header-key-callout__image-wrapper');

  // Left column content
  let leftCellContent = [];
  if (contentWrapper) {
    const contentContainer = contentWrapper.querySelector('.c-content-container');
    if (contentContainer) leftCellContent.push(contentContainer);
  }
  if (leftCellContent.length === 0) leftCellContent = [''];

  // Right column content (image from background)
  let rightCellContent = [];
  if (imageWrapper) {
    const style = imageWrapper.getAttribute('style') || '';
    const imgUrl = extractBgImageUrl(style);
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      rightCellContent.push(img);
    }
  }
  if (rightCellContent.length === 0) rightCellContent = [''];

  // Build table: header row is a single cell, second row has two cells
  const headerRow = ['Columns (columns1)']; // Single-cell header row
  const contentRow = [
    leftCellContent.length === 1 ? leftCellContent[0] : leftCellContent,
    rightCellContent.length === 1 ? rightCellContent[0] : rightCellContent
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
