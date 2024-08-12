import React, { useEffect } from 'react'
import { Layout, Pagination } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const { Content } = Layout
export default function DmPagination({
    currentPage,
    totalItemsCount,
    handlePageNumberChange,
    pageSize,
    showSizeChanger,
    defaultPageSize,
    showTotal,
    presentPage,
    showQuickJumper
}) {
    const { t } = useTranslation()
    const handlePageChange = (page, pageSize) => {
        handlePageNumberChange(page, pageSize)
    }
    const selectedLanguageFromReduxState = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)
    useEffect(() => {
        if (String(selectedLanguageFromReduxState?.writing_script_direction).toUpperCase() === 'RTL') {
            document.getElementsByClassName('ant-pagination-prev')[0].style.transform = 'rotate(180deg)'
            document.getElementsByClassName('ant-pagination-next')[0].style.transform = 'rotate(180deg)'
        }
    }, [selectedLanguageFromReduxState])
    return (
        <Content className='my-3'>
            <Pagination
                pageSizeOptions={[20, 50, 100]}
                showSizeChanger={showSizeChanger}
                current={presentPage}
                defaultCurrent={currentPage}
                total={totalItemsCount}
                onChange={handlePageChange}
                pageSize={pageSize}
                defaultPageSize={defaultPageSize}
                showTotal={
                    showTotal === true
                        ? (total, range) => `${range[0]}-${range[1]} ${t('labels:of')} ${total} ${t('labels:items')}`
                        : false
                }
                locale={{
                    //? Here we can customize the Keys for Pagination
                    prev_page: t('labels:prev_page'),
                    next_page: t('labels:next_page'),
                    items_per_page: t('labels:page'),
                }}
                showQuickJumper={showQuickJumper}
            />
        </Content>
    )
}
