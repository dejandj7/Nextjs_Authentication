import { put, call, takeLeading } from "redux-saga/effects";
import { receiveUser, failUser, userTasks, loadingUser } from "./actions";
import { responseUserTasks } from "../usertask/actions";
import { receivedLinks, responseLinks } from "../links/actions";
import { userNotifications } from "../notification/actions";
import { USER } from "./constants";
import { getUserAndCutomerProfileApi, getCustomerProfileApi } from "./api";
import { getUserTasksApi } from "../usertask/api";
import { getDocumentsApi } from "../generic/api";
import _ from "lodash";

function* getUserAndCustomerProfileWokrer({ adAccount }) {
  let userId = null;
  let disabled = false;
  try {
    const userProfile = yield call(getUserAndCutomerProfileApi, adAccount);

    try {
      const parameters = {
        collection: "Links",
      };
      const links = yield call(getDocumentsApi, parameters);
      yield put(responseLinks(links));
      yield put(receivedLinks(true));
    } catch (error) {
      yield put(receivedLinks(false));
    }

    try {
      const usertasks = yield call(getUserTasksApi, userId);
      yield put(responseUserTasks(usertasks));
      yield put(userTasks(true));
    } catch (error) {
      yield put(userTasks(false));
    }

    try {
      const filtersBuild = [
        {
          key: "UserId",
          value: userId,
        },
        {
          key: "IsSeen",
          value: false,
        },
      ];
      const parameters = {
        collection: "Notifications",
        filters: filtersBuild,
      };
      const notifications = yield call(getDocumentsApi, parameters);
      yield put(responseNotifications(notifications));
      yield put(userNotifications(true));
    } catch (error) {
      yield put(userNotifications(false));
    }
  } catch (error) {
    yield put(failUser(error.toString(), disabled));
  }
}

function* getCustomerProfileWorker({
  customerId,
  userId,
  email,
  userCustomers,
}) {
  try {
    yield put(loadingUser(true));
    const response = yield call(getCustomerProfileApi, customerId);
    const userProfile = response.data;
    const user = userProfile.customer.relatedUsers.filter(
      (item) => item._id === userId
    )[0];
    const userRoles = user.userRoles.map((item) => item.name);
    var permissions = [];
    userProfile.customer.roles.forEach((element) => {
      if (userRoles.indexOf(element.name) >= 0) {
        permissions = _.union(permissions, element.permissions);
      }
    });
    permissions = _.sortBy(permissions);
    yield put(
      receiveUser(
        userProfile.customer,
        user.userRoles,
        permissions,
        userProfile.applications
      )
    );
    yield put(loadingUser(false));
  } catch (error) {
    console.error(error);
    yield put(loadingUser(false));
    yield put(failUser(error.toString(), true));
  }

  try {
    const parameters = {
      collection: "Links",
    };
    const links = yield call(getDocumentsApi, parameters);
    yield put(responseLinks(links.data));
    yield put(receivedLinks(true));
  } catch (error) {
    yield put(receivedLinks(false));
  }

  try {
    const usertasks = yield call(getUserTasksApi, userId);
    yield put(responseUserTasks(usertasks.data));
    yield put(userTasks(true));
  } catch (error) {
    yield put(userTasks(false));
  }

  try {
    const filtersBuild = [
      {
        key: "UserId",
        value: userId,
      },
      {
        key: "IsSeen",
        value: false,
      },
    ];
    const parameters = {
      collection: "Notifications",
      filters: filtersBuild,
    };
    const notifications = yield call(getDocumentsApi, parameters);
    yield put(responseNotifications(notifications.data));
    yield put(userNotifications(true));
  } catch (error) {
    yield put(userNotifications(false));
  }
}

export default function* rootSaga() {
  yield takeLeading(USER.LOGGED_USER_REQUEST, getUserAndCustomerProfileWokrer);
  yield takeLeading(USER.USER_LOGIN, getCustomerProfileWorker);
}
