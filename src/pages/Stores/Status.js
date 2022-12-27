import React, { useState, useEffect } from "react";
import { Switch, Space, Row, Col, Button } from "antd";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import StoreModal from "../../components/storeModal/StoreModal";
import axios from "axios";

const storeEditStatusAPI = process.env.REACT_APP_DM_STORE_STATUS_API;

function Status({ storeId, storeStatus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(
    storeStatus === 1 ? true : false
  );
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");

 
  // closing the delete popup model
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // opening the delete popup model
  const openModal = (e) => {
    setIsModalOpen(true);
    setChangeSwitchStatus(e.target.checked);
  };

   // const openModel = (e) => {
  //   console.log("modal1", e.target.checked);
  //   setStatusChanged(e.target.checked);
  //   setIsModalOpen(true);
  // };

  const requestServer = async () => {
    const reqbody = {
      status: switchStatus === true ? 1 : 2,
    };
    axios
      .put(storeEditStatusAPI, reqbody, {
        params: {
          store_id: parseInt(storeId),
        },
      })
      .then((response) => {
        console.log(response);
        toast("Edit Status is done Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        closeModal()
      })
      .catch((error) => {
        toast(error.message, {
          type: "error",
        });
        console.log("error", error);
        closeModal()
      });

    console.log("post body for ---", storeEditStatusAPI, " is:", reqbody);
  };

  // const ModelPopUp = () => {
  //   return (
  //     <div
  //       className={`${
  //         isModalOpen ? "flex" : "hidden"
  //       } justify-center items-center bg-opacity-50 bg-black fixed top-0 right-0 left-0 z-50 w-full md:inset-0 md:h-full`}
  //     >
  //       <div className="relative max-w-[672px] h-screen md:h-auto">
  //         {/* Modal content --> */}
  //         <div className="relative bg-white p-3 shadow dark:bg-gray-700">
  //           {/* <!-- Modal header --> */}
  //           <div className="flex justify-between items-center">
  //             <div className="text-[23px] font-medium text-gray-900 dark:text-white">
  //               {switchStatus ? "Product Activiation" : "Product Deactiviation"}
  //             </div>
  //             <Button
  //               type="button"
  //               className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
  //               onClick={() => closeModel()}
  //             >
  //               <IoClose></IoClose>
  //             </Button>
  //           </div>
  //           {/* <!-- Modal body --> */}
  //           {switchStatus ? (
  //             <div className="mt-4">
  //               <p>{`Awesome!`}</p>
  //               <p>{`You are about the activate to your store. Would you like to proceed?`}</p>
  //             </div>
  //           ) : (
  //             <div className="mt-4">
  //               <p>{`You are about the deactivate from your store`}</p>
  //               <p>{`All products created under this category will be lost Are you sure you like to proceed deactivating?`}</p>
  //             </div>
  //           )}

  //           {/* <!-- Modal footer --> */}
  //           <div className="flex items-center justify-end mt-[2.5rem]">
  //             <Button
  //               type="button"
  //               onClick={() => closeModel()}
  //               className="app-btn-secondary rounded-none"
  //               // className="text-black bg-[#ffff] border border-black-200 text-sm font-medium px-[2rem] py-2.5 mr-4"
  //             >
  //               Discard
  //             </Button>
  //             <Button
  //               type="button"
  //               // className={`text-white ${
  //               //   switchStatus ? "bg-black" : "bg-black"
  //               // } font-medium text-sm px-[1.5rem] py-2.5 text-center`}
  //               className="app-btn-primary rounded-none"
  //               onClick={() => {
  //                 closeModel();
  //                 requestServer();
  //               }}
  //             >
  //               Yes
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const onChange = (checked) => {
    setSwitchStatus(checked);
    setIsModalOpen(true);
    console.log(`switch to ${checked}`);
  };

  return (
    <div>
      {/* <ModelPopUp /> */}
      <StoreModal
        isVisible={isModalOpen}
        okButtonText={"Yes"}
        title={switchStatus ? "Store Activiation" : "Store Deactiviation"}
        cancelButtonText={"Cancel"}
        okCallback={() => requestServer()}
        cancelCallback={() => closeModal()}
      >
        {switchStatus ? (
          <div>
            <p>{`Awesome!`}</p>
            <p>{`You are about the activate to your store. Would you like to proceed?`}</p>
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
              defaultChecked={storeStatus}
              checked={storeStatus}
              onChange={onChange}
              onClick={() => {
                openModal(switchStatus);
              }}
            />
          </Space>
        </Col>
        <div
          className={`pl-1 ${
            storeStatus === "Active" ? "text-gray-400" : "#00c3b3"
          }`}
        >
          {storeStatus ? "Active" : "Inactive"}
        </div>
      </Row>
    </div>
  );
}

export default Status;
