/** section with logic about navigation / scrollIntoView to  advisor tile */
export const ADVISOR_TILE_ANCHOR_ID = 'offers-advisor-tile';

export const scrollToAdvisorTile = () => {
  const targetElement = document.getElementById(ADVISOR_TILE_ANCHOR_ID);
  if (!targetElement) {
    return;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  targetElement.scrollIntoView({ behavior: 'smooth' });
};
