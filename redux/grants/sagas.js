import { takeEvery, put, call, takeLeading, getContext } from 'redux-saga/effects';
import { receiveApplication, errorApplication, receiveApplicationId, receiveBudget, receiveDonor, errorDonor } from './actions';
import GRANT from './constants';
import { getApplicationByIdApi, saveApplicationApi, getBudgetApi, getDonorByIdApi, updateApplicationApi } from './api';
import BUDGET from './constants';

function* completeApplicationByIdWorker({ type,
  applicationId
}) {
  try {
    const application = yield call(getApplicationByIdApi, applicationId);
    yield put(receiveApplication(application));
  } catch (error) {
    yield put(errorApplication(error.toString()));
  }
}

function* completeDonorByIdWorker({ type,
  donorId
}) {
  try {
    const donor = yield call(getDonorByIdApi, donorId);
    yield put(receiveDonor(donor));
  } catch (error) {
    yield put(errorDonor(error.toString()));
  }
}

function* completeSaveApplicationWorker({ type,
  application,
  done
}) {
  try {
    const applicationResult = yield call(saveApplicationApi, application);

    done(null, applicationResult);
    yield put(receiveApplication(applicationResult));
  } catch (error) {
    console.log(error);
    done(error, null);
    yield put(errorApplication(error.toString()));
  }
}

function* completeUpdateApplicationWorker({ type,
  application,
  done
}) {
  try {
    const applicationResult = yield call(updateApplicationApi, application);

    done(null, applicationResult);
    yield put(receiveApplication(applicationResult));
  } catch (error) {
    console.log(error);
    done(error, null);
    yield put(errorApplication(error.toString()));
  }
}

function* completeBudgetWorker({ type
}) {
  try {
    const getApiFetchClient = yield getContext('getApiFetchClient');
    const budgetResult = yield call(getBudgetApi, getApiFetchClient());

    yield put(receiveBudget(budgetResult));
  } catch (error) {
    console.log(error);
    yield put(errorApplication(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeLeading(GRANT.APPLICATION_REQUEST_BY_ID, completeApplicationByIdWorker);
  yield takeLeading(GRANT.APPLICATION_SAVE_REQUEST, completeSaveApplicationWorker);
  yield takeLeading(GRANT.APPLICATION_UPDATE_REQUEST, completeUpdateApplicationWorker);
  yield takeLeading(GRANT.BUDGET_REQUEST, completeBudgetWorker);
  // yield takeLeading(GRANT.DONOR_REQUEST_BY_ID, completeDonorByIdWorker);
}

