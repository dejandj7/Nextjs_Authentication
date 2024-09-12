import {
  takeEvery,
  put,
  call,
  takeLeading,
  getContext,
  takeLatest,
} from "redux-saga/effects";
import { userTaskLoading, completeUserTaskSuccess } from "./actions";
import {
  updateNotificationError,
  updateNotificationSuccess,
} from "../../redux/notification/actions";
import { USER_TASK } from "./constants";
import { completeUserTaskApi, updateNotification } from "./api";

function* completeUserTaskWorker({ userTask }) {
  try {
    const getSingalRConnection = yield getContext("getSingalRConnection");
    yield put(userTaskLoading(true));
    const status = yield call(
      completeUserTaskApi,
      userTask,
      getSingalRConnection()
    );
    yield put(userTaskLoading(false));
    yield put(completeUserTaskSuccess(status));
  } catch (error) {
    // yield put(completeUserTaskError(error.toString()));
    console.log(error);
  }
}

function* updateNotificationWorker({ notification }) {
  try {
    const res = yield call(updateNotification, notification);
    if (res) {
      yield put(updateNotificationSuccess(notification.notificationId));
    }
  } catch (error) {
    yield put(updateNotificationError(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeLatest(USER_TASK.COMPLETE, completeUserTaskWorker);
  yield takeLatest(USER_TASK.UPDATE_NOTIFICATION, updateNotificationWorker);
}
