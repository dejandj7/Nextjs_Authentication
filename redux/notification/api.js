import { fetchGetApi } from "../fetchHelper";
import { AppConfig } from "../../utilities/config";

const getNotificationByIdApi = async (notificationId) => {
  return await fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/notification/template/${notificationId}`
  );
};

export { getNotificationByIdApi };
