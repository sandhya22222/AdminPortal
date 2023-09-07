import { combineReducers } from "redux";
import { ReducerUserLoggedInfo } from "./ReducerUser";
import { ReducerAbsoluteStoreImageInfo } from "./ReducerStoreImages";
import {
  ReducerStoreLanguage,
  ReducerSelectedLanguage,
  ReducerDefaultLanguage,
} from "./ReducerStoreLanguage";

const reducers = combineReducers({
  reducerUserLoggedInfo: ReducerUserLoggedInfo,
  reducerAbsoluteStoreImageInfo: ReducerAbsoluteStoreImageInfo,
  reducerStoreLanguage: ReducerStoreLanguage,
  reducerSelectedLanguage: ReducerSelectedLanguage,
  reducerDefaultLanguage: ReducerDefaultLanguage,
});

export default reducers;
