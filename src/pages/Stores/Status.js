import React, { useState, useEffect } from "react";
import { Switch, Space, Row, Col, Button, Spin } from "antd";
import { toast } from "react-toastify";
import StoreModal from "../../components/storeModal/StoreModal";
import axios from "axios";

const storeEditStatusAPI = process.env.REACT_APP_STORE_STATUS_API;

function Status({
  storeId,
  storeStatus,
  selectedTabTableContent,
  setSelectedTabTableContent,
  storeApiData,
  setStoreApiData,
}) {
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

  const requestServer = async () => {
    const reqbody = {
      status: changeSwitchStatus === true ? 1 : 2,
    };
    // Enabling spinner
    setIsLoading(true);
    axios
      .put(storeEditStatusAPI, reqbody, {
        params: {
          "store-id": parseInt(storeId),
        },
      })
      .then((response) => {
        setSwitchStatus(changeSwitchStatus);
        if (changeSwitchStatus) {
          storeApiData.forEach((element) => {
            if (element.id == response.config.params.store_id) {
              element.status = 1;
            }
          });
          setStoreApiData(storeApiData);
        } else {
          storeApiData.forEach((element) => {
            if (element.id == response.config.params.store_id) {
              element.status = 2;
            }
          });
          setStoreApiData(storeApiData);
        }
        console.log(
          "Selecte content",
          selectedTabTableContent,
          response.config.params.store_id
        );
        setSelectedTabTableContent(
          selectedTabTableContent.filter(
            (element) => element.id !== response.config.params.store_id
          )
        );
        toast("Edit Status is done Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        setIsLoading(false);
        closeModal();
      })
      .catch((error) => {
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
        title={changeSwitchStatus ? "Store Activiation" : "Store Deactiviation"}
        cancelButtonText={"Cancel"}
        okCallback={() => requestServer()}
        cancelCallback={() => closeModal()}
        isSpin={isLoading}
      >
        {changeSwitchStatus ? (
          <div>
            <p>{`Awesome!`}</p>
            <p>{`You are about the activate your store. Would you like to proceed?`}</p>
          </div>
        ) : (
          <div>
            <p>{`You are about the deactivate from your store. Would you like to proceed?`}</p>
          </div>
        )}
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
        <div className="pl-1">{storeStatus ? "Active" : "Inactive"}</div>
      </Row>
    </div>
  );
}

export default Status;
