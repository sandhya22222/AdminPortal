import Cookies from "js-cookie";

const storeName = process.env.REACT_APP_STORE_NAME;
const baseURL = process.env.REACT_APP_BASE_URL;

const isDev = () => {
  return process.env.NODE_ENV === "development" ? true : false;
};

const getPermissionData = () => {
  return window.sessionStorage.getItem("permissions_data");
};

const getReduxPersistRoot = () => {
  let reduxPersistRoot = window.localStorage.getItem("persist:root");
  if (reduxPersistRoot) return JSON.parse(reduxPersistRoot);
  else return null;
};

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

const getSelectedLanguageCode = () => {
  let userSelectedLang = Cookies.get("mpaplng");
  if (userSelectedLang === undefined) {
    userSelectedLang = localStorage.getItem("mpaplng");
  }
  return userSelectedLang;
};

const getUserSelectedLngCode = () => {
  try {
    const cookieLngCode = Cookies.get("mpaplng");
    const localStorageLngCode = window.localStorage.getItem("mpaplng");
    if (cookieLngCode) return cookieLngCode;
    else if (localStorageLngCode) return localStorageLngCode;
    else {
      const allStoreLngs = getReduxPersistRoot();
      let defaultStoreLng = allStoreLngs && allStoreLngs.reducerDefaultLanguage;
      defaultStoreLng =
        defaultStoreLng && JSON.parse(defaultStoreLng).defaultLanguage;

      let userSelectedLng =
        allStoreLngs && allStoreLngs.reducerSelectedLanguage;
      // allStoreLngs && JSON.parse(allStoreLngs).reducerSelectedLanguage;
      userSelectedLng =
        userSelectedLng && JSON.parse(userSelectedLng).selectedLanguage;
      console.log("userSelectedLng", userSelectedLng);
      if (userSelectedLng) {
        if (userSelectedLng.language_code) {
          setUserSelectedLngCode(userSelectedLng.language_code);
          return userSelectedLng.language_code;
        } else {
          setUserSelectedLngCode("en");
          return "en";
        }
      } else if (defaultStoreLng) {
        if (defaultStoreLng.language_code) {
          setUserSelectedLngCode(defaultStoreLng.language_code);
          return defaultStoreLng.language_code;
        } else {
          setUserSelectedLngCode("en");
          return "en";
        }
      } else {
        setUserSelectedLngCode("en");
        return "en";
      }
    }
  } catch (error) {
    setUserSelectedLngCode("en");
    return "en";
  }
};

/**
 * Setter Functions
 */

const setAuthToken = (authToken) => {
  window.sessionStorage.setItem("access_token", authToken);
};

const setRefreshToken = (refreshToken) => {
  window.sessionStorage.setItem("refresh_token", refreshToken);
};

const setIsLoggedIn = (value) => {
  window.sessionStorage.setItem("is_loggedIn", value);
};

const setClient = (value) => {
  window.sessionStorage.setItem("client", value);
};

const setPermissionData = (value) => {
  window.sessionStorage.setItem("permissions_data", value);
};

const setIsAuthorized = (value) => {
  window.sessionStorage.setItem("isAuthorized", value);
};

const setUserSelectedLngCode = (value) => {
  console.log("value1234", value);
  window.localStorage.setItem("mpaplng", value);
  Cookies.set("mpaplng", value);
};

const getSelectedLanguageDirection = () => {
  try {
    const allStoreLngs = getReduxPersistRoot();
    let defaultStoreLng = allStoreLngs && allStoreLngs.reducerDefaultLanguage;
    defaultStoreLng =
      defaultStoreLng && JSON.parse(defaultStoreLng).defaultLanguage;
    let userSelectedLng = allStoreLngs && allStoreLngs.reducerSelectedLanguage;
    userSelectedLng =
      userSelectedLng && JSON.parse(userSelectedLng).selectedLanguage;
    if (userSelectedLng) {
      return userSelectedLng.writing_script_direction;
    } else if (defaultStoreLng) {
      return defaultStoreLng.writing_script_direction;
    } else {
      return "LTR";
    }
  } catch (error) {
    return "LTR";
  }
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

const getToastObject = (message, type) => {
  const toastObject = {};
  const dataObject = {};
  dataObject["response_message"] = message;
  dataObject["error_type"] = type;

  toastObject["data"] = dataObject;

  return toastObject;
};

const getStoreSupportedLngs = () => {
  let storeSupportedLngs = ["en"];
  try {
    const reduxPersistRoot = util.getReduxPersistRoot();
    let storeLngs = reduxPersistRoot && reduxPersistRoot.reducerStoreLanguage;
    storeLngs = storeLngs && JSON.parse(storeLngs).storeLanguage;
    console.log("supportedLngs", storeLngs);

    if (storeLngs && storeLngs.length > 0) {
      storeSupportedLngs = [];
      storeLngs.forEach((element) => {
        if (element.language_code) {
          storeSupportedLngs.push(element.language_code);
        }
      });
    }

    return storeSupportedLngs;
  } catch (error) {
    return storeSupportedLngs;
  }
};

const getStoreDefaultLngCode = () => {
  try {
    const allStoreLngs = getReduxPersistRoot();
    let defaultStoreLng = allStoreLngs && allStoreLngs.reducerDefaultLanguage;
    defaultStoreLng =
      defaultStoreLng && JSON.parse(defaultStoreLng).defaultLanguage;

    if (defaultStoreLng) {
      if (defaultStoreLng.language_code) {
        return defaultStoreLng.language_code;
      } else {
        return "en";
      }
    } else return "en";
  } catch (error) {
    return "en";
  }
};

/**
 * Getter Functions
 */

const getAuthToken = () => {
  return window.sessionStorage.getItem("access_token");
};

const getRefreshToken = () => {
  return window.sessionStorage.getItem("refresh_token");
};

/**
 * Remove Functions
 */

const removeIsAuthorized = () => {
  window.sessionStorage.removeItem("isAuthorized");
};

const removeAuthToken = () => {
  window.sessionStorage.removeItem("access_token");
};

const removePermission = () => {
  window.sessionStorage.removeItem("permissions_data");
};

const util = {
  isDev,
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
  getToastObject,
  getStoreSupportedLngs,
  getReduxPersistRoot,
  getSelectedLanguageDirection,
  getUserSelectedLngCode,
  getStoreDefaultLngCode,
  removeIsAuthorized,
  removeAuthToken,
  setClient,
  setPermissionData,
  setIsAuthorized,
  getPermissionData,
  setUserSelectedLngCode,
  removePermission
};

export default util;
