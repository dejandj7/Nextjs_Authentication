import GRANT from './constants';
import axios from 'axios';
import { AppConfig } from '../../utilities/config';
import { status } from 'nprogress';

const requestGrant = () => ({
  type: GRANT.GRANT_REQUEST,
});

const requestGrants = () => ({
  type: GRANT.GRANTS_REQUEST,
});

const requestAppTemplate = () => ({
  type: GRANT.GRANT_APP_TEMPLATE_REQUEST,
});

const requestCustomerApplications = () => ({
  type: GRANT.CUSTOMER_APPLICATIONS_REQUEST,
});

const requestApplication = () => ({
  type: GRANT.APPLICATION_REQUEST,
});

const requestApplications = () => ({
  type: GRANT.APPLICATIONS_REQUEST,
});

const requestDonors = () => ({
  type: GRANT.DONORS_REQUEST,
});

const requestDefinitions = () => ({
  type: GRANT.DEFINITIONS_REQUEST,
});

const attemptApplicationSave = (application, done) => ({
  type: GRANT.APPLICATION_SAVE_REQUEST,
  application,
  done,
});

const updateApplication = (application, done) => ({
  type: GRANT.APPLICATION_UPDATE_REQUEST,
  application,
  done,
});

const receiveAppTemplate = (payload) => ({
  type: GRANT.GRANT_APP_TEMPLATE_REQUEST_SUCCESS,
  payload,
});

const setApplication = (application) => ({
  type: GRANT.APPLICATION_REQUEST,
  application,
});

const receiveGrant = (grant) => ({
  type: GRANT.GRANT_REQUEST_SUCCESS,
  grant,
});

const receiveApplication = (payload) => ({
  type: GRANT.APPLICATION_REQUEST_SUCCESS,
  payload,
});

const receiveDonor = (payload) => ({
  type: GRANT.DONOR_REQUEST_SUCCESS,
  payload,
});

const errorApplication = (error) => ({
  type: GRANT.APPLICATION_REQUEST_ERROR,
  error,
});

const errorDonor = (error) => ({
  type: GRANT.DONOR_REQUEST_ERROR,
  error,
});

const receiveApplications = (payload) => ({
  type: GRANT.APPLICATIONS_REQUEST_SUCCESS,
  payload,
});

const receiveDonors = (payload) => ({
  type: GRANT.DONORS_REQUEST_SUCCESS,
  payload,
});

const receiveApplicationsByCustomer = (payload) => ({
  type: GRANT.CUSTOMER_APPLICATIONS_REQUEST_SUCCESS,
  payload,
});

const receiveDefinitions = (payload) => ({
  type: GRANT.DEFINITIONS_REQUEST_SUCCESS,
  payload,
});

const clearApplication = () => ({
  type: GRANT.CLEAR_APPLICATION,
});

const receiveAppTemplateId = (payload) => ({
  type: GRANT.GRANT_APP_TEMPLATE_ID_REQUEST_SUCCESS,
  payload,
});

const receiveApplicationId = (payload) => ({
  type: GRANT.APPLICATION_ID_REQUEST_SUCCESS,
  payload,
});

const requestApplicationById = (applicationId) => ({
  type: GRANT.APPLICATION_REQUEST_BY_ID,
  applicationId,
});

const requestGrantById = (grantId) => ({
  type: GRANT.DEFINITION_REQUEST_BY_ID,
  grantId,
});

const receiveGrantDefinitionId = (payload) => ({
  type: GRANT.DEFINITION_ID_REQUEST_SUCCESS,
  payload,
});

const receiveUnrelatedAppTemplateId = (payload) => ({
  type: GRANT.GRANT_UNRELATED_APP_TEMPLATE_ID_REQUEST_SUCCESS,
  payload,
});

const receiveGrants = (grants) => ({
  type: GRANT.GRANTS_REQUEST_SUCCESS,
  grants,
});

const cleanGrants = () => ({
  type: GRANT.GRANTS_CLEAN_REQUEST,
});

const cleanApplications = () => ({
  type: GRANT.APPLICATIONS_CLEAN_REQUEST,
});

const receiveGrantId = (payload) => ({
  type: GRANT.GRANT_ID_REQUEST_SUCCESS,
  payload,
});

const setBudget = () => ({
  type: GRANT.BUDGET_REQUEST,
});

const receiveBudget = (budget) => ({
  type: GRANT.BUDGET_REQUEST_SUCCESS,
  budget,
});

const setGrant =
  (grantId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestGrant());

    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/tender', {
        params: { id: grantId },
      }),
    ])
      .then((result) => {
        const grant = result[0].data[0];
        dispatch(receiveGrant(grant));
        done(null, result);
      })
      .catch((error) => {
        console.log('setGrant catch error ' + error);
        done(error);
      });
  };

const setApplicationByCustomerId =
  (customerId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestCustomerApplications());
    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/customer', {
        params: { customerId: customerId },
      }),
    ])
      .then((result) => {
        const customerApplications = result[0].data;
        dispatch(receiveApplicationsByCustomer(customerApplications));
        done(null, result);
      })
      .catch((error) => {
        console.log('get applications by customer error ' + error);
        done(error);
      });
  };
