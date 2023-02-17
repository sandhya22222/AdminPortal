//! Import libraries & components
import React, { useState } from "react";
import {
  Container,
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import { Typography, Layout, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

//! Import CSS libraries

//! Import user defined services
import { fnUserLoggedInInfo } from "../../services/redux/actions/ActionsUser";

//! Import user defined components & hooks
import { BrandLogo } from "../../constants/media";

//! Import user defined functions

//! Import user defined CSS
import "./header.css";
import { backendUrl } from "../../urlPages/backendUrl";
import { keycloakData } from "../../urlPages/keycloak";
import axios from "axios";

//! Get all required details from .env file
import {makeHttpRequestForRefreshToken} from "../../util/unauthorizedControl"
//! Destructure the components
const { Text } = Typography;
const { Content } = Layout;

const realmName = process.env.REACT_APP_REALMNAME;
const clientId = process.env.REACT_APP_CLIENTID;
const keyUrl = process.env.REACT_APP_KEYCLOAK_URL;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const logoutUrl = process.env.REACT_APP_LOGOUT;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isLoggedIn = sessionStorage.getItem("is_loggedIn");
  const token = sessionStorage.getItem("access_token");
  const refreshToken = sessionStorage.getItem("refresh_token");

  const handleSignIn = () => {
    window.location = `${keyUrl}/realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}`;
  };

  const handleLogout = () => {
    let baseurl = `${umsBaseUrl}${logoutUrl}`;
    axios({
      url: baseurl,
      method: "post",
      headers: {
        Authorization: token,
      },
      data: {
        refresh_token: refreshToken,
      },
    })
      .then((res) => {
        console.log("logged out res", res);
        if (res.status === 200) {
          sessionStorage.clear();
          // window.location = 'http://localhost:3002/'
          window.location = `${keyUrl}/realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}`;
        }
      })
      .catch((err) => {
        console.log("logged out err", err);
        sessionStorage.clear();
        if(err&&err.response&&err.response.status === 401){
           makeHttpRequestForRefreshToken();}
      });
  };

  const persistedUserLoggedInInfo = useSelector(
    (state) => state.reducerUserLoggedInfo.userLoggedInfo
  );

  const profileData = [
    {
      id: 1,
      value: "My Profile",
    },
    {
      id: 2,
      value: "Logout",
    },
  ];

  const handleDropDownProfile = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const onClickProfile = (id) => {
    if (id === 2) {
      toast("Successfully logged out", {
        type: "success",
        onClose: navigate("/", { replace: true }),
      });
      dispatch(fnUserLoggedInInfo());
    }
  };

  return (
    <Container fluid className="navbar z-20">
      <Navbar color="white" expand="md" fixed="top" className="drop-shadow">
        <NavbarBrand to="/" tag={Link} className="me-auto">
          <img src={BrandLogo} alt="logo" />
        </NavbarBrand>
        <NavbarToggler
          className="me-2"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto ps-5" navbar>
            {/* <NavItem>
              <NavLink tag={Link} to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/dashboard">
                Dashboard
              </NavLink>
            </NavItem>
            <UncontrolledDropdown inNavbar nav>
              <DropdownToggle caret nav>
                Options
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </Nav>
          <Nav navbar>
            {typeof persistedUserLoggedInInfo !== "undefined" ? (
              <>
                <span className="text-[#A00A18]   mr-5 text-center mt-2">
                  Welcome {""}
                  {persistedUserLoggedInInfo &&
                    persistedUserLoggedInInfo[0].name}
                </span>
                <Dropdown
                  isOpen={isProfileDropdownOpen}
                  toggle={handleDropDownProfile}
                >
                  <DropdownToggle
                    caret
                    className="flex  items-center !text-black bg-white outline-none !shadow-none"
                  >
                    <UserOutlined className=" align-middle" />
                  </DropdownToggle>
                  <DropdownMenu>
                    {profileData &&
                      profileData.map((element) => {
                        return (
                          <DropdownItem
                            header
                            // className="!text-black  !font-semibold cursor-pointer hover:bg-gray-200"
                            className={`!text-black  !font-semibold
                               ${
                                 element.id === 1
                                   ? "!text-opacity-30"
                                   : " !text-black  !font-semibold cursor-pointer hover:bg-gray-200 "
                               }
                             `}
                            key={element.id}
                          >
                            <div onClick={() => onClickProfile(element.id)}>
                              {element.value}
                            </div>
                          </DropdownItem>
                        );
                      })}
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              <Content className="">
                <Button
                  onClick={isLoggedIn ? handleLogout : handleSignIn}
                  className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]"
                >
                  {isLoggedIn ? "Logout" : "Signin"}
                </Button>
                {/* <Link
                  to={{
                    pathname: "/signin",
                  }}
                  className=" pl-[5px] font-semibold !no-underline"
                >
                  <Text className="">Signin</Text>
                </Link> */}
              </Content>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </Container>
  );
};

export default Header;
