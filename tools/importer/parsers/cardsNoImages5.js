/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content section holding the cards
  const contentSection = element.querySelector('.c-how-it-works__content');
  if (!contentSection) return;

  // Function to collect paragraphs and nested sections' paragraphs in order
  function collectCardParagraphs(parent) {
    const children = Array.from(parent.children);
    let result = [];
    for (const child of children) {
      if (child.tagName === 'P') {
        result.push(child);
      } else if (child.tagName === 'SECTION') {
        // Only direct <p> children of SECTION; order is preserved
        result.push(...collectCardParagraphs(child));
      }
    }
    return result;
  }

  // Get all paragraphs in source order, including those in nested sections
  const allParagraphs = collectCardParagraphs(contentSection);

  // Group pairs: a <p> with <strong>, then a <p> without (description)
  const cardRows = [];
  let i = 0;
  while (i < allParagraphs.length) {
    const titleP = allParagraphs[i];
    if (titleP.querySelector('strong')) {
      const cardCells = [titleP];
      const descP = allParagraphs[i + 1];
      if (descP && !descP.querySelector('strong')) {
        cardCells.push(descP);
        i += 2;
      } else {
        i += 1;
      }
      cardRows.push([cardCells]);
    } else {
      // If there's a paragraph not matching the pattern, skip it
      i += 1;
    }
  }

  // Block header as specified by the example
  const cells = [
    ['Cards (cardsNoImages5)'],
    ...cardRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
