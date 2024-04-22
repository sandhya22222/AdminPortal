import { Button, InputNumber, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import useCreateVersion from '../hooks/useCreateVersion'

function AddVersion({ setConsentVersionName, versionNumber, storeId, consentId, setAddVersion }) {
    const [inputValuefirst, setInputValueFirst] = useState()
    const [inputValueSecond, setInputValueSecond] = useState()
    const { t } = useTranslation()
    const [versionNumberChanged, setVersionNumberChanged] = useState(false)
    const { mutate: createNewVersion, status: createNewVersionStatus } = useCreateVersion()

    useEffect(() => {
        if (versionNumber) {
            let numbers = String(versionNumber).split('.')
            setInputValueFirst(numbers[0])
            setInputValueSecond(numbers[1] || '0')
        }
    }, [versionNumber])

    useEffect(() => {
        if (String(versionNumber) !== inputValuefirst + '.' + inputValueSecond) setVersionNumberChanged(true)
    }, [inputValuefirst, inputValueSecond])

    const inputHandlerfirst = (value) => {
        setInputValueFirst(value)
    }
    const inputHandlerSecond = (value) => {
        setInputValueSecond(value)
    }

    const handelSaveVersion = () => {
        const body = {
            store_id: Number(storeId),
            user_consent: Number(consentId),
        }

        if (versionNumberChanged) {
            body.version_number = parseFloat(inputValuefirst + '.' + inputValueSecond)
        }

        createNewVersion(
            { body },
            {
                onSuccess: () => {
                    toast(t('version updated successfully'), {
                        type: 'success',
                    })
                    setAddVersion(false)
                },
                onError: (err) => {
                    toast(err?.response?.data?.response_message || t('messages:error_saving_policy'), {
                        type: 'error',
                    })
                },
            }
        )
    }

    return (
        <div>
            <p className='input-label-color'>{t('messages:add_version_note')}</p>
            <div className='mb-10 flex items-center'>
                <Typography>{t('labels:version')}</Typography>
                <InputNumber
                    style={{ width: '60px', margin: '0 8px 0 14px' }}
                    value={inputValuefirst}
                    onChange={inputHandlerfirst}
                    min={inputValuefirst}
                />
                <InputNumber
                    style={{ width: '60px' }}
                    value={inputValueSecond}
                    min={inputValueSecond}
                    onChange={inputHandlerSecond}
                />
            </div>
            <div className='flex justify-end'>
                <Button
                    className='app-btn-primary'
                    onClick={handelSaveVersion}
                    loading={createNewVersionStatus === 'pending'}>
                    {t('labels:add_version')}
                </Button>
            </div>
        </div>
    )
}

export default AddVersion
