import React from 'react';
import { Modal, Button } from 'antd';

const StoreModal = ({okCallback, cancelCallback, isVisible, children, title, cancelButtonText, okButtonText, width, hideCloseButton }) => {
  const handleOk = () => {
    okCallback()
  };

  const handleCancel = () => {
    cancelCallback()
  };

  return (
    <>
      <Modal title={title} open={isVisible} onOk={handleOk} closable={hideCloseButton} centered={true} maskClosable={hideCloseButton} onCancel={handleCancel} width={width} footer={okButtonText == null ? null : [
        <Button key="back" className="app-btn-secondary"  onClick={handleCancel}>
          {cancelButtonText}
        </Button>,
        <Button key="submit" className="app-btn-primary" onClick={handleOk}>
          {okButtonText}
        </Button>]}>
        {children}
      </Modal>
    </>
  );
};

export default StoreModal;