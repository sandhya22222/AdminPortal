import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const DISPLAYNAME_VERSIONS_URL = process.env.REACT_APP_USER_CONSENT_VERSIONS_DISPLAYNAME_API


const useUpdateVersionDisplayname = () => {
    const updateVersionDisplayName = async ({ userConsentVersionId, body }) => {
        const params = { 'version_id': userConsentVersionId }
        const res = await MarketplaceServices.update(DISPLAYNAME_VERSIONS_URL, body, params)
        return res.data
    }
    return useMutation({ mutationFn: updateVersionDisplayName })
}
export default useUpdateVersionDisplayname