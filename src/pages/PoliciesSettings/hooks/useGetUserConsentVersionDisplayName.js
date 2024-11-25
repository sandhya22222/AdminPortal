import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../../services/API/apis'

const DISPLAYNAME_VERSIONS_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_VERSIONS_DISPLAYNAME_API

const useGetUserConsentVersionDisplayName = ({ userConsentVersionId }) => {
    const getUserConsentVersionDisplayNames = async () => {
        const params = {}
        if (userConsentVersionId) params['version_id '] = userConsentVersionId
        const res = await MarketplaceServices.findAll(DISPLAYNAME_VERSIONS_URL, params)
        return res?.data?.response_body
    }
    return useQuery({
        queryKey: ['UserConsent display name Details', userConsentVersionId ?? ''],
        queryFn: getUserConsentVersionDisplayNames,
        refetchOnWindowFocus: false,
        retry: false,
    })
}
export default useGetUserConsentVersionDisplayName
