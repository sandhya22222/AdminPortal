import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const versionUrl = API_ENDPOINTS.REACT_APP_USER_CONSENT_VERSION

const useCreateVersion = () => {
    const createUserConsent = async ({ body }) => {
        const res = await MarketplaceServices.save(versionUrl, body)
        return res
    }
    return useMutation({ mutationFn: createUserConsent })
}
export default useCreateVersion
