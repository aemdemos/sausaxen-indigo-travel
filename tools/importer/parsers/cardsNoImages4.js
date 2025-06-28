/* global WebImporter */
export default function parse(element, { document }) {
  // The Cards (cardsNoImages4) block requires a 1-column table: header + 1 row per card.
  const cells = [['Cards (cardsNoImages4)']];

  // Each card is a direct child div (corresponding to a column/card)
  const cardContainers = element.querySelectorAll(':scope > div');
  cardContainers.forEach((card) => {
    // Find the content wrapper for the card
    const content = card.querySelector('.c-card--product__content') || card;

    // Find heading (h3 inside content)
    const heading = content.querySelector('h3');
    // Find description (usually p inside .c-card--product__description)
    let description = content.querySelector('.c-card--product__description p');
    if (!description) {
      // fallback: maybe just .c-card--product__description
      description = content.querySelector('.c-card--product__description');
    }

    // Construct the cell content: heading first (if present), then description (if present)
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    cells.push([cellContent]);
  });

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
