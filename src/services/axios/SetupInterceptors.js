import MarketplaceServices from "./MarketplaceServices";
import util from "../../util/common";

const umsBaseURL = process.env.REACT_APP_USM_BASE_URL;
const refreshTokenAPI = process.env.REACT_APP_REFRESHTOKEN;

export const SetupInterceptors = (http) => {
  http.interceptors.request.use(
    // `req` is the Axios request config, so you can modify the `headers`.
    // Automatically sets the authorization header in every request because of this request interceptor
    (req) => {
      // debugger;
      req.headers.authorization = util.getAuthToken();
      return req;
    },
    (error) => {
      // debugger;
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    function (response) {
      // debugger;
      console.log("SetupInterceptors-response", response);
      return response;
    },
    function (error) {
      if (error.response) {
        const originalConfig = error.config;
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          window.location.replace(window.location.origin + "/logout");
        }
      }
      // debugger;
      // const originalConfig = error.config;
      // if (error.response) {
      //   if (error.response.status === 401 && !originalConfig._retry) {
      //     originalConfig._retry = true;

      //     // Get refreshToken
      //     let refreshToken = util.getRefreshToken();
      //     let accessToken = util.getAuthToken();
      //     let accessPoint = umsBaseURL + refreshTokenAPI;
      //     MarketplaceServices.save(accessPoint, {
      //       refresh_token: refreshToken,
      //       access_token: accessToken,
      //     })
      //       .then((response) => {
      //         console.log("retrieveRefreshToken", response.data);
      //         if (response.data.access_token) {
      //           util.setAuthToken(response.data.access_token);
      //           util.setRefreshToken(response.data.refresh_token);
      //           window.location.reload();
      //         }
      //       })
      //       .catch((error) => {
      //         console.log("Unable to get refresh token: ", error);
      //         util.logoutUser();
      //       });
      //     return Promise.reject(error);
      //   }
      //   if (error.response.status === "ANOTHER_STATUS_CODE") {
      //     // Do something
      //     return Promise.reject(error.response.data);
      //   }
      // }
      // console.log("SetupInterceptors-response-error", error);
      // const status = error?.response?.status || 0;
      // const resBaseURL = error?.response?.config?.baseURL;
      // if (resBaseURL.retry === baseURL && status === 401) {
      //   if (localStorage.getItem("ap_access_token")) {
      //     localStorage.clear();
      //     window.location.assign("/");
      //     return Promise.reject(error);
      //   } else {
      //     return Promise.reject(error);
      //   }
      // }
      return Promise.reject(error);
    }
  );
};

export default SetupInterceptors;
