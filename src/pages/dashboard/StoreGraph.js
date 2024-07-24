import React, { useState, useEffect } from 'react'
import { Layout, Typography, Spin, Button } from 'antd'
import { Bar, Pie, Column } from '@ant-design/plots'

const { Title, Text } = Typography
const { Content } = Layout

const StoreGraph = ({ languageData }) => {
    const [pieStoreGraphData, setPieStoreGraphData] = useState()

    // useEffect(() => {
    //   if (storeData !== undefined) {
    //     let data = [
    //       {
    //         type: "Active",
    //         value: storeData && storeData.active_stores,
    //       },
    //       {
    //         type: "Inactive",
    //         value: storeData && storeData.inactive_store,
    //       },
    //     ];

    //     const config = {
    //       appendPadding: 10,
    //       data,
    //       angleField: "value",
    //       colorField: "type",
    //       radius: 1,
    //       innerRadius: 0.5,
    //       label: {
    //         type: "inner",
    //         offset: "-50%",
    //         content: "{value}",
    //         style: {
    //           textAlign: "center",
    //           fontSize: 14,
    //         },
    //       },
    //       interactions: [
    //         { type: "element-selected" },
    //         {
    //           type: "element-active",
    //         },
    //       ],
    //       statistic: {
    //         title: false,
    //         content: {
    //           style: {
    //             whiteSpace: "pre-wrap",
    //             overflow: "hidden",
    //             textOverflow: "ellipsis",
    //           },
    //           // formatter: function formatter() {
    //           //   return `total\n134`;
    //           // },
    //         },
    //       },
    //     };

    //     setPieStoreGraphData(config);
    //   }
    // }, []);

    useEffect(() => {
        if (languageData !== undefined) {
            console.log('languageData', languageData)
            const data = []
            languageData.store_language.forEach((element) => {
                const lngData = {}
                lngData['type'] = element.store_name
                lngData['value'] = element.language_count
                data.push(lngData)
            })

            const config = {
                appendPadding: 10,
                data,
                angleField: 'value',
                colorField: 'type',
                radius: 1,
                innerRadius: 0.5,
                label: {
                    type: 'inner',
                    offset: '-50%',
                    content: '{value}',
                    style: {
                        textAlign: 'center',
                        fontSize: 14,
                    },
                },
                interactions: [
                    { type: 'element-selected' },
                    {
                        type: 'element-active',
                    },
                ],
                statistic: {
                    title: false,
                    content: {
                        style: {
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        },
                        // formatter: function formatter() {
                        //   return `total\n134`;
                        // },
                    },
                },
            }

            setPieStoreGraphData(config)
        }
    }, [])

    return (
        <Content>
            {' '}
            {pieStoreGraphData !== undefined ? (
                <>
                    <Content>
                        <Pie {...pieStoreGraphData} />
                    </Content>
                </>
            ) : null}
        </Content>
    )
}

export default StoreGraph