const setApplicationByStatus4Customer =
  (customerId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestCustomerApplications());

    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/status', {
        params: { status: 'Approved', customerId: customerId },
      }),
    ])
      .then((result) => {
        const customerApplications = result[0].data;
        dispatch(receiveApplicationsByCustomer(customerApplications));
        done(null, result);
      })
      .catch((error) => {
        console.log('get applications by customer error ' + error);
        done(error);
      });
  };

const getApplication =
  (applicationId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestApplication());

    Promise.all([
      axios.get(AppConfig.apiUrl + '/application', {
        params: { id: applicationId },
      }),
    ])
      .then((result) => {
        const selectedApplication = result[0].data;
        dispatch(receiveApplication(selectedApplication));
        done(null, result);
      })
      .catch((error) => {
        console.log('get application error ' + error);
        done(error);
      });
  };

const setGrants =
  (done = () => {}) =>
  (dispatch) => {
    dispatch(requestGrants());

    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/tender'),
      axios.get(AppConfig.apiUrl + '/application/unrelated'),
    ])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj._id,
        }));
        dispatch(receiveGrants(mappedArray));
        const unrelatedTemplate = result[1].data;
        dispatch(receiveUnrelatedAppTemplateId(unrelatedTemplate._id));
        done(null, result);
      })
      .catch((error) => {
        console.log('setGrants catch error ' + error);
        done(error);
      });
  };

const setApplicationTemplate =
  (appTemplateId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestAppTemplate());

    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/template', {
        params: { id: appTemplateId },
      }),
    ])
      .then((result) => {
        const appTemplate = result[0].data[0];
        dispatch(receiveAppTemplate(appTemplate));
        done(null, result);
      })
      .catch((error) => {
        console.log('setApplicationTemplate catch error ' + error);
        done(error);
      });
  };

const saveApplication =
  (submission, done = () => {}) =>
  (dispatch) => {
    Promise.all([
      axios.post(
        AppConfig.apiUrl + '/Application/register/submission',
        submission,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ])
      .then((result) => {
        done(null, result);
        dispatch(receiveApplicationId(result[0].data._id.$oid));
      })
      .catch((error) => {
        console.log('saveApplication catch error ' + error);
        done(error, null);
      });
  };

const updateApplications =
  (submission, done = () => {}) =>
  (dispatch) => {
    dispatch(receiveApplications(submission));
  };

const setApplications =
  (done = () => {}) =>
  (dispatch) => {
    dispatch(requestApplications());

    var token = Formio.getToken();
    Promise.all([
      axios.get(AppConfig.apiUrl + '/application', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj._id,
        }));
        dispatch(receiveApplications(mappedArray));
        done(null);
      })
      .catch((error) => {
        console.log('setApplications catch error ' + error);
        done(error);
      });
  };

const setDonors =
  (done = () => {}) =>
  (dispatch) => {
    dispatch(requestDonors());

    var token = Formio.getToken();
    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/donor', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj._id,
        }));
        dispatch(receiveDonors(mappedArray));
        done(null);
      })
      .catch((error) => {
        console.log('setDonors catch error ' + error);
        done(error);
      });
  };

const setDefinitions =
  (done = () => {}) =>
  (dispatch) => {
    dispatch(requestDefinitions());

    Promise.all([axios.get(AppConfig.apiUrl + '/application/tender')])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj._id,
        }));
        dispatch(receiveDefinitions(mappedArray));
        done(null);
      })
      .catch((error) => {
        console.log('setDefinitions catch error ' + error);
        done(error);
      });
  };

const requestDonorById = (donorId) => ({
  type: GRANT.DONORS_REQUEST_BY_ID,
  donorId,
});
const receiveDonorById = (donor) => ({
  type: GRANT.DONOR_ID_REQUEST_SUCCESS,
  donor,
});

const requestDonorByIdApi =
  (donorId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestDonorById());

    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/donor', {
        params: { id: donorId },
      }),
    ])
      .then((result) => {
        const donor = result[0];
        dispatch(receiveDonorById(donor));
        done(null, result);
      })
      .catch((error) => {
        console.log('get donor by id error ' + error);
        done(error);
      });
  };

const saveDonorApi =
  (submission, done = () => {}) =>
  (dispatch) => {
    var token = Formio.getToken();
    delete submission.key;
    Promise.all([
      axios.put(AppConfig.apiUrl + '/application/donor/create', submission, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then((result) => {
        done(null, result);
      })
      .catch((error) => {
        console.log('updateApplication catch error ' + error);
        done(error, null);
      });
  };

export {
  requestGrant,
  requestGrants,
  requestAppTemplate,
  requestApplications,
  requestCustomerApplications,
  attemptApplicationSave,
  receiveAppTemplate,
  setApplication,
  setDonors,
  receiveGrant,
  receiveApplication,
  receiveApplications,
  receiveAppTemplateId,
  receiveApplicationId,
  receiveUnrelatedAppTemplateId,
  receiveGrants,
  receiveApplicationsByCustomer,
  receiveDonor,
  requestApplicationById,
  requestDonorById,
  requestDonorByIdApi,
  cleanGrants,
  cleanApplications,
  receiveGrantId,
  errorApplication,
  errorDonor,
  setGrant,
  setGrants,
  setApplicationTemplate,
  setApplicationByCustomerId,
  setApplicationByStatus4Customer,
  getApplication,
  saveApplication,
  saveDonorApi,
  updateApplication,
  updateApplications,
  setApplications,
  setDefinitions,
  clearApplication,
  setBudget,
  receiveBudget,
};
