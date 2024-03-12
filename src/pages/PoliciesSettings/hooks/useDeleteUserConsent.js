import { useMutation } from "@tanstack/react-query";
import MarketplaceServices from "../../../services/axios/MarketplaceServices";
const BASE_URL = process.env.REACT_APP_USER_CONSENT;

const useDeleteUserConsent = () => {
  const deleteUserConsent = async ({ userConsentId }) => {
    const params = { "userconsent-id": userConsentId };
    const res = await MarketplaceServices.remove(BASE_URL, params);
    return res?.data;
  };
  return useMutation({ mutationFn: deleteUserConsent });
};
export default useDeleteUserConsent;
