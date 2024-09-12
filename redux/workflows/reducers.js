import WORKFLOW from './constants';

const initialState = {
  data: {},
  id: null,
  definitionId: null,
  definitionKey: null,
  instnaceId: null,
  user: null,
  error: null,
  isLoading: false,
  isWorkflowSuccess: false,
};

export default function workFlowReducer(state = initialState, action) {
  switch (action.type) {
    case WORKFLOW.RESET:
      return initialState;
    case WORKFLOW.WORKFLOW_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
        definitionKey: action.definitionKey,
        id: action.id,
        error: null,
      };
    case WORKFLOW.RESPONSE_START_WORKFLOW:
      return {
        ...state,
        data: action.data,
        instaceId: action.instaceId,
        isWorkflowSuccess: true,
        error: null,
      };
    case WORKFLOW.ERROR_START_WORKFLOW:
      return {
        ...state,
        error: action.error,
        isWorkflowSuccess: false,
        isLoading: false,
      };
    case WORKFLOW.START_API:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case WORKFLOW.END_API:
      return {
        ...state,
        isLoading: false,
        isWorkflowSuccess: true,
        error: null,
      };
    default:
      return state;
  }
}
