import { AppConfig } from "../../utilities/config";
import {
  fetchGetApi,
  fetchPutApi,
  fetchPostApi,
  fetchGetWithTokenApi,
} from "../fetchHelper";

const getUserTasksApi = async (assignedTo) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/usertask/user?userId=${assignedTo}`
  );
};

const getUserTasksWithTokenApi = async (assignedTo, token) => {
  return await fetchGetWithTokenApi(
    `${process.env.NEXT_PUBLIC_API_URL}/usertask/user?userId=${assignedTo}`,
    token
  );
};

const getNotificationByUserIdApi = async (userId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/notification?userId=${userId}`
  );
};

const completeUserTaskApi = async (userTask, connection) => {
  const response = await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/usertask/${userTask.id}/complete`,
    userTask
  );
  await connection.invoke("CompleteUserTask", userTask);
  return response;
};

const updateNotification = async (notification) => {
  await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/notification/updateseen`,
    notification
  );
};

export {
  getUserTasksApi,
  getUserTasksWithTokenApi,
  getNotificationByUserIdApi,
  completeUserTaskApi,
  updateNotification,
};
