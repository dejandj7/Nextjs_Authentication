import { takeLeading, put, call } from 'redux-saga/effects';
import { responseCustomer, errorCustomer } from './actions';
import {
  setCustomerProfile,
  disableCustomerEdit,
  enableCustomerEdit,
} from '../auth/actions';
import CUSTOMER from './constants';
import { getCustomerByIdApi, updateCustomerApi } from './api';
import { getApplicationsByCustomerApi } from '../grants/api';

function* completeCustomerByIdWorker({ type, customerId }) {
  try {
    const customer = yield call(getCustomerByIdApi, customerId);
    yield put(responseCustomer(customer));
  } catch (error) {
    yield put(errorCustomer(error.toString()));
  }
}

function* completeUpdateCustomerWorker({ type, customerData }) {
  try {
    const customer = yield call(updateCustomerApi, customerData);
    yield put(responseCustomer(customer));
  } catch (error) {
    yield put(errorCustomer(error.toString()));
  }
}

function* completeUpdateProfileWorker({ type, customerData }) {
  try {
    const customer = yield call(updateCustomerApi, customerData);
    yield put(setCustomerProfile(customer));
  } catch (error) {
    yield put(errorCustomer(error.toString()));
  }
}

function* completeGetCustomerProfileWorker({ type, customerId, userId }) {
  try {
    yield put(disableCustomerEdit());
    const customer = yield call(getCustomerByIdApi, customerId);
    const applications = yield call(getApplicationsByCustomerApi, customerId);
    const user = customer.relatedUsers.filter((item) => item._id === userId)[0];
    const userRoles = user.userRoles.map((item) => item.name);
    var permissions = [];
    customer.roles.forEach((element) => {
      if (userRoles.indexOf(element.name) >= 0) {
        permissions = _.union(permissions, element.permissions);
      }
    });
    permissions = _.sortBy(permissions);
    yield put(setCustomerProfile(customer, permissions, applications));
    yield put(enableCustomerEdit());
  } catch (error) {
    yield put(errorCustomer(error.toString()));
    yield put(enableCustomerEdit());
  }
}

export default function* rootSaga() {
  yield takeLeading(
    CUSTOMER.CUSTOMER_REQUEST_BY_ID,
    completeCustomerByIdWorker
  );
  yield takeLeading(
    CUSTOMER.CUSTOMER_SAVE_REQUEST,
    completeUpdateCustomerWorker
  );
  yield takeLeading(CUSTOMER.PROFILE_SAVE_REQUEST, completeUpdateProfileWorker);
  yield takeLeading(
    CUSTOMER.CUSTOMER_REQUEST_PROFILE_BY_ID,
    completeGetCustomerProfileWorker
  );
}
