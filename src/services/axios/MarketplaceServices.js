import http from "./http-common";
import util from "../../util/common";

const itemPerPage = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);

const findAll = (baseURL, pathParams, isLngSpecific) => {
  //If params is null, don't consider params
  //If requiredLngRecord is true, set selected language by default

  let configParams = {};
  configParams["page-number"] = -1;
  configParams["language-code"] = util.getUserSelectedLngCode();
  // if (isLngSpecific) {
  //   configParams["language-code"] = util.getUserSelectedLngCode();
  // }

  if (pathParams !== null) {
    configParams = { ...pathParams, ...configParams };
  }

  return http.get(baseURL, { params: configParams });
};

const findAllWithoutPage = (baseURL, pathParams, isLngSpecific) => {
  //If params is null, don't consider params
  //If requiredLngRecord is true, set selected language by default

  let configParams = {};
  configParams["language-code"] = util.getUserSelectedLngCode();

  // if (isLngSpecific) {
  //   configParams["language-code"] = util.getUserSelectedLngCode();
  // }

  if (pathParams !== null) {
    configParams = { ...pathParams, ...configParams };
  }

  return http.get(baseURL, { params: configParams });
};

const findMedia = (baseURL, pathParams) => {
  //If params is null, don't consider params
  let configParams = {};

  if (pathParams !== null) {
    configParams = {
      ...pathParams,
      ...configParams,
    };
  }
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
  configParams["language-code"] = util.getUserSelectedLngCode();

  // if (isLngSpecific) {
  //   configParams["language-code"] = util.getUserSelectedLngCode();
  // }

  if (pathParams !== null) {
    configParams = { ...pathParams, ...configParams };
  }

  return http.get(baseURL, { params: configParams });
};

const save = (baseURL, requestBody, pathParams) => {
  let configParams = {};
  configParams["language-code"] = util.getUserSelectedLngCode();
  if (pathParams !== null) configParams = { ...pathParams, ...configParams };

  return http.post(baseURL, requestBody, { params: configParams });
};

const update = (baseURL, requestBody, pathParams) => {
  let configParams = {};
  configParams["language-code"] = util.getUserSelectedLngCode();
  if (pathParams !== null) configParams = { ...pathParams, ...configParams };

  return http.put(baseURL, requestBody, { params: configParams });
};

const remove = (baseURL, pathParams) => {
  let configParams = {};
  configParams["language-code"] = util.getUserSelectedLngCode();
  if (pathParams !== null) configParams = { ...pathParams, ...configParams };

  return http.delete(baseURL, { params: configParams });
};

const removeAll = (baseURL) => {
  let configParams = {};
  configParams["language-code"] = util.getUserSelectedLngCode();

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
