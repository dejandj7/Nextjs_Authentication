import SIGNALR_TYPES from "../signalR/constants";

export default function signalRReducer(state = "", action) {
  switch (action.type) {
    case SIGNALR_TYPES.SIGNALR_STATUS_UPDATE:
      return action.status;
    default:
      return state;
  }
}
