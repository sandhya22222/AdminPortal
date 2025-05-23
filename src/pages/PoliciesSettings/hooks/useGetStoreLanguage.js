import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const StoreLanguageUri = API_ENDPOINTS.REACT_APP_STORE_LANGUAGE

const useGetStoreLanguage = ({ storeUUID }) => {
    const getUserConsentVersionDisplayNames = async () => {
        const params = {}
        if (storeUUID) {
            params['store-id'] = storeUUID
            params['language-status'] = 1
        }
        const res = await MarketplaceServices.findAll(StoreLanguageUri, params)
        return res?.data?.response_body
    }
    return useQuery({
        queryKey: ['UserConsent store language', storeUUID ?? ''],
        queryFn: getUserConsentVersionDisplayNames,
        refetchOnWindowFocus: false,
        retry: false,
    })
}
export default useGetStoreLanguage
