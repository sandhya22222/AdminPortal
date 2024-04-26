import { ActionTypes } from '../constants/ActionTypes'

const { RDX_USER_PROFILE_INFO } = ActionTypes

export const fnUserProfileInfo = (data) => {
    return {
        type: RDX_USER_PROFILE_INFO,
        payload: data,
    }
}
