import { useMutation } from "@tanstack/react-query";
import MarketplaceServices from "../../../services/axios/MarketplaceServices";
const BASE_URL = process.env.REACT_APP_USER_CONSENT;

const useUpdateUserConsent = () => {
  const updateUserConsent = async ({ userConsentId, body }) => {
    const params = { "userconsent-id": userConsentId };
    const res = await MarketplaceServices.update(BASE_URL, body, params);
    return res.data;
  };
  return useMutation({ mutationFn: updateUserConsent });
};
export default useUpdateUserConsent;
