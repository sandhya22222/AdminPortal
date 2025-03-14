import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../services/API/apis'
const BASE_URL = API_ENDPOINTS.REACT_APP_ADMIN_USER_CONSENT

const useGetStoreAdminConsentDescription = ({ adminConsentId }) => {
    const getStoreAdminConsentDescription = async () => {
        const params = { 'admin-consent-id': adminConsentId }
        const res = await MarketplaceServices.findAll(BASE_URL, params)
        return res?.data?.response_body?.store_userconsent_data
    }
    return useQuery({
        queryKey: ['admin', 'policies', adminConsentId],
        queryFn: getStoreAdminConsentDescription,
        refetchOnWindowFocus: false,
        enabled: !!adminConsentId,
    })
}
export default useGetStoreAdminConsentDescription
