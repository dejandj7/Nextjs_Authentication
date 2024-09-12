import LINKS from "./constants";

const receivedLinks = (gotLinks) => ({
  type: LINKS.GOT_LINKS,
  gotLinks,
});

const responseLinks = (links) => ({
  type: LINKS.RESPONSE_LINKS,
  links,
});

export { receivedLinks, responseLinks };
