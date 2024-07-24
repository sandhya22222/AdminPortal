import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../services/axios/MarketplaceServices'
const BASE_URL = process.env.REACT_APP_ADMIN_USER_CONSENT

const useGetStoreAdminConsent = () => {
    const getStoreAdminConsent = async () => {
        const res = await MarketplaceServices.findAll(BASE_URL, null, false)
        return res?.data?.response_body?.admin_userconsent_data
    }
    return useQuery({
        queryKey: ['admin', 'policies'],
        queryFn: getStoreAdminConsent,
        refetchOnWindowFocus: false,
    })
}
export default useGetStoreAdminConsent
