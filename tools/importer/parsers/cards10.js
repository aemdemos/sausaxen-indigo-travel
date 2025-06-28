/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row, exactly as required
  const cells = [['Cards (cards10)']];
  // Get all immediate card columns
  const cardColumns = element.querySelectorAll(':scope > div');
  cardColumns.forEach(cardCol => {
    // Get the card element
    const card = cardCol.querySelector('.c-card--product');
    if (!card) return;

    // --- ICON/CELL 1 ---
    let iconCell = '';
    const iconWrap = card.querySelector('.icon-wrapper');
    if (iconWrap) {
      const icon = iconWrap.querySelector('i');
      if (icon) {
        // Use existing <i> (do not clone)
        iconCell = icon;
      }
    }

    // --- TEXT CONTENT/CELL 2 ---
    const textContent = [];
    // Heading
    const heading = card.querySelector('.c-card--product__heading');
    if (heading) textContent.push(heading);
    // Description
    const descContainer = card.querySelector('.c-card--product__description');
    if (descContainer) {
      // Only add the <p> inside, not div wrapper
      const descP = descContainer.querySelector('p');
      if (descP) textContent.push(descP);
    }
    // CTA Link
    const cta = card.querySelector('.c-button-wrapper-stack a');
    if (cta) textContent.push(cta);

    cells.push([
      iconCell,
      textContent
    ]);
  });

  // Create table and replace original
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
