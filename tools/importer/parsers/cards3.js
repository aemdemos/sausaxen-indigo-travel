/* global WebImporter */
export default function parse(element, { document }) {
  // Get all slide cards
  const slides = element.querySelectorAll('.swiper-slide');
  const rows = [['Cards (cards3)']]; // Header row, exactly as in the example (single column)

  slides.forEach((slide) => {
    const card = slide.querySelector('.c-product-selector__card');
    if (!card) return;

    // First cell: empty string because there is no image/icon in the card
    const imageCell = '';

    // Second cell: structured card content using CLONES, not original nodes
    const contentFragment = document.createElement('div');

    // Product title and list
    const product = card.querySelector('.c-product-selector__card__product');
    if (product) {
      const h3 = product.querySelector('h3');
      if (h3) {
        contentFragment.appendChild(h3.cloneNode(true));
      }
      const list = product.querySelector('ul');
      if (list) {
        contentFragment.appendChild(list.cloneNode(true));
      }
    }
    // Rates
    const rates = card.querySelector('.c-product-selector__card__rates');
    if (rates) contentFragment.appendChild(rates.cloneNode(true));
    // Features
    const features = card.querySelector('.c-product-selector__card__features');
    if (features) contentFragment.appendChild(features.cloneNode(true));
    // Repayments and CTA
    const repayments = card.querySelector('.c-product-selector__card__repayments');
    if (repayments) contentFragment.appendChild(repayments.cloneNode(true));

    rows.push([imageCell, contentFragment]); // Two columns per row after header
  });

  // Replace the element with the generated table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
