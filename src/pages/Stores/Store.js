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
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import {
  useLocation,
  Link,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
//! Import user defined components
import DmTabAntDesign from "../../components/DmTabAntDesign/DmTabAntDesign";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import Status from "./Status";
import DmPagination from "../../components/DmPagination/DmPagination";
import { usePageTitle } from "../../hooks/usePageTitle";
const { Content } = Layout;
const { Title } = Typography;
//! Get all required details from .env file
const storeAPI = process.env.REACT_APP_STORE_API;
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);
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
  usePageTitle("Admin Portal - Store");
  const params = useParams();
  const navigate = useNavigate();
  const search = useLocation().search;
  const currentPage = new URLSearchParams(search).get("page");
  const currentCount = new URLSearchParams(search).get("count");
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
  const [isPaginationDataLoaded, setIsPaginationDataLoaded] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  // const [currentPage, setCurrentPage] = useState(
  //   params.page ? params.page.slice(5, params.page.length) : 1
  // );
  // const [currentCount, setCurrentCount] = useState(
  //   params.count ? params.count.slice(6, params.count.length) : 20
  // );
  const [countForStore, setCountForStore] = useState();

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
      sorter: (name1, name2) => name1.name.localeCompare(name2.name),
      sortDirections: ["descend", "ascend"],
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
            tabId={tab_id}
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
          <EditOutlined
            className="app-edit-icon font-bold text-black flex justify-content-end pr-6"
            onClick={() => {
              showEditDrawer(record.id);
            }}
          />
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
    console.log("status", status);
    // setSearchParams({
    //   tab: status,
    // });
    // if (tab_id === status) {
    //   if (currentPage && currentCount) {
    //     navigate(
    //       `/dashboard/store?tab=${tab_id}&page=${currentPage}&count=${currentCount}`
    //     );
    //   } else {
    //     navigate(`/dashboard/store?tab=${status}`);
    //   }
    // } else {
    //   navigate(`/dashboard/store?tab=${status}`);
    // }
    setSearchParams({
      tab: status,
      page: parseInt(searchParams.get("page"))
        ? parseInt(searchParams.get("page"))
        : 1,
      limit: parseInt(searchParams.get("limit"))
        ? parseInt(searchParams.get("limit"))
        : pageLimit,
    });
    // if (status === "0") {
    //   tableStoreData(storeApiData);
    // } else if (status === "1") {
    //   tableStoreData(
    //     storeApiData.filter((element) => element.status == status)
    //   );
    // } else if (status === "2") {
    //   tableStoreData(
    //     storeApiData.filter((element) => element.status == status)
    //   );
    // }
  };
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
    tableStoreData(storeApiData);
  }, [storeApiData]);
  // useEffect(() => {
  //   tableStoreData(storeApiData);
  // }, [storeApiData]);
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
    setInValidEditName(false);
  };
  const onClose = () => {
    setOpen(false);
    setName("");
  };
  //!get call for stores
  const getStoreApi = (pageNumber, pageLimit, storeStatus) => {
    // setIsLoading(true);
    axios
      .get(storeAPI, {
        params: {
          // store_id: parseInt(storeId),
          "page-number": pageNumber,
          "page-limit": pageLimit,
          status: storeStatus,
        },
      })
      .then(function (response) {
        setIsNetworkError(false);
        setIsLoading(false);
        console.log(
          "Server Response from getStoreApi Function: ",
          response.data.data
        );
        // setStoreApiData(response.data.data);
        //TODO: Remove line 303,304 and setStoreApiData(response.data)
        // let allStoresData = response.data;
        // allStoresData = { ...allStoresData, count: 22 };
        setStoreApiData(response.data.data);
        setIsPaginationDataLoaded(false);
        setCountForStore(response.data.count);
        // console.log("hii",response.data.count)
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkError(true);
        console.log("Server error from getStoreApi Function ", error.response);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
          // setErrorMessage(error.response)
        }
        if (error.response.data.message === "That page contains no results") {
          setSearchParams({
            tab: parseInt(searchParams.get("tab")),
            page: 1,
            limit: parseInt(searchParams.get("limit")),
          });
        }
      });
  };
  // useEffect(() => {
  //   getStoreApi();
  //   window.scrollTo(0, 0);
  // }, [currentCount, currentPage]);
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
        if (error.response) {
          toast(
            error &&
              error.response &&
              error.response.data &&
              error.response.data.message,
            {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
            }
          );
        } else {
          toast("Something Went Wrong", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
        console.log(error.response);
        setIsUpLoading(false);
        // setInValidName(true)
        // onClose();
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };
  //!put call for stores
  const editStoreData = () => {
    const putObject = {
      name: editName,
    };
    setIsUpLoading(true);
    console.log("editStoreData() Endpoint:", storeAPI, putObject);
    console.log("editStoreData() putBody:", putObject);
    axios
      .put(storeAPI, putObject, {
        params: {
          store_id: parseInt(storeEditId),
        },
      })
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
        if (response.status === 200 || response.status === 201) {
          toast("Store updated successfully! ", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
        setIsUpLoading(false);
        if (error.response) {
          toast(
            error &&
              error.response &&
              error.response.data &&
              error.response.data.message,
            {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
            }
          );
        } else {
          toast("Something Went Wrong", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
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
  // useEffect(() => {
  //   if (currentPage && currentCount) {
  //     getStoreApi(parseInt(currentPage), parseInt(currentCount));
  //   } else {
  //     getStoreApi(1, pageLimit);
  //   }
  //   window.scrollTo(0, 0);
  // }, [currentCount, currentPage]);

  useEffect(() => {
    getStoreApi(
      searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      searchParams.get("limit")
        ? parseInt(searchParams.get("limit"))
        : pageLimit,
      parseInt(searchParams.get("tab")) &&
        parseInt(searchParams.get("tab")) <= 2
        ? parseInt(searchParams.get("tab"))
        : ""
    );
    window.scrollTo(0, 0);
  }, [searchParams]);
  // const handlePageNumberChange = (page, pageSize) => {
  //   if (page === 1) {
  //     if (pageSize != 20) {
  //       navigate(`/dashboard/store?tab=${tab_id}&page=${page}`);
  //     } else {
  //       navigate("/dashboard/store");
  //     }
  //   } else {
  //     navigate(`/dashboard/store?page=${page}`);
  //   }
  //   navigate(0);
  // };

  const handlePageNumberChange = (page, pageSize) => {
    setSearchParams({
      tab: searchParams.get("tab"),
      page: parseInt(page) ? parseInt(page) : 1,
      limit: parseInt(pageSize) ? parseInt(pageSize) : pageLimit,
    });
    // navigate(`/dashboard/store?tab=${tab_id}&page=${page}&count=${pageSize}`);
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
              <Button className="app-btn-primary" onClick={showAddDrawer}>
                Add Store
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
                      maxLength={255}
                      className={`${
                        inValidName
                          ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-4"
                          : "mb-4"
                      }`}
                      onChange={(e) => {
                        setName(e.target.value);
                        setInValidName(false);
                      }}
                    />
                    <Button
                      className="app-btn-primary"
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
                          ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 mb-4"
                          : "mb-4"
                      }`}
                      maxLength={255}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setInValidEditName(false);
                      }}
                    />
                    <Button
                      className="app-btn-primary"
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
            {errorMessage
              ? errorMessage
              : "Your's back-end server/services seems to be down, please start your server/services and try again."}
          </h5>
        </Layout>
      ) : (
        <Content>
          <Content className="px-3">
            <DmTabAntDesign
              tabData={storeTabData}
              handleTabChangeFunction={handleTabChangeStore}
              activeKey={
                // searchParams.get("tab") ? searchParams.get("tab") : "0"
                String(tab_id)
              }
              tabType={"line"}
              tabBarPosition={"top"}
            />
          </Content>
          <Content>
            <DynamicTable tableComponentData={tablePropsData} />
          </Content>
          {countForStore && countForStore >= pageLimit ? (
            <Content className=" grid justify-items-end">
              <DmPagination
                currentPage={
                  parseInt(searchParams.get("page"))
                    ? parseInt(searchParams.get("page"))
                    : 1
                }
                totalItemsCount={countForStore}
                defaultPageSize={pageLimit}
                pageSize={
                  parseInt(searchParams.get("limit"))
                    ? parseInt(searchParams.get("limit"))
                    : pageLimit
                }
                handlePageNumberChange={handlePageNumberChange}
                showSizeChanger={true}
                showTotal={true}
              />
            </Content>
          ) : null}
        </Content>
      )}
    </Layout>
  );
};
export default Stores;
