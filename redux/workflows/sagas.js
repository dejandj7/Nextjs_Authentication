import { takeEvery, put, call } from 'redux-saga/effects';
import {
  repsoneStartWorkFlow,
  errorStartWorkFlow,
  isLoadingWorkFlow,
} from './actions';
import WORKFLOW from './constants';
import { startWorkFlowByKeyApi } from './api';

function* startWorkFlowByKeyWokrer({ definitionKey, id, userId, data }) {
  try {
    yield put(isLoadingWorkFlow(true, definitionKey, id));
    const instnaceId = yield call(
      startWorkFlowByKeyApi,
      definitionKey,
      id,
      userId,
      data
    );
    yield put(repsoneStartWorkFlow(instnaceId));
    yield put(isLoadingWorkFlow(false, definitionKey, id));
  } catch (error) {
    yield put(isLoadingWorkFlow(false, definitionKey, id));
    yield put(errorStartWorkFlow(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeEvery(
    WORKFLOW.REQUEST_START_WORKFLOW_BY_KEY,
    startWorkFlowByKeyWokrer
  );
}
