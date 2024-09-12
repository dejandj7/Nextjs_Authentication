import { AppConfig } from "../../utilities/config";
import qs from "qs";
import { fetchGetApi, fetchPostApi } from "../fetchHelper";

const getWorkFlowsApi = async (parameters) => {
  var url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/WF/processes?${qs.stringify(
      parameters,
      {
        encodeValuesOnly: true,
      }
    )}`
  );
  return await fetchGetApi(url);
};

const getWorkFlowInstanceApi = async (instanceId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/WF/process?instanceId=${instanceId}`
  );
};

const startWorkFlowByKeyApi = async (definitionKey, id, userId, data) => {
  const dataWithApiUrl = { ...data, apiUrl: AppConfig.apiUrlBpmn };
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/WF/start/process/${definitionKey}`,
    { id: id, userId, data: dataWithApiUrl }
  );
};

export { getWorkFlowsApi, getWorkFlowInstanceApi, startWorkFlowByKeyApi };
