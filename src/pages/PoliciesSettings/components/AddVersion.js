import { Button, InputNumber, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MarketplaceToaster from '../../../util/marketplaceToaster'
import useCreateVersion from '../hooks/useCreateVersion'
const MAX_LIMIT_FOR_THE_VERSION = '999.9'

function AddVersion({
    versionNumber,
    storeId,
    consentId,
    setAddVersion,
    refetchUserConsent,
    setVersionHistory,
    versionfrom,
    versionId,
}) {
    const [inputValuefirst, setInputValueFirst] = useState()
    const [inputValueSecond, setInputValueSecond] = useState()
    const { t } = useTranslation()
    const { mutate: createNewVersion, status: createNewVersionStatus } = useCreateVersion()
    let numbers = String(versionNumber).split('.')
    useEffect(() => {
        let copyofFirstField = numbers[1]
        if (versionNumber) {
            if (numbers[1] == '9' && numbers[0] !== '999') {
                copyofFirstField = String(Number(copyofFirstField + 1))
                setInputValueFirst(String(Number(numbers[0]) + 1))
            } else {
                setInputValueFirst(numbers[0])
            }
            if (numbers[1] == '9' && numbers[0] !== '999' && copyofFirstField !== numbers[1]) {
                setInputValueSecond('0')
            } else if (numbers[1] == '9') {
                setInputValueSecond(MAX_LIMIT_FOR_THE_VERSION.split('.')[1])
            } else {
                setInputValueSecond(numbers[1] ? String(Number(numbers[1]) + 1) : '1')
            }
        }
    }, [versionNumber])


    const inputHandlerfirst = (value) => {
        if (value === null) {
            setInputValueFirst(null)
        } else if (value <= 999) {
            setInputValueFirst(value)
        }
    }

    const inputHandlerSecond = (value) => {
        if (value === null) {
            setInputValueSecond(null)
        } else if (value <= 9) {
            setInputValueSecond(value)
        }
    }

    const handelSaveVersion = () => {
        const body = {
            store_id: Number(storeId),
            user_consent: Number(consentId),
        }

        body.version_number = parseFloat(inputValuefirst + '.' + inputValueSecond)

        if (versionfrom) body.version_from = versionId

        createNewVersion(
            { body },
            {
                onSuccess: (response) => {
                    MarketplaceToaster.showToast(response)
                    refetchUserConsent()
                    setAddVersion(false)
                    if (setVersionHistory) setVersionHistory(false)
                },
                onError: (err) => {
                    MarketplaceToaster.showToast(err?.response)
                },
            }
        )
    }

    return (
        <div>
            <p className='text-brandGray1'>{t('messages:add_version_note')}</p>
            <div className='mb-10 flex items-center'>
                <Typography>{t('labels:version')}</Typography>
                <InputNumber
                    style={{ width: '60px', margin: '0 8px 0 14px' }}
                    value={inputValuefirst}
                    onChange={inputHandlerfirst}
                    min={'1'}
                    max={MAX_LIMIT_FOR_THE_VERSION.split('.')[0]}
                    onKeyDown={(e) => {
                        const {
                            key,
                            target: { value },
                        } = e
                        const newValue = parseInt(value + key, 10)
                        if (newValue > MAX_LIMIT_FOR_THE_VERSION.split('.')[0] && !isNaN(newValue)) {
                            e.preventDefault()
                        }
                    }}
                />
                <InputNumber
                    style={{ width: '60px' }}
                    value={inputValueSecond}
                    min={'0'}
                    onChange={inputHandlerSecond}
                    max={MAX_LIMIT_FOR_THE_VERSION.split('.')[1]}
                    onKeyDown={(e) => {
                        const {
                            key,
                            target: { value },
                        } = e
                        const newValue = parseInt(value + key, 10)
                        if (
                            (newValue > MAX_LIMIT_FOR_THE_VERSION.split('.')[1] || isNaN(newValue)) &&
                            !isNaN(parseInt(key, 10))
                        ) {
                            e.preventDefault()
                        }
                    }}
                />
            </div>
            <div className='flex justify-end'>
                <Button
                    onClick={() => {
                        setAddVersion(false)
                    }}
                    disabled={''}
                    className='mx-2 app-btn-secondary'>
                    {t('labels:cancel')}
                </Button>
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
