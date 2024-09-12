import { takeEvery, put, call } from "redux-saga/effects";
import { errorFetchingTenders, receivedTenders, isLoading } from "./actions";
import TENDERS from "./constants";
import { getTendersApi } from "../../redux/grants/api";

function* getTendersWorker({ filtered }) {
  try {
    yield put(isLoading(true));
    const response = yield call(getTendersApi, filtered);
    yield put(receivedTenders(response.data));
    yield put(isLoading(false));
  } catch (error) {
    yield put(isLoading(false));
    yield put(errorFetchingTenders(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeEvery(TENDERS.REQUEST_TENDERS, getTendersWorker);
}
