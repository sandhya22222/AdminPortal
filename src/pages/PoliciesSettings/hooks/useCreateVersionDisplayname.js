import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const DISPLAYNAME_VERSIONS_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_VERSIONS_DISPLAYNAME_API

const useCreateVersionDisplayname = () => {
    const createVersionDisplayName = async ({ body }) => {
        const res = await MarketplaceServices.save(DISPLAYNAME_VERSIONS_URL, body)
        return res
    }
    return useMutation({ mutationFn: createVersionDisplayName })
}
export default useCreateVersionDisplayname
