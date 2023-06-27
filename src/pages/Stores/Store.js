import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Input,
  Layout,
  Row,
  Skeleton,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MdInfo } from "react-icons/md";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
//! Import user defined components
import Highlighter from "react-highlight-words";
import { MdBusiness, MdDomainDisabled } from "react-icons/md";
import DmPagination from "../../components/DmPagination/DmPagination";
import DmTabAntDesign from "../../components/DmTabAntDesign/DmTabAntDesign";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import StoreModal from "../../components/storeModal/StoreModal";
import useAuthorization from "../../hooks/useAuthorization";
import { usePageTitle } from "../../hooks/usePageTitle";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import Status from "./Status";

const { Content } = Layout;
const { Title, Text } = Typography;
//! Get all required details from .env file
const storeAPI = process.env.REACT_APP_STORE_API;
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);
//! tab data

const Stores = () => {
  const authorizationHeader = useAuthorization();

  usePageTitle("Admin Portal - Store");
  const params = useParams();
  const navigate = useNavigate();
  const search = useLocation().search;
  const currentPage = new URLSearchParams(search).get("page");
  const currentCount = new URLSearchParams(search).get("count");
  // const store_id = new URLSearchParams(search).get("store_id");
  const tab_id = new URLSearchParams(search).get("tab");
  const page_number = new URLSearchParams(search).get("page");
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
  const [storeEmail, setStoreEmail] = useState("");
  const [storeUserName, setStoreUserName] = useState("");
  const [storePassword, setStorePassword] = useState("");
  const [storeEditEmail, setStoreEditEmail] = useState("");
  const [storeEditUserName, setStoreEditUserName] = useState("");
  const [storeEditPassword, setStoreEditPassword] = useState("");
  const [inValidEmail, setInValidEmail] = useState(false);
  const [inValidUserName, setInValidUserName] = useState(false);
  const [inValidPassword, setInValidPassword] = useState(false);
  const [isDeleteStoreModalOpen, setIsDeleteStoreModalOpen] = useState(false);
  const [deleteStoreID, setDeleteStoreID] = useState("");
  const [activeCount, setActiveCount] = useState("");

  // const [currentPage, setCurrentPage] = useState(
  //   params.page ? params.page.slice(5, params.page.length) : 1
  // );
  // const [currentCount, setCurrentCount] = useState(
  //   params.count ? params.count.slice(6, params.count.length) : 20
  // );
  const [countForStore, setCountForStore] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isStoreDeleting, setIsStoreDeleting] = useState(false);
  const [storeApiStatus, setStoreApiStatus] = useState();
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const storeTabData = [
    {
      tabId: 0,
      tabIcon: <MdBusiness className="!text-2xl " />,
      tabTitle: (
        <div className="flex flex-row">
          <Text>All</Text>
          <div className="rounded-full bg-sky-100 ml-2">
            {activeCount && activeCount.totalStores}
          </div>{" "}
        </div>
      ),
    },
    {
      tabId: 1,
      tabIcon: <MdBusiness className="!text-2xl " />,
      tabTitle: (
        <div className="flex flex-row">
          <Text>Active</Text>
          <div className="rounded-full bg-sky-100 ml-2">
            {activeCount && activeCount.activeStores}
          </div>{" "}
        </div>
      ),
    },
    {
      tabId: 2,
      tabIcon: <MdDomainDisabled className="!text-2xl " />,
      tabTitle: (
        <div className="flex flex-row">
          <Text>Inactive</Text>
          <div className="rounded-full bg-sky-100 ml-2">
            {activeCount && activeCount.inactiveStores}
          </div>{" "}
        </div>
      ),
    },
  ];

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            className="app-btn-primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //! table columns
  const StoreTableColumn = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    //   width: "8%",
    //   render: (text, record) => {
    //     return <>{record.id}</>;
    //   },
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (name1, name2) => name1.name.localeCompare(name2.name),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      render: (text, record) => {
        return <>{record.name}</>;
      },
      // ...getColumnSearchProps("name"),
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
            activeCount={activeCount}
            setActiveCount={setActiveCount}
          />
        );
      },
    },
    {
      title: "Created Date And Time",
      dataIndex: "created_on",
      key: "created_on",
      width: "30%",
      render: (text, record) => {
        return <>{new Date(record.created_on).toLocaleString()}</>;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: "12%",
      render: (text, record) => {
        return (
          <content className="whitespace-nowrap">
            <Tooltip title="Edit Store">
              <EditOutlined
                className="app-edit-icon font-bold text-black pr-6"
                onClick={() => {
                  showEditDrawer(record.id);
                }}
              />
            </Tooltip>

            <Link
              to={{
                pathname: "storesetting",
                search: `?id=${record.id}&page=${
                  searchParams.get("page") ? searchParams.get("page") : 1
                }&limit=${
                  searchParams.get("limit")
                    ? searchParams.get("limit")
                    : pageLimit
                }`,
              }}
              // className=" pl-[10px] font-semibold app-table-data-title"
            >
              <Tooltip title="Store Settings">
                <SettingOutlined
                  className="app-delete-icon pr-4  text-black"
                  style={{ fontSize: "16px", marginLeft: "5px" }}
                />
              </Tooltip>
            </Link>

            {record.status === "InActive" ? (
              <Tooltip title="Delete Store">
                <DeleteOutlined
                  className="app-delete-icon pr-4"
                  style={{ fontSize: "16px", marginLeft: "5px" }}
                  onClick={() => {
                    openDeleteModal(record.id);
                  }}
                />
              </Tooltip>
            ) : null}
          </content>
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
      page: 1,
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
        var storeId = element.store_uuid;
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
      // if (tab_id === "0" || tab_id === "1" || tab_id === "2") {
      //   handleTabChangeStore(tab_id);
      // } else {
      //   handleTabChangeStore("0");
      // }
      tableStoreData(storeApiData);
    }
  }, [storeApiData]);

  //! tablepropsData to render the table columns,data,pagination
  const tablePropsData = {
    table_header: StoreTableColumn,
    table_content: selectedTabTableContent,
    pagenationSettings: pagination,
    search_settings: {
      is_enabled: false,
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
    setInValidEmail(false);
    setInValidUserName(false);
    setInValidPassword(false);
  };
  //!edit drawer
  const showEditDrawer = (id) => {
    console.log("storerecordid", id);
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
    setStoreEmail("");
    setStorePassword("");
    setStoreUserName("");
  };

  //! opening the delete popup model
  const openDeleteModal = (id) => {
    setIsDeleteStoreModalOpen(true);
    setDeleteStoreID(id);
  };

  //! closing the delete popup model
  const closeDeleteModal = () => {
    setIsDeleteStoreModalOpen(false);
  };
  //!get call for stores
  const findByPageStoreApi = (pageNumber, pageLimit, storeStatus) => {
    // setIsLoading(true);
    // axios
    //   .get(
    //     storeAPI,
    //     {
    //       params: {
    //         // store_id: parseInt(storeId),
    //         "page-number": pageNumber,
    //         "page-limit": pageLimit,
    //         status: storeStatus ? storeStatus : null,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.findByPage(
      storeAPI,
      {
        status: storeStatus ? storeStatus : null,
      },
      pageNumber,
      pageLimit,
      false
    )
      .then(function (response) {
        setActiveCount({
          totalStores:
            response.data.active_stores + response.data.inactive_stores,
          activeStores: response.data.active_stores,
          inactiveStores: response.data.inactive_stores,
        });
        // setInactiveCount(response.data.inactive_stores);
        setIsNetworkError(false);
        setIsLoading(false);
        console.log(
          "Server Response from findByPageStoreApi Function: ",
          response.data.data
        );
        console.log("storeStatus", storeStatus);
        // setStoreApiData(response.data.data);
        //TODO: Remove line 303,304 and setStoreApiData(response.data)
        // let allStoresData = response.data;
        // allStoresData = { ...allStoresData, count: 22 };
        setStoreApiData(response.data.data);
        setIsPaginationDataLoaded(false);
        setCountForStore(response.data.count);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkError(true);
        console.log(
          "Server error from findByPageStoreApi Function ",
          error.response
        );

        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
        if (error && error.response === undefined) {
          setSearchParams({
            tab: parseInt(searchParams.get("tab")),
            page: 1,
            limit: parseInt(searchParams.get("limit")),
          });
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
  //!useEffect for getting the table in table without refreshing
  useEffect(() => {
    if (postData != null) {
      if (storeApiData.length < pageLimit) {
        const temp = [...storeApiData];
        temp.push(postData);
        setStoreApiData(temp);
      }
      let totalStoresCount = { ...activeCount };
      totalStoresCount["totalStores"] = activeCount.totalStores + 1;
      totalStoresCount["inactiveStores"] = activeCount.inactiveStores + 1;
      setActiveCount(totalStoresCount);
    }
  }, [postData]);
  //! validation for post call
  const validateStorePostField = () => {
    let count = 4;
    if (
      name.trim() === "" ||
      name.trim() === null ||
      name.trim() === undefined
    ) {
      setInValidName(true);
      count--;
      toast("Please enter the store name", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: false,
      });
    }
    // const patternName =/^[A-Za-z]+$/;
    // if (name && patternName.test(name.trim()) === false) {
    //   setInValidName(true);
    //   count--;
    //   toast("Please enter the valid  store name", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //     autoClose: false,
    //   });
    // }

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (storeEmail && regex.test(storeEmail.trim()) === false) {
      count--;
      setInValidEmail(true);
      toast("Please enter the valid email address", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: false,
      });
    }
    if (
      storeEmail.trim() === "" ||
      storeEmail.trim() === null ||
      storeEmail.trim() === undefined
    ) {
      count--;
      setInValidEmail(true);
      toast("Please enter the valid email address", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: false,
      });
    }
    if (
      storeUserName.trim() === "" ||
      storeUserName.trim() === null ||
      storeUserName.trim() === undefined
    ) {
      setInValidUserName(true);
      count--;
      toast("Please enter the username", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: false,
      });
    }
    const userRegex = /^[a-zA-Z0-9_ ]{6,15}$/;
    if (storeUserName && userRegex.test(storeUserName.trim()) === false) {
      count--;
      setInValidUserName(true);
      toast(
        "Username must contain a minimum of 6 characters and can only consist of alphabets, numbers, underscores, and hyphens",
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: false,
        }
      );
    }
    // if (storeUserName && storeUserName.length < 6) {
    //   setInValidUserName(true);
    //   count--;
    //   toast("Username must contain minimum 6 characters", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //   });
    // }
    if (
      storePassword.trim() === "" ||
      storePassword.trim() === null ||
      storePassword.trim() === undefined
    ) {
      setInValidPassword(true);
      count--;
      toast("Please enter the password", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: false,
      });
    }
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    if (storePassword && pattern.test(storePassword.trim()) === false) {
      setInValidPassword(true);
      count--;
      toast(
        "Password must contain a minimum of 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character",
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: false,
        }
      );
    }
    // if (storePassword && storePassword.length < 6) {
    //   setInValidPassword(true);
    //   toast("Password must contain minimum 6 characters", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //   });
    // }
    if (
      count === 4
      // name !== "" &&
      // storeEmail !== "" &&
      // storeUserName !== "" &&
      // storePassword !== ""
    ) {
      saveStoreData();
    }
  };
  //! post call for stores
  const saveStoreData = () => {
    const postBody = {
      name: name.trim(),
      username: storeUserName.trim(),
      email: storeEmail.trim(),
      password: storePassword.trim(),
    };
    setIsUpLoading(true);
    // axios
    //   .post(storeAPI, postBody, authorizationHeader)
    MarketplaceServices.save(storeAPI, postBody)
      .then((response) => {
        toast("Store created successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        setIsUpLoading(false);
        // window.location.reload(true);
        onClose();
        setName("");
        setStoreEmail("");
        setStoreUserName("");
        setStorePassword("");
        console.log("Server Success Response From stores", response.data);
        setPostData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          toast(`${error.response.data.name[0]}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: false,
          });
        }
        console.log("Error respose from the store post call", error.response);
        setIsUpLoading(false);
        // setInValidName(true)
        // onClose();
      });
  };
  //!put call for stores
  const updateStoreData = () => {
    const putObject = {
      name: editName,
    };
    setIsUpLoading(true);
    console.log("editStoreData() Endpoint:", storeAPI, putObject);
    console.log("editStoreData() putBody:", putObject);
    // axios
    //   .put(
    //     storeAPI,
    //     putObject,
    //     {
    //       params: {
    //         store_id: parseInt(storeEditId),
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.update(storeAPI, putObject, {
      store_id: storeEditId,
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
          toast("Store updated successfully ", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
        setIsUpLoading(false);
        if (error.response) {
          toast(`${error.response.data.message.name[0]}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: false,
          });
        }
      });
  };

  useEffect(() => {
    if (storeEditId) {
      var storeData =
        storeApiData &&
        storeApiData.length > 0 &&
        storeApiData.filter((element) => element.store_uuid === storeEditId);
      if (storeData && storeData.length > 0) {
        setEditName(storeData[0].name);
        // setStoreEditEmail(storeData[0].email);
        // setStoreEditUserName(storeData[0].username);
        // setStoreEditPassword(storeEditPassword[0].password);
        setServerStoreName(storeData[0].name);
      }
    }
  }, [storeEditId]);
  //! validation for put call
  const validateStorePutField = () => {
    if (editName === "" || editName === null || editName === undefined) {
      setInValidEditName(true);
      toast("Please enter the store name", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: false,
      });
    } else if (editName === serverStoreName) {
      toast("No changes were detected", {
        position: toast.POSITION.TOP_RIGHT,
        type: "info",
      });
    } else {
      updateStoreData();
    }
  };

  useEffect(() => {
    findByPageStoreApi(
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

  const handlePageNumberChange = (page, pageSize) => {
    // setSearchParams({
    //   tab: searchParams.get("tab"),
    //   page: parseInt(page) ? parseInt(page) : 1,
    //   limit: parseInt(pageSize) ? parseInt(pageSize) : pageLimit,
    // });
    setSearchParams({
      tab: tab_id === null ? "0" : tab_id,
      page: parseInt(page) ? parseInt(page) : 1,
      limit: parseInt(pageSize) ? parseInt(pageSize) : pageLimit,
    });
  };
  //!delete function of language
  const removeStore = () => {
    setIsStoreDeleting(true);
    MarketplaceServices.remove(storeAPI, { store_id: deleteStoreID })
      .then((response) => {
        console.log("response from delete===>", response, deleteStoreID);
        if (response.status === 200 || response.status === 201) {
          setIsDeleteStoreModalOpen(false);
          let removedData = storeApiData.filter(
            ({ store_uuid }) => store_uuid !== deleteStoreID
          );
          let storeStatus = storeApiData.filter(
            ({ store_uuid }) => store_uuid === deleteStoreID
          );
          if (storeStatus && storeStatus.length > 0) {
            let totalStoresCounts = { ...activeCount };
            if (storeStatus && storeStatus.status === 1) {
              totalStoresCounts["activeStores"] = activeCount.activeCount - 1;
              totalStoresCounts["totalStores"] = activeCount.totalStores - 1;
              setActiveCount(totalStoresCounts);
            } else {
              totalStoresCounts["inactiveStores"] =
                activeCount.inactiveStores - 1;
              totalStoresCounts["totalStores"] = activeCount.totalStores - 1;
              setActiveCount(totalStoresCounts);
            }
          }
          setStoreApiData(removedData);
          setCountForStore(countForStore - 1);
          toast("Store deleted successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
        // disabling spinner
        setIsStoreDeleting(false);
      })
      .catch((error) => {
        // disabling spinner
        setIsStoreDeleting(false);
        console.log("response from delete===>", error.response.data);
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: false,
          });
        }
      });
  };

  return (
    <Content className="">
      <StoreModal
        isVisible={isDeleteStoreModalOpen}
        okButtonText={"Ok"}
        cancelButtonText={"Cancel"}
        title={"Warning"}
        okCallback={() => removeStore()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={isStoreDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{`Confirm Store Deletion`}</p>
            <p>{`Are you sure you want to delete the store? This action cannot be undone`}</p>
          </div>
        }
      </StoreModal>
      <Content className="mb-3">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Stores", navigationPath: "", displayOrder: 2 },
          ]}
        />
        <HeaderForTitle
          title={
            <Content className="flex">
              <Content className="!inline-block text-left self-center pr-3">
                <Title level={3} className="!font-normal">
                  Stores
                </Title>
              </Content>
              <Content className="!inline-block text-right self-center">
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
                  width={"40%"}
                >
                  {drawerAction && drawerAction === "post" ? (
                    <>
                      <Row>
                        <Col span={1} className="flex items-start">
                          <MdInfo className="text-blue-400 text-[16px]" />
                        </Col>
                        <Col span={23} className="align-center mb-3">
                          <Text className=" mr-1 font-bold">Note: </Text>
                          <Text>
                            Please enter the store name and administration
                            details. These details will be used when signing
                            into the store portal.
                          </Text>
                        </Col>
                      </Row>
                      <Spin
                        tip="Please wait!"
                        size="large"
                        spinning={isUpLoading}
                      >
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">
                          Store Name
                          {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                        </label>
                        <Input
                          placeholder="Enter Store Name"
                          value={name}
                          maxLength={20}
                          className={`${
                            inValidName
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-2"
                              : "mb-2"
                          }`}
                          onChange={(e) => {
                            const patternName = /^[A-Za-z]+$/;
                            if (patternName.test(e.target.value) === false) {
                              setInValidName(true);
                              setName(e.target.value);
                              toast("Please enter alphabets only ", {
                                position: toast.POSITION.TOP_RIGHT,
                                type: "error",
                                autoClose: false,
                              });
                            } else {
                              setName(e.target.value);
                              setInValidName(false);
                            }
                          }}
                        />
                        <Divider orientation="left" orientationMargin="0">
                          Store Administrator Details
                        </Divider>
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">Email</label>
                        <Input
                          placeholder="Enter Email"
                          value={storeEmail}
                          maxLength={50}
                          className={`${
                            inValidEmail
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-4"
                              : "mb-4"
                          }`}
                          onChange={(e) => {
                            setStoreEmail(e.target.value);
                            setInValidEmail(false);
                          }}
                        />
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">
                          Username
                        </label>
                        <Input
                          placeholder="Enter Username"
                          value={storeUserName}
                          maxLength={15}
                          minLength={6}
                          suffix={`${storeUserName.length}/15`}
                          className={`${
                            inValidUserName
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-4"
                              : "mb-4"
                          }`}
                          prefix={
                            <UserOutlined className="site-form-item-icon" />
                          }
                          onChange={(e) => {
                            // const { value } = e.target;
                            // const regex = /^[a-zA-Z0-9_ ]*$/; // only allow letters and numbers
                            // if (regex.test(value)) {
                            setStoreUserName(e.target.value);
                            setInValidUserName(false);
                            // } else {
                            //   toast(
                            //     "Please enter only alphabets, numbers, underscore, and hyphen.",
                            //     {
                            //       position: toast.POSITION.TOP_RIGHT,
                            //       type: "warning",
                            //     }
                            //   );
                            // }
                          }}
                        />
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">
                          Password
                        </label>
                        <Input.Password
                          placeholder="Enter Password"
                          value={storePassword}
                          maxLength={15}
                          className={`${
                            inValidPassword
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-4"
                              : "mb-4"
                          }`}
                          onChange={(e) => {
                            const value = e.target.value;
                            // if (value && value.length < 15) {
                            setStorePassword(e.target.value);
                            setInValidPassword(false);
                            // }
                            // else if (value && value.length >= 15) {
                            //   toast(
                            //     "Password should allow only 15 characters",
                            //     {
                            //       position: toast.POSITION.TOP_RIGHT,
                            //       type: "warning",
                            //     }
                            //   );
                            // } else
                            if (e.target.value === "") {
                              setStorePassword(e.target.value);
                            }
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
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col span={1} className="flex items-start">
                          <MdInfo className="text-blue-400 text-[16px]" />
                        </Col>
                        <Col span={23} className="align-center mb-3">
                          <Text className=" mr-1 font-bold">Note: </Text>
                          <Text>
                            Store administrator's details cannot be edited. You
                            are permitted to only rename your store
                          </Text>
                        </Col>
                      </Row>
                      <Spin
                        tip="Please wait!"
                        size="large"
                        spinning={isUpLoading}
                      >
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">
                          Store Name
                          {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                        </label>
                        <Input
                          value={editName}
                          placeholder="Enter Store Name"
                          className={`${
                            inValidEditName
                              ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 mb-4"
                              : "mb-4"
                          }`}
                          maxLength={20}
                          onChange={(e) => {
                            // const { value } = e.target;
                            // const regex = /^[a-zA-Z0-9]*$/; // only allow letters and numbers
                            // if (regex.test(value)) {
                            //   setEditName(e.target.value);
                            // }
                            setEditName(e.target.value);
                            setInValidEditName(false);
                          }}
                        />
                        <Divider orientation="left" orientationMargin="0">
                          Store Administrator Details
                        </Divider>
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">Email</label>
                        <Input
                          placeholder="Enter Email"
                          value={storeEditEmail}
                          maxLength={30}
                          disabled
                          className="mb-4"
                          onChange={(e) => {
                            // handleEmailChange(e);
                            const { value } = e.target;
                            const regex = /^[a-zA-Z0-9_.-@]*$/;
                            if (regex.test(value)) {
                              setStoreEditEmail(value);
                            } else {
                              toast("Please provide valid email", {
                                position: toast.POSITION.TOP_RIGHT,
                                type: "warning",
                              });
                            }
                          }}
                        />
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">
                          Username
                        </label>
                        <Input
                          placeholder="Enter Username"
                          value={storeEditUserName}
                          maxLength={10}
                          className="mb-4"
                          prefix={
                            <UserOutlined className="site-form-item-icon" />
                          }
                          suffix={`${storeEditUserName.length}/10`}
                          disabled
                          onChange={(e) => {
                            const { value } = e.target;
                            const regex = /^[a-zA-Z0-9_-]*$/; // only allow letters and numbers
                            if (regex.test(value)) {
                              setStoreEditUserName(value);
                            } else {
                              toast(
                                "Please enter only alphabets, numbers, underscore, and hyphen.",
                                {
                                  position: toast.POSITION.TOP_RIGHT,
                                  type: "warning",
                                }
                              );
                            }
                          }}
                        />
                        <span className="text-red-600 text-sm">*</span>
                        <label className="text-[13px] mb-2 ml-1">
                          Password
                          {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                        </label>
                        <Input.Password
                          placeholder="Enter Password"
                          value={storeEditPassword}
                          maxLength={6}
                          disabled
                          className="mb-4"
                          onChange={(e) => {
                            setStoreEditPassword(e.target.value);
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
                    </>
                  )}
                </Drawer>
              </Content>
            </Content>
          }
        />
      </Content>
      <Content className="!p-3 mt-[10rem] !min-h-screen">
        {isLoading ? (
          <Content className="bg-white">
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
            {/* <p>Validation in Progress</p> */}
            <p>
              {errorMessage
                ? errorMessage
                : "Please wait while we validate your information. If this process persists, please consider logging out and logging back in"}
            </p>
          </Layout>
        ) : (
          <Content className="">
            <Content className="px-3">
              <DmTabAntDesign
                tabData={storeTabData}
                handleTabChangeFunction={handleTabChangeStore}
                activeKey={
                  // searchParams.get("tab") ? searchParams.get("tab") : "0"
                  tab_id === null ? "0" : String(tab_id)
                  // String(tab_id)
                }
                // totalItemsCount={countForStore}
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
      </Content>
    </Content>
  );
};
export default Stores;
