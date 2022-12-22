import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Button,
  Drawer,
  Input,
  Switch,
} from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

//! Import user defined components
import DmTabAntDesign from "../../components/DmTabAntDesign/DmTabAntDesign";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import Status from "./Status";
const { Content } = Layout;
const { Title } = Typography;

//! Get all required details from .env file
const storeDataAPI = process.env.REACT_APP_DM_STORE_API;
const storeEditIdAPI = process.env.REACT_APP_DM_STORE_UPDATE_API;
const storeEditStatusAPI = process.env.REACT_APP_DM_STORE_STATUS_API;

//! tab data
const storeTabData = [
  {
    tabId: 0,
    tabTitle: "All",
  },
  {
    tabId: 1,
    tabTitle: "Active",
  },
  {
    tabId: 2,
    tabTitle: "InActive",
  },
];

const Stores = () => {
  const search = useLocation().search;

  const store_id = new URLSearchParams(search).get("store_id");

  const [open, setOpen] = useState(false);
  const [storeApiData, setStoreApiData] = useState([]);
  const [name, setName] = useState("");
  const [inValidName, setInValidName] = useState("");
  const [editName, setEditName] = useState("");
  const [inValidEditName, setInValidEditName] = useState("");
  const [selectedTabDataForStore, setSelectedTabDataForStore] = useState();
  const [drawerAction, setDrawerAction] = useState();

  //! table columns
  const StoreTableColumn = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (text, record) => {
        return <>{record.id}</>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text, record) => {
        return <>{record.name}</>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (text, record) => {
        return (
          <Status
            storeId={record.id}
            storeStatus={record.status === "Active" ? true : false}
          />
        );
       
        // <Switch onChange={onChange} defaultChecked />;
      },
    },
    {
      title: "Created_on",
      dataIndex: "created_on",
      key: "created_on",
      width: "45%",
      render: (text, record) => {
        return (
          <Row>
            {" "}
            <Col span={10}>{new Date(record.created_on).toLocaleString()}</Col>
            <Col span={9} offset={5}>
              <Link
                to={{
                  pathname: "",
                  search: `?store_id=${record.id}`,
                }}
                className=" pl-[8px] font-semibold app-table-data-title"
              >
                <EditOutlined
                  className="app-edit-icon font-bold text-black"
                  onClick={showEditDrawer}
                />
              </Link>
            </Col>
          </Row>
        );
      },
    },
  ];
  //! status of stores like active or inactive
  const statusForStores = {
    1: "Active",
    2: "InActive",
  };
  //! handleTabChangeStore to get the data according to the status
  const handleTabChangeStore = (status) => {
    if (status === "0") {
      setSelectedTabDataForStore(storeApiData);
    } else if (status === "1") {
      setSelectedTabDataForStore(
        storeApiData.filter((element) => element.status == status)
      );
    } else if (status === "2") {
      setSelectedTabDataForStore(
        storeApiData.filter((element) => element.status == status)
      );
    }
  };
  //!this useEffect for tab(initial rendering)
  useEffect(() => {
    handleTabChangeStore("0");
  }, [storeApiData]);
  //!pagination
  const pagination = [
    {
      defaultSize: 10,
      showPageSizeChanger: false,
      pageSizeOptions: ["5", "10"],
    },
  ];
  //!storeData to get the table data
  const storeData = [];
  {
    selectedTabDataForStore &&
      selectedTabDataForStore.length > 0 &&
      selectedTabDataForStore.map((element, index) => {
        var storeId = element.id;
        var storeName = element.name;
        var createdOn = element.created_on;
        var storeStatus = element.status;
        storeData &&
          storeData.push({
            key: index,
            name: storeName,
            id: storeId,
            created_on: createdOn,
            status: statusForStores[storeStatus],
          });
      });
  }
  //! tablepropsData to render the table columns,data,pagination
  const tablePropsData = {
    table_header: StoreTableColumn,
    table_content: storeData && storeData,
    pagenationSettings: pagination,

    search_settings: {
      is_enabled: true,
      search_title: "Search by name",
      search_data: ["name"],
    },
    filter_settings: {
      is_enabled: false,
      filter_title: "Filter's",
      filter_data: [],
    },
    sorting_settings: {
      is_enabled: false,
      sorting_title: "Sorting by",
      sorting_data: [],
    },
  };

  //! add drawer
  const showAddDrawer = () => {
    setOpen(true);
    setDrawerAction("post");
  };
  //!edit drawer
  const showEditDrawer = () => {
    setOpen(true);
    setDrawerAction("put");
  };
  const onClose = () => {
    setOpen(false);
  };

  //!get call for stores
  const getStoreApi = () => {
    axios
      .get(storeDataAPI, {
        params: {
          page_limit: 100,
        },
      })
      .then(function (response) {
        console.log(
          "Server Response from getStoreApi Function: ",
          response.data.data
        );
        setStoreApiData(response.data.data);
      })
      .catch((error) => {
        console.log("Server error from getStoreApi Function ", error.response);
      });
  };
  useEffect(() => {
    getStoreApi();
  }, []);
  //! post call for stores
  const addStoreData = () => {
    let count = 1;
    if (name === "" || name === null || name === undefined) {
      count--;
      setInValidName(true);
      toast("Please provide the Name", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    const postBody = {
      name: name,
    };
    console.log("postBody", postBody);
    axios
      .post(storeDataAPI, postBody)
      .then((response) => {
        toast("Store created successfully.", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        // var selectedStoreData = storeApiData.filter(
        //   (item) => item.id === store_id
        // );
        // setNewStoreData([[...newStoreData], [selectedStoreData]]);
        console.log("Server Success Response From stores", response.data);
        // console.log("newStoreData",selectedStoreData)
      })
      .catch((error) => {
        toast(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response);
      });
  };
  //!put call for stores
  const editStoreData = () => {
    let count = 1;
    if (editName === "" || editName === null || editName === undefined) {
      count--;
      setInValidEditName(true);
      toast("Please provide the Name", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    const putObject = {
      name: editName,
    };
    axios
      .put(storeEditIdAPI.replace("{id}", store_id), putObject)
      .then((response) => {
        console.log(response);
        if (response.status == 200 || response.status == 201) {
          getStoreApi();
          toast("Edit Store is Successfully Done! ", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
        toast(error.response.data.res, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response.data);
      });
  };
  useEffect(() => {
    if (store_id !== null) {
      var storeData =
        storeApiData &&
        storeApiData.length > 0 &&
        storeApiData.filter((element) => element.id === parseInt(store_id));
      if (storeApiData && storeApiData.length > 0) {
        setEditName(storeData[0].name);
      }
    }
  }, [store_id]);

  // const requestServer = async () => {
  //   const updatedStatus = statusChanged ? 1 : 2;
  //   console.log("updatedStatus", updatedStatus);
  //   const reqbody = {
  //     status: updatedStatus,
  //   };
  //   axios
  //     .put(storeEditStatusAPI, reqbody, {
  //       params: {
  //         store_id: parseInt(store_id),
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       if (response.status == 200 || response.status == 201) {
  //         // getStoreApi();
  //         toast("Edit Store is Successfully Done! ", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           type: "success",
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       toast(error.message, {
  //         type: "error",
  //       });
  //       console.log("error", error);
  //     });
  // };

  // useEffect(() => {
  //   requestServer();
  // }, []);

  return (
    <Layout className="bg-blue mt-3 p-3">
      <Content>
        <Row>
          <Col span={4}>
            <Title level={3} className="!font-normal float-left">
              Stores
            </Title>
          </Col>
          <Col span={4} offset={16}>
            <Content className="text-right">
              <Button className="!bg-black text-white" onClick={showAddDrawer}>
                Add Stores
              </Button>
              <Drawer
                title={
                  drawerAction && drawerAction === "post"
                    ? "Add Store"
                    : "Edit Store"
                }
                placement="right"
                onClose={onClose}
                open={open}
                className="mt-[50px]"
              >
                <Title level={5}>
                  Name
                  <sup className="text-red-600 text-sm pl-1">*</sup>
                </Title>
                {drawerAction && drawerAction === "post" ? (
                  <>
                    <Input
                      // className="mb-4 "
                      placeholder="Enter store name"
                      value={name}
                      className={`${
                        inValidName
                          ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400 mb-4"
                          : "h-10 px-3 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm mb-4"
                      }`}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <Button
                      className="bg-black text-white"
                      onClick={() => addStoreData()}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={editName}
                      className={`${
                        inValidEditName
                          ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400 mb-4"
                          : "h-10 px-3 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm mb-4"
                      }`}
                      onChange={(e) => {
                        setEditName(e.target.value);
                      }}
                    />
                    <Button
                      className="bg-black text-white"
                      onClick={() => editStoreData()}
                    >
                      Update
                    </Button>
                  </>
                )}
              </Drawer>
            </Content>
          </Col>
        </Row>
      </Content>
      <Content>
        <DmTabAntDesign
          tabData={storeTabData}
          handleTabChangeFunction={handleTabChangeStore}
          defaultSelectedTabKey={0}
          tabType={"line"}
          tabBarPosition={"bottom"}
        />
      </Content>
      <Content>
        <DynamicTable tableComponentData={tablePropsData} />
      </Content>
    </Layout>
  );
};

export default Stores;
