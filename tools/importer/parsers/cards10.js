/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards10)'];
  const cardContainers = element.querySelectorAll(':scope > div');
  const rows = [headerRow];

  cardContainers.forEach(cardEl => {
    // Icon cell: find the icon-wrapper
    let iconCell = null;
    const iconWrapper = cardEl.querySelector('.icon-wrapper');
    if (iconWrapper) {
      iconCell = iconWrapper;
    }

    // Text content cell: Heading, description, button (reference original elements only)
    const fragments = [];
    // Heading
    const heading = cardEl.querySelector('.c-card--product__heading');
    if (heading) {
      fragments.push(heading);
    }
    // Description
    const desc = cardEl.querySelector('.c-card--product__description p');
    if (desc) {
      fragments.push(desc);
    }
    // CTA Button
    const btn = cardEl.querySelector('.c-button-wrapper-stack a');
    if (btn) {
      fragments.push(btn);
    }
    rows.push([
      iconCell,
      fragments
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
