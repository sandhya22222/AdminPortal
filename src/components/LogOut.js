import React, { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import { Logout503 } from '../constants/media'
import util from '../util/common'

function LogOut() {
    const { t } = useTranslation()
    const auth = useAuth()
    useEffect(() => {
        util.removeAuthToken()
        util.removeIsAuthorized()
        void auth.signoutSilent()
    }, [auth])
    return (
        <div className='grid justify-items-center align-items-center my-28 bg-white'>
            <img height={310} src={Logout503} alt='' fallback={Logout503} />

            <h3
                style={{
                    fontSize: '20px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.85)',
                    marginBottom: '.5rem',
                    marginTop: '1rem',
                }}>
                {t('labels:please_wait')}
            </h3>
            <h3
                style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.45)',
                }}>
                Please remain on hold momentarily while we securely log you out of the application.
            </h3>
        </div>
    )
}

export default LogOut
