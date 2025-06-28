/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be two columns to match example ([block name, blank])
  const cells = [['Cards (cards3)', '']];

  // Find carousel slides
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  const slides = wrapper.querySelectorAll('.swiper-slide');
  slides.forEach((slide) => {
    const card = slide.querySelector('.c-product-selector__card');
    if (!card) return;
    // Left column: blank (no image/icon)
    const leftCell = '';
    // Right column: array of card's main block-level children (reference, not clone)
    const rightCell = [];
    for (const child of card.children) {
      if (child.nodeType === Node.ELEMENT_NODE) rightCell.push(child);
    }
    cells.push([leftCell, rightCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
