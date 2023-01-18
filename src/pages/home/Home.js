//! Import libraries & components
import React, { useEffect, useState } from "react";
import { Button, Layout, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { backendUrl, keycloakData } from "../../keycloak";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";

//! Import user defined functions

//! Import user defined CSS
import "./home.css";


//! Get all required details from .env file

//! Destructure the components
const { Title } = Typography;
const { Content } = Layout;

const realmName = keycloakData.realmName
const keycloakUrl = keycloakData.url
const isLoggedInURL = backendUrl.isLoggedInURL
const getPermissionsUrl = backendUrl.getPermissionsUrl
const logoutUrl = backendUrl.logoutUrl
const getAccessTokenUrl = backendUrl.getAccessTokenUrl


const Home = ({isLoggedIn, setIsLoggedIn}) => {


  const location = useLocation();
  const [token, setToken] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getPermissionsData, setGetPermissionsData] = useState([])

  const handleSignIn = () => {
    window.location = keycloakUrl;
  }

  const handleisLoggedIn = () => {
    let baseurl = isLoggedInURL;
    axios({
      url: baseurl,
      method: 'post',
      data: {
        realmname: realmName,
        account_name: realmName,
        token: token
      },
    }
    ).then(res => {
      setIsLoggedIn(res.data.is_loggedin)
      sessionStorage.setItem('is_loggedIn', res.data.is_loggedin )
    }).catch(err => {
      console.log('isLoggedIn err', err)
    })
  }

  const getAccessToken = () => {
    let urlparams = new URLSearchParams(location.search);
    if (urlparams.has("code")) {
      let code = urlparams.get('code');
      console.log('code', code)

      let baseurl = getAccessTokenUrl + code;

      axios(baseurl).then(res => {
        // console.log('get access token res', res);
        if (res.data.access_token) {
          setToken(res.data.access_token);
          setrefreshToken(res.data.refresh_token)
          sessionStorage.setItem('access_token', res.data.access_token )
        }
      }).catch(err => {
        console.log('get access token err', err)
      })
    }
  }
  const getPermissions = () => {
    let baseurl = getPermissionsUrl;
    axios({
      url: baseurl,
      method: 'post',
      data: {
        account_name: realmName,
        token: token
      },
    }).then(res => {
      console.log('get access token res', res);
      setGetPermissionsData(res.data)
      sessionStorage.setItem("permissions_data", res.data);
    }).catch(err => {
      console.log('get access token err', err)
    })
  }
  const handleLogout = () => {
    let baseurl = logoutUrl;
    axios({
      url: baseurl,
      method: 'post',
      data: {
        account_name: realmName,
        refresh_token: refreshToken,
        token: token
      }
    }).then(res => {
      console.log('logged out res', res);
      if (res.data === "success") {
        sessionStorage.clear()
        window.location = keycloakUrl
        setIsLoggedIn(false)
      }

    }).catch(err => {
      console.log('logged out err', err)
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
          <Link to="/signin">
            <Button onClick={handleLogout} className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
              Logout
            </Button>
          </Link>
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
