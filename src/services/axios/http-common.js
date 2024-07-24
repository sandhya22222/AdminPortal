import axios from 'axios'
import SetupInterceptors from './SetupInterceptors'

const baseURL = process.env.REACT_APP_BASE_URL

const http = axios.create({
    baseURL: baseURL,
})

SetupInterceptors(http)

export default http
