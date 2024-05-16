import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const BASE_URL = process.env.REACT_APP_GET_USER_CONSENT_NEW

const useGetStoreUserConsent = ({ storeName }) => {
    const getStoreUserConsent = async () => {
        const params = {
            'store-name': storeName,
        }
        const res = await MarketplaceServices.findAll(BASE_URL, params)
        return res?.data?.response_body
    }
    return useQuery({
        queryKey: ['user', 'consent', storeName],
        queryFn: getStoreUserConsent,
    })
}
export default useGetStoreUserConsent
