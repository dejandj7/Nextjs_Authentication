import CUSTOMER_DOCUMENTUPLOAD from './constants';

const completeCustomerUploadDocument = (customer, token) => ({
  type: CUSTOMER_DOCUMENTUPLOAD.COMPLETE,
  customer,
  token
});

const completeCustomerUploadDocumentSuccess = (status) => ({
  type: CUSTOMER_DOCUMENTUPLOAD.COMPLETE_SUCESSS,
  status
});

const completeCustomerUploadDocumentError = (error) => ({
  type: CUSTOMER_DOCUMENTUPLOAD.COMPLETE_ERROR,
  error
});

const completeCustomerUploadDocumentReset = () => ({
  type: CUSTOMER_DOCUMENTUPLOAD.RESET
});

export {
  completeCustomerUploadDocument,
  completeCustomerUploadDocumentSuccess,
  completeCustomerUploadDocumentError,
  completeCustomerUploadDocumentReset
};
