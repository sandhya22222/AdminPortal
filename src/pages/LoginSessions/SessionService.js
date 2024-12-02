import MarketplaceServices from '../../services/axios/MarketplaceServices'
import API_ENDPOINTS from '../../services/API/apis'
const SESSION_API = API_ENDPOINTS.REACT_APP_SESSION_API
const REQUEST_OTP_API = API_ENDPOINTS.REACT_APP_SESSION_OTP_API
const REMOVE_SESSION_API = API_ENDPOINTS.REACT_APP_SESSION_REMOVAL_API
const fetchData = async (api, params) => {
    try {
        const res = await MarketplaceServices.findAllWithoutPage(api, params)
        return res?.data?.response_body
    } catch (error) {
        throw new Error(error)
    }
}

export const fetchSessions = async () => {
    const response = await fetchData(SESSION_API)
    return response?.message
}

export const requestOtp = async (sessionId) => {
    try {
        const params = {}
        console.log(sessionId)
        if (sessionId) {
            params['session-id'] = sessionId
        }
        const requestBody = {
            channel: 'email',
        }
        const response = await MarketplaceServices.save(REQUEST_OTP_API, requestBody, params)
        console.log(response)
        return response
    } catch (error) {
        console.error('Error requesting OTP:', error.message)
        throw error
    }
}
export const sendOtpRequest = async ({ sessionId, otp }) => {
    try {
        const params = {}
        if (sessionId) {
            params['session-id'] = sessionId
        }
        const requestBody = {
            otp: otp,
        }
        console.log(params, requestBody)
        const response = await MarketplaceServices.save(REMOVE_SESSION_API, requestBody, params)
        console.log(response)
        return response?.data
    } catch (error) {
        console.error('Error requesting OTP:', error.message)
        throw error
    }
}
