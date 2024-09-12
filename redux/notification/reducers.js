import NOTIFICATION from "./constants";
import SIGNALR_TYPES from "../signalR/constants";
import { USER_TASK } from "../usertask/constants";

const initialState = {
  data: [],
  notifactionTemplates: [],
  notification: null,
  notificationId: null,
  error: null,
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION.CLEAN_STATE:
      return {};
    case NOTIFICATION.NOTIFICATIONS_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.notifications,
      };
    case NOTIFICATION.NOTIFICATIONS_CLEAN_REQUEST:
      return {
        ...state,
        data: [],
      };
    case NOTIFICATION.NOTIFICATION_REQUEST_SUCCESS:
      return {
        ...state,
        notification: action.notification,
      };
    case NOTIFICATION.NOTIFICATION_ID_REQUEST_SUCCESS:
      return {
        ...state,
        notification: action.payload,
      };
    case NOTIFICATION.NOTIFICATION_REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case SIGNALR_TYPES.NEW_NOTIFICATION:
      if (action.notification.userId === action.userId) {
        tmpData = [
          ...state.data,
          { ...action.notification, _id: action.notification.id },
        ];
      } else {
        tmpData = [...state.data];
      }
      return {
        ...state,
        data: [...tmpData],
      };
    case USER_TASK.RESPONSE_NOTIFICATIONS:
      return { data: action.notifications };
    case USER_TASK.UPDATE_NOTIFICATION_SUCCESS: {
      tmpData = state.data.filter((item) => item._id !== action.notificationId);
      return {
        data: [...tmpData],
      };
    }
    case NOTIFICATION.USER_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications,
      };
    default:
      return state;
  }
}
