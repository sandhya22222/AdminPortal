import React from 'react'
import { SessionsProvider } from './useSession'
import SessionsDisplay from './SessionsDisplay'

const LoginSessions = () => {
    return (
        <SessionsProvider>
            <SessionsDisplay />
        </SessionsProvider>
    )
}

export default LoginSessions
