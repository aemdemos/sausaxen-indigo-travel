/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner section containing the columns content
  const section = element.querySelector('.c-flexible-wrapper.c-two-col-generic');
  if (!section) return;
  const container = section.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // LEFT COLUMN: Image as rendered in the design
  let colImageCell = null;
  const imgCol = cols[0];
  if (imgCol && imgCol.classList.contains('c-two-col-generic__image-wrapper')) {
    // Try to get the largest (desktop) image from background-image style
    const bgStyle = imgCol.style.backgroundImage;
    let imgUrl = null;
    if (bgStyle && bgStyle.startsWith('url(')) {
      imgUrl = bgStyle.slice(4, -1).replace(/"/g, '');
    }
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      colImageCell = img;
    }
  }

  // RIGHT COLUMN: Content (heading, paragraphs, list, links)
  let colContentCell = [];
  const textCol = cols[1];
  if (textCol) {
    const card = textCol.querySelector('.c-card');
    if (card) {
      // Card Content: h2, p, ol
      const content = card.querySelector('.c-card__content');
      if (content) {
        Array.from(content.children).forEach(child => colContentCell.push(child));
      }
      // Buttons/links
      const btnWrapper = card.querySelector('.c-button-wrapper');
      if (btnWrapper) {
        Array.from(btnWrapper.children).forEach(btn => colContentCell.push(btn));
      }
    }
  }

  // Header must exactly match: 'Columns (columns8)'
  const headerRow = ['Columns (columns8)'];
  const cellsRow = [colImageCell, colContentCell];

  // Create the block table (2 columns)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);

  element.replaceWith(table);
}
