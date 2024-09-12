import TENDERS from "./constants";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
  refreshTenders: true,
};

export default function tendersReducer(state = initialState, action) {
  switch (action.type) {
    case TENDERS.GOT_TENDERS:
      return { data: action.tenders, error: null };
    case TENDERS.LOADING:
      return { ...state, isLoading: action.loading, refreshTenders: false };
    case TENDERS.REQUEST_ERROR:
      return { ...state, error: action.error, data: [] };
    default:
      return state;
  }
}
