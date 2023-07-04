import { ActionTypes } from "../constants/ActionTypes";

const {
  RDX_STORE_LANGUAGE_INFO,
  RDX_SELECTED_LANGUAGE_INFO,
  RDX_DEFAULT_LANGUAGE_INFO,
} = ActionTypes;

// selectedVendors is reducer here it will check the actiontype what we are getting
// if it matches it will return the payload to action methods
export const ReducerStoreLanguage = (state = [], { type, payload }) => {
  switch (type) {
    case RDX_STORE_LANGUAGE_INFO:
      return { ...state, storeLanguage: payload };

    default:
      return state;
  }
};

export const ReducerSelectedLanguage = (state = [], { type, payload }) => {
  switch (type) {
    case RDX_SELECTED_LANGUAGE_INFO:
      return { ...state, selectedLanguage: payload };

    default:
      return state;
  }
};

export const ReducerDefaultLanguage = (state = [], { type, payload }) => {
  switch (type) {
    case RDX_DEFAULT_LANGUAGE_INFO:
      return { ...state, defaultLanguage: payload };

    default:
      return state;
  }
};
