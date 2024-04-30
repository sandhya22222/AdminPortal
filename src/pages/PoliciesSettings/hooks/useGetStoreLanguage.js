import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const StoreLanguageUri = process.env.REACT_APP_STORE_LANGUAGE

const useGetStoreLanguage = ({ storeUUID }) => {
    const getUserConsentVersionDisplayNames = async () => {
        const params = {}
        if (storeUUID) params['store-id'] = storeUUID
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