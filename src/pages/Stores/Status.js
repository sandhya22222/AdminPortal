import React, { useState, useEffect } from "react";
import { Switch, Space, Row, Col, Button } from "antd";
import { toast } from "react-toastify";
import StoreModal from "../../components/storeModal/StoreModal";
import axios from "axios";

const storeEditStatusAPI = process.env.REACT_APP_DM_STORE_STATUS_API;

function Status({ storeId, storeStatus, storeApiData, setStoreApiData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(storeStatus);
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");

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
    // setChangeSwitchStatus(e.target.checked);
  };

  const requestServer = async () => {
    const reqbody = {
      status: changeSwitchStatus === true ? 1 : 2,
    };

    axios
      .put(storeEditStatusAPI, reqbody, {
        params: {
          store_id: parseInt(storeId),
        },
      })
      .then((response) => {
        console.log(
          "status put response",
          response.config.params.store_id,
          storeApiData
        );
        setSwitchStatus(changeSwitchStatus);
        if (changeSwitchStatus) {
          setStoreApiData(
            storeApiData.forEach((element) => {
              if (element.id == response.config.params.store_id) {
                element.status = 1;
              }
            })
          );
        } else {
          setStoreApiData(
            storeApiData.forEach((element) => {
              if (element.id == response.config.params.store_id) {
                element.status = 2;
              }
            })
          );
        }

        toast("Edit Status is done Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });

        closeModal();
      })
      .catch((error) => {
        toast(error.response.data.message, {
          type: "error",
        });
        console.log(
          "Error from the status response ===>",
          error.response.data.message
        );
        closeModal();
      });

    console.log("post body for ---", storeEditStatusAPI, " is:", reqbody);
  };

  const onChange = (checked) => {
    setChangeSwitchStatus(checked);
    setIsModalOpen(true);
  };
  console.log("switch status", switchStatus, storeStatus, changeSwitchStatus);

  return (
    <div>
      <StoreModal
        isVisible={isModalOpen}
        okButtonText={"Yes"}
        title={changeSwitchStatus ? "Store Activiation" : "Store Deactiviation"}
        cancelButtonText={"Cancel"}
        okCallback={() => requestServer()}
        cancelCallback={() => closeModal()}
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
