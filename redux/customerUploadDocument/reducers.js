import {
  combineReducers
} from 'redux';
import CUSTOMER_DOCUMENTUPLOAD from './constants';

const completeStatusCustomerUploadDocumentReducer = (state = '', action) => {
  switch (action.type) {
    case CUSTOMER_DOCUMENTUPLOAD.RESET:
      return '';
    case CUSTOMER_DOCUMENTUPLOAD.COMPLETE_SUCESSS:
      return action.status;
    case CUSTOMER_DOCUMENTUPLOAD.COMPLETE_ERROR:
        return action.error;
    default:
      return state;
  }
};

export default completeStatusCustomerUploadDocumentReducer;
