import { ActionTypes } from '../constants/ActionTypes'

const { RDX_USER_LOGGED_INFO } = ActionTypes

export const ReducerUserLoggedInfo = (state = [], { type, payload }) => {
    switch (type) {
        case RDX_USER_LOGGED_INFO:
            return { ...state, userLoggedInfo: payload }
        default:
            return state
    }
}
