import { AppConfig } from "../../utilities/config";
import { fetchGetApi, fetchPutApi } from "../fetchHelper";

const getOrganizationUsersApi = async (customerId, role) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/customer/usersbyrole?customerId=${customerId}&role=${role}`
  );
};

const getUserByIdApi = async (userId) => {
  return await fetchGetApi(`${process.env.NEXT_PUBLIC_API_URL}/User/${userId}`);
};

const getUserByUserNameApi = async (username) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/User/username/${username}`
  );
};

const setUserDefaultProfileApi = async (userId, customerId) => {
  const data = {
    userId,
    customerId,
  };

  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/user/defaultprofile/submission`,
    data
  );
};

const updateUserApi = async (user) => {
  return await fetchPutApi(`${process.env.NEXT_PUBLIC_API_URL}/user`, user);
};

export {
  getOrganizationUsersApi,
  getUserByIdApi,
  getUserByUserNameApi,
  setUserDefaultProfileApi,
  updateUserApi,
};
