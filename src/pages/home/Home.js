//! Import libraries & components
import React, { useEffect, useState } from "react";
import { Button, Layout, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { removeUrlSearchData } from "../../util/util"
import {makeHttpRequestForRefreshToken} from "../../util/unauthorizedControl"
//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";

//! Import user defined functions

//! Import user defined CSS
import "./home.css";
//! Destructure the components
const { Title } = Typography;
const { Content } = Layout;

//! Get all required details from .env file
const realmName = process.env.REACT_APP_REALMNAME
const clientId = process.env.REACT_APP_CLIENTID
const keyUrl = process.env.REACT_APP_KEYCLOAK_URL
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const isLoggedInURL = process.env.REACT_APP_ISLOGGEDIN;
const getPermissionsUrl = process.env.REACT_APP_PERMISSIONS;
const getAccessTokenUrl = process.env.REACT_APP_ACCESSTOKEN;

const auth = process.env.REACT_APP_AUTH;

const instance = axios.create();
delete instance.defaults.headers.common["Authorization"];

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [getPermissionsData, setGetPermissionsData] = useState([])

  const handleSignIn = () => {
    window.location = `${keyUrl}/realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}`;
  };
  const handleisLoggedIn = () => {
    let baseurl = `${umsBaseUrl}${isLoggedInURL}`;
    instance({
      url: baseurl,
      method: "get",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        setIsLoggedIn(res.data.is_loggedin);
        sessionStorage.setItem("is_loggedIn", res.data.is_loggedin);
        getPermissions();
      })
      .catch((err) => {
        console.log("isLoggedIn err", err);
      });
  };

  const getAccessToken = () => {
    let urlparams = new URLSearchParams(location.search);
    if (urlparams.has("code")) {
      let code = urlparams.get("code");
      console.log("code", code);

      let baseurl = `${umsBaseUrl}${getAccessTokenUrl}`;

      instance({
        url: baseurl,
        method: "post",
        data: {
          code: code,
          realmname: realmName,
          client_id: clientId,
        }
      }).then(res => {
        // console.log('get access token res', res);
        if (res.data.access_token) {
          setToken(res.data.access_token);
          setrefreshToken(res.data.refresh_token)
          sessionStorage.setItem('access_token', res.data.access_token)
          sessionStorage.setItem('refresh_token', res.data.refresh_token)

        }
      }).catch(err => {
        console.log('get access token err', err)
      })
        .then((res) => {
          // console.log('get access token res', res);
          if (res.data.access_token) {
            setToken(res.data.access_token);
            setrefreshToken(res.data.refresh_token);
            sessionStorage.setItem("access_token", res.data.access_token);
            sessionStorage.setItem("refresh_token", res.data.refresh_token);
          }
        })
        .catch((err) => {
          console.log("get access token err", err);
        });
    }
  };
  const getPermissions = () => {
    let baseurl = `${umsBaseUrl}${getPermissionsUrl}`;
    instance({
      url: baseurl,
      method: "get",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        console.log("get access token res", res);
        setGetPermissionsData(res.data);
        sessionStorage.setItem("permissions_data", res.data);
      })
      .catch((err) => {
        console.log("get access token err", err);
      });
  };

  useEffect(() => {
    if (auth === 'true') {
      if (location.search === "") {
        handleSignIn();
      } else if (!sessionStorage.getItem('access_token')) {
        getAccessToken();
        removeUrlSearchData();
      }
      else {
        navigate('/dashboard');
      }
    }
  }, [location.search])

  useEffect(() => {
    if (token) {
      handleisLoggedIn();
    }
    else if (sessionStorage.getItem('access_token')) {
      // setToken(sessionStorage.getItem('access_token'));
      if (sessionStorage.getItem('is_loggedIn')) {
        setIsLoggedIn(sessionStorage.getItem('is_loggedIn'))
      }
      else {
        handleisLoggedIn();
      }
    }
  }, [token]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn]);

  usePageTitle("Admin Portal - Home");

  const persistedUserLoggedInInfo = useSelector(
    (state) => state.reducerUserLoggedInfo.userLoggedInfo
  );
  return (
    <Content className=" temppic grid justify-items-center p-3 h-[75vh] bg-bottom ">
      {!isLoggedIn && (
        <>
          <h1>Loading DM-ADMIN-PORTAL</h1>
        </>
      )}
      {isLoggedIn && (
        <>
          <Title level={4}>This is Home page</Title>
          {/* <Link to="dashboard">
            <Button className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
              Go to Dashboard
            </Button>
          </Link> */}
          {/* <Link to="/signin">
            <Button onClick={handleLogout} className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
              Logout
            </Button>
          </Link> */}
        </>
      )}
      {/* <Title level={4}>This is Home page</Title> */}
      {/* {typeof persistedUserLoggedInInfo !== "undefined" ? (
        <Link to="dashboard">
          <Button className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <Link to="/signin">
          <Button className="!h-10 mt-5 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
            Signin
          </Button>
        </Link>
      )} */}
    </Content>
  );
};

export default Home;
