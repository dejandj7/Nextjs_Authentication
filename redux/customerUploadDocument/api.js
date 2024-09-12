import { AppConfig } from "../../utilities/config";
import { fetchPostApi } from "../fetchHelper";

const completeCustomerDocumentUploadApi = async (customer, token) => {
  return await fetchPostApi(
    `${process.env.NEXT_PUBLIC_API_URL}/document`,
    customer
  );
};

export { completeCustomerDocumentUploadApi };
