import { AppConfig } from "../../utilities/config";
import { fetchPostApi } from "../fetchHelper";

const exportExcelApi = async (data) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/api/export/excel`,
    {
      ...data,
    }
  );
};

export { exportExcelApi };
