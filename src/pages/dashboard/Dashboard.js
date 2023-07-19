//! Import libraries & components
import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Spin,
  Skeleton,
  Image,
  Divider,
  Table,
  Button,
  Watermark,
} from "antd";
import {
  DashboardOutlined,
  LoadingOutlined,
  ShopOutlined,
  SyncOutlined,
  WalletOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";

import { AdminIcon, Profit, Positive, Payment } from "../../constants/media";

import { MdDomainDisabled, MdBusiness, MdStore } from "react-icons/md";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { usePageTitle } from "../../hooks/usePageTitle";
import { WorkInProgress } from "../../constants/media";
import DmTabAntDesign from "../../components/DmTabAntDesign/DmTabAntDesign";
//! Import user defined functions

//! Import user defined CSS
import "./dashboard.css";

//! Get all required details from .env file
import axios from "axios";
import { removeUrlSearchData } from "../../util/util";
import LanguageGraph from "./LanguageGraph";
import StoreGraph from "./StoreGraph";
import StoreProductTypeGraph from "./StoreProductTypeGraph";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SalesReportGraph from "./SalesReportGraph";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import util from "../../util/common";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { useAuth } from "react-oidc-context";
const getAuth = process.env.REACT_APP_AUTH;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const isLoggedInURL = process.env.REACT_APP_ISLOGGEDIN;
const getPermissionsUrl = process.env.REACT_APP_PERMISSIONS;
const getAccessTokenUrl = process.env.REACT_APP_ACCESSTOKEN;
const storeAdminDashboardAPI =
  process.env.REACT_APP_STORE_ADMIN_DASHBOARD_DATA_API;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;
// const auth = getAuth.toLowerCase() === "true";

//! Destructure the components
const { Title, Text, Link } = Typography;
const { Content } = Layout;
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
      display: "none",
    }}
    spin
  />
);

