import { ActionTypes } from '../constants/ActionTypes'
const { RDX_USER_LOGGED_INFO } = ActionTypes
export const fnUserLoggedInInfo = (data) => {
    return {
        type: RDX_USER_LOGGED_INFO,
        payload: data,
    }
}
