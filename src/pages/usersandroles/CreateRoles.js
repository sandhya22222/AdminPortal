import React, { useState, useEffect } from 'react'
import { Layout, Typography, Button, Input, Row, Col, Spin, Tooltip } from 'antd'

import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeaderForTitle from '../../components/header/HeaderForTitle'

//! Import CSS libraries

const titleMaxLength = parseInt(process.env.REACT_APP_TITLE_MAX_LENGTH)

const { Paragraph, Title } = Typography
const { Content } = Layout
const { TextArea } = Input

const CreateRoles = () => {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const search = useLocation().search
    const [isLoading, setIsLoading] = useState(false)
    const [pageAction, setPageAction] = useState()

    const roleFormValidation = () => {}

    useEffect(() => {
        var pathnameString = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length).split('-')
        setPageAction(pathnameString[0])

        window.scrollTo(0, 0)
    }, [])

    return (
        <Content className=''>
            <HeaderForTitle
                title={
                    <Tooltip title={pageAction !== 'add' ? 'Edit' : 'Add'} zIndex={11} placement='bottom'>
                        <Title level={3} className='!font-normal max-w-[800px]' ellipsis>
                            {pageAction === 'add' ? `${t('labels:add_role')} ` : 'Edit Roles'}
                        </Title>
                    </Tooltip>
                }
                type={'categories'}
                action={pageAction === 'add' ? 'add' : 'edit'}
                showArrowIcon={true}
                saveFunction={roleFormValidation}
                isVisible={pageAction === 'edit' ? false : true}
                showButtons={pageAction === 'edit' ? true : false}
            />
            <Content className='!min-h-screen mt-[4.5rem] p-3'>
                <Spin tip={t('labels:please_wait')} size='large' spinning={isLoading}>
                    <Content className='bg-white p-3'>
                        <Row>
                            <Col span={14} className=''>
                                <Content className='my-3'>
                                    <Typography className='input-label-color mb-2 flex gap-1'>
                                        {t('labels:role_name')}
                                        <span className='mandatory-symbol-color text-sm '>*</span>
                                    </Typography>
                                    <Content className='flex'>
                                        <Content className=''>
                                            <Input
                                                disabled={pageAction === 'add' ? false : true}
                                                maxLength={titleMaxLength}
                                                placeholder={t('placeholders:role_name_placeholder')}
                                            />
                                        </Content>
                                    </Content>
                                </Content>
                                <Content className='my-3'>
                                    <Typography className='input-label-color mb-2 flex gap-1'>
                                        {t('common:description')}
                                        <span className='mandatory-symbol-color text-sm '>*</span>
                                    </Typography>
                                    <Content className={`flex ${pageAction === 'edit' ? ' relative' : ''}`}>
                                        <TextArea
                                            disabled={pageAction === 'add' ? false : true}
                                            placeholder={t('placeholders:role_description_placeholder')}
                                            autoSize={true}
                                            rows={1}
                                        />
                                    </Content>
                                </Content>
                                {pageAction === 'add' ? (
                                    <Content className='my-2'>
                                        <Button
                                            onClick={roleFormValidation}
                                            className={`app-btn-primary ml-1
                       `}>
                                            {pageAction === 'edit' ? t('labels:update') : t('labels:save')}
                                        </Button>
                                    </Content>
                                ) : null}
                            </Col>
                        </Row>
                    </Content>
                </Spin>
            </Content>
        </Content>
    )
}

export default CreateRoles
