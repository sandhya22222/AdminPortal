import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const BASE_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_ORDER_NEW

const useUpdateConsentsOrder = () => {
    const updateConsentsOrder = async ({ body }) => {
        const res = await MarketplaceServices.update(BASE_URL, body)
        return res?.data
    }
    return useMutation({ mutationFn: updateConsentsOrder })
}
export default useUpdateConsentsOrder
