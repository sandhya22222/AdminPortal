import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const VERSION_DETAILS_URL = process.env.REACT_APP_USER_CONSENT_DETAILS

const useGetUserConsentVersionDetails = ({ userConsentId }) => {
    const getUserConsentVersionDetails = async () => {
        const params = {}
        if (userConsentId) params['userconsent-id'] = userConsentId
        const res = await MarketplaceServices.findAll(VERSION_DETAILS_URL, params)
        return res?.data?.response_body
    }
    return useQuery({
        queryKey: ['UserConsent Version Details', userConsentId ?? ''],
        queryFn: getUserConsentVersionDetails,
        refetchOnWindowFocus: false,
        retry: false,
    })
}
export default useGetUserConsentVersionDetails
