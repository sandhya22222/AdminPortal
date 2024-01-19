import { SearchOutlined, UserOutlined } from "@ant-design/icons";
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
  Radio,
  Tabs,
  Progress,
  InputNumber,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import validator from "validator";
import {
  MdInfo,
  MdStore,
  MdBusiness,
  MdDomainDisabled,
  MdSettings,
  MdPlusOne,
} from "react-icons/md";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "../../constants/media";
import { InfoCircleTwoTone } from "@ant-design/icons";
//! Import user defined components
import Highlighter from "react-highlight-words";
import DmPagination from "../../components/DmPagination/DmPagination";
import DmTabAntDesign from "../../components/DmTabAntDesign/DmTabAntDesign";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import StoreModal from "../../components/storeModal/StoreModal";
import { usePageTitle } from "../../hooks/usePageTitle";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import Status from "./Status";
import MarketplaceToaster from "../../util/marketplaceToaster";
import util from "../../util/common";
import { Table } from "reactstrap";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { validatePositiveNumber } from "../../util/validation";

const { Content } = Layout;
const { Title, Text } = Typography;
//! Get all required details from .env file
const storeAPI = process.env.REACT_APP_STORE_API;
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);
const titleMinLength = process.env.REACT_APP_TITLE_MIN_LENGTH;
const titleMaxLength = process.env.REACT_APP_TITLE_MAX_LENGTH;
const emailMinLength = process.env.REACT_APP_EMAIL_MIN_LENGTH;
const emailMaxLength = process.env.REACT_APP_EMAIL_MAX_LENGTH;
const passwordMinLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH;
const passwordMaxLength = process.env.REACT_APP_PASSWORD_MAX_LENGTH;
const storeNameMinLength = process.env.REACT_APP_STORE_NAME_MIN_LENGTH;
const storeNameMaxLength = process.env.REACT_APP_STORE_NAME_MAX_LENGTH;
const userNameMinLength = process.env.REACT_APP_USERNAME_MIN_LENGTH;
const userNameMaxLength = process.env.REACT_APP_USERNAME_MAX_LENGTH;
const storeLimitApi = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API;
const dm4sightAnalysisCountAPI =
  process.env.REACT_APP_4SIGHT_GETANALYSISCOUNT_API;
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID;
const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL;
const currentUserDetailsAPI = process.env.REACT_APP_USER_PROFILE_API;
const maxDataLimit = process.env.REACT_APP_MAX_DATA_LIMIT;

