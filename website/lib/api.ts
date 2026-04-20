import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 55000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const MAX_RETRY_TIME = 55000;
const RETRY_DELAY = 1000;

// Add a request interceptor to include the auth token and track start time
api.interceptors.request.use(
  (config: any) => {
    if (!config._startTime) {
      config._startTime = Date.now();
    }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("harbor_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle common errors (like 401 Unauthorized) and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle Network Errors or Timeouts for retry
    // !error.response covers cases where the server didn't respond (e.g. backend down)
    if (!error.response && config) {
      const startTime = config._startTime || Date.now();
      const timeElapsed = Date.now() - startTime;

      if (timeElapsed < MAX_RETRY_TIME) {
        // Wait for a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

        // Recalculate timeout for the retry attempt
        const remainingTime = MAX_RETRY_TIME - (Date.now() - startTime);
        if (remainingTime > 0) {
          config.timeout = remainingTime;
          // Return the retry request
          return api(config);
        }
      }
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("harbor_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
