import React, { useEffect } from "react";
import { Modal, Button, Spin, Layout } from "antd";
import "./StoreModal.css";
const { Content } = Layout;
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
}) => {
  const handleOk = () => {
    okCallback();
  };

  const handleCancel = () => {
    cancelCallback();
  };

  return (
    <Modal
      title={title}
      open={isVisible}
      onOk={handleOk}
      closable={hideCloseButton}
      centered={true}
      maskClosable={hideCloseButton}
      onCancel={handleCancel}
      width={width}
      footer={
        okButtonText == null
          ? null
          : [
              <Button
                className={` app-btn-secondary ${
                  isCancelButtonDisabled
                    ? " !opacity-50 !cursor-not-allowed"
                    : " "
                }`}
                disabled={isCancelButtonDisabled}
                key="back"
                onClick={handleCancel}
              >
                {cancelButtonText}
              </Button>,
              <Button
                className={`app-btn-primary ${
                  isOkButtonDisabled ? " !opacity-50 !cursor-not-allowed" : " "
                }`}
                disabled={isOkButtonDisabled ? isOkButtonDisabled : false}
                key="submit"
                onClick={handleOk}
              >
                {okButtonText}
              </Button>,
            ]
      }
    >
      <Spin tip="Please wait" spinning={isSpin}>
        <Content>{children}</Content>
      </Spin>
    </Modal>
  );
};

export default StoreModal;
