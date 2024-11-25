import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../services/API/apis'
const BASE_URL = API_ENDPOINTS.REACT_APP_USERS_API

const useGetStoreUserData = () => {
    const getStoreUsersData = async () => {
        const res = await MarketplaceServices.findAllWithoutPage(BASE_URL, null, false)
        return res?.data?.response_body
    }
    return useQuery({
        queryKey: ['user', 'data', 'vendor'],
        queryFn: getStoreUsersData,
    })
}

export default useGetStoreUserData
