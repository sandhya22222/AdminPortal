//! Import libraries & components
import React, { useEffect, useState } from "react";
import { Layout, Typography, Spin, Skeleton } from "antd";
import { DashboardOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Outlet,
  Link,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { usePageTitle } from "../../hooks/usePageTitle";
import { WorkInProgress } from "../../constants/media";

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
const getAuth = process.env.REACT_APP_AUTH;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const isLoggedInURL = process.env.REACT_APP_ISLOGGEDIN;
const getPermissionsUrl = process.env.REACT_APP_PERMISSIONS;
const getAccessTokenUrl = process.env.REACT_APP_ACCESSTOKEN;
const storeAdminDashboardAPI =
  process.env.REACT_APP_STORE_ADMIN_DASHBOARD_DATA_API;
const auth = getAuth.toLowerCase() === "true";

//! Destructure the components
const { Title, Text } = Typography;
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
const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
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

  const [permissionValue, setGetPermissionsData] = useState(
    sessionStorage.getItem("permissions_data") || []
  );
  const { pathname } = useLocation();
  console.log("consoled");
  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setToken(sessionStorage.getItem("access_token"));
      if (sessionStorage.getItem("is_loggedIn")) {
        setIsLoggedIn(sessionStorage.getItem("is_loggedIn"));
        if (!sessionStorage.getItem("permissions_data")) {
          getPermissions();
        } else {
          setIsLoading(false);
        }
      } else {
        handleisLoggedIn();
      }
    } else {
      getAccessToken();
      removeUrlSearchData();
    }
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    if (isLoading !== true) {
      getDashBoardData();
    }
  }, [isLoading]);

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

    instance({
      url: baseurl,
      method: "get",
      headers: {
        Authorization: token || sessionStorage.getItem("access_token"),
      },
    })
      .then((res) => {
        sessionStorage.setItem("is_loggedIn", res.data.is_loggedin);
        getPermissions(res.data.is_loggedin);
      })
      .catch((err) => {
        console.log("isLoggedIn err", err);
        if (err && err.response && err.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
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
        setIsLoggedIn(logginValue);
        sessionStorage.setItem("permissions_data", res.data);
      })
      .catch((err) => {
        console.log("get access token err", err);
        if (err && err.response && err.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      })
      .then((res) => {
        console.log("get access token res", res);
        setGetPermissionsData(res.data);
        setIsLoggedIn(logginValue);
        sessionStorage.setItem("permissions_data", res.data);
      })
      .catch((err) => {
        console.log("get access token err", err);
        if (err && err.response && err.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };

  const getDashBoardData = () => {
    axios
      .get(storeAdminDashboardAPI)
      .then(function (response) {
        console.log("responseofdashboard--->", response);
        setDashboardData(response.data);
        setDashboardDataLoading(false);
      })
      .catch((error) => {
        console.log("errorresponse--->", error);
        setDashboardDataLoading(false);
        setDashboardDataNetWorkError(true);
      });
  };

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
    <Content className="p-3">
      <Content>
        <Title level={3} className="mt-3 !font-normal">
          Dashboard
        </Title>
      </Content>
      <Content>
        {dashboardDataLoading ? (
          <Content className="bg-white p-3">
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
          <Content className="text-center  !mt-16 !mb-2">
            <h1 level={5}>
              Your's back-end server/services seems to be down, please start
              your server/services and try again.
            </h1>
          </Content>
        ) : (
          <Content className="">
            <Content className="flex justify-between">
              <Content className="w-[100%] bg-[#6494f9] p-2 mr-5 text-center rounded-md">
                <Title level={2} className="!text-slate-200 mb-2">
                  {dashboardData &&
                    dashboardData.store_data &&
                    dashboardData.store_data.total_count}
                </Title>
                <div>
                  <Text className="text-lg !text-slate-200">Stores</Text>
                </div>
              </Content>
              <Content className="w-[100%] bg-[#b464f9] p-2 mr-5 text-center rounded-md">
                <Title level={2} className="!text-slate-200 mb-2">
                  {dashboardData &&
                    dashboardData.language_data &&
                    dashboardData.language_data.total_count}
                </Title>
                <div>
                  <Text className="text-lg !text-slate-200">Languages</Text>
                </div>
              </Content>
              <Content className="w-[100%] bg-bg-red-400 p-2 mr-5 text-center rounded-md">
                <Title level={2} className="!text-slate-200 mb-2">
                  {dashboardData &&
                    dashboardData.product_type_data &&
                    dashboardData.product_type_data.total_count}
                </Title>
                <div>
                  <Text className="text-lg !text-slate-200">
                    Store Product Types
                  </Text>
                </div>
              </Content>
              {/* <Content className="w-[5%] bg-[#62daaa] ml-2 p-4 text-center rounded-md">
              <Title level={2}>
                {dashboardData &&
                  dashboardData.product_template_data &&
                  dashboardData.product_template_data.product_templates.length >
                    0 &&
                  dashboardData.product_template_data.product_templates[1]
                    .count}
              </Title>
              <div>
                <Text>Inactive Product templates</Text>
              </div>
            </Content> */}
            </Content>
            <Content className="flex justify-between mt-12">
              <Content className="w-[60%] p-2 bg-white mr-2">
                <LanguageGraph languageData={dashboardData.language_data} />
              </Content>
              <Content className="w-[40%] p-2 bg-white ml-2">
                <StoreGraph storeData={dashboardData.store_data} />
              </Content>
              {/* <Content className="mt-16">
              {" "}
              <StoreProductTypeGraph
                storeProductTypeData={dashboardData.product_type_data}
              />
            </Content> */}
            </Content>
            <Content className="mt-12 p-2 bg-white">
              {" "}
              <StoreProductTypeGraph
                storeProductTypeData={dashboardData.product_type_data}
              />
            </Content>
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default Dashboard;
