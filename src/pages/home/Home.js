//! Import libraries & components
import React, { useEffect, useState } from "react";
import { Button, Layout, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";

//! Import user defined functions

//! Import user defined CSS
import "./home.css";
import { keycloakData } from "../../urlPages/keycloak";
import { backendUrl } from "../../urlPages/backendUrl";

//! Get all required details from .env file

//! Destructure the components
const { Title } = Typography;
const { Content } = Layout;

const realmName = keycloakData.realmName
const clientId = keycloakData.clientId
const keycloakUrl = keycloakData.url
const isLoggedInURL = backendUrl.isLoggedInURL
const getPermissionsUrl = backendUrl.getPermissionsUrl
const getAccessTokenUrl = backendUrl.getAccessTokenUrl

const instance = axios.create();
delete instance.defaults.headers.common['Authorization'];

const Home = ({isLoggedIn, setIsLoggedIn}) => {
  const location = useLocation();
  const [token, setToken] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [getPermissionsData, setGetPermissionsData] = useState([])

  const handleSignIn = () => {
    window.location = keycloakUrl;
  }
  const handleisLoggedIn = () => {
    let baseurl = isLoggedInURL;
    instance({
      url: baseurl,
      method: 'get',
      headers: {
        Authorization: token
      },
    }
    ).then(res => {
      setIsLoggedIn(res.data.is_loggedin)
      sessionStorage.setItem('is_loggedIn', res.data.is_loggedin)
    }).catch(err => {
      console.log('isLoggedIn err', err)
    })
  }

  const getAccessToken = () => {
    let urlparams = new URLSearchParams(location.search);
    if (urlparams.has("code")) {
      let code = urlparams.get('code');
      console.log('code', code)

      let baseurl = getAccessTokenUrl;

      instance({
        url: baseurl,
        method: 'post',
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
    }
  }
  const getPermissions = () => {
    let baseurl = getPermissionsUrl;
    instance({
      url: baseurl,
      method: 'get',
      headers: {
        Authorization: token
      },
    }).then(res => {
      console.log('get access token res', res);
      setGetPermissionsData(res.data)
      sessionStorage.setItem("permissions_data", res.data);
    }).catch(err => {
      console.log('get access token err', err)
    })
  }
  useEffect(() => {
    if (isLoggedIn) {
      getPermissions();
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (location.search === "") {
      handleSignIn();
    } else {
      console.log('signed in')
      getAccessToken()
    }

  }, [location.search])

  useEffect(() => {
    if (token) {
      handleisLoggedIn();
    }
  }, [token])

  usePageTitle("Home");

  const persistedUserLoggedInInfo = useSelector(
    (state) => state.reducerUserLoggedInfo.userLoggedInfo
  );
  return (
    <Content className=" temppic grid justify-items-center p-3 h-[75vh] bg-bottom ">
      {
        !isLoggedIn && <><h1>Loading DM-ADMIN-PORTAL</h1></>
      }
      {isLoggedIn &&
        <>
          <Title level={4}>This is Home page</Title>
          <Link to="dashboard">
            <Button className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
              Go to Dashboard
            </Button>
          </Link>
          {/* <Link to="/signin">
            <Button onClick={handleLogout} className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
              Logout
            </Button>
          </Link> */}
        </>
      }
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
