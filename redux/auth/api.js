import {
  fetchPostApi,
  fetchGetApi,
  fetchGetWithTokenApi,
} from "../fetchHelper";

const getUserAndCutomerProfileApi = async (adAccount) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/user/login/submission`,
    {
      data: adAccount,
    }
  );
};

const getCustomerProfileApi = async (customerId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile?id=${customerId}`
  );
};

const getCustomerProfileWithTokenApi = async (customerId, token) => {
  return await fetchGetWithTokenApi(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile?id=${customerId}`,
    token
  );
};

export {
  getUserAndCutomerProfileApi,
  getCustomerProfileApi,
  getCustomerProfileWithTokenApi,
};
