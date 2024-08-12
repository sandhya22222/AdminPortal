import React, { useEffect } from 'react'
import { Layout, Table } from 'antd'

import HeaderForTitle from '../../components/header/HeaderForTitle'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useTranslation } from 'react-i18next'
const { Content } = Layout

const PaymentType = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:payment_settings'))
    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    const paymentTypeColumns = [
        {
            title: <div className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:payment_types')}</div>,
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
    ]

    const data = [
        {
            key: 1,
            name: <div className='text-brandGray1'>{t('labels:cash_on_delivery')}</div>,
            is_payment_gateway: false,
        },
        {
            key: 2,
            name: <div className='text-brandGray1'>{t('labels:online_payment')}</div>,
            is_payment_gateway: true,
            children: [
                // {
                //   key: 21,
                //   name: `${t("labels:razor_pay")}`,
                //   is_payment_gateway: true,
                // },
                {
                    key: 22,
                    name: <div className='text-brandGray1'>{t('labels:stripe')}</div>,
                    is_payment_gateway: true,
                },
                {
                    key: 23,
                    name: <div className='text-brandGray1'>{t('labels:cash_free')}</div>,
                    is_payment_gateway: true,
                },
            ],
        },
    ]

    return (
        <Content className=''>
            <HeaderForTitle
                title={
                    <Content>
                        <div className='!font-semibold text-2xl mb-4 text-regal-blue'>{t('labels:payment_setting')}</div>
                    </Content>
                }
            />
            <Content className='!p-3 !mt-[10.5rem] mx-3 bg-white  rounded-md shadow-brandShadow'>
                <Table dataSource={data} columns={paymentTypeColumns} pagination={false} />
            </Content>
        </Content>
    )
}

export default PaymentType
