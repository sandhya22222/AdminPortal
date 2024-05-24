import React from 'react'
import { Button, Layout } from 'antd'
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
            <Content>
                <Header className='header !p-0'>
                    <Content
                        className='!h-16 flex'
                        style={{
                            backgroundColor: headerBackgroundColor,
                        }}
                        mode='horizontal'>
                        <div className='flex justify-start !w-[39%] p-2'>
                            {getImageData && getImageData.length > 0 ? (
                                absoluteStoreImageInfo && absoluteStoreImageInfo.type === 'store_logo' ? (
                                    <img
                                        className=''
                                        src={absoluteStoreImageInfo && absoluteStoreImageInfo.value}
                                        alt='absoluteStoreImageInfo && absoluteStoreImageInfo.value'
                                    />
                                ) : (
                                    <img className=' ' src={marketPlaceLogo} alt='marketPlaceLogo' />
                                )
                            ) : (
                                <img className='' src={marketPlaceLogo} alt='marketPlaceLogo' />
                            )}
                        </div>
                        <div className='!flex !justify-center text-lg !mt-4' style={{ color: headerForegroundColor }}>
                            {t('labels:header_content_of_the_page')}
                        </div>
                    </Content>
                </Header>
            </Content>
            <Content className={`min-h-[300px] text-center `} style={{ backgroundColor: pageBackgroundColor }}>
                <Content className='text-center p-24 '>
                    <p className={`text-center text-lg text-bold `} style={{ color: foreGroundColor }}>
                        {t('labels:main_content_of_the_page')}
                    </p>
                    <Button
                        style={{
                            backgroundColor: buttonPrimaryBackgroundColor,
                            color: buttonPrimaryForegroundColor,
                            border: buttonPrimaryBackgroundColor,
                        }}>
                        {t('labels:button1')}
                    </Button>
                    <Button
                        className={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-8' : 'ml-8'}
                        style={{
                            backgroundColor: buttonSecondaryBackgroundColor,
                            color: buttonSecondaryForegroundColor,
                            border: buttonSecondaryBackgroundColor,
                        }}>
                        {t('labels:button2')}
                    </Button>
                    <Button
                        type='link'
                        className={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-8' : 'ml-8'}
                        style={{
                            // backgroundColor: buttonTertiaryBackgroundColor,
                            color: buttonTeritaryForegroundColor,
                            // border: buttonTertiaryBackgroundColor,
                        }}>
                        {t('labels:button3')}
                    </Button>
                </Content>
            </Content>
            <Content
                className={`!h-24 flex items-center justify-center`}
                style={{ backgroundColor: footerBackgroundColor }}>
                <p style={{ color: footerForegroundColor }} className='text-lg'>
                    {t('labels:footer_content_of_the_page')}
                </p>
            </Content>
        </Content>
    )
}

export default Preview
