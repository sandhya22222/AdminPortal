//! Import libraries & components
import React, { useEffect, useState } from "react";
import { Layout, Typography, Spin } from "antd";
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
const getAuth = process.env.REACT_APP_AUTH;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const isLoggedInURL = process.env.REACT_APP_ISLOGGEDIN;
const getPermissionsUrl = process.env.REACT_APP_PERMISSIONS;
const getAccessTokenUrl = process.env.REACT_APP_ACCESSTOKEN;
const auth = getAuth.toLowerCase() === "true";
//! Destructure the components
const { Title } = Typography;
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
    window.scroll(0,0)
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
      })
      .then((res) => {
        console.log("get access token res", res);
        setGetPermissionsData(res.data);
        setIsLoggedIn(logginValue);
        sessionStorage.setItem("permissions_data", res.data);
      })
      .catch((err) => {
        console.log("get access token err", err);
      });
  };
  return (
    <Spin spinning={isLoading} indicator={antIcon} tip="Please Wait...">
      <Content>
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Dashboard", navigationPath: "", displayOrder: 2 },
          ]}
        />
        <Content className="  d-flex  align-items-center my-3">
          {/* <DashboardOutlined className="text-1xl me-2 d-flex  align-items-center" /> */}
          <Title level={3} className="!font-normal mb-0">
            Dashboard
          </Title>
        </Content>
        <Content className="">
          <img
            src={WorkInProgress}
            alt="WorkInProgress"
            className="mt-3 w-[50%] mx-auto"
          />
        </Content>
      </Content>
    </Spin>
  );
};

export default Dashboard;
