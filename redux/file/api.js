import { AppConfig } from "../../utilities/config";
import { fetchDeleteApi } from "../fetchHelper";

const deleteFileApi = async (fileInfo) => {
  return await fetchDeleteApi(
    `${process.env.NEXT_PUBLIC_API_URL}/document/delete/${fileInfo.data.data.libraryGuid}/${fileInfo.data.data.driveId}/${fileInfo.name}`
  );
};

export { deleteFileApi };
