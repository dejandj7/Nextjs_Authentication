export const selectCompleteError = (name, state) => state[name].completeError;
export const selectCompleteStatus = (name, state) => state[name].completeStatus;
export const selectTasks = (name, state) => state[name].tasks;
export const selectApplicationStatus = (name, state) =>
  state[name].applicationStatus;
export const selectProfileStatus = (name, state) => state[name].profileStatus;
export const selectNotifications = (name, state) => state[name].notifications;
export const selectIsLoading = (name, state) => state[name].isLoading;
