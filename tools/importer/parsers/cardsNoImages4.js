/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Cards (cardsNoImages4)'];
  // Select all direct child columns (cards)
  const cardContainers = element.querySelectorAll(':scope > div');
  const rows = Array.from(cardContainers).map((card) => {
    // The card content area
    const cardContent = card.querySelector('.c-card--product__content') || card;
    // Heading: look for the first heading element inside the card content
    const heading = cardContent.querySelector('h1, h2, h3, h4, h5, h6');
    // Description: look for the .c-card--product__description or first <p>
    let description = cardContent.querySelector('.c-card--product__description');
    if (!description) {
      description = cardContent.querySelector('p');
    }
    // Collect content for this card cell
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (description && !cellContent.includes(description)) cellContent.push(description);
    return [cellContent.length ? cellContent : ''];
  });
  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
