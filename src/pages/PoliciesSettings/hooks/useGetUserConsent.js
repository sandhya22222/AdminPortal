import { useQuery } from "@tanstack/react-query";
import MarketplaceServices from "../../../services/axios/MarketplaceServices";
const BASE_URL = process.env.REACT_APP_USER_CONSENT;

const useGetUserConsent = ({ storeId }) => {
  const getUserConsent = async () => {
    const params = {};
    if (storeId) params["store-id"] = storeId;
    const res = await MarketplaceServices.findAll(BASE_URL, params);
    return res?.data?.response_body;
  };
  return useQuery({
    queryKey: ["UserConsent", storeId ?? ""],
    queryFn: getUserConsent,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!storeId,
  });
};
export default useGetUserConsent;
