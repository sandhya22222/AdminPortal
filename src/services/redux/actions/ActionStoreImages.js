import { ActionTypes } from "../constants/ActionTypes";
const { RDX_ABSOLUTE_STORE_IMAGE_INFO } = ActionTypes;
export const fnAbsoluteStoreImageInfo = (data) => {
  return {
    type: RDX_ABSOLUTE_STORE_IMAGE_INFO,
    payload: data,
  };
};
