import React, { useState, useEffect } from "react";
import { Switch, Space, Row, Col } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import StoreModal from "../../components/storeModal/StoreModal";
import useAuthorization from "../../hooks/useAuthorization";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import MarketplaceToaster from "../../util/marketplaceToaster";
const storeEditStatusAPI = process.env.REACT_APP_STORE_STATUS_API;

function Status({
  storeId,
  storeStatus,
  selectedTabTableContent,
  setSelectedTabTableContent,
  storeApiData,
  setStoreApiData,
  tabId,
  activeCount,
  setActiveCount,
  disableStatus
}) {
  const authorizationHeader = useAuthorization();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(storeStatus);
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // closing the delete popup model
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setSwitchStatus(storeStatus);
  }, [storeStatus]);

  // opening the delete popup model
  const openModal = (e) => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const updateStoreStatus = async () => {
    const reqbody = {
      status: changeSwitchStatus === true ? 1 : 2,
    };
    // Enabling spinner
    setIsLoading(true);
    MarketplaceServices.update(storeEditStatusAPI, reqbody, {
      store_id: storeId,
    })
      .then((response) => {
        setSwitchStatus(changeSwitchStatus);
        closeModal();
        setIsLoading(false);
        MarketplaceToaster.showToast(response);
        console.log(
          "Selected content",
          selectedTabTableContent,
          response.config.params.store_id
        );
        let duplicateActiveCall = { ...activeCount };

        if (
          duplicateActiveCall &&
          duplicateActiveCall.activeStores !== undefined
        ) {
          if (changeSwitchStatus === true) {
            duplicateActiveCall["activeStores"] =
              activeCount && activeCount.activeStores + 1;
            duplicateActiveCall["inactiveStores"] =
              activeCount && activeCount.inactiveStores - 1;
            setActiveCount(duplicateActiveCall);
          } else {
            duplicateActiveCall["activeStores"] =
              activeCount && activeCount.activeStores - 1;
            duplicateActiveCall["inactiveStores"] =
              activeCount && activeCount.inactiveStores + 1;
            setActiveCount(duplicateActiveCall);
          }
        }
        if (changeSwitchStatus) {
          storeApiData &&
            storeApiData.length > 0 &&
            storeApiData.forEach((element) => {
              if (element.store_uuid == response.config.params.store_id) {
                element.status = 1;
              }
            });
          if (setStoreApiData !== undefined) {
            setStoreApiData(storeApiData);
          }
        } else {
          storeApiData.forEach((element) => {
            if (element.store_uuid == response.config.params.store_id) {
              element.status = 2;
            }
          });
          if (setStoreApiData !== undefined) {
            setStoreApiData(storeApiData);
          }
        }
        if (
          tabId > 0 &&
          selectedTabTableContent &&
          selectedTabTableContent.length > 0
        ) {
          setSelectedTabTableContent(
            selectedTabTableContent.filter(
              (element) => element.id !== response.config.params.store_id
            )
          );
        } else {
          if (selectedTabTableContent && selectedTabTableContent.length > 0) {
            let temp = [...selectedTabTableContent];
            let index = temp.findIndex(
              (ele) => ele.id === response.config.params.store_id
            );
            temp[index]["status"] =
              changeSwitchStatus === true ? "Active" : "InActive";
            setSelectedTabTableContent(temp);
          }
        }
        // setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        closeModal();
        MarketplaceToaster.showToast(error.response);
        console.log("Error from the status response ===>", error.response);
      });
  };

  const onChange = (checked) => {
    setChangeSwitchStatus(checked);
    setIsModalOpen(true);
  };

  return (
    <div>
      <StoreModal
        isVisible={isModalOpen}
        okButtonText={t("labels:yes")}
        title={
          changeSwitchStatus
            ? `${t("labels:success")}`
            : `${t("labels:warning")}`
        }
        cancelButtonText={t("labels:cancel")}
        okCallback={() => updateStoreStatus()}
        cancelCallback={() => closeModal()}
        isSpin={isLoading}
        hideCloseButton={false}
      >
        {/* <Content className="!w-3/5"> */}
        {changeSwitchStatus ? (
          <div>
            <p>{t("messages:store_activation_confirmation")}</p>
            <p>{t("messages:store_active_confirmation_message")}</p>
          </div>
        ) : (
          <div>
            <p>{t("messages:store_deactivation_confirmation")}</p>
            <p>{t("messages:store_deactivation_confirmation_message")}</p>
          </div>
        )}
        {/* </Content> */}
      </StoreModal>
      <Row className="gap-1">
        <Col>
          <Space direction="vertical">
            <Switch
              className={switchStatus ? "!bg-green-500" : "!bg-gray-400"}
              checked={switchStatus}
              onChange={onChange}
              onClick={() => {
                openModal(switchStatus);
              }}
              disabled={disableStatus}
            />
          </Space>
        </Col>
        <div className="">
          {switchStatus ? `${t("labels:active")}` : `${t("labels:inactive")}`}
        </div>
      </Row>
    </div>
  );
}

export default Status;
