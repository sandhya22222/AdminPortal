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
            title: `${t('labels:payment_type')}`,
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            // render: (text, record) => {
            //   return <>{record.name}</>;
            // },
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
            ],
        },
    ]

    // const tempArray = [];
    // paymentTypesData[0] &&
    //   paymentTypesData[0].data.map((element, index) => {
    //     var tempId = element.id;
    //     var paymentTypeName = element.payment_type;
    //     tempArray.push({
    //       key: index,
    //       name: paymentTypeName,
    //       id: tempId,
    //     });
    //   });

    // const tablePropsData = {
    //   table_header: paymentTypeColumns,
    //   table_content: tempArray,
    //   pagenationSettings: false,
    //   search_settings: {
    //     is_enabled: false,
    //     search_title: "Search by name",
    //     search_data: ["name"],
    //   },
    //   filter_settings: {
    //     is_enabled: false,
    //     filter_title: "Filter's",
    //     filter_data: [],
    //   },
    //   sorting_settings: {
    //     is_enabled: false,
    //     sorting_title: "Sorting by",
    //     sorting_data: [],
    //   },
    // };

    return (
        <Content className=''>
            <HeaderForTitle
                title={
                    <Content>
                        <Title level={3} className='!font-normal'>
                            {t('labels:payment')}
                        </Title>
                    </Content>
                }
            />
            <Content className='!p-3 !mt-[7.4rem] '>
                <Table dataSource={data} columns={paymentTypeColumns} pagination={false} />
            </Content>
        </Content>
    )
}

export default PaymentType
