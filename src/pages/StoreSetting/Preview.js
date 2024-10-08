import React from 'react'
import { Button, Layout, Divider } from 'antd'
import { marketPlaceLogo } from '../../constants/media'
import { useSelector } from 'react-redux'
import util from '../../util/common'
import { useTranslation } from 'react-i18next'
const { Header, Content } = Layout
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
        <Content>
            <Divider style={{ margin: '8px 0' }} />
            <Content className='flex !mb-2 bg-[var(--mp-theme-preview-header-background-color)]'>
                <div className='flex justify-start !py-2 !w-[48%]'>
                    {getImageData && getImageData.length > 0 ? (
                        absoluteStoreImageInfo && absoluteStoreImageInfo.type === 'store_logo' ? (
                            <img
                                className=''
                                src={absoluteStoreImageInfo && absoluteStoreImageInfo.value}
                                alt='absoluteStoreImageInfo && absoluteStoreImageInfo.value'
                                height={60}
                                width={100}
                            />
                        ) : (
                            <img className=' ' src={marketPlaceLogo} alt='marketPlaceLogo' height={60} width={100} />
                        )
                    ) : (
                        <img className='' src={marketPlaceLogo} alt='marketPlaceLogo' height={60} width={100} />
                    )}
                </div>
                <div className='!w-[62%]  !mt-4 !text-[#6d7b88]'>{t('labels:header_content_of_the_page')}</div>
            </Content>
            <Divider style={{ margin: '8px 0' }} />
            <Content
                className={`min-h-[320px] justify-center text-center bg-[var(--mp-theme-preview-page-content-background-color)] `}>
                <p className={`text-bold !text-[#6d7b88] !mt-8 !mx-auto`}>{t('labels:main_content_of_the_page')}</p>
                <Content className='text-center pt-24 '>
                    <Button
                        style={{
                            backgroundColor: buttonPrimaryBackgroundColor,
                            color: buttonPrimaryForegroundColor,
                            border: buttonPrimaryBackgroundColor,
                        }}>
                        {t('labels:primary_button')}
                    </Button>
                    <Button
                        className={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-8' : 'ml-8'}
                        style={{
                            backgroundColor: buttonSecondaryBackgroundColor,
                            color: buttonSecondaryForegroundColor,
                            border: buttonSecondaryBackgroundColor,
                        }}>
                        {t('labels:secondary_button')}
                    </Button>
                    <Button
                        type='link'
                        className={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-8' : 'ml-8'}
                        style={{
                            // backgroundColor: buttonTertiaryBackgroundColor,
                            color: buttonTeritaryForegroundColor,
                            // border: buttonTertiaryBackgroundColor,
                        }}>
                        {t('labels:tertiary_button')}
                    </Button>
                </Content>
            </Content>
            <Content
                className={`!h-24  flex items-center justify-center bg-[var(--mp-theme-preview-footer-background-color)]`}>
                <p className=''>{t('labels:footer_content_of_the_page')}</p>
            </Content>
        </Content>
    )
}

export default Preview
