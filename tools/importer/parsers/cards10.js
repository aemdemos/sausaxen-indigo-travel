/* global WebImporter */
export default function parse(element, { document }) {
  // Initialize rows with the exact header
  const rows = [['Cards (cards10)']];

  // Select all direct card containers
  const cardContainers = element.querySelectorAll(':scope > div');

  cardContainers.forEach((container) => {
    // --- ICON CELL: Try to find a meaningful icon or image ---
    let iconCell = null;
    const iconWrapper = container.querySelector('.icon-wrapper');
    if (iconWrapper) {
      // Reference the icon wrapper directly (may include <i> or other icons)
      iconCell = iconWrapper;
    } else {
      // fallback is an empty cell
      iconCell = document.createElement('span');
    }

    // --- TEXT CELL ---
    const textContent = [];
    // Title
    const heading = container.querySelector('.c-card--product__heading');
    if (heading) textContent.push(heading);
    // Description
    const desc = container.querySelector('.c-card--product__description');
    if (desc) textContent.push(desc);
    // CTA (button/link)
    const ctaWrap = container.querySelector('.c-button-wrapper-stack');
    if (ctaWrap) textContent.push(ctaWrap);
    // Edge case: If all are missing, use an empty cell
    if (textContent.length === 0) {
      textContent.push(document.createElement('span'));
    }

    rows.push([
      iconCell,
      textContent
    ]);
  });

  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}