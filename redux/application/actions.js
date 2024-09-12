import SIGNALR_TYPES from "../signalR/constants";
import { APP_STATUS } from "./constants";

const signalRApplicatinStatusUpdate = (statusUpdate) => ({
  type: SIGNALR_TYPES.APPLICATION_STATUS_UPDATE,
  statusUpdate,
});

const resetApplicationStatus = () => ({
  type: APP_STATUS.RESET,
});

export { signalRApplicatinStatusUpdate, resetApplicationStatus };
