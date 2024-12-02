import React, { createContext, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSessions, requestOtp, sendOtpRequest } from './SessionService'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import { useTranslation } from 'react-i18next'

const SessionsContext = createContext()

export const SessionsProvider = ({ children }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { data, refetch, isLoading, isFetching, error, isError } = useQuery({
        queryKey: ['Sessions'],
        queryFn: () => fetchSessions(),
        staleTime: 0,
        cacheTime: 0,
    })
    const {
        mutate: sendOtp,
        isLoading: otpLoading,
        isError: otpError,
        error: otpErrorMessage,
    } = useMutation({
        mutationFn: requestOtp,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['Sessions'])
        },
        onError: (error) => {
            console.error('OTP request failed:', error.message)
        },
    })
    const {
        mutate: submitOtp,
        isLoading: otpConfirmLoading,
        isError: otpConfirmError,
        error: otpConfirmErrorMessage,
    } = useMutation({
        mutationFn: sendOtpRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['Sessions'])
            MarketplaceToaster.showToast(util.getToastObject(data.response_message, 'success'))
        },
        onError: (error) => {
            console.error('OTP request failed:', error.message)
            console.log(error)
            MarketplaceToaster.showToast(util.getToastObject(error?.response?.data?.response_body?.message, 'error'))
        },
    })
    const values = {
        data,
        isLoading,
        isFetching,
        error,
        isError,
        sendOtp,
        refetch,
        otpLoading,
        otpError,
        otpErrorMessage,
        submitOtp,
        otpConfirmError,
        otpConfirmErrorMessage,
        otpConfirmLoading,
    }
    return <SessionsContext.Provider value={values}>{children}</SessionsContext.Provider>
}
export const useSession = () => {
    const context = useContext(SessionsContext)
    if (!context) {
        throw new Error('Session Context must be used within SessionsProvider')
    }
    return context
}
