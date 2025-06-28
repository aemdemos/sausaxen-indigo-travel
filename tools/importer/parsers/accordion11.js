/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, exactly as in the example
  const headerRow = ['Accordion'];

  // Find all accordion items (direct children)
  const items = element.querySelectorAll(':scope > .c-accordion__item');

  const rows = Array.from(items).map((item) => {
    // Title cell: get the span.item-title inside the button
    const button = item.querySelector('.c-accordion__header-button');
    let titleContent = '';
    if (button) {
      const titleSpan = button.querySelector('.item-title');
      if (titleSpan) {
        titleContent = titleSpan;
      }
    }

    // Content cell: use the .c-accordion__content__details div (reference, do not clone)
    let details = item.querySelector('.c-accordion__content__details');
    let contentCell = '';
    if (details) {
      contentCell = details;
    }

    return [titleContent, contentCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  element.replaceWith(table);
}
