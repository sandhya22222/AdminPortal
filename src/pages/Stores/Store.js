import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Button,
  Drawer,
  Input,
  Spin,
  Skeleton,
} from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import { useLocation, Link, useSearchParams } from "react-router-dom";

//! Import user defined components
import DmTabAntDesign from "../../components/DmTabAntDesign/DmTabAntDesign";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import Status from "./Status";
const { Content } = Layout;
const { Title } = Typography;

//! Get all required details from .env file
const storeAPI = process.env.REACT_APP_STORE_API;
const storeUpdateAPI = process.env.REACT_APP_STORE_UPDATE_API;

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
    tabTitle: "Inactive",
  },
];

const Stores = () => {
  const search = useLocation().search;

  // const store_id = new URLSearchParams(search).get("store_id");
  const tab_id = new URLSearchParams(search).get("tab");

  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [storeApiData, setStoreApiData] = useState([]);
  const [name, setName] = useState("");
  const [inValidName, setInValidName] = useState("");
  const [editName, setEditName] = useState("");
  const [inValidEditName, setInValidEditName] = useState("");
  const [drawerAction, setDrawerAction] = useState();
  const [postData, setPostData] = useState(null);
  const [selectedTabTableContent, setSelectedTabTableContent] = useState([]);
  const [serverStoreName, setServerStoreName] = useState();
  const [storeEditId, setStoreEditId] = useState();
  //! table columns
  const StoreTableColumn = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "8%",
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
            storeApiData={storeApiData}
            setSelectedTabTableContent={setSelectedTabTableContent}
            selectedTabTableContent={selectedTabTableContent}
            setStoreApiData={setStoreApiData}
          />
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "created_on",
      key: "created_on",
      width: "34%",
      render: (text, record) => {
        return <>{new Date(record.created_on).toLocaleString()}</>;
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: "8%",
      render: (text, record) => {
        return (
          <Row>
            {" "}
            <Col span={3} offset={8}>
              <EditOutlined
                className="app-edit-icon font-bold text-black"
                onClick={() => {
                  showEditDrawer(record.id);
                }}
              />
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
    setSearchParams({
      tab: status,
    });
    if (status === "0") {
      tableStoreData(storeApiData);
    } else if (status === "1") {
      tableStoreData(
        storeApiData.filter((element) => element.status == status)
      );
    } else if (status === "2") {
      tableStoreData(
        storeApiData.filter((element) => element.status == status)
      );
    }
  };
  //!this useEffect for tab(initial rendering)
  useEffect(() => {
    if (storeApiData && storeApiData.length > 0) {
      setIsLoading(false);
      if (tab_id === "0" || tab_id === "1" || tab_id === "2") {
        handleTabChangeStore(tab_id);
      } else {
        handleTabChangeStore("0");
      }
    }
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
  const tableStoreData = (filteredData) => {
    const tempArray = [];
    filteredData &&
      filteredData.length > 0 &&
      filteredData.map((element, index) => {
        var storeId = element.id;
        var storeName = element.name;
        var createdOn = element.created_on;
        var storeStatus = element.status;
        tempArray &&
          tempArray.push({
            key: index,
            name: storeName,
            id: storeId,
            created_on: createdOn,
            status: statusForStores[storeStatus],
          });
      });
    setSelectedTabTableContent(tempArray);
  };
  //! tablepropsData to render the table columns,data,pagination
  const tablePropsData = {
    table_header: StoreTableColumn,
    table_content: selectedTabTableContent,
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
    setInValidName(false);
  };
  //!edit drawer
  const showEditDrawer = (id) => {
    setStoreEditId(id);
    setOpen(true);
    setDrawerAction("put");
    setEditName(
      storeApiData &&
        storeApiData.length > 0 &&
        storeApiData.filter((element) => element.id === id)[0].name
    );
  };
  const onClose = () => {
    setOpen(false);
    setName("");
  };
  //!get call for stores
  const getStoreApi = () => {
    // setIsLoading(true);
    axios
      .get(storeAPI, {
        params: {
          "page-limit": 1000,
          "page-number": 1,
        },
      })
      .then(function (response) {
        setIsNetworkError(false);
        setIsLoading(false);
        console.log(
          "Server Response from getStoreApi Function: ",
          response.data.data
        );
        setStoreApiData(response.data.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkError(true);
        console.log("Server error from getStoreApi Function ", error.response);
      });
  };
  useEffect(() => {
    getStoreApi();
  }, []);

  //!useEffect for getting the table in table without refreshing
  useEffect(() => {
    if (postData != null) {
      const temp = [...storeApiData];
      temp.push(postData);
      setStoreApiData(temp);
    }
  }, [postData]);

  //! validation for post call
  const validateStorePostField = () => {
    if (name === "" || name === null || name === undefined) {
      setInValidName(true);
      toast("Please provide the Name", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (name !== "") {
      addStoreData();
    }
  };
  //! post call for stores
  const addStoreData = () => {
    const postBody = {
      name: name,
    };
    setIsUpLoading(true);
    axios
      .post(storeAPI, postBody)
      .then((response) => {
        toast("Store created successfully.", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        setIsUpLoading(false);
        onClose();
        setName("");
        console.log("Server Success Response From stores", response.data);
        setPostData(response.data);
      })
      .catch((error) => {
        toast(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response);
        setIsUpLoading(false);
        // setInValidName(true)
        // onClose();
      });
  };

  //!put call for stores
  const editStoreData = () => {
    const putObject = {
      name: editName,
    };
    setIsUpLoading(true);
    axios
      .put(storeUpdateAPI.replace("{id}", storeEditId), putObject)
      .then((response) => {
        console.log("put response", response.data, storeApiData);
        let copyofStoreAPIData = [...storeApiData];
        copyofStoreAPIData.forEach((obj) => {
          if (obj.id === response.data.id) {
            obj.name = response.data.name;
          }
        });
        setStoreApiData(copyofStoreAPIData);
        setIsUpLoading(false);
        setServerStoreName(response.data.name);
        onClose();
        if (response.status == 200 || response.status == 201) {
          toast("Edit Store is Successfully Done! ", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
        setIsUpLoading(false);
        toast(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response.data.message);
      });
    console.log("post body for ---", storeUpdateAPI, " is:", putObject);
  };

  useEffect(() => {
    if (storeEditId) {
      var storeData =
        storeApiData &&
        storeApiData.length > 0 &&
        storeApiData.filter((element) => element.id === parseInt(storeEditId));
      if (storeApiData && storeApiData.length > 0) {
        setEditName(storeData[0].name);
        setServerStoreName(storeData[0].name);
      }
    }
  }, [storeEditId]);
  //! validation for put call
  const validateStorePutField = () => {
    if (editName === "" || editName === null || editName === undefined) {
      setInValidEditName(true);
      toast("Please provide the Name", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else if (editName === serverStoreName) {
      toast("No Changes Detected !", {
        position: toast.POSITION.TOP_RIGHT,
        type: "info",
      });
    } else {
      editStoreData();
    }
  };
  return (
    <Layout>
      <Content className="mb-1">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Stores", navigationPath: "", displayOrder: 2 },
          ]}
        />
        <Row justify={"space-between"}>
          <Col>
            <Content className="float-left mt-3">
              <Title level={3} className="!font-normal">
                Stores
              </Title>
            </Content>
          </Col>
          <Col>
            <Content className="text-right mt-3">
              <Button
                className="!bg-black text-white rounded-none border border-neutral-500"
                onClick={showAddDrawer}
              >
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
              >
                <Title level={5}>
                  Name
                  <sup className="text-red-600 text-sm pl-1">*</sup>
                </Title>
                {drawerAction && drawerAction === "post" ? (
                  <Spin tip="Please wait!" size="large" spinning={isUpLoading}>
                    <Input
                      placeholder="Enter store name"
                      value={name}
                      className={`${
                        inValidName
                          ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400 mb-4"
                          : "h-10 px-3 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm mb-4"
                      }`}
                      onChange={(e) => {
                        setName(e.target.value);
                        setInValidName(false);
                      }}
                    />
                    <Button
                      className="!bg-black text-white border border-neutral-500"
                      onClick={() => {
                        validateStorePostField();
                      }}
                    >
                      Save
                    </Button>
                  </Spin>
                ) : (
                  <Spin tip="Please wait!" size="large" spinning={isUpLoading}>
                    <Input
                      value={editName}
                      className={`${
                        inValidEditName
                          ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400 mb-4"
                          : "h-10 px-3 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm mb-4"
                      }`}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setInValidEditName(false);
                      }}
                    />
                    <Button
                      className="!bg-black text-white border border-neutral-500"
                      onClick={() => {
                        validateStorePutField();
                      }}
                    >
                      Update
                    </Button>
                  </Spin>
                )}
              </Drawer>
            </Content>
          </Col>
        </Row>
      </Content>
      {isLoading ? (
        <Content className="bg-white mb-3">
          <Skeleton
            active
            paragraph={{
              rows: 6,
            }}
            className="p-3"
          ></Skeleton>
          {/* <SkeletonComponent Layout="layout1" /> */}
        </Content>
      ) : isNetworkError ? (
        <Layout className="p-0 text-center mb-3 bg-[#F4F4F4]">
          <h5>
            Your's back-end server/services seems to be down, please start your
            server/services and try again.
          </h5>
        </Layout>
      ) : (
        <Content>
          <Content className="px-3">
            <DmTabAntDesign
              tabData={storeTabData}
              handleTabChangeFunction={handleTabChangeStore}
              activeKey={
                searchParams.get("tab") ? searchParams.get("tab") : "0"
              }
              tabType={"line"}
              tabBarPosition={"bottom"}
            />
          </Content>
          <Content>
            <DynamicTable tableComponentData={tablePropsData} />
          </Content>
        </Content>
      )}
    </Layout>
  );
};

export default Stores;
