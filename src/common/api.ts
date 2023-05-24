import axios from "axios";
import { sleep } from "./utils";
import { CAT_API_URL } from "./constants";

// Axios API client with built-in exponential retrying up to 3 times
const apiClient = axios.create({
  baseURL: CAT_API_URL,
  timeout: 10000,
});

let retries = 0;

apiClient.interceptors.response.use(
  async (response) => {
    retries = 0;
    return response;
  },
  async (error) => {
    const { config, response } = error;
    const { method, url } = config;

    // If the error is due to a 5xx error, we retry up to 3 times
    if (response && response.status >= 500 && response.status < 600) {
      if (retries >= 3) {
        retries = 0;
        throw error;
      }

      console.log(
        `Retrying ${method.toUpperCase()} request to ${url} due to ${
          response.status
        } error`
      );

      await sleep(2 ** retries);

      retries += 1;
      return apiClient(config);
    }

    throw error;
  }
);

export default apiClient;
