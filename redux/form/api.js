import {
  fetchGetApi,
  fetchPutApi,
  fetchPostApi,
  fetchDeleteApi,
} from "../fetchHelper";
import qs from "qs";

const addFormApi = async (form) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/form/submission`,
    form
  );
};

const deleteFormByIdApi = async (id) => {
  return fetchDeleteApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/form?id=${id}`
  );
};

const getFormByPathApi = async (path) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/form?path=${path}`
  );
};

const getFormByPathRawApi = async (path) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/form?path=${path}&replaceApiUrl=false`
  );
};

const getAllFormIOFormsApi = async (parameters) => {
  const paramsSerialized = qs.stringify(parameters, { encodeValuesOnly: true });
  var url = new URL(
    process.env.NEXT_PUBLIC_API_URL + "/api/mongo/documents/paging"
  );
  url.search = new URLSearchParams(paramsSerialized).toString();

  return await fetchGetApi(url);
};

const updateFormApi = async (form) => {
  const updatedForm = JSON.stringify(form).replace(
    process.env.NEXT_PUBLIC_API_URL,
    "{{apiUrl}}"
  );
  return fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/update/form`,
    JSON.parse(updatedForm)
  );
};

export {
  addFormApi,
  deleteFormByIdApi,
  getFormByPathApi,
  getFormByPathRawApi,
  getAllFormIOFormsApi,
  updateFormApi,
};
