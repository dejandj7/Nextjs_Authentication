import SIGNALR_TYPES from "./constants";

import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";

const signalRComplateUserTask = (userTask) => ({
  type: SIGNALR_TYPES.USER_TASK_COMPLETE_SUCESSS,
  userTask,
});

const signalRUpdateUserTask = (userTask) => ({
  type: SIGNALR_TYPES.UPDATE_USER_TASK,
  userTask,
});

const signalRNewUserTask = (userTask, userId) => ({
  type: SIGNALR_TYPES.NEW_USER_TASK,
  userTask,
  userId,
});

const signalRProfileStatusUpdate = (statusUpdate) => ({
  type: SIGNALR_TYPES.PROFILE_STATUS_UPDATE,
  statusUpdate,
});

const signalRConnectionStatus = (status) => ({
  type: SIGNALR_TYPES.SIGNALR_STATUS_UPDATE,
  status,
});

const isDev = process.env.NODE_ENV === "development";

let connection;
const getSingalRConnection = () => connection;

const startSignalRConnection = async (userId) => {
  try {
    await connection.start().then((result) => {});
    console.assert(connection.state === HubConnectionState.Connected);
    console.log("SignalR connection established");
  } catch (err) {
    console.assert(connection.state === HubConnectionState.Disconnected);
    console.error("SignalR Connection Error: ", err);
    if (connection.state === HubConnectionState.Disconnected) {
      setTimeout(() => startSignalRConnection(connection), 5000);
    }
  }
};

// Set up a SignalR connection to the specified hub URL, and actionEventMap.
// actionEventMap should be an object mapping event names, to eventHandlers that will
// be dispatched with the message body.
const setupSignalRConnection =
  (connectionHub, token, userId) => (dispatch, getState) => {
    const options = {
      logMessageContent: isDev,
      logger: isDev ? LogLevel.Warning : LogLevel.Error,
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: () => token,
    };

    // create the connection instance
    // withAutomaticReconnect will automatically try to reconnect
    // and generate a new socket connection if needed
    connection = new HubConnectionBuilder()
      .withUrl(connectionHub, options)
      .withAutomaticReconnect([
        0,
        1000,
        5000,
        15000,
        30000,
        60000,
        120000,
        null,
      ])
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();

    // Note: to keep the connection open the serverTimeout should be
    // larger than the KeepAlive value that is set on the server
    // keepAliveIntervalInMilliseconds default is 15000 and we are using default
    // serverTimeoutInMilliseconds default is 30000 and we are using 60000 set below
    connection.serverTimeoutInMilliseconds = 60000;

    connection.on((error) => {
      console.assert(connection.state === HubConnectionState.Disconnected);
      dispatch(signalRConnectionStatus(connection.state));
      console.log(
        "Connection closed due to error. Try refreshing this page to restart the connection",
        error
      );
    });

    // re-establish the connection if connection dropped
    connection.onclose((error) => {
      console.assert(connection.state === HubConnectionState.Disconnected);
      dispatch(signalRConnectionStatus(connection.state));
      console.log(
        "Connection closed due to error. Try refreshing this page to restart the connection",
        error
      );
    });

    connection.onreconnecting((error) => {
      console.assert(connection.state === HubConnectionState.Reconnecting);
      dispatch(signalRConnectionStatus(connection.state));
      console.log("Connection lost due to error. Reconnecting.", error);
    });

    connection.onreconnected(() => {
      console.assert(connection.state === HubConnectionState.Connected);
      dispatch(signalRConnectionStatus(connection.state));
      console.log(
        "Connection reestablished. Connected with connectionId",
        connection.connectionId
      );
    });

    startSignalRConnection(userId).then(() =>
      dispatch(signalRConnectionStatus(connection.state))
    );

    connection.on("NewUserTask", (userTask) => {
      dispatch(signalRNewUserTask(userTask, userId));
    });

    connection.on("CompleteUserTask", (userTask) => {
      dispatch(signalRComplateUserTask(userTask));
    });

    connection.on("UpdateUserTask", (userTask) => {
      dispatch(signalRUpdateUserTask(userTask));
    });

    connection.on("NewNotification", (notification) => {
      dispatch(signalRNewNotification(notification, userId));
    });

    connection.on("ApplicationStatusUpdate", (data) => {
      dispatch(signalRApplicatinStatusUpdate(data));
    });

    connection.on("ProfileStatusUpdate", (data) => {
      dispatch(signalRProfileStatusUpdate(data));
    });

    return connection;
  };

export {
  signalRNewUserTask,
  setupSignalRConnection,
  signalRConnectionStatus,
  getSingalRConnection,
};
