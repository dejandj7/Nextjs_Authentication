import { USER } from "./constants";
import produce from "immer";
import _ from "lodash";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  init: false,
  isActive: false,
  user: null,
  role: null,
  permissions: [
    "home:visit",
    "dashboard:visit",
    "userTasks:visit",
    "customer:details",
    "application:create",
    "activegrants:visit",
    "application:edit",
    "application:view",
    "dashboardstatistics:visit",
    "customerapplication:list",
    "customerapplication:details",
    "customergrants:list",
    "customerapplication:edit",
    "customergrants:details",
    "profile:edit",
    "profile:visit",
    "application:send:review",
  ],
  applications: null,
  myprofile: null,
  adAccount: "",
  authenticated: false,
  tasks: false,
  notifications: false,
  roles: {},
  error: "",
  profileEditable: false,
  profileChanged: false,
  disabled: false,
  isLoading: false,
};

export const authReducer = produce((state = initialState, action) => {
  switch (action.type) {
    case USER.LOGGED_USER_REQUEST:
      return {
        ...state,
        myprofile: null,
        adAccount: action.adAccount,
        init: true,
        submissionAccess: false,
        isActive: true,
      };
    case USER.LOGGED_USER_REQUEST_SUCCESS:
      return {
        ...state,
        isActive: false,
        role: action.role,
        permissions: action.permissions,
        myprofile: action.customer,
        applications: action.applications,
        authenticated: true,
        profileEditable: true,
        error: "",
      };
    case USER.SET_USER_PROFILE:
      return {
        ...state,
        isActive: false,
        myprofile: action.profile,
        role: action.role,
        permissions: action.permissions,
        applications: action.applications,
        authenticated: true,
        profileEditable: true,
        error: "",
      };
    case USER.LOGGED_USER_PROFILE_REQUEST_SUCCESS:
      return {
        ...state,
        role: action.role,
        permissions: action.permissions,
        myprofile: action.customer,
        applications: action.applications,
        error: "",
      };
    case USER.LOGGED_USER_REQUEST_FAILURE:
      return {
        ...state,
        isActive: false,
        authenticated: false,
        error: action.error,
        user: null,
        role: null,
        permissions: [],
        applications: null,
        profileEditable: false,
        disabled: action.disabled,
      };
    case USER.USER_LOGOUT:
      return {
        ...state,
        user: null,
        role: null,
        permissions: [],
        applications: null,
        isActive: false,
        authenticated: false,
        error: "",
        profileEditable: false,
      };
    case USER.USER_ROLES:
      return {
        ...state,
        roles: action.roles,
      };
    case USER.PROFILE_SET_EDITABLE:
      return {
        ...state,
        profileEditable: true,
      };
    case USER.PROFILE_DISABLE_EDITABLE:
      return {
        ...state,
        profileEditable: false,
      };
    case USER.PROFILE_CHANGE_RESET:
      return {
        ...state,
        profileChanged: false,
      };
    case USER.PROFILE_UPDATE:
      return {
        ...state,
        myprofile: action.profile,
      };
    case USER.USER_LOADING:
      return {
        ...state,
        isLoading: action.loading,
      };
    case USER.PROFILE_SET:
      return {
        ...state,
        myprofile: action.profile,
        permissions: action.permissions,
        applications: action.applications,
        role: action.profile.relatedUsers.filter(
          (item) => item._id === state.user.id
        )[0].userRoles,
        profileChanged: true,
      };
    case [HYDRATE]:
      (state, action) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      };
    default:
      return state;
  }
});
