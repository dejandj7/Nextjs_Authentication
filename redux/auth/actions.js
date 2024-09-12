import { USER } from "./constants";

const requestUser = (adAccount) => ({
  type: USER.LOGGED_USER_REQUEST,
  adAccount,
});

const receiveUser = (customer, role, permissions, applications) => ({
  type: USER.LOGGED_USER_REQUEST_SUCCESS,
  customer,
  role,
  permissions,
  applications,
});

const receivedProfile = (customer, role, permissions, applications) => ({
  type: USER.LOGGED_USER_PROFILE_REQUEST_SUCCESS,
  customer,
  role,
  permissions,
  applications,
});

const failUser = (error, disabled) => ({
  type: USER.LOGGED_USER_REQUEST_FAILURE,
  error,
  disabled,
});

const userTasks = (userTasks) => ({
  type: USER.USER_TASKS,
  userTasks,
});

const getUserProfile = (customerId, userId, email, userCustomers) => ({
  type: USER.USER_LOGIN,
  customerId,
  userId,
  email,
  userCustomers,
});

const setUserProfile = (profile, role, permissions, applications) => ({
  type: USER.SET_USER_PROFILE,
  profile,
  role,
  permissions,
  applications,
});

const logoutUser = () => ({
  type: USER.USER_LOGOUT,
});

const loadingUser = (loading) => ({
  type: USER.USER_LOADING,
  loading,
});

const enableCustomerEdit = () => ({
  type: USER.PROFILE_SET_EDITABLE,
});

const setCustomerProfile = (profile, permissions, applications) => ({
  type: USER.PROFILE_SET,
  profile,
  permissions,
  applications,
});

const updateCustomerProfile = (profile) => ({
  type: USER.PROFILE_UPDATE,
  profile,
});

const disableCustomerEdit = () => ({
  type: USER.PROFILE_DISABLE_EDITABLE,
});

export {
  getUserProfile,
  setUserProfile,
  requestUser,
  receiveUser,
  receivedProfile,
  failUser,
  userTasks,
  loadingUser,
  logoutUser,
  enableCustomerEdit,
  disableCustomerEdit,
  setCustomerProfile,
  updateCustomerProfile,
};
