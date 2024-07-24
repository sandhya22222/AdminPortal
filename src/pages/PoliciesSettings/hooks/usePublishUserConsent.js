import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const userConsentUpdateUrl = process.env.REACT_APP_USER_CONSENT_UPDATE

const usePublishUserConsent = () => {
    const publishUserConsent = async ({ userConsentVersionId, body }) => {
        const params = { 'userconsent-version-id': userConsentVersionId }
        const res = await MarketplaceServices.update(userConsentUpdateUrl, body, params)
        return res
    }
    return useMutation({ mutationFn: publishUserConsent })
}
export default usePublishUserConsent
