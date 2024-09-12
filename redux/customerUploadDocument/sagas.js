import {
  takeEvery,
  put,
  call
} from 'redux-saga/effects';
import {
  completeCustomerUploadDocumentSuccess,
  completeCustomerDocumentuploadError
} from './actions';
import CUSTOMER_DOCUMENTUPLOAD from './constants';
import {
  completeCustomerDocumentUploadApi
} from './api';

function* completeCustomerUploadDocumentWokrer({
  customer,
  token
}) {
  try {
    const status = yield call(completeCustomerDocumentUploadApi, customer, token);
    yield put(completeCustomerUploadDocumentSuccess(status));
  } catch (error) {
    yield put(completeCustomerUploadDocumentWokrer(error.toString()));
  }
}

export default function* rootSaga() {
  yield takeEvery(CUSTOMER_DOCUMENTUPLOAD.COMPLETE, completeCustomerUploadDocumentWokrer);
}
