/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flexible two column section
  const twoColSection = element.querySelector('.c-flexible-wrapper.c-two-col-generic');
  if (!twoColSection) return;

  // The two columns are children of .row.no-gutters.u-flex-wrapper
  const row = twoColSection.querySelector('.row.no-gutters.u-flex-wrapper');
  if (!row) return;
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // First column is the image (background)
  const imageCol = columns[0];
  let imageEl;
  // Try to extract the image URL from style or <span data-src>
  const bgStyle = imageCol.getAttribute('style') || '';
  const urlMatch = bgStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
  if (urlMatch && urlMatch[1]) {
    imageEl = document.createElement('img');
    imageEl.src = urlMatch[1];
    imageEl.alt = '';
  } else {
    // fallback: look for <span data-src>
    const srcSpan = imageCol.querySelector('span[data-src]');
    if (srcSpan) {
      imageEl = document.createElement('img');
      imageEl.src = srcSpan.getAttribute('data-src');
      imageEl.alt = '';
    } else {
      imageEl = document.createDocumentFragment();
    }
  }

  // Second column is the content
  const contentCol = columns[1];
  const card = contentCol.querySelector('.c-card');
  const contentBlock = card || contentCol;

  // Build table rows
  const dataRow = [imageEl, contentBlock];
  // Header row as a single <th> element with colspan matching dataRow length
  const th = document.createElement('th');
  th.textContent = 'Columns (columns8)';
  th.colSpan = dataRow.length;
  const headerRow = [th];

  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
