import React from 'react'
import { Layout, Skeleton, Space } from 'antd'
import SkeletonInput from 'antd/lib/skeleton/Input'

const { Content } = Layout

var layouts = [
    {
        layout: 'layout1',
        attribute: (
            <Content>
                <Content
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <Skeleton.Input size='large' active style={{ margin: '25px' }} />
                    <Skeleton.Avatar size={'large'} shape='square' active style={{ margin: '25px' }} />
                </Content>
                <Content>
                    <Skeleton active paragraph />
                </Content>
            </Content>
        ),

        key: 1,
    },
    {
        layout: 'layout2',
        attribute: (
            <Layout>
                <Layout
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <Skeleton title active style={{ margin: '15px' }} />
                    <Skeleton active style={{ margin: '15px' }} />
                </Layout>
                <Layout>
                    <Skeleton.Input active style={{ margin: '15px' }} />
                    <Skeleton.Input active style={{ margin: '15px' }} />
                    <Space style={{ marginLeft: '15px' }}>
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                    </Space>
                    <Skeleton.Input active style={{ margin: '15px' }} />
                </Layout>
                <Layout>
                    <Skeleton active style={{ margin: '15px' }} />
                    <Space style={{ marginLeft: '15px' }}>
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                    </Space>
                </Layout>
            </Layout>
        ),

        key: 2,
    },

    {
        layout: 'layout3',
        attribute: (
            <Layout>
                <Layout>
                    <Skeleton.Input active style={{ margin: '15px' }} />
                    <Skeleton.Input active style={{ margin: '15px' }} />
                    <Skeleton.Button active size='default' style={{ margin: '15px' }} />
                    <Skeleton.Button active size='small' style={{ margin: '15px' }} />
                </Layout>
            </Layout>
        ),
        key: 3,
    },
    {
        layout: 'layout4',
        attribute: (
            <Layout
                style={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    margin: '15px',
                }}>
                <Skeleton paragraph active />
                <Space>
                    <Skeleton.Button active />
                    <Skeleton.Button active />
                </Space>
            </Layout>
        ),

        key: 4,
    },
    {
        layout: 'layout5',
        attribute: (
            <Layout>
                <Layout
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: '15px',
                    }}>
                    <Skeleton.Input active />
                    <Space>
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                    </Space>
                </Layout>
                <Layout
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: '10px',
                    }}>
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                </Layout>
            </Layout>
        ),
        key: 5,
    },
    {
        layout: 'layout6',
        attribute: (
            <Layout
                style={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    margin: '15px',
                }}>
                <Skeleton avatar active />
                <Skeleton.Button active />
            </Layout>
        ),
        key: 6,
    },
    {
        layout: 'layout7',
        attribute: (
            <Layout>
                <Layout
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        margin: '15px',
                    }}>
                    <Skeleton.Button active />
                </Layout>
                <Layout style={{ margin: '15px' }}>
                    <Skeleton active />
                    <Skeleton.Button active />
                </Layout>
                <Layout style={{ marginLeft: '15px' }}>
                    <Space>
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                    </Space>
                </Layout>
                <Layout
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        margin: '15px',
                    }}>
                    <Skeleton.Button active />
                    <Skeleton.Button active style={{ marginLeft: '300px' }} />
                </Layout>
            </Layout>
        ),
        key: 7,
    },
]
const SkeletonComponent = (props) => {
    if (props.Layout == null) {
        return <Skeleton active />
    } else {
        const result = layouts.filter((val) => {
            return val.layout === props.Layout
        })
        return <Content>{result[0].attribute}</Content>
    }
}
export default SkeletonComponent
