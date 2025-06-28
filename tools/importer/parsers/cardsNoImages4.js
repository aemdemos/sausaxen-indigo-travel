/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cardsNoImages4)'];
  const rows = [headerRow];

  // Get all immediate card columns
  const cardCols = element.querySelectorAll(':scope > div');
  cardCols.forEach(col => {
    // Find the card content wrapper
    const cardContent = col.querySelector('.c-card--product__content');
    if (cardContent) {
      // We'll build a single wrapper div to hold the card content for resiliency
      const cardDiv = document.createElement('div');
      // Heading (if any)
      const heading = cardContent.querySelector('h3, .c-card--product__heading');
      if (heading) cardDiv.appendChild(heading);
      // Description (if any)
      const desc = cardContent.querySelector('.c-card--product__description');
      if (desc) {
        // Append all children (to include all text, preserve formatting)
        Array.from(desc.childNodes).forEach(child => cardDiv.appendChild(child));
      }
      // Only add non-empty cards
      if (cardDiv.childNodes.length > 0) {
        rows.push([cardDiv]);
      }
    }
  });
  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
