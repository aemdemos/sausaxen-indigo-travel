/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row as per the required format
  const headerRow = ['Cards (cardsNoImages5)'];

  // Find the container that holds the card content
  const cardsContainer = element.querySelector('.c-how-it-works__content');
  if (!cardsContainer) return;

  // Prepare to collect card rows
  const cardRows = [];
  // Get all children of the card container
  const children = Array.from(cardsContainer.childNodes);

  // This function extracts a card (title + description) from current index
  function extractCard(startIdx, arr) {
    const cardElements = [];
    let idx = startIdx;
    // Find the first <p> with <strong> (title)
    while (idx < arr.length) {
      const node = arr[idx];
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'P' &&
        node.querySelector('strong')
      ) {
        cardElements.push(node);
        idx++;
        // Find the next <p> that does not have <strong> (description—optional)
        while (idx < arr.length) {
          const desc = arr[idx];
          if (
            desc.nodeType === Node.ELEMENT_NODE &&
            desc.tagName === 'P' &&
            !desc.querySelector('strong')
          ) {
            cardElements.push(desc);
            idx++;
            break;
          } else if (desc.nodeType === Node.ELEMENT_NODE && desc.tagName === 'P') {
            break; // next <p> with <strong> is another card
          } else {
            idx++;
          }
        }
        break; // Card found
      } else {
        idx++;
      }
    }
    return cardElements.length ? { card: cardElements, nextIdx: idx } : null;
  }

  // Walk through children and extract all card blocks (pairs)
  let i = 0;
  while (i < children.length) {
    const result = extractCard(i, children);
    if (result) {
      cardRows.push([result.card]);
      i = result.nextIdx;
    } else {
      i++;
    }
  }

  // Also, check for <section> (like Redraw-facility) inside cardsContainer for additional cards
  cardsContainer.querySelectorAll(':scope > section').forEach(section => {
    const sectionChildren = Array.from(section.childNodes);
    let j = 0;
    while (j < sectionChildren.length) {
      const result = extractCard(j, sectionChildren);
      if (result) {
        cardRows.push([result.card]);
        j = result.nextIdx;
      } else {
        j++;
      }
    }
  });

  // Only build table if we have cards
  if (cardRows.length) {
    const cells = [headerRow, ...cardRows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
