import { AppConfig } from "../../utilities/config";
import { fetchGetApi } from "../fetchHelper";

const getAllUsersApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents/count?collection=Users`
  );

  return await fetchGetApi(url);
};

const getAllNgoApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents/count?collection=Customers&filters[0][key]=legalCustomer.typeLegalId&filters[0][value]=2`
  );

  return await fetchGetApi(url);
};

const getAllGrandsApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents/count?collection=Applications&filters[0][key]=isGrant&filters[0][value]=true`
  );

  return await fetchGetApi(url);
};

const getAllTendersApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents/count?collection=Tenders`
  );

  return await fetchGetApi(url);
};

const getAllApplicationsApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents/count?collection=Applications`
  );

  return await fetchGetApi(url);
};

const getAllApplicationsLocationsApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents/distinct?collection=Applications&field=select`
  );
  return await fetchGetApi(url);
};

const getTotalPerTenderApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents?collection=TenderAmountsAppAndGrants&filters[0][key]=grants&filters[0][value]=true`
  );
  return await fetchGetApi(url);
};

const getGrantistAddressesApi = async () => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mongo/documents?collection=GrantistAddresses`
  );
  return await fetchGetApi(url);
};

export {
  getAllUsersApi,
  getAllNgoApi,
  getAllGrandsApi,
  getAllTendersApi,
  getAllApplicationsApi,
  getAllApplicationsLocationsApi,
  getTotalPerTenderApi,
  getGrantistAddressesApi,
};
