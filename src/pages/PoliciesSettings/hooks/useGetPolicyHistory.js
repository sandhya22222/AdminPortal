import { useEffect, useState } from 'react'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import useGetUserConsent from './useGetUserConsent'
import API_ENDPOINTS from '../../../services/API/apis'

const VERSION_DETAILS_URL = API_ENDPOINTS.REACT_APP_USER_CONSENT_DETAILS

const useGetPolicyHistory = ({ storeId }) => {
    const [isFetching, setIsFetching] = useState(false)
    const [policiesWithoutContactInformation, setPoliciesWithoutContactInformation] = useState([])
    const [versionDetails, setVersionDetails] = useState([])

    const {
        data: userConsents,
        status: userConsentStatus,
        isFetched: isUserConsentFetched,
    } = useGetUserConsent({
        storeId,
    })

    useEffect(() => {
        if (userConsentStatus === 'success' || isUserConsentFetched) {
            setIsFetching(true)
            if (userConsents?.userconsent_data?.map((consent) => consent?.version_details?.[0]).length > 0) {
                setPoliciesWithoutContactInformation(
                    userConsents?.userconsent_data?.map((consent) => consent?.version_details?.[0])
                )
                const fetchVersionDetails = async () => {
                    try {
                        const promises = userConsents?.userconsent_data
                            ?.map((consent) => consent?.version_details?.[0])
                            .map(async ({ user_consent_id }) => {
                                const params = { 'userconsent-id': user_consent_id }
                                const response = await MarketplaceServices.findAll(VERSION_DETAILS_URL, params)
                                console.log('Response from API:', response) // Log the response
                                let obj = {
                                    consent_id: user_consent_id,
                                    data: response?.data?.response_body.userconsent_version_details,
                                }
                                return obj // Assuming you need only data from the response
                            })
                        const versionDetailsData = await Promise.all(promises)
                        setVersionDetails(versionDetailsData)
                        setIsFetching(false)
                    } catch (error) {
                        setIsFetching(false)
                    }
                }
                fetchVersionDetails()
            } else {
                setIsFetching(false)
            }
        }
    }, [storeId, userConsents, userConsentStatus, isUserConsentFetched])

    return { policiesWithoutContactInformation, versionDetails, isFetching }
}

export default useGetPolicyHistory
