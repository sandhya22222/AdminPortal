import { combineReducers } from "redux";
import { ReducerUserLoggedInfo } from "./ReducerUser";
import { ReducerAbsoluteStoreImageInfo } from "./ReducerStoreImages";

const reducers = combineReducers({
    reducerUserLoggedInfo: ReducerUserLoggedInfo,
    reducerAbsoluteStoreImageInfo:ReducerAbsoluteStoreImageInfo
});

export default reducers;