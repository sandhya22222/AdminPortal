import { ActionTypes } from "../constants/ActionTypes";

const {
  RDX_STORE_LANGUAGE_INFO,
  RDX_SELECTED_LANGUAGE_INFO,
  RDX_DEFAULT_LANGUAGE_INFO,
} = ActionTypes;

export const fnStoreLanguage = (data) => {
  return {
    type: RDX_STORE_LANGUAGE_INFO,
    payload: data,
  };
};

export const fnSelectedLanguage = (data) => {
  return {
    type: RDX_SELECTED_LANGUAGE_INFO,
    payload: data,
  };
};

export const fnDefaultLanguage = (data) => {
  return {
    type: RDX_DEFAULT_LANGUAGE_INFO,
    payload: data,
  };
};
