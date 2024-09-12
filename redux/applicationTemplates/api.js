import { AppConfig } from "../../utilities/config";
import { fetchGetApi } from "../fetchHelper";

const getApplicationTemplateByIdApi = async (applicationTemplateId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/application/template?id=${applicationTemplateId}`
  );
};

export { getApplicationTemplateByIdApi };
