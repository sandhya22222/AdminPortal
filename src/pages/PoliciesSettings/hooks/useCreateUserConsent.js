import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'
const BASE_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT
const URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_NEW

const useCreateUserConsent = () => {
    const createUserConsent = async ({ body }) => {
        const res = await MarketplaceServices.save(URL, body)
        return res
    }
    return useMutation({ mutationFn: createUserConsent })
}
export default useCreateUserConsent
