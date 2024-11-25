import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const BASE_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT
const URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_NEW

const useGetUserConsent = ({ storeId }) => {
    const getUserConsent = async () => {
        const params = {}
        if (storeId) params['store-id'] = storeId
        const res = await MarketplaceServices.findAll(URL, params)
        return res?.data?.response_body
    }
    return useQuery({
        queryKey: ['UserConsent', storeId ?? ''],
        queryFn: getUserConsent,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: !!storeId,
    })
}
export default useGetUserConsent
