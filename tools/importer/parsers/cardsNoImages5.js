/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: must match example exactly
  const cells = [['Cards (cardsNoImages5)']];

  // Find the container holding the cards (features/benefits)
  // It's the .col-lg-8.c-how-it-works__content
  const cardsContainer = element.querySelector('.col-lg-8.c-how-it-works__content');
  if (!cardsContainer) return;

  // The cards are structured as a series of <p><strong>Title</strong></p> followed by <p>Description</p>
  // and some are inside a <section> with two <p>s
  let current = cardsContainer.firstElementChild;
  while (current) {
    // 1. If this is a <p> with <strong>, treat as card title.
    if (current.tagName === 'P' && current.querySelector('strong')) {
      // Title is this <p>, description is next sibling <p> (if present and not a card title)
      const titleElem = current;
      let descElem = null;
      let next = titleElem.nextElementSibling;
      if (next && next.tagName === 'P' && !next.querySelector('strong')) {
        descElem = next;
      }
      // Collect all relevant elements into a fragment array (reuse references, don't clone, keep all semantic structure)
      const cellContent = [titleElem];
      if (descElem) {
        cellContent.push(document.createElement('br'));
        cellContent.push(descElem);
      }
      cells.push([cellContent]);
      // Move to next after description if we had one, else just after title
      current = descElem ? descElem.nextElementSibling : titleElem.nextElementSibling;
      continue;
    }
    // 2. If this is a <section>, treat its <p>s as a card as well
    if (current.tagName === 'SECTION') {
      const ps = current.querySelectorAll('p');
      if (ps.length > 0) {
        const cellContent = [ps[0]]; // title
        if (ps.length > 1) {
          cellContent.push(document.createElement('br'));
          cellContent.push(ps[1]); // description
        }
        cells.push([cellContent]);
      }
      current = current.nextElementSibling;
      continue;
    }
    // else skip non-card elements (e.g. button wrappers)
    current = current.nextElementSibling;
  }

  // Replace the original element with the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
