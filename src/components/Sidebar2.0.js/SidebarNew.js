//! Import libraries
import { LoadingOutlined } from "@ant-design/icons";
import { Affix, Button, Divider, Layout, Menu, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BackBurger,
  PaymentTypeIcon,
  ProfileIcon,
  Store,
  TranslateIcon,
  ViewDashboard,
  menuIcon,
} from "../../constants/media";
import Footer from "./../footer/Footer";
import { useTranslation } from "react-i18next";
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import "./sidebarnew.css";
import util from "../../util/common";
import { useAuth } from "react-oidc-context";

//! Destructure the components
const { Sider, Content } = Layout;

const antIcon = <LoadingOutlined className="text-[10px] hidden" spin />;

//! Global Variables

const SidebarNew = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [openedItem, setOpenedItem] = useState([]);
  const [loadingEffect, setLoadingEffect] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

    // get permissions from storage
    const permissionValue = util.getPermissionData() || [];
    const auth = useAuth();
    // console.log("Permission value...", permissionValue)

  const { pathname } = useLocation();

  const navigate = useNavigate();
  const myData = [
    // {
    //   key: "-1",
    //   icon: <AiOutlineHome />,
    //   label: "Home",
    //   navigate_to: "/",
    //   item: null,
    // },
    {
      key: "1",
      icon: <img src={ViewDashboard} />,
      inactive_icon: <img src={ViewDashboard} />,
      label: ` ${t("labels:dashboard")}`,
      navigate_to: "/dashboard",
      show_in_menu: true,
      // children: [],
    },
    {
      key: "2",
      icon: <img src={Store} />,
      inactive_icon: <img src={Store} />,
      label: ` ${t("labels:stores")}`,
      navigate_to: "/dashboard/store",
      show_in_menu: true,
    },
    {
      key: "3",
      icon: <img src={TranslateIcon} />,
      inactive_icon: <img src={TranslateIcon} />,
      label: ` ${t("labels:languages")}`,
      navigate_to: "/dashboard/language",
      show_in_menu: true,
    },
    // {
    //   key: "4",
    //   icon: <SettingOutlined />,
    //   label: "Store Settings",
    //   navigate_to: "/dashboard/storesetting",
    // },
    {
      key: "5",
      icon: <img src={PaymentTypeIcon} />,
      inactive_icon: <img src={PaymentTypeIcon} />,
      label: ` ${t("labels:payment_type")}`,
      navigate_to: "/dashboard/paymenttype",
      show_in_menu: true,
    },
    {
      key: "6",
      icon: <img src={ProfileIcon} />,
      inactive_icon: <img src={ProfileIcon} />,
      label: ` ${t("labels:profile")}`,
      navigate_to: "/dashboard/userprofile",
      show_in_menu: true,
    },
    {
      key: "12",
      icon: <img src={ProfileIcon} alt="userAccessControl" />,
      inactive_icon: <img src={ProfileIcon} />,
      label: `${t("labels:user_access_control")}`,
      navigate_to: `/dashboard/user-access-control/list-user-roles`,
      show_in_menu: true,
      // children: [],
    },
    {
      key: "7",
      icon: <img src={Store} />,
      inactive_icon: <img src={Store} />,
      label: ` ${t("labels:admin_menu")}`,
      navigate_to: "/dashboard/adminsettings",
      show_in_menu: !auth.isAuthenticated ||
      (auth.isAuthenticated &&
        permissionValue &&
        permissionValue.length > 0 &&
        permissionValue.includes("UI-product-admin"))
        ? true
        : false,
    },
  ];

  const handlePageRefresh = (navigationPath) => {
    if (pathname !== navigationPath) {
      // navigate(0);
    }
  };

  // Function to handle mouse enter event on the sidebar
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Function to handle mouse leave event on the sidebar
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    switch (pathname.split("/")[2]) {
      case "userprofile":
        setSelectedItem("6");
        break;
      case "paymenttype":
        setSelectedItem("5");
        break;
      case "storesetting":
        setSelectedItem("4");
        break;
      case "language":
        setSelectedItem("3");
        break;
      case "store":
        setSelectedItem("2");
        break;
      case "user-access-control":
        setSelectedItem("12");
        break;
      case "user-access-control":
        setSelectedItem("12");
        break;
      case "adminsettings":
        setSelectedItem("7");
        break;
      default:
        setSelectedItem("1");
        break;
    }
  }, [pathname]);

  return (
    <Layout>
      <div>
        <Affix offsetTop={48}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={252}
            onMouseEnter={() => {
              handleMouseEnter();
            }}
            onMouseLeave={() => {
              handleMouseLeave();
            }}
            className="!bg-[var(--mp-brand-color)]"
            style={{
              overflow: isHovering ? "auto" : "hidden",
              height: "100vh",
              // backgroundColor: "#4A2D73",
              // left: 0,
              // top: 0,
              // bottom: 0,
            }}
            // className="!flex-[0_0_20%] min-h-screen border-r-[1px] drop-shadow-[0_0px_2px_rgba(0,0,0,0.15)]"
          >
            <Spin
              spinning={loadingEffect}
              indicator={antIcon}
              tip="Please Wait..."
            >
              <Menu
                mode="inline"
                className="h-full !text-base !bg-[var(--mp-brand-color)]"
                selectedKeys={selectedItem}
                openKeys={openedItem}
                theme={"dark"}
                style={{
                  height: "calc(100vh - 145px)",
                  overflow: isHovering ? "auto" : "hidden",
                  // backgroundColor: "#7d3192",
                }}
              >
                {myData.map((item) => (
                  item.show_in_menu ?
                    <Menu.Item
                      icon={
                        selectedItem === item.key ? item.icon : item.inactive_icon
                      }
                      key={item.key}
                      // className="!bg-[var(--mp-brand-color)] !hover:bg-[var(--mp-brand-color)]"
                      onClick={() => {
                        navigate(item.navigate_to);
                      }}
                    >
                      {selectedItem === item.key ? (
                        <span className="font-semibold ">{item.label}</span>
                      ) : (
                        <span className="text-[#ffffffde]"> {item.label} </span>
                      )}
                    </Menu.Item> : null
                ))}
              </Menu>
            </Spin>
            <Content className="justify-center self-center px-[8px] items-center">
              <Divider
                style={{
                  background: "#FFFFFF",
                  opacity: "0.55",
                  margin: "0px",
                  marginTop: "50px",
                }}
              />
            </Content>
            <Button
              type="text"
              icon={
                collapsed ? <img src={menuIcon} /> : <img src={BackBurger} />
              }
              onClick={() => setCollapsed(!collapsed)}
              className="!bg-[var(--mp-brand-color)] hover:bg-[var(--mp-brand-color)]"
              style={{
                width: "100%",
                display: "flex",
                padding: "8 16 8 16",
                marginTop: "10px",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </Sider>
        </Affix>
      </div>
      <Layout className="site-layout !w-[80%]">
        <Outlet />
        <Footer />
      </Layout>
    </Layout>
  );
};
export default SidebarNew;
