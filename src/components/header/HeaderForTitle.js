import { Layout, Button, Row } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import './header2.css'

const { Content } = Layout

function HeaderForTitle({
    title,
    headerContent,
    titleContent,
    saveFunction,
    showArrowIcon,
    backNavigationPath,
    action,
    isVisible,
    showButtons,
    disableSave,
    disableDiscard,
}) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    //! selected Language from Redux
    const selectedLanguageFromReduxState = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    const handleNavigationBack = () => {
        if (backNavigationPath !== undefined && backNavigationPath !== null && backNavigationPath !== '') {
            navigate(backNavigationPath)
        } else {
            navigate(-1)
        }
    }
    return (
        <Content className='shadow-sm'>
            <Content className='fixed top-[3.0rem] z-10 bg-white flex justify-between headerWidth !px-5 pt-3 pb-1 '>
                <Content className={`${showArrowIcon === true ? 'flex !items-center gap-2' : ''}`}>
                    {showArrowIcon === true ? (
                        selectedLanguageFromReduxState &&
                        Object(selectedLanguageFromReduxState).hasOwnProperty('writing_script_direction') &&
                        String(selectedLanguageFromReduxState?.writing_script_direction).toUpperCase() === 'RTL' ? (
                            <ArrowRightOutlined className='!text-xl ml-2 ' onClick={handleNavigationBack} />
                        ) : (
                            <ArrowLeftOutlined className=' !text-xl mr-2 ' onClick={handleNavigationBack} />
                        )
                    ) : null}
                    <Row className='w-full !items-center'>
                        <Content className='w-[30%] flex justify-start'>{title}</Content>
                        <div className='flex justify-end'>{titleContent}</div>
                    </Row>
                </Content>
                {showArrowIcon === true ? (
                    <>
                        {showButtons === false ? (
                            ''
                        ) : (
                            <Content className='flex justify-end'>
                                {' '}
                                {disableDiscard === true ? null : (
                                    <Button className='mx-2' onClick={() => navigate(-1)}>
                                        {t('labels:discard')}
                                    </Button>
                                )}
                                {isVisible !== false ? (
                                    <Button
                                        disabled={disableSave === true ? true : false}
                                        onClick={() => saveFunction()}
                                        className={`${
                                            disableSave === true ? 'app-btn-primary opacity-50' : 'app-btn-primary'
                                        }`}>
                                        {/* // !This Button Renders on Store Product Type */}
                                        {action === 'add' ? t('labels:save') : t('labels:update')}
                                    </Button>
                                ) : null}
                            </Content>
                        )}
                    </>
                ) : null}
            </Content>
            {headerContent !== null && headerContent !== undefined ? (
                <Content className='mt-[4.0rem] bg-white !px-5 !pt-3 !pb-1'>{headerContent}</Content>
            ) : null}
        </Content>
    )
}

export default HeaderForTitle
