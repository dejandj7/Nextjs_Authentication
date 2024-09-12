import * as type from './constants';
import axios from 'axios';
import { AppConfig } from '../../utilities/config';

const actions = {
  SET_STATE: 'appTemplates/SET_STATE',
  CLEAN_STATE: 'appTemplates/CLEAN_STATE',
  CHANGE_APP_TEMPLATE: 'appTemplates/CHANGE_APP_TEMPLATE',
  APP_TEMPLATES_REQUEST: 'APP_TEMPLATES_REQUEST',
  APP_TEMPLATE_FORM_REQUEST: 'APP_TEMPLATE_FORM_REQUEST',
  APP_TEMPLATE_ID_REQUEST_SUCCESS: 'APP_TEMPLATE_ID_REQUEST_SUCCESS',
  APP_TEMPLATE_REQUEST_SUCCESS: 'APP_TEMPLATE_REQUEST_SUCCESS',
  APP_TEMPLATES_REQUEST_SUCCESS: 'APP_TEMPLATES_REQUEST_SUCCESS',
  APP_TEMPLATE_FORM_REQUEST_SUCCESS: 'APP_TEMPLATE_FORM_REQUEST_SUCCESS',
};

export default actions;

const requestAppTemplates = () => ({
  type: type.APP_TEMPLATES_REQUEST,
});

const requestForm = () => ({
  type: type.APP_TEMPLATE_FORM_REQUEST,
});

export const receiveAppTemplate = (appTemplate) => ({
  type: type.APP_TEMPLATE_REQUEST_SUCCESS,
  appTemplate,
});

export const receiveAppTemplateForm = (payload) => ({
  type: type.APP_TEMPLATE_FORM_REQUEST_SUCCESS,
  payload,
});

const receiveAppTemplates = (appTemplates) => ({
  type: type.APP_TEMPLATES_REQUEST_SUCCESS,
  appTemplates,
});

export const setAppTemplates =
  (done = () => {}) =>
  (dispatch) => {
    dispatch(requestAppTemplates());

    var token = Formio.getToken();
    Promise.all([
      axios.get(AppConfig.apiUrl + '/application/template', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then((result) => {
        const mappedArray = result[0].data.map((obj) => ({
          ...obj,
          key: obj.id,
        }));
        dispatch(receiveAppTemplates(mappedArray));
        done(null, result);
      })
      .catch((error) => {
        console.log('setAppTemplates catch error ' + error);
        done(error);
      });
  };

export const setForm =
  (submission, done = () => {}) =>
  (dispatch) => {
    dispatch(requestForm());

    var token = Formio.getToken();
    Promise.all([
      axios.put(
        AppConfig.apiUrl + '/Application/updatetemplate/submission',
        submission,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ])
      .then((result) => {
        done(null, result);
      })
      .catch((error) => {
        console.log('setForm catch error ' + error);
        done(error, null);
      });
  };
