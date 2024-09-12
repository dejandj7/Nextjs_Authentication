import GRANT from './constants';

const initialState = {
  data: [],
  applications: [],
  definitions: [],
  donors: [],
  grant: null,
  grantId: null,
  appTemplateId: null,
  appTemplate: null,
  application: null,
  donor:null,
  applicationId: null,
  unrelatedAppTemplateId: null,
  error: null,
  budget: null,
};

export default function grantReducer(state = initialState, action) {
  switch (action.type) {
    case GRANT.CLEAN_STATE:
      return {
      };
    case GRANT.GRANTS_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.grants,
        grantId: null,
        appTemplateId: null,
        applicationId: null
      };
    case GRANT.GRANTS_CLEAN_REQUEST:
      return {
        ...state,
        data: [],
      };
    case GRANT.GRANT_REQUEST_SUCCESS:
      return {
        ...state,
        grant: action.grant,
      };
    case GRANT.GRANT_ID_REQUEST_SUCCESS:
      return {
        ...state,
        grantId: action.payload
      };
    case GRANT.GRANT_APP_TEMPLATE_ID_REQUEST_SUCCESS:
      return {
        ...state,
        appTemplateId: action.payload
      };
    case GRANT.GRANT_APP_TEMPLATE_REQUEST_SUCCESS:
      return {
        ...state,
        appTemplate: action.payload
      };
    case GRANT.GRANT_UNRELATED_APP_TEMPLATE_ID_REQUEST_SUCCESS:
      return {
        ...state,
        unrelatedAppTemplateId: action.payload
      };
    case GRANT.APPLICATION_REQUEST_SUCCESS:
      return {
        ...state,
        application: action.payload
      };
    case GRANT.DONOR_REQUEST_SUCCESS:
      return {
        ...state,
        donor: action.payload
      };
    case GRANT.APPLICATION_ID_REQUEST_SUCCESS:
      return {
        ...state,
        applicationId: action.payload
      };
    case GRANT.DONOR_ID_REQUEST_SUCCESS:
      return {
        ...state,
        donor: action.donor.data[0]
      };
    case GRANT.DEFINITION_ID_REQUEST_SUCCESS:
      return {
        ...state,
        definitionId: action.payload
      };
    case GRANT.APPLICATIONS_REQUEST_SUCCESS:
      return {
        ...state,
        applications: action.payload,
        application: null,
        appTemplateId: null,
        appTemplate: null
      };
    case GRANT.DONORS_REQUEST_SUCCESS:
      return {
        ...state,
        donors: action.payload
      };
    case GRANT.CUSTOMER_APPLICATIONS_REQUEST_SUCCESS:
      return {
        ...state,
        customerApplications: action.payload,
        appTemplateId: null,
        appTemplate: null,
        application: null,
      };
    case GRANT.CLEAR_APPLICATION:
      return {
        ...state,
        application: null,
        appTemplate: null
      };
    case GRANT.DEFINITIONS_REQUEST_SUCCESS:
      return {
        ...state,
        definitions: action.payload
      };
    case GRANT.APPLICATIONS_CLEAN_REQUEST:
      return {
        ...state,
        applications: []
      };
    case GRANT.APPLICATION_REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case GRANT.BUDGET_REQUEST_SUCCESS:
      return {
        ...state,
        budget: action.budget,
      };
    default:
      return state;
  }
}
