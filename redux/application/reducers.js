import APP_STATUS from "./constants";
import SIGNALR_TYPES from "../signalR/constants";

const initialState = {
  data: null,
};

export default function applicationReducer(state = initialState, action) {
  switch (action.type) {
    case SIGNALR_TYPES.APPLICATION_STATUS_UPDATE:
      return {
        ...state,
        data: action.statusUpdate,
      };

    case APP_STATUS.RESET: {
      return {
        data: null,
      };
    }
    default:
      return state;
  }
}
