import React from 'react'
import { Modal, Button, Spin, Layout } from 'antd'
import './StoreModal.css'
import { useTranslation } from 'react-i18next'
const { Content } = Layout
const StoreModal = ({
    okCallback,
    cancelCallback,
    isVisible,
    children,
    title,
    cancelButtonText,
    okButtonText,
    width,
    hideCloseButton,
    isSpin,
    isCancelButtonDisabled,
    isOkButtonDisabled,
    destroyOnClose,
    removePadding,
}) => {
    const { t } = useTranslation()
    const handleOk = () => {
        okCallback()
    }

    const handleCancel = () => {
        cancelCallback()
    }

    return (
        <Modal
            title={<div className='text-regal-blue font-bold text-[18px] leading-[26px]'>{title}</div>}
            open={isVisible}
            onOk={handleOk}
            closable={hideCloseButton}
            centered={true}
            maskClosable={hideCloseButton}
            onCancel={handleCancel}
            width={width}
            className={removePadding ? 'custom-modal' : ''}
            footer={
                okButtonText == null
                    ? null
                    : [
                          cancelButtonText == null ? null : (
                              <Button
                                  className={` app-btn-secondary ${
                                      isCancelButtonDisabled ? ' !opacity-50 !cursor-not-allowed' : ' '
                                  }`}
                                  key='back'
                                  onClick={handleCancel}
                                  disabled={isCancelButtonDisabled ? isCancelButtonDisabled : false}>
                                  {cancelButtonText}
                              </Button>
                          ),
                          okButtonText == null ? null : (
                              <Button
                                  className={` app-btn-primary ${isOkButtonDisabled ? ' !opacity-50 !cursor-not-allowed' : ' '}`}
                                  disabled={isOkButtonDisabled ? isOkButtonDisabled : false}
                                  key='submit'
                                  onClick={handleOk}>
                                  {okButtonText}
                              </Button>
                          ),
                      ]
            }
            destroyOnClose={destroyOnClose}>
            <Spin tip={t('labels:please_wait')} spinning={isSpin}>
                <Content>{children}</Content>
            </Spin>
        </Modal>
    )
}

export default StoreModal
