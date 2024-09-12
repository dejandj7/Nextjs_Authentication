import CUSTOMER from './constants';

const initialState = {
  data: [],
  customer: null,
  error: null,
};

export default function customerReducer(state = initialState, action) {
  switch (action.type) {
    case CUSTOMER.CUSTOMERS_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.customers,
      };
    case CUSTOMER.CUSTOMER_REQUEST_SUCCESS:
      return {
        ...state,
        customer: action.customer,
      };
    case CUSTOMER.CUSTOMERS_CLEAN_REQUEST:
      return {
        ...state,
        data: [],
      };
    case CUSTOMER.CUSTOMER_REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case CUSTOMER.ASSIGNEES_REQUEST_SUCCESS:
      return {
        ...state,
        assignees: action.assignees,
      };
    default:
      return state;
  }
}
