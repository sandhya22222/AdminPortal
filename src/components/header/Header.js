import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { Layout, Input, Typography, Button } from "antd";

import { BrandLogo } from "../../constants/media";
import { useSelector, useDispatch } from "react-redux";
import { fnUserLoggedInInfo } from "../../services/redux/actions/ActionsUser";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./header.css";

const { Text } = Typography;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
    <Container fluid className="navbar">
      <Navbar color="primary" dark expand="md" fixed="top" light>
        <NavbarBrand to="/" tag={Link} className="me-auto">
          <img src={BrandLogo} alt="logo" width={150} />
        </NavbarBrand>
        <NavbarToggler
          className="me-2"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto ps-5" navbar>
            <NavItem>
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
            </UncontrolledDropdown>
          </Nav>
          <Nav navbar>
            {typeof persistedUserLoggedInInfo !== "undefined" ? (
              <>
                <span className="text-[#A00A18] font-bold  mr-5 text-center mt-2">
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
                    className=" !text-black bg-white outline-none !shadow-none"
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
              <div>
                <Link
                  to={{
                    pathname: "/signin",
                  }}
                  className=" pl-[5px] font-semibold"
                >
                  <Text className="">Signin</Text>
                </Link>
              </div>
            )}
            {/* <NavLink tag={Link} to="/signin">
              Signin
            </NavLink> */}
          </Nav>
        </Collapse>
      </Navbar>
    </Container>
  );
};

export default Header;
