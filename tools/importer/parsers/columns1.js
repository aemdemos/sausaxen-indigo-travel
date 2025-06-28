/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the hero image URL from inline styles
  function getHeroImageUrl(wrapperDiv) {
    if (!wrapperDiv) return null;
    const style = wrapperDiv.getAttribute('style');
    if (!style) return null;
    let match = style.match(/--image-large:\s*url\('([^']+)'\)/);
    if (!match) {
      match = style.match(/--image-medium:\s*url\('([^']+)'\)/);
    }
    if (!match) {
      match = style.match(/--image-small:\s*url\('([^']+)'\)/);
    }
    return match ? match[1] : null;
  }

  // Find the grid container (main columns structure)
  const grid = element.querySelector('.container-grid');
  if (!grid) return;
  // Left: Content wrapper, Right: Image wrapper
  const contentWrapper = grid.querySelector('.c-hero-header-key-callout__content-wrapper');
  const imageWrapper = grid.querySelector('.c-hero-header-key-callout__image-wrapper');

  // Left column content
  let leftContent = null;
  if (contentWrapper) {
    const containerBody = contentWrapper.querySelector('.c-content-container__body');
    if (containerBody) {
      leftContent = containerBody;
    } else {
      leftContent = contentWrapper;
    }
  } else {
    leftContent = '';
  }

  // Right column content: the image, only if the URL exists
  let rightContent = '';
  const imageUrl = getHeroImageUrl(imageWrapper);
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.setAttribute('loading', 'lazy');
    rightContent = img;
  }

  // The header row must have one cell, but for proper alignment, create two columns for data row
  const rows = [];
  // Header row: a single cell, no empty cells for remaining columns
  rows.push(['Columns (columns1)']);
  // Data row: two columns
  rows.push([leftContent, rightContent]);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the table so the header <th> spans both columns
  const th = table.querySelector('th');
  if (th && table.rows[1] && table.rows[1].cells.length > 1) {
    th.colSpan = table.rows[1].cells.length;
  }

  element.replaceWith(table);
}
