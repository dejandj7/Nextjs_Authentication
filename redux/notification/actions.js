import NOTIFICATION from "./constants";
import SIGNALR_TYPES from "../signalR/constants";
import { USER_TASK } from "../usertask/constants";
import axios from "axios";
import { AppConfig } from "../../utilities/config";

const signalRNewNotification = (notification, userId) => ({
  type: SIGNALR_TYPES.NEW_NOTIFICATION,
  notification,
  userId,
});

const userNotifications = (notifications) => ({
  type: NOTIFICATION.USER_NOTIFICATIONS,
  notifications,
});

const requestNotification = () => ({
  type: NOTIFICATION.NOTIFICATION_REQUEST,
});

const requestNotificationById = (notificationId) => ({
  type: NOTIFICATION.NOTIFICATION_REQUEST_BY_ID,
  notificationId,
});

const requestNotifications = () => ({
  type: NOTIFICATION.NOTIFICATIONS_REQUEST,
});

const receiveNotification = (notification) => ({
  type: NOTIFICATION.NOTIFICATION_REQUEST_SUCCESS,
  notification,
});

const receiveNotifications = (notifications) => ({
  type: NOTIFICATION.NOTIFICATIONS_REQUEST_SUCCESS,
  notifications,
});

const cleanNotifications = () => ({
  type: NOTIFICATION.NOTIFICATIONS_CLEAN_REQUEST,
});

const receiveNotificationId = (payload) => ({
  type: NOTIFICATION.NOTIFICATION_ID_REQUEST_SUCCESS,
  payload,
});

const errorNotification = (error) => ({
  type: NOTIFICATION.NOTIFICATION_REQUEST_ERROR,
  error,
});

const cleanNotification = () => ({
  type: NOTIFICATION.NOTIFICATION_CLEAN_STATE,
});

const setNotification =
  (notificationId, done = () => {}) =>
  (dispatch) => {
    dispatch(requestNotification());

    axios
      .get(AppConfig.apiUrl + "/notification", {
        params: { id: notificationId },
      })
      .then((result) => {
        const notification = result[0].data[0];
        dispatch(receiveNotification(notification));
        done(null, result);
      })
      .catch((error) => {
        console.log("setNotification catch error " + error);
        done(error);
      });
  };

const setNotifications =
  (done = () => {}) =>
  (dispatch) => {
    dispatch(requestNotifications());

    Promise.all([axios.get(AppConfig.apiUrl + "/notification", {})])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj._id,
        }));
        dispatch(receiveNotifications(mappedArray));
        done(null, result);
      })
      .catch((error) => {
        console.log("setNotifications catch error " + error);
        done(error);
      });
  };

const saveNotificationTemplate =
  (submission, done = () => {}) =>
  (dispatch) => {
    //dispatch(requestGrant());

    var token = Formio.getToken();
    Promise.all([
      axios.post(
        AppConfig.apiUrl + "/Application/register/submission",
        submission,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ])
      .then((result) => {
        done(null, result);
        dispatch(receiveApplicationId(result[0].data._id.$oid));
      })
      .catch((error) => {
        console.log("saveApplication catch error " + error);
        done(error, null);
      });
  };

const updateNotificationTemplate =
  (submission, done = () => {}) =>
  (dispatch) => {
    delete submission.key;
    console.log(submission);
    Promise.all([axios.put(AppConfig.apiUrl + "/notification", submission)])
      .then((result) => {
        done(null, result);
      })
      .catch((error) => {
        console.log("updateNotificationTemplate catch error " + error);
        done(error, null);
      });
  };

const updateNotifications =
  (submission, done = () => {}) =>
  (dispatch) => {
    dispatch(receiveNotifications(submission));
  };

const setNotificationTemplates =
  (notificationId, done = () => {}) =>
  (dispatch) => {
    //dispatch(requestApplications()); ->this line was commented
    dispatch(requestNotification());
    var token = Formio.getToken();
    Promise.all([axios.get(AppConfig.apiUrl + "/notification", {})])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj._id,
        }));
        //dispatch(receiveApplications(mappedArray)); ->this line was commented
        dispatch(receiveNotificationId(mappedArray));
        done(null);
      })
      .catch((error) => {
        console.log("setNotifications catch error " + error);
        done(error);
      });
  };

const updateNotification = (notification) => ({
  type: USER_TASK.UPDATE_NOTIFICATION,
  notification,
});

const updateNotificationSuccess = (notificationId) => ({
  type: USER_TASK.UPDATE_NOTIFICATION_SUCCESS,
  notificationId,
});

const updateNotificationError = (error) => ({
  type: USER_TASK.UPDATE_NOTIFICATION_SUCCESS,
  error,
});

export {
  requestNotification,
  requestNotifications,
  receiveNotification,
  receiveNotifications,
  cleanNotifications,
  cleanNotification,
  receiveNotificationId,
  errorNotification,
  setNotification,
  setNotifications,
  saveNotificationTemplate,
  updateNotification,
  updateNotificationSuccess,
  updateNotifications,
  setNotificationTemplates,
  updateNotificationError,
  updateNotificationTemplate,
  requestNotificationById,
  signalRNewNotification,
  userNotifications,
};
