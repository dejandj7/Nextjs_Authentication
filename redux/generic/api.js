import qs from "qs";
import { AppConfig } from "../../utilities/config";
import {
  fetchGetApi,
  fetchPutApi,
  fetchPostApi,
  fetchDeleteApi,
  fetchGetWithTokenApi,
} from "../fetchHelper";

const addDocumentApi = async (parameters) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/add`,
    {
      data: parameters.data,
      collection: parameters.collection,
    }
  );
};

const deleteDocumentApi = async (parameters) => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo?collection=${parameters.collection}&key=${parameters.key}&keyValue=${parameters.keyValue}&isObjectId=${parameters.isObjectId}`
  );
  return await fetchDeleteApi(url);
};

const getDocumentApi = async (parameters) => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/document?collection=${parameters.collection}&key=${parameters.key}&keyValue=${parameters.keyValue}&isObjectId=${parameters.isObjectId}`
  );

  return await fetchGetApi(url);
};

const getDocumentsApi = async (parameters) => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents?${qs.stringify(
      parameters,
      {
        encodeValuesOnly: true,
      }
    )}`
  );

  return await fetchGetApi(url);
};

const getDocumentsWithTokenApi = async (parameters, token) => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents?${qs.stringify(
      parameters,
      {
        encodeValuesOnly: true,
      }
    )}`
  );

  return await fetchGetWithTokenApi(url, token);
};

const getDocumentsDataTableApi = async (params) => {
  var url = new URL(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/mongo/documents/paging?${qs.stringify(params, {
      encodeValuesOnly: true,
    })}`
  );

  return await fetchGetApi(url);
};

const updateDocumentApi = async (parameters) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/update`,
    {
      ...parameters,
    }
  );
};

const updateDocumentPropertyApi = async (parameters) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/update/property`,
    {
      ...parameters,
    }
  );
};

const updateDocumentPropertiesApi = async (parameters) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/update/properties`,
    {
      ...parameters,
    }
  );
};

export {
  addDocumentApi,
  deleteDocumentApi,
  getDocumentApi,
  getDocumentsApi,
  getDocumentsWithTokenApi,
  getDocumentsDataTableApi,
  updateDocumentApi,
  updateDocumentPropertyApi,
  updateDocumentPropertiesApi,
};
