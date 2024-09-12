import { put, call, takeLatest } from 'redux-saga/effects';
import { deleteFileSuccess, deleteFileError } from './actions';
import FILE from './constants';
import { deleteFileApi } from './api';

function* deleteFileWorker({
  fileInfo
}) {
  try {
    const status = yield call(deleteFileApi, fileInfo);
    yield put(deleteFileSuccess(status));
  } catch (error) {
    yield put(deleteFileError(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeLatest(FILE.DELETE_FILE_REQUEST, deleteFileWorker);
}
