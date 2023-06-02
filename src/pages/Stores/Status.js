import React, { useState, useEffect } from "react";
import { Switch, Space, Row, Col, Button, Spin, Layout } from "antd";
import { toast } from "react-toastify";
import StoreModal from "../../components/storeModal/StoreModal";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import useAuthorization from "../../hooks/useAuthorization";
import MarketplaceServices from "../../services/axios/MarketplaceServices";

const storeEditStatusAPI = process.env.REACT_APP_STORE_STATUS_API;

function Status({
  storeId,
  storeStatus,
  selectedTabTableContent,
  setSelectedTabTableContent,
  storeApiData,
  setStoreApiData,
  tabId,
}) {
  const authorizationHeader = useAuthorization();

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

  const updateStoreStatus = async () => {
    const reqbody = {
      status: changeSwitchStatus === true ? 1 : 2,
    };
    // Enabling spinner
    setIsLoading(true);
    // axios
    //   .put(
    //     storeEditStatusAPI,
    //     reqbody,
    //     {
    //       params: {
    //         "store-id": parseInt(storeId),
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.update(storeEditStatusAPI, reqbody, {
      "store-id": parseInt(storeId),
    }).then((response) => {
      setSwitchStatus(changeSwitchStatus);
      if (changeSwitchStatus) {
        storeApiData.forEach((element) => {
          if (element.id == response.config.params["store-id"]) {
            element.status = 1;
          }
        });
        setStoreApiData(storeApiData);
        console.log("storeapidata==>", storeApiData);
      } else {
        storeApiData.forEach((element) => {
          if (element.id == response.config.params["store-id"]) {
            element.status = 2;
          }
        });
        setStoreApiData(storeApiData);
      }
      console.log(
        "Selected content",
        selectedTabTableContent,
        response.config.params["store-id"]
      );
      if (tabId > 0) {
        setSelectedTabTableContent(
          selectedTabTableContent.filter(
            (element) => element.id !== response.config.params["store-id"]
          )
        );
      } else {
        setSelectedTabTableContent(selectedTabTableContent);
      }
      if (switchStatus === false) {
        toast("Store activation is successful", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
      } else {
        toast("Store deactivation is successful", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
      }
      setIsLoading(false);
      closeModal();
    });
    console.log("first12344", switchStatus).catch((error) => {
      toast(error.response.data.message, {
        type: "error",
      });
      console.log("Error from the status response ===>", error.response);
      setIsLoading(false);
      closeModal();
    });
    console.log("first12344", switchStatus).catch((error) => {
      toast(error.response.data.message, {
        type: "error",
      });
      console.log("Error from the status response ===>", error.response);
      setIsLoading(false);
      closeModal();     
    });

    console.log("post body for ---", storeEditStatusAPI, " is:", reqbody);
  };

  const onChange = (checked) => {
    setChangeSwitchStatus(checked);
    setIsModalOpen(true);
  };

  return (
    <div>
      <StoreModal
        isVisible={isModalOpen}
        okButtonText={"Yes"}
        title={changeSwitchStatus ? "Store Activation" : "Store Deactivation"}
        cancelButtonText={"Cancel"}
        okCallback={() => updateStoreStatus()}
        cancelCallback={() => closeModal()}
        isSpin={isLoading}
      >
        {/* <Content className="!w-3/5"> */}
        {changeSwitchStatus ? (
          <div>
            <p>{`Awesome!`}</p>
            <p>{`You are about to activate your store. Would you like to proceed?`}</p>
          </div>
        ) : (
          <div>
            <p>{`You are about to deactivate your store. Would you like to proceed?`}</p>
          </div>
        )}
        {/* </Content> */}
      </StoreModal>
      <Row>
        <Col>
          <Space direction="vertical">
            <Switch
              className="bg-gray-400"
              checked={switchStatus}
              onChange={onChange}
              onClick={() => {
                openModal(switchStatus);
              }}
            />
          </Space>
        </Col>
        <div className="pl-1">{switchStatus ? "Active" : "Inactive"}</div>
      </Row>
    </div>
  );
}

export default Status;
