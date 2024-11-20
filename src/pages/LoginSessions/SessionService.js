import MarketplaceServices from '../../services/axios/MarketplaceServices'
const SESSION_API = process.env.REACT_APP_SESSION_API
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
