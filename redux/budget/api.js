import { AppConfig } from "../../utilities/config";
import { fetchGetApi } from "../fetchHelper";

const getNestedBudgetApi = async () => {
  return await fetchGetApi(`${process.env.NEXT_PUBLIC_API_URL}/budget/nested`);
};

export { getNestedBudgetApi };
