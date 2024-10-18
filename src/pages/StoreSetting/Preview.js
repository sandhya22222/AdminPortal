import React from 'react'
import { Button } from '../../shadcnComponents/ui/button'
import { marketPlaceLogo } from '../../constants/media'
import { useSelector } from 'react-redux'
import util from '../../util/common'
import { useTranslation } from 'react-i18next'

const Preview = ({
    headerBackgroundColor,
    headerForegroundColor,
    footerBackgroundColor,
    footerForegroundColor,
    pageBackgroundColor,
    foreGroundColor,
    buttonPrimaryBackgroundColor,
    buttonSecondaryBackgroundColor,
    buttonPrimaryForegroundColor,
    buttonSecondaryForegroundColor,
    buttonTeritaryForegroundColor,
    getImageData,
}) => {
    const { t } = useTranslation()
    const absoluteStoreImageInfo = useSelector((state) => state.reducerAbsoluteStoreImageInfo.absoluteStoreImageInfo)

    return (
        <div className='flex flex-col'>
            <div style={{ margin: '8px 0', borderBottom: '1px solid #f0f0f0' }}></div>
            <div className='flex !mb-2 bg-[var(--mp-theme-preview-header-background-color)]'>
                <div className='flex justify-start !py-2 !w-full'>
                    {getImageData && getImageData.length > 0 ? (
                        absoluteStoreImageInfo && absoluteStoreImageInfo.type === 'store_logo' ? (
                            <img
                                src={absoluteStoreImageInfo && absoluteStoreImageInfo.value}
                                alt='absoluteStoreImageInfo && absoluteStoreImageInfo.value'
                                height={60}
                                width={100}
                            />
                        ) : (
                            <img src={marketPlaceLogo} alt='marketPlaceLogo' height={60} width={100} />
                        )
                    ) : (
                        <img src={marketPlaceLogo} alt='marketPlaceLogo' height={60} width={100} />
                    )}
                </div>
                <div className='!w-[62%] !mt-4 !text-[#6d7b88]'>{t('labels:header_content_of_the_page')}</div>
            </div>
            <div style={{ margin: '8px 0', borderBottom: '1px solid #f0f0f0' }}></div>
            <div className=' flex flex-col justify-center gap-[60px] my-[60px] text-center bg-[var(--mp-theme-preview-page-content-background-color)]'>
                <p className='text-bold !text-[#6d7b88] '>
                    {t('labels:main_content_of_the_page')}
                </p>
                <div className='flex flex-row justify-between align-center'>
                    <Button
                        style={{
                            backgroundColor: buttonPrimaryBackgroundColor,
                            color: buttonPrimaryForegroundColor,
                            borderColor: buttonPrimaryBackgroundColor, // ensures the border matches the background
                        }}>
                        {t('labels:primary_button')}
                    </Button>
                    <Button
                        className={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-8' : 'ml-8'}
                        style={{
                            backgroundColor: buttonSecondaryBackgroundColor,
                            color: buttonSecondaryForegroundColor,
                            borderColor: buttonSecondaryBackgroundColor, // ensures the border matches the background
                        }}>
                        {t('labels:secondary_button')}
                    </Button>
                    <Button
                        variant="link"
                        className={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-8' : 'ml-8'}
                        style={{
                            color: buttonTeritaryForegroundColor,
                        }}>
                        {t('labels:tertiary_button')}
                    </Button>
                </div>
            </div>
            <div className='!h-24 flex items-center justify-center bg-[var(--mp-theme-preview-footer-background-color)]'>
                <p>{t('labels:footer_content_of_the_page')}</p>
            </div>
        </div>
    )
}

export default Preview
