import React, { useState, useEffect } from "react";
import { Switch, Space } from "antd";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

import axios from "axios";

const storeEditStatusAPI = process.env.REACT_APP_DM_STORE_STATUS_API;

function Status({ storeId, storeStatus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(
    storeStatus === 1 ? true : false
  );
  const [checkedChildren, setCheckedChildren] = useState(
    storeStatus === 1 ? true : false
  );
  const [unCheckedChildren, setUnCheckedChildren] = useState(
    storeStatus === 1 ? true : false
  );

  const closeModel = () => {
    setIsModalOpen(false);
  };

  const openModel = (e) => {
    console.log("modal1", e.target.checked);
    setStatusChanged(e.target.checked);
    setIsModalOpen(true);
  };

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
      })
      .catch((error) => {
        toast(error.message, {
          type: "error",
        });
        console.log("error", error);
      });

    console.log("post body for ---", storeEditStatusAPI, " is:", reqbody);
  };

  const ModelPopUp = () => {
    return (
      <div
        className={`${
          isModalOpen ? "flex" : "hidden"
        } justify-center items-center bg-opacity-50 bg-black fixed top-0 right-0 left-0 z-50 w-full md:inset-0 md:h-full`}
      >
        <div className="relative max-w-[672px] h-screen md:h-auto">
          {/* Modal content --> */}
          <div className="relative bg-white p-3 shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex justify-between items-center">
              <div className="text-[23px] font-medium text-gray-900 dark:text-white">
                {switchStatus ? "Product Activiation" : "Product Deactiviation"}
              </div>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => closeModel()}
              >
                <IoClose></IoClose>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            {statusChanged ? (
              <div className="mt-4">
                <p>{`Awesome!`}</p>
                <p>{`You are about the activate to your store. Would you like to proceed?`}</p>
              </div>
            ) : (
              <div className="mt-4">
                <p>{`You are about the deactivate from your store`}</p>
                <p>{`All products created under this category will be lost Are you sure you like to proceed deactivating?`}</p>
              </div>
            )}

            {/* <!-- Modal footer --> */}
            <div className="flex items-center justify-end mt-[2.5rem]">
              <button
                type="button"
                onClick={() => closeModel()}
                className="text-white bg-[#393939] focus:ring-gray-200 rounded-md border border-gray-200 text-sm font-medium px-[2rem] py-2.5 mr-4"
              >
                Discard
              </button>
              <button
                type="button"
                className={`text-white ${
                  statusChanged ? "bg-[#0047BB]" : "bg-[#A00A18]"
                } font-medium rounded-md text-sm px-[1.5rem] py-2.5 text-center`}
                onClick={() => {
                  closeModel();
                  requestServer();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onChange = (checked) => {
    // if (checked === true) {
    //   setCheckedChildren("Active");
    //   setUnCheckedChildren();
    // } else {
    //   setCheckedChildren();
    //   setUnCheckedChildren("InActive");
    // }

    setSwitchStatus(checked);
    setIsModalOpen(true);
    console.log(`switch to ${checked}`);
  };

  return (
    <div>
      <ModelPopUp></ModelPopUp>
      <div>
        <Space direction="vertical">
          <Switch
            className="bg-gray-500"
            // checkedChildren={checkedChildren}
            // unCheckedChildren={unCheckedChildren}
            defaultChecked={switchStatus}
            checked={storeStatus}
            onChange={onChange}
          />
        </Space>
      </div>
      {/* <div
            className={`pl-1  ${
              totalTypesEnabled[0].name === title &&
              totalTypesEnabled.length === 1
                ? "text-gray-400"
                : "text-[#393939]"
            }`}
          >
            {storeStatus ? "Active" : "Inactive"}
          </div> */}
    </div>
  );
}

export default Status;
