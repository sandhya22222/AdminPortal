import { ActionTypes } from '../constants/ActionTypes'

const { RDX_ABSOLUTE_STORE_IMAGE_INFO } = ActionTypes

export const ReducerAbsoluteStoreImageInfo = (state = [], { type, payload }) => {
    switch (type) {
        case RDX_ABSOLUTE_STORE_IMAGE_INFO:
            return { ...state, absoluteStoreImageInfo: payload }
        default:
            return state
    }
}
