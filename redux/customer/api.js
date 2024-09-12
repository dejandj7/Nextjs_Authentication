import { AppConfig } from "../../utilities/config";
import { fetchGetApi, fetchPutApi } from "../fetchHelper";
import qs from "qs";

const getCustomersDataTableApi = async (params) => {
  const paramsSerialized = qs.stringify(params, { encodeValuesOnly: true });
  var url = new URL(AppConfig.apiUrl + "/api/mongo/documents/paging");
  url.search = new URLSearchParams(paramsSerialized).toString();

  return await fetchGetApi(url);
};

const getCustomerByIdApi = async (customerId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/document?collection=CustomerWithRolePermissions&key=_id&keyValue=${customerId}&isObjectId=true`
  );
};

const updateCustomerApi = async (customer) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/customer`,
    customer
  );
};

export { getCustomerByIdApi, getCustomersDataTableApi, updateCustomerApi };
