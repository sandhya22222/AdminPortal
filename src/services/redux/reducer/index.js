import { combineReducers } from "redux";
import { ReducerUserLoggedInfo } from "./ReducerUser";


const reducers = combineReducers({
    reducerUserLoggedInfo: ReducerUserLoggedInfo

});

export default reducers;