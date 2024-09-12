import WORKFLOW from './constants';

const resetWorkFlow = () => ({
  type: WORKFLOW.RESET,
});

const isLoadingWorkFlow = (isLoading, definitionKey, id) => ({
  type: WORKFLOW.WORKFLOW_LOADING,
  isLoading,
});

const startFlowByKey = (definitionKey, id, userId, data) => ({
  type: WORKFLOW.REQUEST_START_WORKFLOW_BY_KEY,
  definitionKey,
  id,
  userId,
  data,
});

const startApi = () => ({
  type: WORKFLOW.START_API,
});

const endApi = () => ({
  type: WORKFLOW.END_API,
});

const repsoneStartWorkFlow = (instnaceId) => ({
  type: WORKFLOW.RESPONSE_START_WORKFLOW,
  instnaceId,
});

const errorStartWorkFlow = (error) => ({
  type: WORKFLOW.ERROR_START_WORKFLOW,
  error,
});

export {
  resetWorkFlow,
  isLoadingWorkFlow,
  startFlowByKey,
  startApi,
  endApi,
  repsoneStartWorkFlow,
  errorStartWorkFlow,
};
