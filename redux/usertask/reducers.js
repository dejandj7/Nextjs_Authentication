import { combineReducers } from "redux";
import { USER_TASK, APP_STATUS, PROFILE_STATUS } from "./constants";
import SIGNALR_TYPES from "../signalR/constants";

const userTaskLoadingReducer = (state = false, action) => {
  switch (action.type) {
    //COMPLETE_ERROR
    case USER_TASK.RESET:
      return false;
    case USER_TASK.USER_TASKS_LOADING:
      return action.isLoading;
    default:
      return state;
  }
};

const completeStatusUserTaskReducer = (state = "", action) => {
  switch (action.type) {
    case USER_TASK.RESET:
      return "";
    //COMPLETE
    case USER_TASK.COMPLETE_SUCESSS:
      return action.status;
    default:
      return state;
  }
};

const completeErrorUserTaskReducer = (state = "", action) => {
  switch (action.type) {
    //COMPLETE_ERROR
    case USER_TASK.RESET:
      return "";
    case USER_TASK.COMPLETE_ERROR:
    case USER_TASK.ERROR_USER_TASKS:
      return action.error;
    default:
      return state;
  }
};

const userTasksReducer = (
  state = {
    data: [],
  },
  action
) => {
  let tmpData;
  switch (action.type) {
    //COMPLETE_ERROR
    case USER_TASK.RESET:
      return [];
    case USER_TASK.RESPONSE_USER_TASKS:
      return { data: action.userTasks };
    case SIGNALR_TYPES.NEW_USER_TASK:
      if (action.userTask.data.assignedTo === action.userId) {
        if (
          state.data.filter((item) => item.data.id === action.userTask.data.id)
            .length === 0
        ) {
          tmpData = [...state.data, action.userTask];
        }
      } else {
        tmpData = [...state.data];
      }
      return {
        ...state,
        data: [...tmpData],
      };
    case SIGNALR_TYPES.USER_TASK_COMPLETE_SUCESSS:
      tmpData = state.data.filter(
        (item) => item.data.id !== action.userTask.data.id
      );
      return {
        ...state,
        data: [...tmpData],
      };
    case SIGNALR_TYPES.UPDATE_USER_TASK:
      tmpData = state.data.filter(
        (item) => item.data.id !== action.userTask.data.id
      );
      if (
        action.userTask.data.status === "Canceled" ||
        action.userTask.data.status === "Rejected"
      ) {
        return {
          ...tmpData,
          data: [...tmpData],
        };
      } else {
        return {
          ...tmpData,
          data: [...tmpData, action.userTask],
        };
      }
    default:
      return state;
  }
};

const profileStatusReducer = (
  state = {
    data: null,
  },
  action
) => {
  switch (action.type) {
    case SIGNALR_TYPES.PROFILE_STATUS_UPDATE:
      return {
        ...state,
        data: action.statusUpdate,
      };

    case PROFILE_STATUS.RESET: {
      return {
        data: null,
      };
    }
    default:
      return state;
  }
};

const rootUserTaskReducer = combineReducers({
  tasks: userTasksReducer,
  isLoading: userTaskLoadingReducer,
  completeStatus: completeStatusUserTaskReducer,
  completeError: completeErrorUserTaskReducer,
  profileStatus: profileStatusReducer,
});

export default rootUserTaskReducer;
