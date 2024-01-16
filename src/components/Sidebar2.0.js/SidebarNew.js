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
  UserAccessControl,
  StoreSettings,
  PaymentSettingsIcon,
  OpenInNew,
} from "../../constants/media";
import Footer from "./../footer/Footer";
import { useTranslation } from "react-i18next";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import "./sidebarnew.css";
import util from "../../util/common";
import { useAuth } from "react-oidc-context";

//! Destructure the components
const { Sider, Content } = Layout;

const antIcon = <LoadingOutlined className="text-[10px] hidden" spin />;
const pageLimitFromENV = process.env.REACT_APP_ITEM_PER_PAGE;
const sfUrlAPI = process.env.REACT_APP_STORE_FRONT_URL;


//! Global Variables

const SidebarNew = ({ permissionValue, collapsed, setCollapsed }) => {
  const { t } = useTranslation();
  // const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [openedItem, setOpenedItem] = useState([]);
  const [loadingEffect, setLoadingEffect] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [sfUrl, setSFUrl] = useState();


  // get permissions from storage

  const auth = useAuth();
  // console.log("Permission value...", permissionValue)

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [myData, setMyData] = useState([]);

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

  const storeFrontUrl = () => {
    MarketplaceServices.findAll(
      sfUrlAPI,
      // { "vendor-status": parseInt(1) },
      null,
      true
    )
      .then(function (response) {
        console.log("Response from get SF url", response.data);
        if (response.data.response_body) {
          setSFUrl(response.data.response_body.url);
        }
      })
      .catch(function (error) {
        // setIsNetworkError(true);
        console.log("Response from SFurl", error);
      });
    }
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
      // case "adminsettings":
      //   setSelectedItem("7");
      //   break;
      default:
        setSelectedItem("1");
        break;
    }
  }, [pathname]);

  useEffect(() => {
    // const myData =
    // const permissionValue = util.getPermissionData() || [];
    // storeFrontUrl();

    console.log(
      "permission value",
      permissionValue.length > 0 && permissionValue.includes("UI-product-admin")
        ? false
        : true,
      permissionValue,
      window.sessionStorage.getItem("permissions_data"),
      myData
    );
    if (permissionValue && permissionValue.length > 0) {
      setMyData([
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
          key: "15",
          icon: <img src={StoreSettings} alt="storeSettings" />,
          inactive_icon: <img src={StoreSettings} />,
          label: `${t("labels:Settings")}`,
          navigate_to: "/dashboard/",
          show_in_menu: true,
          childrenKeys:["3","5","6","12"],
          children: [
            {
              key: "3",
              icon: <img src={TranslateIcon} />,
              inactive_icon: <img src={TranslateIcon} />,
              label: ` ${t("labels:languages")}`,
              navigate_to: "/dashboard/language",
              show_in_menu:
                !auth.isAuthenticated ||
                (auth.isAuthenticated &&
                  permissionValue &&
                  permissionValue.length > 0 &&
                  permissionValue.includes("UI-product-admin"))
                  ? false
                  : true,
            },
            {
              key: "5",
              icon: <img src={PaymentSettingsIcon} />,
              inactive_icon: <img src={PaymentTypeIcon} />,
              label: ` ${t("labels:payment_settings")}`,
              navigate_to: "/dashboard/paymenttype",
              show_in_menu: true,
            },
            {
              key: "6",
              icon: (
                <img
                  src={ProfileIcon}
                  alt="profileIcon"
                  width={"15px"}
                  height={"15px"}
                />
              ),
              inactive_icon: (
                <img
                  src={ProfileIcon}
                  alt="profileIcon"
                  width={"15px"}
                  height={"15px"}
                />
              ),
              label: ` ${t("labels:my_profile")}`,
              navigate_to: "/dashboard/userprofile",
              show_in_menu: true,
            },
            {
              key: "12",
              icon: (
                <img
                  src={UserAccessControl}
                  alt="userAccessControl"
                  width={"15px"}
                  height={"15px"}
                />
              ),
              inactive_icon: (
                <img
                  src={UserAccessControl}
                  alt="userAccessControl"
                  width={"15px"}
                  height={"15px"}
                />
              ),
              label: `${t("labels:user_access_control")}`,
              navigate_to: `/dashboard/user-access-control/list-user-roles?tab=0&page=1&limit=${pageLimitFromENV}`,
              show_in_menu:
                !auth.isAuthenticated ||
                (auth.isAuthenticated &&
                  permissionValue &&
                  permissionValue.length > 0 &&
                  permissionValue.includes("UI-user-access-control"))
                  ? true
                  : false,
              // !auth.isAuthenticated ||
              // (auth.isAuthenticated &&
              //   permissionValue &&
              //   permissionValue.length > 0 &&
              //   permissionValue.includes("UI-user-access-control"))
              //   ? true
              //   : false,
              // children: [],
            },
          ],
        },
        // moved into store settings
        // {
        //   key: "3",
        //   icon: <img src={TranslateIcon} />,
        //   inactive_icon: <img src={TranslateIcon} />,
        //   label: ` ${t("labels:languages")}`,
        //   navigate_to: "/dashboard/language",
        //   show_in_menu:
        //     !auth.isAuthenticated ||
        //     (auth.isAuthenticated &&
        //       permissionValue &&
        //       permissionValue.length > 0 &&
        //       permissionValue.includes("UI-product-admin"))
        //       ? false
        //       : true,
        // },
        // {
        //   key: "4",
        //   icon: <SettingOutlined />,
        //   label: "Store Settings",
        //   navigate_to: "/dashboard/storesetting",
        // },
        // {
        //   key: "5",
        //   icon: <img src={PaymentTypeIcon} />,
        //   inactive_icon: <img src={PaymentTypeIcon} />,
        //   label: ` ${t("labels:payment_type")}`,
        //   navigate_to: "/dashboard/paymenttype",
        //   show_in_menu: true,
        // },
        // {
        //   key: "6",
        //   icon: (
        //     <img
        //       src={ProfileIcon}
        //       alt="profileIcon"
        //       width={"15px"}
        //       height={"15px"}
        //     />
        //   ),
        //   inactive_icon: (
        //     <img
        //       src={ProfileIcon}
        //       alt="profileIcon"
        //       width={"15px"}
        //       height={"15px"}
        //     />
        //   ),
        //   label: ` ${t("labels:profile")}`,
        //   navigate_to: "/dashboard/userprofile",
        //   show_in_menu: true,
        // },
        // {
        //   key: "9",
        //   icon: <img src={ViewDashboard} />,
        //   inactive_icon: <img src={ViewDashboard} />,
        //   label: ` ${t("labels:dashboard")}`,
        //   navigate_to: "/dashboard/newDashboard",
        //   show_in_menu: true,
        // },
        // {
        //   key: "12",
        //   icon: (
        //     <img
        //       src={UserAccessControl}
        //       alt="userAccessControl"
        //       width={"15px"}
        //       height={"15px"}
        //     />
        //   ),
        //   inactive_icon: (
        //     <img
        //       src={UserAccessControl}
        //       alt="userAccessControl"
        //       width={"15px"}
        //       height={"15px"}
        //     />
        //   ),
        //   label: `${t("labels:user_access_control")}`,
        //   navigate_to: `/dashboard/user-access-control/list-user-roles?tab=0&page=1&limit=${pageLimitFromENV}`,
        //   show_in_menu:
        //     !auth.isAuthenticated ||
        //     (auth.isAuthenticated &&
        //       permissionValue &&
        //       permissionValue.length > 0 &&
        //       permissionValue.includes("UI-user-access-control"))
        //       ? true
        //       : false,
        //   // !auth.isAuthenticated ||
        //   // (auth.isAuthenticated &&
        //   //   permissionValue &&
        //   //   permissionValue.length > 0 &&
        //   //   permissionValue.includes("UI-user-access-control"))
        //   //   ? true
        //   //   : false,
        //   // children: [],
        // },
        // {
        //   key: "7",
        //   icon: <img src={Store} />,
        //   inactive_icon: <img src={Store} />,
        //   label: ` ${t("labels:admin_menu")}`,
        //   navigate_to: "/dashboard/adminsettings",
        //   show_in_menu: !auth.isAuthenticated ||
        //   (auth.isAuthenticated &&
        //     permissionValue &&
        //     permissionValue.length > 0 &&
        //     permissionValue.includes(UI-product-admin))
        //     ? true
        //     : false,
        // },
      ]);
    }
  }, [permissionValue]);

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
              spinning={myData.length > 0 ? false : true}
              indicator={antIcon}
              tip=""
            >
              {/* <Content className="!h-12  space-y-4 !bg-[#392359] !py-2">
                {myData && myData.length > 0 ? (
                  <Content> */}
                    {/* <Content
                      className={` text-white font-normal ${
                        util.getSelectedLanguageDirection()?.toUpperCase() ===
                        "RTL"
                          ? "!mr-7"
                          : "!ml-7"
                      }`}
                    >
                      {collapsed ? (
                        <p className="">{"TH"}</p>
                      ) : (
                        <p>{"Torry Harris Market Place"}</p>
                      )}
                    </Content> */}
                    {/* <Content className="flex cursor-pointer"  onClick={() => window.open(sfUrl, "_blank")}>
                      {collapsed ? (
                        <div className="  w-[100%] !flex !items-center !justify-center">
                          <img
                            src={OpenInNew}
                            alt="openInNewIcon"
                            width={"22px"}
                            height={"22px"}
                            // className="!ml-6"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="!w-[25%] ">
                            <img
                              src={Store}
                              alt="StoreIcon"
                              width={"20px"}
                              height={"20px"}
                              className={` ${
                                util
                                  .getSelectedLanguageDirection()
                                  ?.toUpperCase() === "RTL"
                                  ? "!mr-6"
                                  : "!ml-6"
                              }`}
                            />
                          </div>
                          <div className="!w-[70%]">
                            <p className="text-white">{"View My Store"}</p>
                          </div>
                          <div className="!w-[25%] ">
                            <img
                              src={OpenInNew}
                              alt="openInNewIcon"
                              width={"22px"}
                              height={"22px"}
                              // className="!ml-6"
                            />
                          </div>
                        </>
                      )}
                    </Content> */}
                  {/* </Content>
                ) : null}
              </Content> */}
              <Menu
                mode="inline"
                className="h-full !text-base !bg-[var(--mp-brand-color)]"
                selectedKeys={selectedItem}
                openKeys={openedItem}
                onOpenChange={(e) => {
                  setOpenedItem(e);
                  // console.log(e);
                }}
                theme={"dark"}
                style={{
                  height: "calc(100vh - 145px)",
                  overflow: isHovering ? "auto" : "hidden",
                  // backgroundColor: "#7d3192",
                }}
              >
                {/* {myData.length > 0
                  ? myData.map((item) =>
                      item.show_in_menu ? (
                        <Menu.Item
                          icon={
                            selectedItem === item.key
                              ? item.icon
                              : item.inactive_icon
                          }
                          key={item.key}
                          // className="!bg-[var(--mp-brand-color)] !hover:bg-[var(--mp-brand-color)]"
                          onClick={() => {
                            if (item.key == 2) {
                              sessionStorage.setItem("currentStoretab", 1);
                            }
                            navigate(item.navigate_to);
                          }}
                        >
                          {selectedItem === item.key ? (
                            <span className="font-semibold ">{item.label}</span>
                          ) : (
                            <span className="text-[#ffffffde]">
                              {" "}
                              {item.label}{" "}
                            </span>
                          )}
                        </Menu.Item>
                      ) : null
                    )
                  : ""} */}
                {myData.map((item) =>
                  item.show_in_menu && item.children ? (
                    <Menu.SubMenu
                      icon={item.icon}
                      key={item.key}
                      // style={{ color: "black" }}
                      title={item.label}
                      style={{
                        opacity: item.childrenKeys.includes(selectedItem)
                          ? 1
                          : 0.7,
                      }}
                    >
                      {item.children.map((child) =>
                        child.show_in_menu ? (
                          <Menu.Item
                            icon={child.icon}
                            key={child.key}
                            // style={{ color: "black" }}
                            onClick={() => {
                              navigate(child.navigate_to);
                              handlePageRefresh(child.navigate_to);
                            }}
                            style={{
                              opacity: selectedItem === child.key ? 1 : 0.8,
                            }}
                          >
                            {selectedItem === child.key ? (
                              <span className="font-semibold">
                                {child.label}
                              </span>
                            ) : (
                              child.label
                            )}
                          </Menu.Item>
                        ) : null
                      )}
                    </Menu.SubMenu>
                  ) : item.show_in_menu ? (
                    <Menu.Item
                      icon={item.icon}
                      key={item.key}
                      disabled={!item.show_in_menu}
                      // style={{ color: "black" }}
                      onClick={() => {
                        navigate(item.navigate_to);
                        handlePageRefresh(item.navigate_to);
                      }}
                      style={{
                        opacity: selectedItem === item.key ? 1 : 0.8,
                      }}
                    >
                      {selectedItem === item.key ? (
                        <span className="font-semibold ">{item.label}</span>
                      ) : (
                        item.label
                      )}
                    </Menu.Item>
                  ) : null
                )}
              </Menu>
              {/* <Content className="justify-center self-center px-[8px] items-center">
                <Divider
                  style={{
                    background: "#FFFFFF",
                    opacity: "0.55",
                    margin: "0px",
                    marginTop: "50px",
                  }}
                />
              </Content> */}
            </Spin>
            {/* <Button
              type="text"
              icon={
                collapsed ? (
                  <img src={menuIcon} />
                ) : (
                  <img
                    className={`  ${
                      util.getSelectedLanguageDirection()?.toUpperCase() ===
                      "RTL"
                        ? "rotate-180"
                        : ""
                    }`}
                    src={BackBurger}
                    alt="BackButton"
                  />
                )
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
            /> */}
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
