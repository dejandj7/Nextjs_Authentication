import qs from "qs";
import { AppConfig } from "../../utilities/config";
import { fetchGetApi, fetchPutApi, fetchPostApi } from "../fetchHelper";

const getApplicationByIdApi = async (applicationId, signal = null) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application?id=${applicationId}`,
    signal
  );
};

const getApplicationByPermissionApi = async (params, signal = null) => {
  var url = new URL(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/application/datatable/permission?${qs.stringify(params, {
      encodeValuesOnly: true,
    })}`
  );

  return await fetchGetApi(url);
};

const getApplicationWithProfileAndTenderByIdApi = async (
  applicationId,
  signal = null
) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/document?collection=ApplicationsWithTender&key=_id&keyValue=${applicationId}&isObjectId=true`,
    signal
  );
};

const getMyApplicationWithProfileAndTenderByIdApi = async (
  applicationId,
  applicantId,
  signal = null
) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/document/filtered?collection=MyApplicationsWithTender&filters[0][key]=_id&filters[0][value]=${applicationId}&filters[0][id]=true&filters[1][key]=applicant.applicantId&filters[1][value]=${applicantId}`,
    signal
  );
};

const getGrantWithProfileAndOrdersByIdApi = async (
  applicationId,
  signal = null
) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/document?collection=ApplicationsWithOrders&key=_id&keyValue=${applicationId}&isObjectId=true`,
    signal
  );
};

const getApplicationsApi = async () => {
  return await fetchGetApi(`${process.env.NEXT_PUBLIC_API_URL}/application`);
};

const getApplicationsDataTableApi = async (params) => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/application/all?${qs.stringify(params, {
      encodeValuesOnly: true,
    })}`
  );

  return await fetchGetApi(url);
};

const getApplicationsByCustomerApi = async (customerId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/customer?customerId=${customerId}`
  );
};

const getDonorByIdApi = async (donorId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/donor?id=${donorId}`
  );
};

const getDonorsApi = async (params) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/donor`
  );
};

const getBudgetApi = async (ApiFetchClient) => {
  return await fetchGetApi(`${process.env.NEXT_PUBLIC_API_URL}/budget/nested`);
};

const getTendersApi = async (filtered) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/tenders?filtered=${filtered}`
  );
};

const getTenderByIdApi = async (tenderId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/tender?id=${tenderId}`
  );
};

const getUnrelatedTemplateApi = async () => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/unrelated`
  );
};

const saveApplicationApi = async (application) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/register/submission`,
    { data: application.data }
  );
};

const saveTenderApi = async (tender) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/tender/submission`,
    { data: tender.data }
  );
};

const updateApplicationApi = async (application) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/update/submission`,
    { data: application.data }
  );
};

const updateApplicationPropertyApi = async (application) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/update/property`,
    {
      ...application,
    }
  );
};

const updateTenderApi = async (tender) => {
  return await fetchPutApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/updatetender/submission`,
    { data: tender.data }
  );
};

export {
  getApplicationByIdApi,
  getApplicationByPermissionApi,
  getApplicationWithProfileAndTenderByIdApi,
  getMyApplicationWithProfileAndTenderByIdApi,
  getApplicationsByCustomerApi,
  getApplicationsApi,
  getApplicationsDataTableApi,
  getBudgetApi,
  getDonorsApi,
  getDonorByIdApi,
  getGrantWithProfileAndOrdersByIdApi,
  getTendersApi,
  getTenderByIdApi,
  getUnrelatedTemplateApi,
  saveApplicationApi,
  saveTenderApi,
  updateApplicationApi,
  updateApplicationPropertyApi,
  updateTenderApi,
};
