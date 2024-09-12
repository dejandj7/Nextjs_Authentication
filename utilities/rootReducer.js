import { combineReducers } from "redux";
import application from "../redux/application/reducers";
import notifications from "../redux/notification/reducers";
import settings from "../redux/settings/reducers";
import userTasksRedusers from "../redux/usertask/reducers";
import workFlowReducer from "../redux/workflows/reducers";
import { authReducer } from "../redux/auth";
import links from "../redux/links/reducers";
import tenders from "../redux/tenders/reducers";
import signalRReducer from "../redux/signalR/reducers";

const createRootReducer = () =>
  combineReducers({
    application,
    auth: authReducer,
    links,
    userTask: userTasksRedusers,
    notifications,
    settings,
    workflow: workFlowReducer,
    signalR: signalRReducer,
    tenders,
  });

export default createRootReducer;
