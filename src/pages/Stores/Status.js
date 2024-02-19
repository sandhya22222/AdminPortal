import React, { useState, useEffect } from "react";
import { Switch, Space, Row, Col, Layout, Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import StoreModal from "../../components/storeModal/StoreModal";
import useAuthorization from "../../hooks/useAuthorization";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import MarketplaceToaster from "../../util/marketplaceToaster";
import { storeActiveConfirmationImage } from "../../constants/media";
const storeEditStatusAPI = process.env.REACT_APP_STORE_STATUS_API;

const { Content } = Layout;
const { Text } = Typography;
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
  disableStatus,
  statusInprogress,
}) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(storeStatus);
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmationModalOpen, setActiveConfirmationModalOpen] =
    useState(false);

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
        setActiveConfirmationModalOpen(statusInprogress === 3 ? true : "");
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
            ? `${t("messages:store_activation_confirmation")}`
            : `${t("messages:store_deactivation_confirmation")}`
        }
        cancelButtonText={t("labels:cancel")}
        okCallback={() => updateStoreStatus()}
        cancelCallback={() => closeModal()}
        isSpin={isLoading}
        hideCloseButton={false}
      >
        {changeSwitchStatus ? (
          <div>
            <p className="!mb-0">
              {t("messages:store_active_confirmation_message")}
            </p>
            <p className="!m-0 !p-0">
              {t("messages:are_you_sure_you_like_to_proceed")}
            </p>
          </div>
        ) : (
          <div>
            <p>{t("messages:store_deactivation_confirmation_message")}</p>
          </div>
        )}
      </StoreModal>
      {statusInprogress !== 3 ? (
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
          {/* <div className={statusInprogress === 3 ? "opacity-30" : ""}>
            {switchStatus ? `${t("labels:active")}` : `${t("labels:inactive")}`}
          </div> */}
        </Row>
      ) : (
        <Switch loading  className={switchStatus ? "!bg-green-500" : "!bg-gray-400"}/>
      )}
      <StoreModal
        isVisible={activeConfirmationModalOpen}
        isSpin={false}
        hideCloseButton={false}
        width={800}
      >
        {
          <Content className="!text-center">
            <Text className=" font-semibold text-[15px]">
              {switchStatus
                ? `${t("labels:activating_store")}`
                : `${t("labels:deactivating_store")}`}
            </Text>
            <div
              className="mt-5 mb-3"
              style={{ "text-align": "-webkit-center" }}
            >
              <img src={storeActiveConfirmationImage} className="" />
            </div>
            <div className="mb-3">
              <p className="!mb-0">{t("messages:patience_is_a_virtue")}</p>
              <p className="!mb-0">
                {switchStatus
                  ? `${t("messages:activation_message")}`
                  : `${t("messages:deactivation_message")}`}
              </p>
            </div>
            <Button
              className="app-btn-primary"
              onClick={() => {
                setActiveConfirmationModalOpen(false);
              }}
            >
              {t("labels:close_message")}
            </Button>
          </Content>
        }
      </StoreModal>
    </div>
  );
}

export default Status;
