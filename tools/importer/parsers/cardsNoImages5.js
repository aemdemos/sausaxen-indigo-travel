/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const cells = [
    ['Cards (cardsNoImages5)']
  ];

  // Find the content column containing the cards content
  const contentCol = element.querySelector('.col-lg-8.c-how-it-works__content');
  if (!contentCol) return;

  // Collect all <p> elements that are direct children of contentCol or inside its <section> direct children
  const ps = Array.from(contentCol.querySelectorAll(':scope > p, :scope > section > p'));
  
  // Each card is represented by a pair of <p>: title then description
  for (let i = 0; i < ps.length; i += 2) {
    const pTitle = ps[i];
    const pDesc = ps[i+1];

    // For semantic accuracy, preserve <strong> and <sup> in the title
    // Also preserve possible <sup> after <strong> within the same <p>
    const titleFragment = document.createDocumentFragment();
    if (pTitle) {
      // Find strong
      const strong = pTitle.querySelector('strong');
      if (strong) {
        titleFragment.appendChild(strong);
        // Append any <sup> directly after <strong>
        let next = strong.nextSibling;
        while (next) {
          if (next.nodeType === 1 && next.tagName === 'SUP') {
            titleFragment.appendChild(next);
          } else if (next.nodeType === 3 && next.textContent.trim() === '') {
            // skip whitespace text nodes
          } else {
            break;
          }
          next = next.nextSibling;
        }
      } else {
        // No <strong>, just use the whole <p>
        Array.from(pTitle.childNodes).forEach(node => titleFragment.appendChild(node));
      }
    }
    // Compose the card row: title (as fragment), then description (as <p>)
    const cardDiv = document.createElement('div');
    if (titleFragment.childNodes.length) {
      cardDiv.appendChild(titleFragment);
    }
    if (pDesc) {
      // Add a <br> for spacing (to match the example)
      cardDiv.appendChild(document.createElement('br'));
      // Add the description <p>
      cardDiv.appendChild(pDesc);
    }
    cells.push([cardDiv]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
