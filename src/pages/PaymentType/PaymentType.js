import React, { useEffect } from 'react'
import { Layout, Typography, Table } from 'antd'

import DynamicTable from '../../components/DynamicTable/DynamicTable'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useTranslation } from 'react-i18next'
const { Content } = Layout
const { Title } = Typography

const PaymentType = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:payment_settings'))
    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    const paymentTypeColumns = [
        {
            title: `${t('labels:payment_types')}`,
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
    ]

    const data = [
        {
            key: 1,
            name: `${t('labels:cash_on_delivery')}`,
            is_payment_gateway: false,
        },
        {
            key: 2,
            name: `${t('labels:online_payment')}`,
            is_payment_gateway: true,
            children: [
                // {
                //   key: 21,
                //   name: `${t("labels:razor_pay")}`,
                //   is_payment_gateway: true,
                // },
                {
                    key: 22,
                    name: `${t('labels:stripe')}`,
                    is_payment_gateway: true,
                },
                {
                    key: 23,
                    name: `${t('labels:cash_free')}`,
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
                        <div className='!font-semibold text-2xl mb-4'>{t('labels:payment_type')}</div>
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
