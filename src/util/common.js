import Cookies from "js-cookie";

const storeName = process.env.REACT_APP_STORE_NAME;
const baseURL = process.env.REACT_APP_BASE_URL;

const hasKeyCloakData = () => {
  if (window.sessionStorage.getItem("keycloakData")) {
    return true;
  }
  return false;
};

const hasUserLoggedIn = () => {
  if (window.sessionStorage.getItem("is_loggedIn")) {
    return true;
  }

  return false;
};

const logoutUser = () => {
  sessionStorage.clear();
  window.location = "/";
};

const getAuthToken = () => {
  return window.sessionStorage.getItem("access_token");
};

const getRefreshToken = () => {
  return window.sessionStorage.getItem("refresh_token");
};

const setAuthToken = (authToken) => {
  window.sessionStorage.setItem("access_token", authToken);
};

const setRefreshToken = (refreshToken) => {
  window.sessionStorage.setItem("refresh_token", refreshToken);
};

const setIsLoggedIn = (value) => {
  window.sessionStorage.setItem("is_loggedIn", value);
};

const getSelectedLanguageCode = () => {
  let userSelectedLang = Cookies.get("dmsmplng");
  if (userSelectedLang === undefined) {
    userSelectedLang = localStorage.getItem("dmsmplng");
  }
  return userSelectedLang;
};

const getRealmName = () => {
  if (hasKeyCloakData) {
    const keyCloakData = JSON.parse(
      window.sessionStorage.getItem("keycloakData")
    );
    const urlParams = new URLSearchParams(keyCloakData.url);
    const realmName = urlParams.get("client_id");
    return realmName.slice(0, realmName.lastIndexOf("-"));
  }

  return storeName;
};

const getImageAbsolutePath = (relativePath) => {
  return baseURL + "" + relativePath;
};

const util = {
  hasKeyCloakData,
  hasUserLoggedIn,
  logoutUser,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  setIsLoggedIn,
  getSelectedLanguageCode,
  getRealmName,
  getImageAbsolutePath,
};

export default util;
