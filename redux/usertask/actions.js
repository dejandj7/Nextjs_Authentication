import { USER_TASK, PROFILE_STATUS } from "./constants";

const userTaskLoading = (isLoading) => ({
  type: USER_TASK.USER_TASKS_LOADING,
  isLoading,
});

const requestUserTasks = (assignedTo) => ({
  type: USER_TASK.REQUEST_USER_TASKS,
  assignedTo,
});

const responseUserTasks = (userTasks) => ({
  type: USER_TASK.RESPONSE_USER_TASKS,
  userTasks,
});

const errorUserTasks = (error) => ({
  type: USER_TASK.ERROR_USER_TASKS,
  error,
});

const completeUserTask = (userTask) => ({
  type: USER_TASK.COMPLETE,
  userTask,
});

const completeUserTaskSuccess = (status) => ({
  type: USER_TASK.COMPLETE_SUCESSS,
  status,
});

const completeUserTaskError = (error) => ({
  type: USER_TASK.COMPLETE_ERROR,
  error,
});

const completeUserTaskReset = () => ({
  type: USER_TASK.RESET,
});

const resetProfileStatus = () => ({
  type: PROFILE_STATUS.RESET,
});

export {
  userTaskLoading,
  requestUserTasks,
  resetProfileStatus,
  responseUserTasks,
  errorUserTasks,
  completeUserTask,
  completeUserTaskSuccess,
  completeUserTaskError,
  completeUserTaskReset,
};
