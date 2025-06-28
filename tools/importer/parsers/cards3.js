/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell (one column)
  const headerRow = ['Cards (cards3)'];

  // Find all slides in the carousel
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.querySelectorAll(':scope > .swiper-slide'));

  // Each slide contains the card content
  const rows = slides.map((slide) => {
    const card = slide.querySelector('.c-product-selector__card');
    if (!card) return null;
    // Each row after the header should have exactly two cells:
    // - The first is always blank (no image in this card set)
    // - The second is the referenced card element
    return ['', card];
  }).filter(Boolean);

  // Combine the header row with the data rows
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
