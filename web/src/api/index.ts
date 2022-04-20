import axios from "axios";
import { SERVER_ROOT_URL, token } from "../utils/constants";

export const sampleApi = () => {
  return axios({
    method: "get",
    url: `${SERVER_ROOT_URL}/api/sample`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: token }),
    },
  });
};
