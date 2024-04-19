import { Button, InputNumber, Typography } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

function AddVersion({ versionNumber }) {
    const { t } = useTranslation()
    const inputHandlerfirst = (value) => {
        console.log('changed', value)
    }
    const inputHandlerSecond = (value) => {
        console.log('changed', value)
    }
    return (
        <div>
            <p className='input-label-color'>{t('messages:add_version_note')}</p>
            <div className='mb-10 flex items-center'>
                <Typography>{t('labels:version')}</Typography>
                <InputNumber style={{ width: '60px', margin: '0 8px 0 14px' }} value={3} onChange={inputHandlerfirst} />
                <InputNumber style={{ width: '60px' }} value={3} onChange={inputHandlerSecond} />
            </div>
            <div className='flex justify-end'>
                <Button className='app-btn-primary' onClick={''}>
                    {t('labels:add_version')}
                </Button>
            </div>
        </div>
    )
}

export default AddVersion
