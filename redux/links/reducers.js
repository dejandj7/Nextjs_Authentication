import LINKS from "./constants";

const initialState = {
  data: [],
};

export default function linksReducer(state = initialState, action) {
  switch (action.type) {
    case LINKS.RESPONSE_LINKS:
      return { data: action.links };
    default:
      return state;
  }
}
