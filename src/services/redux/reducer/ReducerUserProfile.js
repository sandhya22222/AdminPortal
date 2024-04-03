import { ActionTypes } from '../constants/ActionTypes'

const { RDX_USER_PROFILE_INFO } = ActionTypes

export const ReducerUserProfileInfo = (state = [], { type, payload }) => {
    switch (type) {
        case RDX_USER_PROFILE_INFO:
            return { ...state, userProfileInfo: payload }

        default:
            return state
    }
}
