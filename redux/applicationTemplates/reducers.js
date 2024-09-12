import actions from './actions';

const initialState = {
  data: [],
  appTemplate: null,
  appTemplateId: null,
};

export default function grantReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CLEAN_STATE:
      return {};
    case actions.APP_TEMPLATES_REQUEST_SUCCESS:
      return {
        ...state,
        data: action.appTemplates,
      };
    case actions.APP_TEMPLATE_REQUEST_SUCCESS:
      return {
        ...state,
        appTemplate: action.appTemplate,
      };
    case actions.APP_TEMPLATE_FORM_REQUEST_SUCCESS:
      return {
        ...state,
        appTemplate: action.payload,
      };
    default:
      return state;
  }
}
