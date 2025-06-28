/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main two-column section within the given element
  const twoColSection = element.querySelector('.c-two-col-generic');
  if (!twoColSection) return;

  // Get the columns (image and text)
  const row = twoColSection.querySelector('.row');
  if (!row) return;
  const colDivs = row.querySelectorAll(':scope > div');
  if (colDivs.length < 2) return;

  // --- First Column: Image ---
  const imgCol = colDivs[0];
  // Get the background image URL from style
  let imgUrl = '';
  if (imgCol.style && imgCol.style.backgroundImage) {
    imgUrl = imgCol.style.backgroundImage.replace(/url\(["']?(.*?)["']?\)/, '$1');
  }
  let imgEl = null;
  if (imgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    imgEl.alt = '';
  }

  // --- Second Column: Text ---
  const textCol = colDivs[1];
  // Compose the text (keep all card content and button wrapper together)
  const card = textCol.querySelector('.c-card');
  let textContentContainer = document.createElement('div');
  if (card) {
    // Use all direct children of the card to preserve structure
    card.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        textContentContainer.appendChild(node);
      }
    });
  } else {
    // fallback: include all children
    textCol.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        textContentContainer.appendChild(node);
      }
    });
  }

  // --- Build the block table ---
  const headerRow = ['Columns (columns8)'];
  const contentRow = [imgEl, textContentContainer];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