const instance = axios.create();
delete instance.defaults.headers.common["Authorization"];
const Dashboard = () => {
  const auth = useAuth();
  usePageTitle("Admin Portal - Dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState([]);
  const [openedItem, setOpenedItem] = useState([]);
  const [token, setToken] = useState("");
  const [refreshToken, setrefreshToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState();
  const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
  const [dashboardDataNetWorkError, setDashboardDataNetWorkError] =
    useState(false);
  const [storeTabId, setStoreTabId] = useState(1);
  const [permissionValue, setGetPermissionsData] = useState(
    sessionStorage.getItem("permissions_data") || []
  );
  const { pathname } = useLocation();

  // useEffect(() => {
  //   if (sessionStorage.getItem("access_token")) {
  //     setToken(sessionStorage.getItem("access_token"));
  //     if (sessionStorage.getItem("is_loggedIn")) {
  //       setIsLoggedIn(sessionStorage.getItem("is_loggedIn"));
  //       if (!sessionStorage.getItem("permissions_data")) {
  //         getPermissions();
  //       } else {
  //         setIsLoading(false);
  //       }
  //     } else {
  //       handleisLoggedIn();
  //     }
  //   } else {
  //     getAccessToken();
  //     removeUrlSearchData();
  //   }
  //   window.scroll(0, 0);
  // }, []);
  useEffect(() => {
    if (auth && auth.user && auth.user?.access_token) {
      window.sessionStorage.setItem("access_token", auth.user?.access_token);
      // if (!window.sessionStorage.getItem("permissions_data")) {
      //   getPermissions(auth.isAuthenticated);
      // }
    }
  }, [auth]);

  useEffect(() => {
    console.log("auth", auth);
    console.log("auth isAuthenticated", auth.isAuthenticated);
    if (auth.isAuthenticated) {
      getDashBoardData();
    }
  }, []);

  const getAccessToken = () => {
    let urlparams = new URLSearchParams(location.search);
    if (sessionStorage.getItem("keycloakData")) {
      let keyCLoak = sessionStorage.getItem("keycloakData");
      keyCLoak = JSON.parse(keyCLoak);

      const realmName = keyCLoak.realmName;
      const clientId = keyCLoak.clientId;
      if (urlparams.has("code")) {
        let code = urlparams.get("code");
        console.log("code", code);

        let baseurl = `${umsBaseUrl}${getAccessTokenUrl}`;
        console.log("baseurl", baseurl);
        instance({
          url: baseurl,
          method: "post",
          data: {
            code: code,
            realmname: realmName,
            client_id: clientId,
          },
        })
          .then((res) => {
            // console.log('get access token res', res);
            if (res.data.access_token) {
              setToken(res.data.access_token);
              setrefreshToken(res.data.refresh_token);
              sessionStorage.setItem("access_token", res.data.access_token);
              sessionStorage.setItem("refresh_token", res.data.refresh_token);
              handleisLoggedIn();
            }
          })
          .catch((err) => {
            console.log("get access token err", err);
            if (err && err.response && err.response.status === 401) {
              makeHttpRequestForRefreshToken();
            }
          });
      }
    }
  };

  const handleisLoggedIn = () => {
    let baseurl = `${umsBaseUrl}${isLoggedInURL}`;

    // instance({
    //   url: baseurl,
    //   method: "get",
    //   headers: {
    //     Authorization: token || sessionStorage.getItem("access_token"),
    //   },
    // })
    MarketplaceServices.findAllWithoutPage(baseurl, null, false)
      .then((res) => {
        sessionStorage.setItem("is_loggedIn", res.data.is_loggedin);
        util.setIsLoggedIn(res.data.is_loggedin);
        getPermissions(res.data.is_loggedin);
      })
      .catch((err) => {
        console.log("isLoggedIn err", err);
        util.logoutUser();
        // if (err && err.response && err.response.status === 401) {
        //   makeHttpRequestForRefreshToken();
        // }
      });
  };

  const getPermissions = (logginValue) => {
    let baseurl = `${umsBaseUrl}${getPermissionsUrl}`;
    instance({
      url: baseurl,
      method: "get",
      headers: {
        Authorization: token || sessionStorage.getItem("access_token"),
      },
    })
      .then((res) => {
        console.log("get access token res", res);
        setGetPermissionsData(res.data);
        setIsLoading(false);
        // setIsLoggedIn(logginValue);
        sessionStorage.setItem("permissions_data", res.data);
      })
      .catch((err) => {
        console.log("get access token err", err);
        if (err && err.response && err.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
    // .then((res) => {
    //   console.log("get access token res", res);
    //   setGetPermissionsData(res.data);
    //   setIsLoggedIn(logginValue);
    //   sessionStorage.setItem("permissions_data", res.data);
    // })
    // .catch((err) => {
    //   console.log("get access token err", err);
    //   if (err && err.response && err.response.status === 401) {
    //     makeHttpRequestForRefreshToken();
    //   }
    // });
  };

  const getDashBoardData = () => {
    MarketplaceServices.findAllWithoutPage(storeAdminDashboardAPI, null, true)
      .then(function (response) {
        console.log("responseofdashboard--->", response);
        setDashboardData(response.data);
        setDashboardDataLoading(false);
      })
      .catch((error) => {
        // if (error && error.response && error.response.status === 401) {
        //   makeHttpRequestForRefreshToken();
        // }
        console.log("errorresponse--->", error);
        setDashboardDataLoading(false);
        setDashboardDataNetWorkError(true);
      });
  };

  const storeTabData = [
    {
      tabId: 1,
      tabTitle: "Stores",
    },
    {
      tabId: 2,
      tabTitle: "Products",
    },
  ];

  const tabId = (value) => {
    setStoreTabId(value);
  };

  const storeTableHeader = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: "20%",
      render: (text, record) => {
        return <>{record.key}</>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text, record) => {
        return <>{record.name}</>;
      },
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      width: "20%",
      render: (text, record) => {
        return <>{record.sales}</>;
      },
    },
    {
      title: "Market Share",
      dataIndex: "marketshare",
      key: "marketshare",
      width: "35%",
      render: (text, record) => {
        return <> {record.marketshare}</>;
      },
    },
  ];
  const storeTableData = [
    {
      key: 1,
      name: "Store",
      sales: `${currencySymbol}890`,
      marketshare: "25%",
    },
    {
      key: 2,
      name: "Store2",
      sales: `${currencySymbol}790`,
      marketshare: "30%",
    },
    {
      key: 3,
      name: "Store3",
      sales: `${currencySymbol}800`,
      marketshare: "40%",
    },
    {
      key: 4,
      name: "Store4",
      sales: `${currencySymbol}600`,
      marketshare: "30%",
    },
    {
      key: 5,
      name: "Store4",
      sales: `${currencySymbol}720`,
      marketshare: "15%",
    },
    {
      key: 6,
      name: "Store5",
      sales: `${currencySymbol}400`,
      marketshare: "20%",
    },
  ];

  const tablePropsData = {
    table_header: storeTableHeader,
    table_content: storeTableData,
    pagenationSettings: false,
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

  console.log("dashboardData----->", dashboardData);
  return (
    // <Content className="p-3">
    //   <Spin spinning={isLoading} indicator={antIcon} tip="Please Wait...">
    //     <Content>
    //       <AntDesignBreadcrumbs
    //         data={[
    //           { title: "Home", navigationPath: "/", displayOrder: 1 },
    //           { title: "Dashboard", navigationPath: "", displayOrder: 2 },
    //         ]}
    //       />
    //       <Content className="  d-flex  align-items-center my-3">
    //         {/* <DashboardOutlined className="text-1xl me-2 d-flex  align-items-center" /> */}
    //         <Title level={3} className="!font-normal mb-0">
    //           Dashboard
    //         </Title>
    //       </Content>
    //       <Content className="">
    //         <img
    //           src={WorkInProgress}
    //           alt="WorkInProgress"
    //           className="mt-3 w-[50%] mx-auto"
    //         />
    //       </Content>
    //     </Content>
    //   </Spin>
    // </Content>
    <Content className="mb-2">
      <Content className="mb-2">
        <HeaderForTitle
          title={
            <Content className="flex !justify-between">
              <Content className="!w-[80%]">
                <Title level={3} className="!font-normal">
                  Dashboard
                </Title>
              </Content>
              <Content className="!w-[20%] text-right !right-0"></Content>
            </Content>
          }
        />
      </Content>
      <Content className="!p-[1.2rem] !mt-[120px] !min-h-screen">
        {dashboardDataLoading ? (
          <Content className="bg-white !p-3">
            <Content className="flex justify-between">
              {" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
            </Content>
            <Content className="flex justify-between my-16">
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />
            </Content>
          </Content>
        ) : dashboardDataNetWorkError ? (
          <Content className="text-center !mt-10 !mb-2">
            <p>
              Please wait while we validate your information. If this process
              persists, please consider logging out and logging back in
            </p>
          </Content>
        ) : (
          <Content>
            <Content className="flex">
              <Content className="p-3 w-[7%] mr-4 shadow-sm rounded-md justify-center !bg-white">
                <Content className="flex mb-3">
                  <Content className="flex items-center">
                    <Title
                      level={3}
                      className="!text-[#1A5692] mb-0 !font-semibold mt-0 !inline-block"
                    >
                      {dashboardData &&
                        dashboardData.store_data &&
                        dashboardData.store_data.total_count}
                    </Title>
                    <Text className="font-semibold text-lg ml-2">Stores</Text>
                  </Content>
                  <Content className="flex flex-row-reverse items-center">
                    <Link
                      className="linkColor float-right font-semibold"
                      onClick={() => navigate("/dashboard/store")}
                    >
                      View All
                    </Link>
                  </Content>
                </Content>
                <Content className="flex">
                  <Content className="flex">
                    <Content className="!inline-block w-[40%]">
                      <MdStore className="!text-5xl !inline-block !text-[#FCC32A]" />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#8C8C8C] ml-3">Active</Text>
                      <Title level={5} className="!text-black mt-0 ml-3">
                        {dashboardData &&
                          dashboardData.store_data &&
                          dashboardData.store_data.active_stores}
                      </Title>
                    </Content>
                  </Content>
                  <Content className="flex">
                    <Content className="!inline-block w-[40%]">
                      <MdStore className="!text-5xl !inline-block !text-[#8C8C8C]" />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#8C8C8C] ml-3">Inactive</Text>
                      <Title level={5} className="!text-black mt-0 ml-3">
                        {dashboardData &&
                          dashboardData.store_data &&
                          dashboardData.store_data.inactive_store}
                      </Title>
                    </Content>
                  </Content>
                </Content>
              </Content>
              <Content className="p-3 w-[26%] mr-4 shadow-sm rounded-md justify-center !bg-white">
                <Content className="flex items-center">
                  <Content className="flex-1 w-[50%]">
                    <Content className="!inline-block w-[40%]">
                      <Image
                        width={75}
                        preview={false}
                        src={Positive}
                        className="cursor-default"
                      />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#00000073] text-md mb-2 !font-medium">
                        Total Revenue
                      </Text>
                      <Title
                        level={3}
                        className="!text-[#7CB305] mb-2 !font-semibold mt-0"
                      >
                        {currencySymbol}
                        {parseInt(
                          dashboardData &&
                            dashboardData.store_revenue &&
                            dashboardData.store_revenue.total_amount
                        )}
                      </Title>
                      <Text className="!text-[#000000D9] text-sm">
                        Monthly Revenue
                      </Text>
                      <Title level={5} className="!text-[#7CB305] mt-0">
                        {currencySymbol}
                        {parseInt(
                          dashboardData &&
                            dashboardData.store_revenue &&
                            dashboardData.store_revenue.total_amount_last_month
                        )}
                      </Title>
                    </Content>
                  </Content>
                  <Content className="flex-1 w-[50%]">
                    <Content className="!inline-block w-[40%]">
                      <Image
                        width={75}
                        preview={false}
                        src={Profit}
                        className="cursor-default"
                      />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#00000073] text-md mb-2 !font-medium">
                        Total Profit
                      </Text>
                      <Title
                        level={3}
                        className="!text-[#7CB305] mb-2 !font-semibold mt-0"
                      >
                        {currencySymbol}
                        {parseInt(
                          dashboardData &&
                            dashboardData.store_revenue &&
                            dashboardData.store_revenue.store_commision_amount
                        )}
                      </Title>
                      <Text className="!text-[#000000D9] text-sm">
                        Monthly Profit
                      </Text>
                      <Title level={5} className="!text-[#7CB305] mt-0">
                        {currencySymbol}
                        {parseInt(
                          dashboardData &&
                            dashboardData.store_revenue &&
                            dashboardData.store_revenue
                              .store_commision_last_month
                        )}
                      </Title>
                    </Content>
                  </Content>
                </Content>
              </Content>
              <Content className="p-3 w-[7%] shadow-sm rounded-md justify-center !bg-white">
                <Content className="flex items-center">
                  <Content className="flex-1 w-[40%]">
                    <Image
                      width={75}
                      preview={false}
                      src={Payment}
                      className="cursor-default"
                    />
                  </Content>
                  <Content className="flex-1 w-[60%]">
                    <Text className="!text-[#00000073] text-md mb-2 !font-medium">
                      Total Products
                    </Text>
                    <Title
                      level={3}
                      className="!text-[#1A5692] mb-2 !font-semibold mt-0"
                    >
                      {dashboardData && dashboardData.total_products}
                    </Title>
                    <Text className="!text-[#000000D9] text-sm">
                      Products Created Last Month
                    </Text>
                    <Title level={5} className="!text-[#1A5692] mt-0">
                      {dashboardData && dashboardData.total_products_last_month}
                    </Title>
                  </Content>
                </Content>
              </Content>
            </Content>

            {/* <Content className="flex justify-between !mt-6">
              <Content className="bg-[#ffff] p-3 mr-5 shadow-sm rounded-md justify-center">
                <Title level={3} className="!font-normal">
                  Dashboard
                </Title>
                <Content>
                  <Text level={2} className="!text-black !text-lg flex ">
                    <img className="mr-2 !w-12" src={AdminIcon} />
                    Hello Logonathan B, have a great day!
                  </Text>
                </Content>
              </Content>
              <Content className=" bg-[#ffff] p-3 mr-5 shadow-sm rounded-md">
                <p className="!text-[#cdcdcd] text-lg ">
                  Total sales this month
                </p>
                <Text className="text-xl !text-black">$ 126,560</Text>
                <Divider plain />
                <Text className="font-semibold"> Daily Sales $12,423</Text>
              </Content>
              <Content className=" bg-[#ffff] p-3 mr-5 shadow-sm rounded-md">
                <div>
                  <Text className="text-lg !text-[#cdcdcd]">Total Stores</Text>
                </div>
                <Text className="text-xl !text-black">
                  {dashboardData &&
                    dashboardData.store_data &&
                    dashboardData.store_data.total_count}
                </Text>
                <Divider plain />
                <Text className="text-[#7dc1ff]">View Storelist </Text>
              </Content>
            </Content> */}
            {/* <Watermark content="Sample Data" fontSize={18}>
              <Content className="mt-6">
                <Content>
                  <StoreGraph storeData={dashboardData.store_data} />
                  <Content className="flex ">
                    <Content className="!bg-white shadow-sm p-3 ">
                      <Text className="!font-semibold text-lg">Ranking</Text>
                      <Text className="text-slate-600"> (Previous Month)</Text>
                      <Text
                      className="cursor-pointer linkColor float-right font-semibold"
                      onClick={() => navigate("/dashboard/store")}
                    >
                      View All
                    </Text>
                      <Content>
                        <DmTabAntDesign
                          tabType={"line"}
                          tabBarPosition={"top"}
                          tabData={storeTabData}
                          handleTabChangeFunction={(value) => tabId(value)}
                        />
                        <Content>
                          <DynamicTable tableComponentData={tablePropsData} />
                        </Content>
                        <Text
                        className="cursor-pointer text-blue-400"
                        onClick={() => navigate("/dashboard/store")}
                      >
                        Explore All Stores
                      </Text>
                      </Content>
                    </Content>
                  </Content>
                </Content>
                <Content className="bg-white !mt-6 p-2">
                <div>
                  <Text className="text-lg font-semibold p-2">
                    Total Languages
                  </Text>
                </div>
                <Text className="text-xl !text-black p-2">
                  {dashboardData &&
                    dashboardData.language_data &&
                    dashboardData.language_data.total_count}
                </Text>
                <StoreGraph languageData={dashboardData.language_data} />
                </Content>
              </Content>
            </Watermark> */}
            {/* <Watermark content="Sample Data" fontSize={18}>
              <Content className="p-3 shadow-sm bg-white !mt-6">
                <SalesReportGraph />
                <LanguageGraph languageData={dashboardData.language_data} />
              </Content>
            </Watermark> */}
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default Dashboard;
