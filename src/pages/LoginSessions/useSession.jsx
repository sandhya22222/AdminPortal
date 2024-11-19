import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext } from 'react'
import { fetchSessions } from './SessionService'

const SessionsContext = createContext()

export const SessionsProvider = ({ children }) => {
    const { data, isLoading, isFetching, error, isError } = useQuery({
        queryKey: ['Sessions'],
        queryFn: () => fetchSessions(),
        staleTime: 0,
        cacheTime: 0,
    })
    const values = {
        data,
        isLoading,
        isFetching,
        error,
        isError,
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
