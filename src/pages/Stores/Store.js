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
import validator from "validator";
import {
  MdInfo,
  MdStore,
  MdBusiness,
  MdDomainDisabled,
  MdEdit,
  MdSettings,
  MdDelete,
} from "react-icons/md";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import { useTranslation } from "react-i18next";
//! Import user defined components
import Highlighter from "react-highlight-words";
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
const titleMinLength = process.env.REACT_APP_TITLE_MIN_LENGTH;
const titleMaxLength = process.env.REACT_APP_TITLE_MAX_LENGTH;
const emailMinLength = process.env.REACT_APP_DESCRIPTION_MIN_LENGTH;
const emailMaxLength = process.env.REACT_APP_DESCRIPTION_MAX_LENGTH;
const passwordMinLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH;
const passwordMaxLength = process.env.REACT_APP_PASSWORD_MAX_LENGTH;

const Stores = () => {
  const authorizationHeader = useAuthorization();
  const { t } = useTranslation();
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
  const [showStoreErrorMessage, setShowStoreErrorMessage] = useState(false);
  const [onChangeValues, setOnChangeValues] = useState(false);
  const [onChangeEditValues, setOnChangeEditValues] = useState(false);
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
      tabIcon: <MdStore className="!text-2xl !text-[#FCC32A] " />,
      tabTitle: (
        <div className="flex flex-row">
          <div className="!font-medium">{t("stores:All")}</div>
          <div className="rounded-full bg-purple-100 ml-2 px-2  flex justify-center !font-medium">
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
          <div className="">{t("stores:Active")}</div>
          <div className="rounded-full bg-purple-100 ml-2 px-2 flex justify-center ">
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
          <div className="">{t("stores:Inactive")}</div>
          <div className="rounded-full bg-purple-100 ml-2 px-2 flex justify-center ">
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
      title: `${t("stores:Name")}`,
      dataIndex: "name",
      key: "name",
      width: "30%",
      ellipsis: true,
      // sorter: (name1, name2) => name1.name.localeCompare(name2.name),
      // sortDirections: ["descend", "ascend"],
      // showSorterTooltip: true,
      render: (text, record) => {
        return (
          <Tooltip title={record.name}>
            <Text className="max-w-xs" ellipsis={{ tooltip: record.name }}>
              {record.name}
            </Text>
          </Tooltip>
        );
        // <>{record.name}</>;
      },
      // ...getColumnSearchProps("name"),
    },
    {
      title: `${t("stores:Status")}`,
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
      title: `${t("stores:Created-Date-And-Time")}`,
      dataIndex: "created_on",
      key: "created_on",
      width: "30%",
      render: (text, record) => {
        return <>{new Date(record.created_on).toLocaleString()}</>;
      },
    },
    {
      title: `${t("stores:Action")}`,
      dataIndex: "",
      key: "",
      width: "12%",
      render: (text, record) => {
        return (
          <Content className="whitespace-nowrap flex align-middle">
            <Tooltip title={t("stores:Edit-Store")}>
              <MdEdit
                className=" !text-xl cursor-pointer"
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
              <Tooltip title={t("stores:Store-Settings")}>
                <MdSettings className=" text-black !text-xl ml-4" />
              </Tooltip>
            </Link>

            {record.status === "InActive" ? (
              <Tooltip title={t("stores:Delete-Store")}>
                <MdDelete
                  className=" !text-[#A00A18] !text-xl ml-4 cursor-pointer"
                  onClick={() => {
                    openDeleteModal(record.id);
                  }}
                />
              </Tooltip>
            ) : null}
          </Content>
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
    setOnChangeValues(false);
    setShowStoreErrorMessage(false);
  };
  //!edit drawer
  const showEditDrawer = (id) => {
    console.log("storerecordid", id);
    setOnChangeEditValues(false);
    setStoreEditId(id);
    setOpen(true);
    setDrawerAction("put");
    setEditName(
      storeApiData &&
        storeApiData.length > 0 &&
        storeApiData.filter((element) => element.store_uuid === id)[0].name
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
    if (
      (storeEmail.trim() === "" ||
        storeEmail.trim() === null ||
        storeEmail.trim() === undefined) &&
      (storeUserName.trim() === "" ||
        storeUserName.trim() === null ||
        storeUserName.trim() === undefined) &&
      (storePassword.trim() === "" ||
        storePassword.trim() === null ||
        storePassword.trim() === undefined)
    ) {
      setInValidEmail(true);
      setInValidUserName(true);
      setInValidPassword(true);
      toast(`${t("Please provide values for the mandatory fields")}`, {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
      if (
        name.trim() === "" ||
        name.trim() === null ||
        name.trim() === undefined
      ) {
        setInValidName(true);
      }
    } else {
      let count = 4;
      if (
        name.trim() === "" ||
        name.trim() === null ||
        name.trim() === undefined
      ) {
        setInValidName(true);
      }
      // if (
      //   name.trim() === "" ||
      //   name.trim() === null ||
      //   name.trim() === undefined
      // ) {
      //   setInValidName(true);
      //   count--;
      //   toast(`${t("stores:Please-enter-the-store-name")}`, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //     autoClose: 10000,
      //   });
      // }
      // const patternName = /^[A-Za-z]+$/;
      if (
        name &&
        validator.isLength(name.trim(), {
          min: titleMinLength,
          max: titleMaxLength,
        }) === false
      ) {
        setInValidName(true);
        count--;
        toast(
          `Store name must contain minimum of ${titleMinLength}, maximum of ${titleMaxLength} characters`,
          {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          }
        );
      }

      if (
        (storeEmail && validator.isEmail(storeEmail) === false) ||
        validator.isLength(storeEmail.trim(), {
          min: emailMinLength,
          max: emailMaxLength,
        }) === false
      ) {
        setInValidEmail(true);
        count--;
        toast("Please enter valid email", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        });
      }

      // const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{12,50}$/i;
      // if (storeEmail && regex.test(storeEmail.trim()) === false) {
      //   count--;
      //   setInValidEmail(true);
      //   toast(`${t("stores:Please-enter-the-valid-email-address")}`, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //     autoClose: 10000,
      //   });
      // }
      // if (
      //   storeEmail.trim() === "" ||
      //   storeEmail.trim() === null ||
      //   storeEmail.trim() === undefined
      // ) {
      //   count--;
      //   setInValidEmail(true);
      //   toast(`${t("stores:Please-enter-the-valid-email-address")}`, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //     autoClose: 10000,
      //   });
      // }
      // if (
      //   storeUserName.trim() === "" ||
      //   storeUserName.trim() === null ||
      //   storeUserName.trim() === undefined
      // ) {
      //   setInValidUserName(true);
      //   count--;
      //   toast(`${t("stores:Please-enter-the-username")}`, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //     autoClose: 10000,
      //   });
      // }
      // /^[a-zA-Z0-9_ ]{6,15}$/
      // const userRegex = /^[A-Za-z0-9_\- ]+$/;
      // if (storeUserName && userRegex.test(storeUserName.trim()) === false) {
      //   count--;
      //   setInValidUserName(true);
      //   toast(`${t("stores:Validation-Error-Message2")}`, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //     autoClose: 10000,
      //   });
      // }

      if (
        storeUserName &&
        validator.isLength(storeUserName.trim(), {
          min: titleMinLength,
          max: titleMaxLength,
        }) === false
      ) {
        setInValidUserName(true);
        count--;
        toast(
          `Username must contain minimum of ${titleMinLength}, maximum of ${titleMaxLength} characters`,
          {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          }
        );
      }

      // if (
      //   storePassword &&
      //   validator.isLength(storePassword.trim(), {
      //     min: passwordMinLength,
      //     max: passwordMaxLength,
      //   }) === false
      // ) {
      //   setInValidPassword(true);
      //   count--;
      //   toast(
      //     `Password must contain minimum of ${passwordMinLength}, maximum of ${passwordMaxLength} characters`,
      //     {
      //       position: toast.POSITION.TOP_RIGHT,
      //       type: "error",
      //       autoClose: 10000,
      //     }
      //   );
      // }

      // if (storeUserName && storeUserName.length < 6) {
      //   setInValidUserName(true);
      //   count--;
      //   toast("Username must contain minimum 6 characters", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //   });
      // }
      // if (
      //   storePassword.trim() === "" ||
      //   storePassword.trim() === null ||
      //   storePassword.trim() === undefined
      // ) {
      //   setInValidPassword(true);
      //   count--;
      //   toast(`${t("stores:Please-enter-the-password")}`, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //     autoClose: 10000,
      //   });
      // }
      const pattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_%*?&])[A-Za-z\d@$!_%*?&]{6,15}$/;
      const isValidPassword = pattern.test(storePassword);

      if (storePassword && pattern.test(storePassword) === false) {
        setInValidPassword(true);
        count--;
        toast(`${t("stores:Validation-Error-Message1")}`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        });
      }
      // if (storePassword && storePassword.length < 6) {
      //   setInValidPassword(true);
      //   toast("Password must contain minimum 6 characters", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //   });
      // }
      if (
        count === 4 &&
        !showStoreErrorMessage
        // name !== "" &&
        // storeEmail !== "" &&
        // storeUserName !== "" &&
        // storePassword !== ""
      ) {
        saveStoreData();
      }
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
        toast(`${t("stores:Store-created-successfully")}`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
          autoClose: 10000,
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
        setIsUpLoading(false);
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          toast(`${t("common:Something-Went-Wrong")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
        console.log("Error respose from the store post call", error.response);
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
        setIsUpLoading(false);
        let copyofStoreAPIData = [...storeApiData];
        copyofStoreAPIData.forEach((obj) => {
          if (obj.id === response.data.id) {
            obj.name = response.data.name;
          }
        });
        setStoreApiData(copyofStoreAPIData);
        setServerStoreName(response.data.name);
        onClose();
        if (response.status === 200 || response.status === 201) {
          toast(`${t("stores:Store-updated-successfully")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
        }
      })
      .catch((error) => {
        setIsUpLoading(false);
        if (error.response.status === 400) {
          toast(`${t("stores:Please-enter-the-valid-store-name")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
          // toast(`${error.response.data.message.name}`, {
          //   position: toast.POSITION.TOP_RIGHT,
          //   type: "error",
          //   autoClose: 10000,
          // });
          // toast(`${error.response.data.message.name}`, {
          //   position: toast.POSITION.TOP_RIGHT,
          //   type: "error",
          //   autoClose: 10000,
          // });
        } else {
          toast(`${t("common:Something-Went-Wrong")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
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
      toast(`${t("stores:Please-enter-the-store-name")}`, {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      editName &&
      validator.isLength(editName.trim(), {
        min: titleMinLength,
        max: titleMaxLength,
      }) === false
    ) {
      setInValidEditName(true);
      count--;
      toast(
        `Store name must contain minimum of ${titleMinLength}, maximum of ${titleMaxLength} characters`,
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        }
      );
    } else if (editName === serverStoreName) {
      toast(`${t("common:No-Changes-Detected")}`, {
        position: toast.POSITION.TOP_RIGHT,
        type: "info",
        autoClose: 10000,
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
          toast(`${t("stores:Store-deleted-successfully")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
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
            autoClose: 10000,
          });
        } else {
          toast(`${t("common:Something-Went-Wrong")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
      });
  };

  return (
    <Content className="">
      <StoreModal
        isVisible={isDeleteStoreModalOpen}
        okButtonText={"Yes"}
        cancelButtonText={"Cancel"}
        title={"Warning"}
        okCallback={() => removeStore()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={isStoreDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{t("stores:Confirm-Store-Deletion")}</p>
            <p>{t("stores:Store-Deletion-Confirmation-Message")}</p>
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
            <>
              <Content className="flex">
                <Content className="!inline-block text-left self-center pr-3">
                  <Title level={3} className="!font-normal">
                    {t("stores:Stores")}
                  </Title>
                </Content>
                <Content className="!inline-block text-right self-center">
                  <Button className="app-btn-primary" onClick={showAddDrawer}>
                    {t("stores:Add-Store")}
                  </Button>
                  <Drawer
                    title={
                      drawerAction && drawerAction === "post"
                        ? `${t("stores:Add-Store")}`
                        : `${t("stores:Edit-Store")}`
                    }
                    placement="right"
                    onClose={onClose}
                    open={open}
                    width={"40%"}
                  >
                    {drawerAction && drawerAction === "post" ? (
                      <>
                        <Row>
                          <Col span={1} className="flex items-start mt-[3px]">
                            <MdInfo className="!text-[#7d3192] text-[16px]" />
                          </Col>
                          <Col span={23} className="align-center mb-3">
                            <Text className=" mr-1 font-bold">
                              {" "}
                              {t("stores:Note")}:{" "}
                            </Text>
                            <Text>{t("stores:Add-Store-Description")}</Text>
                          </Col>
                        </Row>
                        <Spin
                          tip={t("stores:Please-wait")}
                          size="large"
                          spinning={isUpLoading}
                        >
                          <span className="text-red-600 text-sm">*</span>
                          <label className="text-[13px] mb-2 ml-1">
                            {t("stores:Store-Name")}
                            {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                          </label>
                          <Input
                            placeholder={t("stores:Enter-Store-Name")}
                            value={name}
                            minLength={titleMinLength}
                            maxLength={titleMaxLength}
                            className={`${
                              inValidName
                                ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-[0.5rem]"
                                : "mb-[0.5rem]"
                            }`}
                            onChange={(e) => {
                              const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
                              if (
                                e.target.value !== "" &&
                                validator.matches(
                                  e.target.value,
                                  alphaWithSpacesRegex
                                )
                              ) {
                                // setShowStoreErrorMessage(true);
                                setName(e.target.value);
                                setOnChangeValues(true);
                              } else if (e.target.value === "") {
                                setName(e.target.value);
                                // setShowStoreErrorMessage(false);
                                setOnChangeValues(true);
                              }
                              setInValidName(false);
                            }}
                          />

                          {/* {showStoreErrorMessage === true ? (
                            <p className="text-red-600 text-sm">
                              {t(
                                "stores:Please-enter-alphabetic-characters-only"
                              )}
                            </p>
                          ) : null} */}

                          <Divider orientation="left" orientationMargin="0">
                            {t("stores:Store-Administrator-Details")}
                          </Divider>
                          <span className="text-red-600 text-sm">*</span>
                          <label className="text-[13px] mb-2 ml-1">
                            {t("stores:Email")}
                          </label>
                          <Input
                            placeholder={t("stores:Enter-Email")}
                            value={storeEmail}
                            minLength={emailMinLength}
                            maxLength={emailMaxLength}
                            className={`${
                              inValidEmail
                                ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-6"
                                : "mb-6"
                            }`}
                            onChange={(e) => {
                              setStoreEmail(e.target.value);
                              setInValidEmail(false);
                              setOnChangeValues(true);
                            }}
                          />
                          <span className="text-red-600 text-sm">*</span>
                          <label className="text-[13px] mb-2 ml-1">
                            {t("stores:Username")}
                          </label>
                          <Input
                            placeholder={t("stores:Enter-Username")}
                            value={storeUserName}
                            minLength={titleMinLength}
                            maxLength={titleMaxLength}
                            // suffix={`${storeUserName.length}/15`}
                            className={`${
                              inValidUserName
                                ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-6"
                                : "mb-6"
                            }`}
                            prefix={
                              <UserOutlined className="site-form-item-icon" />
                            }
                            onChange={(e) => {
                              const regex = /^[A-Za-z0-9_\- ]+$/;
                              if (
                                e.target.value !== "" &&
                                validator.matches(e.target.value, regex)
                              ) {
                                setInValidUserName(false);
                                setStoreUserName(e.target.value);
                                setOnChangeValues(true);
                              } else if (e.target.value === "") {
                                setStoreUserName(e.target.value);
                                setOnChangeValues(true);
                              }
                              setOnChangeValues(true);
                            }}
                          />
                          <span className="text-red-600 text-sm">*</span>
                          <label className="text-[13px] mb-2 ml-1">
                            {t("stores:Password")}
                          </label>
                          <Input.Password
                            placeholder={t("stores:Enter-Password")}
                            value={storePassword}
                            minLength={passwordMinLength}
                            maxLength={passwordMaxLength}
                            className={`${
                              inValidPassword
                                ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-10"
                                : "mb-10"
                            }`}
                            onChange={(e) => {
                              const value = e.target.value;
                              // if (value && value.length < 15) {
                              setStorePassword(e.target.value);
                              setInValidPassword(false);
                              setOnChangeValues(true);
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
                            onBlur={() => {
                              const trimmed = storePassword.trim();
                              setStorePassword(trimmed);
                            }}
                          />
                          <Button
                            className={
                              onChangeValues ? "app-btn-primary" : "!opacity-75"
                            }
                            disabled={!onChangeValues}
                            onClick={() => {
                              validateStorePostField();
                            }}
                          >
                            {t("common:Save")}
                          </Button>
                        </Spin>
                      </>
                    ) : (
                      <>
                        <Row>
                          <Col span={1} className="flex items-start mt-[3px]">
                            <MdInfo className="!text-[#7d3192] text-[16px]" />
                          </Col>
                          <Col span={23} className="align-center mb-3">
                            <Text className=" mr-1 font-bold">
                              {" "}
                              {t("stores:Note")}:
                            </Text>
                            <Text>{t("stores:Edit-Store-Description")}</Text>
                          </Col>
                        </Row>
                        <Spin
                          tip={t("stores:Please-wait")}
                          size="large"
                          spinning={isUpLoading}
                        >
                          <span className="text-red-600 text-sm">*</span>
                          <label className="text-[13px] mb-2 ml-1">
                            {t("stores:Store-Name")}
                            {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                          </label>
                          <Input
                            value={editName}
                            placeholder={t("stores:Enter-Store-Name")}
                            className={`${
                              inValidEditName
                                ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 mb-6"
                                : "mb-6"
                            }`}
                            minLength={titleMinLength}
                            maxLength={titleMaxLength}
                            onChange={(e) => {
                              // const { value } = e.target;
                              // const regex = /^[a-zA-Z0-9]*$/; // only allow letters and numbers
                              // if (regex.test(value)) {
                              //   setEditName(e.target.value);
                              // }
                              const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
                              if (
                                e.target.value !== "" &&
                                validator.matches(
                                  e.target.value,
                                  alphaWithSpacesRegex
                                )
                              ) {
                                // setShowStoreErrorMessage(true);
                                setEditName(e.target.value);
                                setOnChangeEditValues(true);
                                setInValidEditName(false);
                              } else if (e.target.value === "") {
                                setEditName(e.target.value);
                                // setShowStoreErrorMessage(false);
                                setOnChangeEditValues(true);
                              }
                            }}
                          />
                          <Divider orientation="left" orientationMargin="0">
                            {t("stores:Store-Administrator-Details")}
                          </Divider>
                          <span className="text-red-600 text-sm">*</span>
                          <label className="text-[13px] mb-2 ml-1">
                            {" "}
                            {t("stores:Email")}
                          </label>
                          <Input
                            placeholder={t("stores:Enter-Email")}
                            value={storeEditEmail}
                            maxLength={30}
                            disabled
                            className="mb-6"
                            onChange={(e) => {
                              // handleEmailChange(e);
                              const { value } = e.target;
                              const regex = /^[a-zA-Z0-9_.-@]*$/;
                              if (regex.test(value)) {
                                setStoreEditEmail(value);
                                setOnChangeEditValues(true);
                              } else {
                                toast(
                                  `${t(
                                    "stores:Please enter the valid email address"
                                  )}`,
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
                            {t("stores:Username")}
                          </label>
                          <Input
                            placeholder={t("stores:Enter-Username")}
                            value={storeEditUserName}
                            maxLength={10}
                            className="mb-6"
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
                                setOnChangeEditValues(true);
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
                            {t("stores:Password")}
                            {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                          </label>
                          <Input.Password
                            placeholder={t("stores:Enter-Password")}
                            value={storeEditPassword}
                            maxLength={6}
                            disabled
                            className="mb-10"
                            onChange={(e) => {
                              setStoreEditPassword(e.target.value);
                              setOnChangeEditValues(true);
                            }}
                          />
                          <Button
                            className={
                              onChangeEditValues
                                ? "app-btn-primary"
                                : "!opacity-75"
                            }
                            onClick={() => {
                              validateStorePutField();
                            }}
                            disabled={!onChangeEditValues}
                          >
                            {t("common:Update")}
                          </Button>
                        </Spin>
                      </>
                    )}
                  </Drawer>
                </Content>
              </Content>
              <Content className="!h-7">
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
            </>
          }
        />
      </Content>
      <Content className="!p-3 !mt-[10rem] ">
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
              {/* {errorMessage
                ? errorMessage :*/}
              Please wait while we validate your information. If this process
              persists, please consider logging out and logging back in
              {/* } */}
            </p>
          </Layout>
        ) : (
          <Content className="">
            {/* <Content className="px-3">
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
            </Content> */}
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
