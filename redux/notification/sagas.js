import { takeEvery, put, call, takeLeading } from 'redux-saga/effects';
import { receiveNotification, errorNotification } from './actions';
import NOTIFICATION from './constants';
import { getNotificationByIdApi } from './api';

function* completeNotificationByIdWorker({ notificationId }) {
  try {
    const notification = yield call(getNotificationByIdApi, notificationId);
    yield put(receiveNotification(notification));
  } catch (error) {
    yield put(errorNotification(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeLeading(
    NOTIFICATION.NOTIFICATION_REQUEST_BY_ID,
    completeNotificationByIdWorker
  );
}
