/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column, as required
  const rows = [['Cards (cards3)']];

  // Data rows: each with two columns (image/icon or blank, then text content)
  const slides = element.querySelectorAll('.swiper-wrapper > .swiper-slide');
  slides.forEach(slide => {
    const card = slide.querySelector('.c-product-selector__card');
    if (card) {
      rows.push(['', card]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
