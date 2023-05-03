import http from "./http-common";
import util from "../../util/common";

const itemPerPage = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);

const findAll = (baseURL, pathParams, isLngSpecific) => {
  //If params is null, don't consider params
  //If requiredLngRecord is true, set selected language by default

  let configParams = {};
  configParams["page-number"] = -1;

  if (isLngSpecific) {
    configParams["language-code"] = util.getSelectedLanguageCode();
  }

  if (pathParams !== null) {
    configParams = { ...pathParams, ...configParams };
  }

  return http.get(baseURL, { params: configParams });
};

const findAllWithoutPage = (baseURL, pathParams, isLngSpecific) => {
  //If params is null, don't consider params
  //If requiredLngRecord is true, set selected language by default

  let configParams = {};

  if (isLngSpecific) {
    configParams["language-code"] = util.getSelectedLanguageCode();
  }

  if (pathParams !== null) {
    configParams = { ...pathParams, ...configParams };
  }

  return http.get(baseURL, { params: configParams });
};

const findMedia = (baseURL, pathParams) => {
  //If params is null, don't consider params
  console.log("pathhh#", pathParams);

  let configParams = {};

  if (pathParams !== null) {
    configParams = {
      ...pathParams,
      ...configParams,
    };
  }
  console.log("checkParams", baseURL, {
    params: configParams,
    responseType: "blob",
  });
  // return http.get(baseURL, { params: { configParams }, responseType: "blob" });
  return http.get(baseURL, { params: configParams, responseType: "blob" });
};

const findByPage = (baseURL, pathParams, page, limit, isLngSpecific) => {
  //If params is null, don't consider params
  //If page is null, set 1 by default
  //If requiredLngRecord is true, set selected language by default
  page = page === null ? 1 : page;
  limit = limit === null ? itemPerPage : limit;
  let configParams = {};
  configParams["page-number"] = page;
  configParams["page-limit"] = limit;

  if (isLngSpecific) {
    configParams["language-code"] = util.getSelectedLanguageCode();
  }

  if (pathParams !== null) {
    configParams = { ...pathParams, ...configParams };
  }

  return http.get(baseURL, { params: configParams });
};

const save = (baseURL, requestBody, pathParams) => {
  return http.post(baseURL, requestBody, { params: pathParams });
};

const update = (baseURL, requestBody, pathParams) => {
  const configRequest = {};

  return http.put(baseURL, requestBody, { params: pathParams });
};

const remove = (baseURL, pathParams) => {
  return http.delete(baseURL, { params: pathParams });
};

const removeAll = (baseURL) => {
  return http.delete(baseURL);
};

const MarketplaceServices = {
  findAll,
  findAllWithoutPage,
  findByPage,
  save,
  update,
  remove,
  removeAll,
  findMedia,
};

export default MarketplaceServices;