const Stores = () => {
  const { t } = useTranslation();
  usePageTitle(t("labels:stores"));
  const instance = axios.create();

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
  const [currentTab, setCurrentTab] = useState(1);
  const [storeLimitValues, setStoreLimitValues] = useState();
  const [duplicateStoreLimitValues, setDuplicateStoreLimitValues] = useState(
    []
  );
  const [analysisCount, setAnalysisCount] = useState();
  const [countForStore, setCountForStore] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isStoreDeleting, setIsStoreDeleting] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [hideAddStoreButton, setHideAddStoreButton] = useState(false);
  const searchInput = useRef(null);
  const auth = useAuth();
  const permissionValue = util.getPermissionData() || [];

  let keyCLoak = sessionStorage.getItem("keycloakData");
  keyCLoak = JSON.parse(keyCLoak);
  let realmName = keyCLoak.clientId.replace(/-client$/, "");

  const dm4sightHeaders = {
    headers: {
      token: auth.user && auth.user?.access_token,
      realmname: realmName,
      dmClientId: dm4sightClientID,
      client: "admin",
    },
  };

  const getCurrentUserDetails = () => {
    MarketplaceServices.findAll(currentUserDetailsAPI, null, false)
      .then((res) => {
        console.log("get access token res", res);
        if (
          res.data.response_body.resource_access[
            "dmadmin-client"
          ].roles.includes("UI-product-admin")
        ) {
          setSuperAdmin(true);
        }
        console.log(
          "dddddddddddddddddddddddddddddddddddddddd",
          res.data.response_body.resource_access[
            "dmadmin-client"
          ].roles.includes("UI-product-admin")
        );
      })
      .catch((err) => {
        console.log("get access token err", err);
      });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleRadioChange = (e) => {
    setValue(e.target.value);
    setRadioValue(e.target.value);
    setSearchParams({
      tab: e.target.value,
      page: 1,
      limit: parseInt(searchParams.get("limit"))
        ? parseInt(searchParams.get("limit"))
        : pageLimit,
    });
    console.log("object status", e.target.value);
  };

  const [radioValue, setRadioValue] = useState(1);

  const [value, setValue] = useState(tab_id ? tab_id : 0);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    setRadioValue(e.target.value);
  };

  useEffect(() => {
    setRadioValue(tab_id);
  }, []);

  useEffect(() => {
    // console.log("location..", window.sessionStorage.getItem("currentStoretab"))
    if (window.sessionStorage.getItem("currentStoretab") == 1) {
      setCurrentTab("1");
    }
  }, [window.sessionStorage.getItem("currentStoretab")]);

  const storeTabData = [
    {
      tabId: 0,
      tabIcon: <MdStore className="!text-2xl !text-[#FCC32A] " />,
      tabTitle: (
        <div className="flex gap-2 ">
          <div className="">{t("labels:all")}</div>
          {/* <div className="rounded-full bg-[#E2F1FC] !px-2  flex justify-center">
            {activeCount && activeCount.totalStores}
          </div>{" "} */}
        </div>
      ),
    },
    {
      tabId: 1,
      tabIcon: <MdBusiness className="!text-2xl " />,
      tabTitle: (
        <div
          className={
            util.getSelectedLanguageDirection()?.toUpperCase() === "RTL"
              ? "flex gap-2 mr-5"
              : "flex gap-2"
          }
        >
          <div className="">{t("labels:active")}</div>
          {/* <div className="rounded-full bg-[#E2F1FC] !px-2 flex justify-center ">
            {activeCount && activeCount.activeStores}
          </div>{" "} */}
        </div>
      ),
    },
    {
      tabId: 2,
      tabIcon: <MdDomainDisabled className="!text-2xl " />,
      tabTitle: (
        <div className="flex gap-2">
          <div className="">{t("labels:inactive")}</div>
          {/* <div className="rounded-full bg-[#E2F1FC] !px-2 flex justify-center ">
            {activeCount && activeCount.inactiveStores}
          </div>{" "} */}
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
  useEffect(() => {
    getCurrentUserDetails();
  }, []);

  useEffect(() => {
    if (currentTab == 2) {
      console.log("storeLimitApi", storeLimitApi);
      MarketplaceServices.findAll(storeLimitApi)
        .then(function (response) {
          console.log(
            "Server Response from store limit API: ",
            response.data.response_body
          );
          setStoreLimitValues(response.data.response_body);
          setDuplicateStoreLimitValues(response.data.response_body);
        })
        .catch((error) => {
          // setIsLoading(false);
          console.log("Server error from store limit API ", error.response);
        });

      instance
        .get(dm4sightBaseURL + dm4sightAnalysisCountAPI, dm4sightHeaders)
        .then((res) => {
          setAnalysisCount(res.data);
          console.log("redddd", res);
        });
    }
  }, [currentTab]);

  useEffect(() => {
    setHideAddStoreButton(
      !auth.isAuthenticated ||
        (auth.isAuthenticated &&
          permissionValue &&
          permissionValue.length > 0 &&
          permissionValue.includes("UI-product-admin"))
        ? true
        : false
    );
  }, [auth]);

  const StoreTableColumnThreshold1 = [
    {
      title: `${t("labels:limits")}`,
      dataIndex: "limits",
      key: "limits",
      width: "30%",
      render: (text) => {
        const [limitName, limitValue, keyName, tooltip] = text.split(",");
        return (
          <Content className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              {limitName}
              <Tooltip title={tooltip} placement="right">
                <InfoCircleTwoTone
                  twoToneColor={"#7d3192"}
                  className="text-xs"
                />
              </Tooltip>
            </div>
            {/* <InputNumber
              value={
                storeLimitValues?.[keyName] > 0
                  ? storeLimitValues?.[keyName]
                  : ""
              }
              min={0}
              onKeyPress={(e) => {
                validatePositiveNumber(e, /[0-9]/);
              }}
              onChange={(value) => {
                let copyofStoreimitValues = { ...storeLimitValues };
                copyofStoreimitValues[keyName] = value;
                setStoreLimitValues(copyofStoreimitValues);
                console.log("value", value);
              }}
              disabled={!superAdmin}
              className="w-28"
              placeholder={t("labels:placeholder_unlimited")}
            /> */}

            <InputNumber
              value={
                storeLimitValues?.[keyName] > 0
                  ? storeLimitValues?.[keyName]
                  : ""
              }
              min={0}
              max={maxDataLimit}
              onKeyPress={(e) => {
                validatePositiveNumber(e, /[0-9]/);
              }}
              onChange={(value) => {
                let copyofStoreLimitValues = { ...storeLimitValues };
                copyofStoreLimitValues[keyName] = value;
                setStoreLimitValues(copyofStoreLimitValues);
              }}
              // onPaste={(e) => {
              //   // Prevent pasting non-numeric characters and limit to 12 characters
              //   e.preventDefault();
              //   const pastedValue = e.clipboardData
              //     .getData("text/plain")
              //     .replace(/[^0-9]/g, "")
              //     .substring(0, 12);
              //   document.execCommand("insertText", false, pastedValue);
              // }}

              onPaste={(e) => {
                e.preventDefault();

                const pastedText = e.clipboardData.getData("text/plain");
                const numericValue = pastedText.replace(/[^0-9]/g, "");
                const truncatedValue = numericValue.substring(0, 12);

                // Check if the resulting value is a positive number
                if (/^[0-9]+$/.test(truncatedValue)) {
                  let copyOfStoreLimitValues = { ...storeLimitValues };
                  copyOfStoreLimitValues[keyName] = truncatedValue;
                  setStoreLimitValues(copyOfStoreLimitValues);
                }
              }}
              // onPaste={(e) => {
              //   // Prevent pasting non-numeric characters and limit to 12 characters
              //   e.preventDefault();
              //   const pastedValue = e.clipboardData
              //     .getData("text/plain")
              //     .replace(/[^0-9]/g, "")
              //     .substring(0, 12);
              //   const updatedValue = parseInt(pastedValue, 10) || 0; // Ensure it's a valid number
              //   let copyofStoreLimitValues = { ...storeLimitValues };
              //   copyofStoreLimitValues[keyName] = updatedValue;
              //   setStoreLimitValues(copyofStoreLimitValues);
              // }}
              disabled={!superAdmin}
              className="w-28"
              placeholder={t("labels:placeholder_unlimited")}
            />
          </Content>
        );
      },
    },

    {
      title: `${t("labels:stats_name")}`,
      dataIndex: "stats",
      key: "stats",
      width: "20%",

      render: (text) => {
        const [count, total, keyName] = text.split(",");
        return (
          <Content>
            {count !== "undefined" && total !== "undefined" ? (
              <Content className="flex flex-col gap-2">
                {count} {total > 0 ? " of " + total : null}{" "}
                {keyName === "store_limit" ? t("labels:active_stores") : null}
                {total > 0 ? (
                  <Progress
                    strokeColor={"#4A2D73"}
                    className="w-24"
                    size="small"
                    percent={(count / total) * 100}
                    showInfo={false}
                  />
                ) : null}
              </Content>
            ) : (
              <Spin tip="Loading"></Spin>
            )}
          </Content>
        );
      },
    },
  ];

  const StoreTableColumnThreshold2 = [
    {
      // title: `${t("labels:name")}`,
      title: `${t("labels:limits")}`,
      dataIndex: "limits",
      key: "limits",
      width: "30%",
      render: (text) => {
        const [limitName, limitValue, keyName, tooltip] = text.split(",");
        return (
          <Content className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              {limitName}
              <Tooltip title={tooltip} placement="right">
                <InfoCircleTwoTone
                  twoToneColor={"#7d3192"}
                  className="text-xs"
                />
              </Tooltip>
            </div>
            <Content>
              <InputNumber
                value={
                  storeLimitValues?.[keyName] > 0
                    ? storeLimitValues?.[keyName]
                    : ""
                }
                min={0}
                max={maxDataLimit}
                onKeyPress={(e) => {
                  validatePositiveNumber(e, /[0-9]/);
                }}
                onChange={(value) => {
                  let copyofStoreimitValues = { ...storeLimitValues };
                  copyofStoreimitValues[keyName] = value;
                  setStoreLimitValues(copyofStoreimitValues);
                }}
                onPaste={(e) => {
                  // Prevent pasting non-numeric characters and limit to 12 characters
                  e.preventDefault();
                  const pastedValue = e.clipboardData
                    .getData("text/plain")
                    .replace(/[^0-9]/g, "")
                    .substring(0, 12);
                  document.execCommand("insertText", false, pastedValue);
                }}
                disabled={!superAdmin}
                className="w-28"
                placeholder={t("labels:placeholder_unlimited")}
              />
            </Content>
          </Content>
        );
      },
    },
  ];

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
      title: `${t("labels:name")}`,
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
      title: `${t("labels:status")}`,
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
            disableStatus={hideAddStoreButton}
          />
        );
      },
    },
    {
      title: `${t("labels:created_date_and_time")}`,
      dataIndex: "created_on",
      key: "created_on",
      width: "30%",
      render: (text, record) => {
        return <>{new Date(record.created_on).toLocaleString()}</>;
      },
    },
    {
      title: `${t("labels:action")}`,
      dataIndex: "",
      key: "",
      width: "12%",
      render: (text, record) => {
        return (
          <Content className="whitespace-nowrap flex align-middle">
            {/* <Tooltip title={t("stores:Edit-Store")}>
              <img
                src={EditIcon}
                className=" !text-xl cursor-pointer"
                onClick={() => {
                  showEditDrawer(record.id);
                }}
              />
            </Tooltip> */}

            {hideAddStoreButton ? (
              <Link
                to={{
                  pathname: "storesetting",
                  search: `?id=${record.id}&page=${
                    searchParams.get("page") ? searchParams.get("page") : 1
                  }&limit=${
                    searchParams.get("limit")
                      ? searchParams.get("limit")
                      : pageLimit
                  }&storeId=${record.storeId}`,
                }}
                style={{ textDecoration: "none" }}
                // className=" pl-[10px] font-semibold app-table-data-title"
              >
                <Tooltip title={t("labels:view_details")}>
                  {t("labels:view_details")}
                </Tooltip>
              </Link>
            ) : (
              <Button
                className="app-btn-icon flex align-items-center justify-center"
                type="text"
              >
                {
                  <Link
                    to={{
                      pathname: "storesetting",
                      search: `?id=${record.id}&page=${
                        searchParams.get("page") ? searchParams.get("page") : 1
                      }&limit=${
                        searchParams.get("limit")
                          ? searchParams.get("limit")
                          : pageLimit
                      }&storeId=${record.storeId}`,
                    }}
                    // className=" pl-[10px] font-semibold app-table-data-title"
                  >
                    <Tooltip title={t("labels:store_settings")}>
                      <MdSettings className="text-[var(--mp-primary-border-color)] hover:text-[var(--mp-primary-border-color-h)] !text-xl" />
                    </Tooltip>
                  </Link>
                }
              </Button>
            )}

            {/* {record.status === "InActive" ? (
              <Button
                className="app-btn-text flex align-items-center ml-2 justify-center"
                type="text"
              >
                <Tooltip title={t("labels:delete_store")}>
                  <img
                    src={DeleteIcon}
                    className="!text-xl cursor-pointer"
                    onClick={() => {
                      openDeleteModal(record.id);
                    }}
                  />
                </Tooltip>
              </Button>
            ) : null} */}
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
        var storeActualId = element.id;
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
            storeId: storeActualId,
          });
      });
    setSelectedTabTableContent(tempArray);
  };

  // const getActiveInactiveData = () => {
  //   // instance
  //   //   .get(dm4sightBaseURL + dm4sightAnalysisCountAPI, dm4sightHeaders)
  //     // .then((response) => {
  //     //   console.log("resdooooo", response.data);

  //       //   convert the response to table readable format

  //       //   console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]
  //       // Object.entries converts key-value to array of key,value
  //       //   key --> first value of Array
  //       //   value ---> second value of array
  //       // const transformedData = Object.entries(response.data.count_info).map(
  //       //   ([key, value]) => ({
  //       //     key: key,
  //       //     store_name: value.name,
  //       //     orders: value.count_order,
  //       //     vendors: value.count_vendor,
  //       //     products: value.count_product,
  //       //     product_templates: value.count_template,
  //       //   })
  //       // );
  //       // setTableData(transformedData);
  //       // console.log(transformedData);
  //     });
  // };

  // useEffect(() => {
  //   getActiveInactiveData();
  // });

  //!this useEffect for tab(initial rendering)
  useEffect(() => {
    if (storeApiData && storeApiData.length > 0 && !isLoading) {
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

  // const StoreTableColumnThreshold = [
  //   {
  //     // title: `${t("labels:name")}`,
  //     title: "Limits",
  //     dataIndex: "limits",
  //     key: "limits",
  //     width: "30%",
  //   },
  //   {
  //     title: "Stats",
  //     dataIndex: "stats",
  //     key: "stats",
  //     width: "20%",
  //   },
  // ];
  const tablePropsThreshold1 = {
    table_header: StoreTableColumnThreshold1,
    table_content: [
      {
        key: "1",
        limits: `${t("labels:maximum_store_creation_limit")},${
          storeLimitValues?.store_limit
        },store_limit,${t("labels:store_limit_tooltip")}`,
        stats:
          analysisCount?.store_count +
          "," +
          storeLimitValues?.store_limit +
          "," +
          "store_limit",
      },
      // {
      //   key: "2",
      //   limits: `${t("labels:maximum_language_activation_limit")},${
      //     storeLimitValues?.dm_language_limit
      //   },dm_language_limit`,
      //   stats:
      //     analysisCount?.lang_count +
      //     " of " +
      //     storeLimitValues?.dm_language_limit,
      // },
      // {
      //   key: "3",
      //   limits: `${t("labels:maximum_user_limit")},${
      //     storeLimitValues?.dm_user_limit
      //   },dm_user_limit`,
      //   stats:
      //     analysisCount?.user_count + " of " + storeLimitValues?.dm_user_limit,
      // },
    ],
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

  const tablePropsThreshold2 = {
    table_header: StoreTableColumnThreshold2,
    table_content: [
      {
        key: "1",

        limits: `${t("labels:max_vendor_onboarding_limit")},${
          storeLimitValues?.vendor_limit
        },vendor_limit, ${t("labels:vendor_limit_tooltip")}`,
      },

      {
        key: "2",
        limits: `${t("labels:max_customer_onboarding_limit")},${
          storeLimitValues?.customer_limit
        },customer_limit, ${t("labels:customer_limit_tooltip")}`,
      },
      {
        key: "3",
        limits: `${t("labels:max_product_limit")},${
          storeLimitValues?.product_limit
        },product_limit, ${t("labels:product_limit_tooltip")}`,
      },
      {
        key: "4",
        limits: `${t("labels:max_order_limit")} ,${
          storeLimitValues?.order_limit_per_day
        },order_limit_per_day, ${t("labels:order_limit_tooltip")}`,
      },
      {
        key: "5",
        limits: `${t("labels:max_language_limit")} ,${
          storeLimitValues?.langauge_limit
        },langauge_limit, ${t("labels:language_limit_tooltip")}`,
      },
      {
        key: "6",
        limits: `${t("labels:max_product_template_limit")},${
          storeLimitValues?.product_template_limit
        },product_template_limit, ${t(
          "labels:product_template_limit_tooltip"
        )}`,
      },
      // {
      //   key: "7",
      //   limits: `${t("labels:max_store_user_limit")},${
      //     storeLimitValues?.store_users_limit
      //   },store_users_limit`,
      // },
      // {
      //   key: "8",
      //   limits: `${t("labels:max_vendor_user_limit")},${
      //     storeLimitValues?.vendor_users_limit
      //   },vendor_users_limit`,
      // },
    ],
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
    setOnChangeValues(false);
  };
  //!edit drawer
  const showEditDrawer = (id) => {
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
    setOnChangeValues(false);
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
    setIsLoading(true);
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
            response.data.response_body.active_stores +
            response.data.response_body.inactive_stores,
          activeStores: response.data.response_body.active_stores,
          inactiveStores: response.data.response_body.inactive_stores,
        });
        // setInactiveCount(response.data.inactive_stores);
        setIsNetworkError(false);
        setIsLoading(false);
        console.log(
          "Server Response from findByPageStoreApi Function: ",
          response.data.response_body
        );
        // setStoreApiData(response.data.data);
        //TODO: Remove line 303,304 and setStoreApiData(response.data)
        // let allStoresData = response.data;
        // allStoresData = { ...allStoresData, count: 22 };
        setStoreApiData(response.data.response_body.data);
        setIsPaginationDataLoaded(false);
        setCountForStore(response.data.response_body.count);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkError(true);
        console.log(
          "Server error from findByPageStoreApi Function ",
          error.response
        );
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
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
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{12,64}$/;
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_%*?&])[A-Za-z\d@$!_%*?&]{6,15}$/;
    let count = 4;
    if (
      storeEmail === "" &&
      storeUserName === "" &&
      storePassword === "" &&
      name === ""
    ) {
      setInValidEmail(true);
      setInValidUserName(true);
      setInValidPassword(true);
      setInValidName(true);
      count--;
      // toast("Please provide values for the mandatory fields", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   type: "error",
      //   autoClose: 10000,
      // });
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName === "" &&
      storePassword === "" &&
      name !== ""
    ) {
      setInValidEmail(true);
      setInValidUserName(true);
      setInValidPassword(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName === "" &&
      storePassword === "" &&
      name === ""
    ) {
      setInValidUserName(true);
      setInValidPassword(true);
      setInValidName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName !== "" &&
      storePassword === "" &&
      name === ""
    ) {
      setInValidEmail(true);
      setInValidPassword(true);
      setInValidName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName === "" &&
      storePassword !== "" &&
      name === ""
    ) {
      setInValidEmail(true);
      setInValidUserName(true);
      setInValidName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName === "" &&
      storePassword !== "" &&
      name !== ""
    ) {
      setInValidEmail(true);
      setInValidUserName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName !== "" &&
      storePassword === "" &&
      name !== ""
    ) {
      setInValidEmail(true);
      setInValidPassword(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName === "" &&
      storePassword === "" &&
      name !== ""
    ) {
      setInValidUserName(true);
      setInValidPassword(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName === "" &&
      storePassword !== "" &&
      name === ""
    ) {
      setInValidName(true);
      setInValidUserName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName !== "" &&
      storePassword === "" &&
      name === ""
    ) {
      setInValidName(true);
      setInValidPassword(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName !== "" &&
      storePassword !== "" &&
      name === ""
    ) {
      setInValidName(true);
      setInValidEmail(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName !== "" &&
      storePassword !== "" &&
      name === ""
    ) {
      setInValidName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail === "" &&
      storeUserName !== "" &&
      storePassword !== "" &&
      name !== ""
    ) {
      setInValidEmail(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName === "" &&
      storePassword !== "" &&
      name !== ""
    ) {
      setInValidUserName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      storeEmail !== "" &&
      storeUserName !== "" &&
      storePassword === "" &&
      name !== ""
    ) {
      setInValidPassword(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_provide_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      name &&
      validator.isLength(name.trim(), {
        min: storeNameMinLength,
        max: storeNameMaxLength,
      }) === false
    ) {
      setInValidName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t(
            "messages:store_name_must_contain_minimum_of"
          )} ${storeNameMinLength}, ${t(
            "messages:maximum_of"
          )} ${storeNameMaxLength} ${t("messages:characters")}`,
          "error"
        )
      );
    } else if (
      storeEmail &&
      validator.isEmail(storeEmail) === false &&
      validator.isLength(storeEmail.trim(), {
        min: emailMinLength,
        max: emailMaxLength,
      }) === false
    ) {
      setInValidEmail(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_the_valid_email_address")}`,
          "error"
        )
      );
    } else if (
      storeUserName &&
      validator.isLength(storeUserName.trim(), {
        min: userNameMinLength,
        max: userNameMaxLength,
      }) === false
    ) {
      setInValidUserName(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t(
            "messages:username_must_contain_minimum_of"
          )} ${userNameMinLength}, ${t(
            "messages:maximum_of"
          )} ${userNameMaxLength} ${t("messages:characters")}`,
          "error"
        )
      );
    } else if (storePassword && pattern.test(storePassword) === false) {
      setInValidPassword(true);
      count--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t(
            "messages:password_must_contain_minimum_of"
          )} ${passwordMinLength} ${t("messages:password_error_message")}`,
          "error"
        )
      );
    }
    if (count === 4) {
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
    MarketplaceServices.save(storeAPI, postBody)
      .then((response) => {
        MarketplaceToaster.showToast(response);
        setIsUpLoading(false);
        onClose();
        setName("");
        setStoreEmail("");
        setStoreUserName("");
        setStorePassword("");
        console.log(
          "Server Success Response From stores",
          response.data.response_body
        );
        setPostData(response.data.response_body);
      })
      .catch((error) => {
        setIsUpLoading(false);
        MarketplaceToaster.showToast(error.response);
        console.log("Error response from the store post call", error.response);
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
    MarketplaceServices.update(storeAPI, putObject, {
      store_id: storeEditId,
    })
      .then((response) => {
        console.log("put response", response.data, storeApiData);
        MarketplaceToaster.showToast(response);
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
      })
      .catch((error) => {
        setIsUpLoading(false);
        MarketplaceToaster.showToast(error.response);
      });
  };

  //! Post call for the store store limit api
  const saveStoreLimit = () => {
    const postBody = storeLimitValues;
    MarketplaceServices.save(storeLimitApi, postBody)
      .then((response) => {
        setDuplicateStoreLimitValues(response.data.response_body);
        console.log("response meeeeeeeeee", response);
        MarketplaceToaster.showToast(response);
      })
      .catch((error) => {
        console.log("Error Response From storelimit", error.response);
        MarketplaceToaster.showToast(error.response);
      });
  };

  const validationForSaveStoreLimit = () => {
    if (
      duplicateStoreLimitValues?.customer_limit ===
        storeLimitValues?.customer_limit &&
      duplicateStoreLimitValues?.dm_language_limit ===
        storeLimitValues?.dm_language_limit &&
      duplicateStoreLimitValues?.dm_user_limit ===
        storeLimitValues?.dm_user_limit &&
      duplicateStoreLimitValues?.order_limit_per_day ===
        storeLimitValues?.order_limit_per_day &&
      duplicateStoreLimitValues?.product_limit ===
        storeLimitValues?.product_limit &&
      duplicateStoreLimitValues?.product_template_limit ===
        storeLimitValues?.product_template_limit &&
      duplicateStoreLimitValues?.store_limit === storeLimitValues.store_limit &&
      duplicateStoreLimitValues?.store_users_limit ===
        storeLimitValues?.store_users_limit &&
      duplicateStoreLimitValues?.vendor_limit ===
        storeLimitValues?.vendor_limit &&
      duplicateStoreLimitValues?.vendor_users_limit ===
        storeLimitValues?.vendor_users_limit &&
      duplicateStoreLimitValues?.langauge_limit ===
        storeLimitValues?.langauge_limit
    ) {
      MarketplaceToaster.showToast(
        util.getToastObject(`${t("messages:no_changes_were_detected")}`, "info")
      );
    } else {
      saveStoreLimit();
    }
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
      toast(`Please enter the store name`, {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      editName &&
      validator.isLength(editName.trim(), {
        min: storeNameMinLength,
        max: storeNameMaxLength,
      }) === false
    ) {
      setInValidEditName(true);
      // count--;
      toast(
        `Store name must contain minimum of ${storeNameMinLength}, maximum of ${storeNameMaxLength} characters`,
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        }
      );
    } else if (editName === serverStoreName) {
      toast(`No changes were detected`, {
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
        MarketplaceToaster.showToast(response);
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

        // disabling spinner
        setIsStoreDeleting(false);
      })
      .catch((error) => {
        // disabling spinner
        setIsStoreDeleting(false);
        console.log("response from delete===>", error.response.data);
        MarketplaceToaster.showToast(error.response);
      });
  };

  const handleKeyDown = (e) => {
    // Prevent spaces from being entered by checking the key code
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  return (
    <Content className="">
      <StoreModal
        isVisible={isDeleteStoreModalOpen}
        okButtonText={t("labels:yes")}
        cancelButtonText={t("labels:cancel")}
        title={t("labels:warning")}
        okCallback={() => removeStore()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={isStoreDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{t("messages:confirm_store_deletion")}</p>
            <p>{t("messages:store_deletion_confirmation_message")}</p>
          </div>
        }
      </StoreModal>
      <Content className="">
        <HeaderForTitle
          title={
            <Title level={3} className="!font-normal">
              {t("labels:stores")}
            </Title>
          }
          titleContent={
            currentTab == 1 ? (
              hideAddStoreButton ? (
                ""
              ) : (
                <Button
                  className="app-btn-primary !h-8 !hover:h-[32px]"
                  onClick={showAddDrawer}
                >
                  {t("labels:add_store")}
                </Button>
              )
            ) : null
          }
          headerContent={
            !isLoading && (
              <Content className="!h-10 !mt-7">
                <Tabs
                  // defaultActiveKey={currentTab}
                  activeKey={currentTab}
                  items={[
                    {
                      key: "1",
                      label: `${t("labels:my_stores")}`,
                    },
                    {
                      key: "2",
                      label: `${t("labels:threshold_configuration")}`,
                    },
                  ]}
                  onChange={(key) => {
                    setCurrentTab(key);
                    sessionStorage.setItem("currentStoretab", key);
                  }}
                />

                {/* <DmTabAntDesign
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
                /> */}
              </Content>
            )
          }
        />
        <Drawer
          title={
            drawerAction && drawerAction === "post"
              ? `${t("labels:add_store")}`
              : `${t("labels:edit_store")}`
          }
          placement={
            util.getSelectedLanguageDirection()?.toUpperCase() === "RTL"
              ? "left"
              : "right"
          }
          onClose={onClose}
          open={open}
          width={"40%"}
        >
          {drawerAction && drawerAction === "post" ? (
            <>
              <Row>
                <Col span={1} className="flex items-start mt-[3px]">
                  <MdInfo className="!text-[var(--mp-brand-color-h)] text-[16px]" />
                </Col>
                <Col span={23} className="align-center mb-3">
                  <Text className=" mr-1 font-bold"> {t("labels:note")}: </Text>
                  <Text>{t("messages:add_store_description")}</Text>
                </Col>
              </Row>
              <Spin
                tip={t("labels:please_wait")}
                size="large"
                spinning={isUpLoading}
              >
                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStNam"
                >
                  {t("labels:store_name")}
                  {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input
                  placeholder={t("placeholders:enter_store_name")}
                  value={name}
                  minLength={storeNameMinLength}
                  maxLength={storeNameMaxLength}
                  className={`${
                    inValidName
                      ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-[0.5rem]"
                      : "mb-[0.5rem]"
                  }`}
                  onChange={(e) => {
                    // const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
                    const alphaWithoutSpaces = /^[a-zA-Z0-9]+$/;
                    if (
                      e.target.value !== "" &&
                      validator.matches(e.target.value, alphaWithoutSpaces)
                    ) {
                      // setShowStoreErrorMessage(true);
                      setName(e.target.value);
                      setOnChangeValues(true);
                    } else if (e.target.value === "") {
                      setName(e.target.value);
                      // setShowStoreErrorMessage(false);
                      setOnChangeValues(false);
                    }
                    setInValidName(false);
                  }}
                  onBlur={() => {
                    const trimmed = name.trim();
                    const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                    setName(trimmedUpdate);
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
                  {t("labels:store_administrator_details")}
                </Divider>

                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStEmail"
                >
                  {t("labels:email")}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input
                  placeholder={t("placeholders:enter_email")}
                  value={storeEmail}
                  minLength={emailMinLength}
                  maxLength={emailMaxLength}
                  className={`${
                    inValidEmail
                      ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-6"
                      : "mb-6"
                  }`}
                  onChange={(e) => {
                    // setStoreEmail(e.target.value);
                    setInValidEmail(false);
                    if (e.target.value === "") {
                      setOnChangeValues(false);
                      setStoreEmail(e.target.value);
                    } else {
                      setOnChangeValues(true);
                      setStoreEmail(e.target.value);
                    }
                  }}
                  onBlur={() => {
                    const trimmed = storeEmail.trim();
                    const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                    setStoreEmail(trimmedUpdate);
                  }}
                />

                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStUseName"
                >
                  {t("labels:username")}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input
                  placeholder={t("placeholders:enter_username")}
                  value={storeUserName}
                  minLength={userNameMinLength}
                  maxLength={userNameMaxLength}
                  // suffix={`${storeUserName.length}/15`}
                  className={`${
                    inValidUserName
                      ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-6"
                      : "mb-6"
                  }`}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  onChange={(e) => {
                    const regex = /^[A-Za-z0-9_\- ]+$/;
                    if (
                      e.target.value !== "" &&
                      validator.matches(e.target.value, regex)
                    ) {
                      setInValidUserName(false);
                      setStoreUserName(String(e.target.value).toLowerCase());
                      setOnChangeValues(true);
                    } else if (e.target.value === "") {
                      setStoreUserName(e.target.value);
                      setOnChangeValues(false);
                    }
                  }}
                  onBlur={() => {
                    const trimmed = storeUserName.trim();
                    const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                    setStoreUserName(trimmedUpdate);
                  }}
                />

                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStPwd"
                >
                  {t("labels:password")}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input.Password
                  placeholder={t("placeholders:enter_password")}
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
                    // setStorePassword(e.target.value);
                    setInValidPassword(false);
                    // setOnChangeValues(true);
                    if (e.target.value === "") {
                      setOnChangeValues(false);
                      setStorePassword(e.target.value);
                    } else {
                      setOnChangeValues(true);
                      setStorePassword(e.target.value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    const trimmed = storePassword.trim();
                    setStorePassword(trimmed);
                  }}
                />
                <Button
                  className={onChangeValues ? "app-btn-primary" : "!opacity-75"}
                  disabled={!onChangeValues}
                  onClick={() => {
                    validateStorePostField();
                  }}
                >
                  {t("labels:save")}
                </Button>
              </Spin>
            </>
          ) : (
            <>
              <Row>
                <Col span={1} className="flex items-start mt-[3px]">
                  <MdInfo className="!text-[var(--mp-brand-color-h)] text-[16px]" />
                </Col>
                <Col span={23} className="align-center mb-3">
                  <Text className=" mr-1 font-bold"> {t("labels:note")}:</Text>
                  <Text>{t("messages:edit_store_description")}</Text>
                </Col>
              </Row>
              <Spin
                tip={t("labels:please_wait")}
                size="large"
                spinning={isUpLoading}
              >
                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStNam"
                >
                  Store Name
                  {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input
                  value={editName}
                  placeholder={t("placeholders:enter_store_name")}
                  className={`${
                    inValidEditName
                      ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 mb-6"
                      : "mb-6"
                  }`}
                  minLength={storeNameMinLength}
                  maxLength={storeNameMaxLength}
                  onChange={(e) => {
                    // const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
                    const alphaWithoutSpaces = /^[a-zA-Z0-9]+$/;
                    if (
                      e.target.value !== "" &&
                      validator.matches(e.target.value, alphaWithoutSpaces)
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
                  onBlur={() => {
                    const trimmed = editName.trim();
                    const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                    setEditName(trimmedUpdate);
                  }}
                />
                <Divider orientation="left" orientationMargin="0">
                  {t("labels:store_administrator_details")}
                </Divider>
                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStEmail"
                >
                  {" "}
                  {t("labels:email")}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input
                  placeholder={t("placeholders:enter_email")}
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
                        `${t("stores:please_enter_the_valid_email_address")}`,
                        {
                          position: toast.POSITION.TOP_RIGHT,
                          type: "warning",
                        }
                      );
                    }
                  }}
                />
                <label
                  className="text-[13px] mb-2 ml-1 input-label-color"
                  id="labStUseName"
                >
                  Username
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input
                  placeholder={t("placeholders:enter_username")}
                  value={storeEditUserName}
                  maxLength={10}
                  className="mb-6"
                  prefix={<UserOutlined className="site-form-item-icon" />}
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
                  onBlur={() => {
                    const trimmed = storeEditUserName.trim();
                    const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                    setStoreEditUserName(trimmedUpdate);
                  }}
                />
                <label
                  className="text-[13px] mb-2 ml-1 .input-label-color"
                  id="labStPwd"
                >
                  Password
                  {/* <sup className="text-red-600 text-sm pl-1">*</sup> */}
                </label>
                <span className="mandatory-symbol-color text-sm ml-1">*</span>
                <Input.Password
                  placeholder={t("placeholders:enter_password")}
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
                    onChangeEditValues ? "app-btn-primary" : "!opacity-75"
                  }
                  onClick={() => {
                    validateStorePutField();
                  }}
                  disabled={!onChangeEditValues}
                >
                  {t("labels:update")}
                </Button>
              </Spin>
            </>
          )}
        </Drawer>
      </Content>
      <Content className="!p-3">
        {isLoading ? (
          <Content className="bg-white p-3 !rounded-md mt-[2.0rem]">
            <Skeleton
              active
              paragraph={{
                rows: 6,
              }}
            ></Skeleton>
            {/* <SkeletonComponent Layout="layout1" /> */}
          </Content>
        ) : isNetworkError ? (
          <Content className="!mt-[1.7rem] !text-center bg-white p-3 !rounded-md">
            {t("messages:store_network_error")}
          </Content>
        ) : (
          <Content className="">
            <Content>
              {currentTab == 1 && storeApiData && storeApiData.length > 0 ? (
                <Content className="bg-white ">
                  <Radio.Group
                    className="mt-3 mr-4 flex float-right"
                    optionType="button"
                    onChange={handleRadioChange}
                    value={value}
                  >
                    <Radio value={0}>{t("labels:all")}</Radio>
                    <Radio value={1}>{t("labels:active")}</Radio>
                    <Radio value={2}>{t("labels:inactive")}</Radio>
                  </Radio.Group>

                  <DynamicTable tableComponentData={tablePropsData} />
                </Content>
              ) : currentTab == 2 ? (
                <>
                  <Content>
                    <Title level={5}>{t("labels:account_restrictions")}</Title>
                    <DynamicTable tableComponentData={tablePropsThreshold1} />
                  </Content>
                  <Content>
                    <Title level={5}>{t("labels:store_restrictions")}</Title>
                    <DynamicTable tableComponentData={tablePropsThreshold2} />
                  </Content>
                  {hideAddStoreButton ? (
                    <Content className="flex gap-2">
                      <Button
                        className={"app-btn-primary"}
                        onClick={() => validationForSaveStoreLimit()}
                      >
                        {t("labels:save")}
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentTab(1);
                          sessionStorage.setItem("currentStoretab", 1);
                        }}
                      >
                        Discard
                      </Button>
                    </Content>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <Content className="!mt-[1.7rem] !text-center bg-white p-3 !rounded-md">
                  {t("messages:no_data_available")}
                </Content>
              )}
            </Content>
            {currentTab == 1 && countForStore && countForStore >= pageLimit ? (
              <Content className=" grid justify-items-end">
                <DmPagination
                  currentPage={
                    parseInt(searchParams.get("page"))
                      ? parseInt(searchParams.get("page"))
                      : 1
                  }
                  presentPage={
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
