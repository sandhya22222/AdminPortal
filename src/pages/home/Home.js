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

//! Get all required details from .env file

//! Destructure the components
const { Title } = Typography;
const { Content } = Layout;

const Home = () => {
  const realmName = 'dmadmin'
  const clientId = 'dmadmin-client'

  const location = useLocation();
  const [token, setToken] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    window.location = `http://54.210.56.174:8080/realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}`;
  }

  const handleisLoggedIn = () => {
    let baseurl = 'http://127.0.0.1:5000/authenticate/is_loggedin';
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
    }).catch(err => {
      console.log('isLoggedIn err', err)
    })
  }

  const getAccessToken = () => {
    let urlparams = new URLSearchParams(location.search);
    if (urlparams.has("code")) {
      let code = urlparams.get('code');
      console.log('code', code)

      let baseurl = 'http://127.0.0.1:5000/authenticate/get_access_token?code=' + code;

      axios(baseurl).then(res => {
        // console.log('get access token res', res);
        if (res.data.access_token) {
          setToken(res.data.access_token);
          setrefreshToken(res.data.refresh_token)
        }
      }).catch(err => {
        console.log('get access token err', err)
      })
    }
  }

  const handleLogout = () => {
    let baseurl = 'http://127.0.0.1:5000/authenticate/logout';
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
      alert("Logging out")
      if (res.data === "success") {
        window.location = `http://54.210.56.174:8080/realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}`
        setIsLoggedIn(false)
      }

    }).catch(err => {
      console.log('logged out err', err)
    })
  }

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
