import axios from "axios";

// const baseURL = "http://172.20.10.2:8000/api";
// const baseURL = "https://steemtrade.pythonanywhere.com/api";
const baseURL = "https://bitmaxv2.pythonanywhere.com/api";
// const baseURL = "http://192.168.43.58:8000/api";
// const baseURL = "http://127.0.0.1:8000/api";

const accessToken = localStorage.getItem("access_token");
const refreshToken = localStorage.getItem("refresh_token");

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    Authorization: accessToken ? "JWT " + accessToken : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log("heres the error: ", error.response);
    const originalRequest = error.config;

    //if no error response
    if (!error.response) {
      console.log("No error response, server might be down");
    }

    //preventing infinite loops early
    if (
      error.response.status === 401 &&
      originalRequest.url === "/auth/token/refresh/"
    ) {
      console.log("Error refreshing token");

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/auth/login/";

      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      error.response.data.code === "user_not_found"
    ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/auth/login/";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds while now( return milliseconds)
        const now = Math.ceil(Date.now() / 1000);
        // console.log(tokenParts.exp, now);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/auth/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              // console.log("resetting ", response);
              localStorage.setItem("access_token", response.data.access);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            });
        } else {
          console.log("Refresh token must be expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/auth/login/";
        }
      } else {
        console.log("Refresh token is not available");
        window.location.href = "/auth/login/";
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
