import USER from './constants';
import { AppConfig } from '../../utilities/config';

const requestUserById = (userId, token) => ({
  type: USER.USER_REQUEST_BY_ID,
  userId,
  token,
});

const requestSetDefaultProfile = (userId, customerId) => ({
  type: USER.USER_DEFAULT_PROFILE_REQUEST,
  userId,
  customerId,
});

const requestUserByUserName = (username) => ({
  type: USER.USER_REQUEST_BY_USERNAME,
  username,
});

const responseUser = (user) => ({
  type: USER.USER_REQUEST_SUCCESS,
  user,
});

const errorUser = (error) => ({
  type: USER.USER_REQUEST_ERROR,
  error,
});

const requestUsers = () => ({
  type: USER.USERS_REQUEST,
});

const receiveUsers = (users) => ({
  type: USER.USERS_REQUEST_SUCCESS,
  users,
});

const cleanUsers = () => ({
  type: USER.USERS_CLEAN_REQUEST,
});

const setUsers =
  (token, done = () => {}) =>
  async (dispatch) => {
    dispatch(requestUsers());
    let client = getApiFetchClient();

    client.scopes = [process.env.SCOPE_URL + 'login.read'];

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const result = await client.fetch(AppConfig.apiUrl + '/User', options);
      const users = await result.json();
      const mappedArray = users.map((obj) => ({
        ...obj,
        key: obj.id,
      }));
      dispatch(receiveUsers(mappedArray));
      done(null, result);
    } catch (error) {
      console.log('setUsers catch error ' + error);
      done(error);
    }
  };

export {
  requestUserById,
  requestSetDefaultProfile,
  requestUserByUserName,
  responseUser,
  errorUser,
  cleanUsers,
  setUsers,
};
