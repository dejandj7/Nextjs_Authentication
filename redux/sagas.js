import { all } from "redux-saga/effects";
import sagaSettings from "./settings/sagas";
import sagaUserTasks from "./usertask/sagas";
import customeruploaddocumentreducerSaga from "./customerUploadDocument/sagas";
import sagaCustomer from "./customer/saga";
import sagaUser from "./users/saga";
import sagaWorkFlow from "./workflows/sagas";
import sagaApplication from "./grants/sagas";
import sagaAuth from "./auth/saga";
import sagaNotificationTemplate from "./notification/sagas";
import sagaFile from "./file/sagas";
import sagaTenders from "./tenders/sagas";

export default function* rootSaga() {
  yield all([
    sagaSettings(),
    sagaUserTasks(),
    customeruploaddocumentreducerSaga(),
    sagaCustomer(),
    sagaUser(),
    sagaWorkFlow(),
    sagaApplication(),
    sagaAuth(),
    sagaNotificationTemplate(),
    sagaFile(),
    sagaTenders(),
  ]);
}
