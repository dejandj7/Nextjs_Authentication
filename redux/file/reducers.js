import FILE from './constants';

const initialState = {
  status: null,
  error: null
};

export default function fileReducer(state = initialState, action) {
  switch (action.type) {
    case FILE.DELETE_FILE_SUCCESS:
      return {
        ...state,
        status: action.status,
      };
  case FILE.DELETE_FILE_ERROR:
        return {
          ...state,
          error: action.error,
        };
    default:
      return state;
  }
}
