/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the example
  const cells = [['Cards (cards10)']];

  // Find all card containers (direct children)
  const cardContainers = element.querySelectorAll(':scope > div');

  cardContainers.forEach((card) => {
    // Icon (first cell)
    let iconCell = '';
    const iconWrapper = card.querySelector('.icon-wrapper');
    if (iconWrapper) {
      const icon = iconWrapper.querySelector('i');
      if (icon) {
        iconCell = icon;
      } else {
        iconCell = iconWrapper;
      }
    }

    // Text content (second cell)
    const textContent = [];
    // Heading/title
    const heading = card.querySelector('h1, h2, h3, h4, .c-card--product__heading');
    if (heading) textContent.push(heading);
    // Description
    const description = card.querySelector('.c-card--product__description, p');
    if (description) textContent.push(description);
    // CTA link/button
    const ctaWrapper = card.querySelector('.c-button-wrapper-stack');
    let cta = null;
    if (ctaWrapper) {
      cta = ctaWrapper.querySelector('a');
      if (cta) textContent.push(cta);
    }
    // fallback if direct link
    if (!cta) {
      const link = card.querySelector('a');
      if (link && (!ctaWrapper || !ctaWrapper.contains(link))) textContent.push(link);
    }

    cells.push([
      iconCell,
      textContent
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
