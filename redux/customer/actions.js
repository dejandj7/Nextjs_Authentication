import CUSTOMER from './constants';
import { AppConfig } from '../../utilities/config';

const requestCustomerById = (customerId) => ({
  type: CUSTOMER.CUSTOMER_REQUEST_BY_ID,
  customerId,
});

const responseCustomerProfileById = (customerId, userId) => ({
  type: CUSTOMER.CUSTOMER_REQUEST_PROFILE_BY_ID,
  customerId,
  userId,
});

const cleanCustomers = () => ({
  type: CUSTOMER.CUSTOMERS_CLEAN_REQUEST,
});

const errorCustomer = (error) => ({
  type: CUSTOMER.CUSTOMER_REQUEST_ERROR,
  error,
});

const responseCustomer = (customer) => ({
  type: CUSTOMER.CUSTOMER_REQUEST_SUCCESS,
  customer,
});

const receiveCustomers = (customers) => ({
  type: CUSTOMER.CUSTOMERS_REQUEST_SUCCESS,
  customers,
});

const receiveAssignees = (assignees) => ({
  type: CUSTOMER.ASSIGNEES_REQUEST_SUCCESS,
  assignees,
});

const attemptCustomerSave = (customerData) => ({
  type: CUSTOMER.CUSTOMER_SAVE_REQUEST,
  customerData,
});

const attemptProfileSave = (customerData) => ({
  type: CUSTOMER.PROFILE_SAVE_REQUEST,
  customerData,
});

const setAssignees =
  (done = () => {}) =>
  async (dispatch) => {
    let client = getApiFetchClient();

    client.scopes = [
      process.env.SCOPE_URL + 'login.read',
      process.env.SCOPE_URL + 'login.write',
    ];

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const result = await client.fetch(
        AppConfig.apiUrl + '/Customer/fosmusers',
        options
      );
      const assignees = await result.json();
      const mappedArray = assignees.map((obj) => ({
        ...obj,
        key: obj.id,
      }));
      dispatch(receiveAssignees(mappedArray));
      done(null, result);
    } catch (error) {
      console.log(error);
      // console.log('setAssignees catch error ' + error);
      done(error);
    }
  };

const setCustomers =
  (done = () => {}) =>
  async (dispatch) => {
    let client = getApiFetchClient();

    client.scopes = ['https://fosmapp.onmicrosoft.com/webApi/login.read'];

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const result = await client.fetch(
        AppConfig.apiUrl + '/Customer',
        options
      );
      const customers = await result.json();
      const mappedArray = customers.map((obj) => ({
        ...obj,
        key: obj.id,
      }));
      dispatch(receiveCustomers(mappedArray));
      done(null, result);
    } catch (error) {
      console.log('setCustomers catch error ' + error);
      done(error);
    }
  };

export {
  attemptCustomerSave,
  attemptProfileSave,
  requestCustomerById,
  responseCustomerProfileById,
  responseCustomer,
  errorCustomer,
  cleanCustomers,
  receiveCustomers,
  receiveAssignees,
  setAssignees,
  setCustomers,
};
