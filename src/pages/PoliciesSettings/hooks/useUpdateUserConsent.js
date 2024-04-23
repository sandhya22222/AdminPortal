import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const BASE_URL = process.env.REACT_APP_USER_CONSENT
const URL = process.env.REACT_APP_USER_CONSENT_VERSION


const useUpdateUserConsent = () => {
    const updateUserConsent = async ({ userConsentVersionId, body }) => {
        const params = { 'userconsent-version-id': userConsentVersionId }
        const res = await MarketplaceServices.update(URL, body, params)
        return res.data
    }
    return useMutation({ mutationFn: updateUserConsent })
}
export default useUpdateUserConsent
