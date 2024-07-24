import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const BASE_URL = process.env.REACT_APP_USER_CONSENT_LEADING_NEW

const useUpdateConsentLead = () => {
    const updateConsentLead = async ({ body }) => {
        const res = await MarketplaceServices.update(BASE_URL, body)
        return res?.data
    }
    return useMutation({ mutationFn: updateConsentLead })
}
export default useUpdateConsentLead
