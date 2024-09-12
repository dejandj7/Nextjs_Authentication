import { takeEvery, takeLeading, put, call } from 'redux-saga/effects';
import { responseUser, errorUser } from './actions';
import USER from './constants';
import { getUserByIdApi, getUserByUserNameApi, setUserDefaultProfileApi } from './api';

function* completeUserByIdWokrer({ type,
  userId,
  token
}) {
  try {
    const user = yield call(getUserByIdApi, userId, token);
    yield put(responseUser(user));
  } catch (error) {
    yield put(errorUser(error.toString()));
  }
}

function* completeUserByUserNameWokrer({ type,
  username
}) {
  try {
    const user = yield call(getUserByUserNameApi, username);
    yield put(responseUser(user));
  } catch (error) {
    yield put(errorUser(error.toString()));
  }
}

function* completeSetDefaultProfileWokrer({ type,
  userId,
  customerId
}) {
  try {
    const user = yield call(setUserDefaultProfileApi, userId, customerId);
    yield put(responseUser(user));
  } catch (error) {
    yield put(errorUser(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeLeading(USER.USER_REQUEST_BY_ID, completeUserByIdWokrer);
  yield takeLeading(USER.USER_REQUEST_BY_USERNAME, completeUserByUserNameWokrer);
  yield takeLeading(USER.USER_DEFAULT_PROFILE_REQUEST, completeSetDefaultProfileWokrer);
}
