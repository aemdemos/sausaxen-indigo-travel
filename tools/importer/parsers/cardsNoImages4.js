/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cardsNoImages4)'];
  const rows = [headerRow];
  // Each card is a direct child div (col-md-6 col-xl-4 ...)
  const cardContainers = element.querySelectorAll(':scope > div');
  cardContainers.forEach((cardContainer) => {
    // Find the card content (should always have this in the given structure)
    const content = cardContainer.querySelector('.c-card--product__content');
    if (content) {
      // Try for a heading (h3, or with c-card--product__heading or u-h4)
      const heading = content.querySelector('h3, .c-card--product__heading, .u-h4');
      // Try for main description (should be .c-card--product__description or direct p)
      let description = content.querySelector('.c-card--product__description');
      // Fallback: If no .c-card--product__description, try for a p directly in content
      if (!description) description = content.querySelector('p');
      // Compose the card cell
      const wrapper = document.createElement('div');
      if (heading) wrapper.appendChild(heading);
      if (description) {
        if (description.parentElement === wrapper) {
          // already appended
        } else if (description.tagName.toLowerCase() === 'p') {
          wrapper.appendChild(description);
        } else {
          Array.from(description.childNodes).forEach((node) => {
            wrapper.appendChild(node);
          });
        }
      }
      rows.push([wrapper]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
