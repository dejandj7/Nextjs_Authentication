import store from "store";
import USER from "./constants";

const initialState = {
  data: [],
  user: { id: 1 },
  error: null,
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case USER.USERS_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.users,
      };
    case USER.USER_REQUEST_SUCCESS:
      return {
        ...state,
        user: action.user,
      };
    case USER.USER_REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case USER.USERS_CLEAN_REQUEST:
      return {
        ...state,
        data: [],
        user: null,
        error: null,
      };
    default:
      return state;
  }
}
