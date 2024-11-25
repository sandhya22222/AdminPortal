import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const BASE_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT
const URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_NEW

const useDeleteUserConsent = () => {
    const deleteUserConsent = async ({ userConsentId }) => {
        const params = { 'userconsent-id': userConsentId }
        const res = await MarketplaceServices.remove(URL, params)
        return res?.data
    }
    return useMutation({ mutationFn: deleteUserConsent })
}
export default useDeleteUserConsent
