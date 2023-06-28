//! Import libraries
import React, { useState, useEffect } from "react";
import { Layout, Menu, Affix, Spin, Button, Divider } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CopyOutlined,
  LoadingOutlined,
  TranslationOutlined,
  ShopOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  MdDashboard,
  MdStore,
  MdLanguage,
  MdOutlinePayment,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import "./sidebarnew.css";

//! Destructure the components
const { Sider, Content } = Layout;

const antIcon = <LoadingOutlined className="text-[10px] hidden" spin />;

//! Global Variables

const SidebarNew = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [openedItem, setOpenedItem] = useState([]);
  const [loadingEffect, setLoadingEffect] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate();
  // testt
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
      icon: <MdDashboard className="!text-[#FCC32A]" />,
      inactive_icon: <MdDashboard className="!text-[#ffffffde]" />,
      label: "Dashboard",
      navigate_to: "/dashboard",
      // children: [],
    },
    {
      key: "2",
      icon: <MdStore className="!text-[#FCC32A]" />,
      inactive_icon: <MdStore className="!text-[#ffffffde]" />,
      label: "Stores",
      navigate_to: "/dashboard/store",
    },
    {
      key: "3",
      icon: <MdLanguage className="!text-[#FCC32A]" />,
      inactive_icon: <MdLanguage className="!text-[#ffffffde]" />,
      label: "Languages",
      navigate_to: "/dashboard/language",
    },
    // {
    //   key: "4",
    //   icon: <SettingOutlined />,
    //   label: "Store Settings",
    //   navigate_to: "/dashboard/storesetting",
    // },
    {
      key: "5",
      icon: <MdOutlinePayment className="!text-[#FCC32A]" />,
      inactive_icon: <MdOutlinePayment className="!text-[#ffffffde]" />,
      label: "Payment Type",
      navigate_to: "/dashboard/paymenttype",
    },
    {
      key: "6",
      icon: <UserOutlined className="!text-[#FCC32A]" />,
      inactive_icon: <UserOutlined className="!text-[#ffffffde]" />,
      label: "Profile",
      navigate_to: "/dashboard/userprofile",
    },
  ];

  const handlePageRefresh = (navigationPath) => {
    if (pathname !== navigationPath) {
      // navigate(0);
    }
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
      default:
        setSelectedItem("1");
        break;
    }
  }, [pathname]);

  return (
    <Layout>
      <Affix offsetTop={80}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={252}
          style={{
            // overflow: "auto",
            height: "100vh",
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
              className="h-full !text-base !bg-[#001529]"
              selectedKeys={selectedItem}
              openKeys={openedItem}
              theme={"dark"}
              style={{ height: "calc(100vh - 145px)", overflow: "auto" }}
            >
              {myData.map((item) => (
                <Menu.Item
                  icon={
                    selectedItem === item.key ? item.icon : item.inactive_icon
                  }
                  key={item.key}
                  onClick={() => {
                    navigate(item.navigate_to);
                  }}
                >
                  {selectedItem === item.key ? (
                    <span className="font-semibold ">{item.label}</span>
                  ) : (
                    <span className="text-[#ffffffde]"> {item.label} </span>
                  )}
                </Menu.Item>
              ))}
            </Menu>
          </Spin>
          <Content>
            <Divider
              style={{
                background: "#FFFFFF",
                opacity: "0.55",
                alignSelf: "stretch",
                margin: "0px",
                marginTop: "320px",
              }}
            />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: "100%",
                display: "flex",
                // padding: "8 16 8 16",
                // marginTop: "0px",
                color: "white",
                justifyContent: "center",
                // alignItems: "center",
                bottom: "0",
              }}
            />
          </Content>
        </Sider>
      </Affix>

      {/* </Sider>
        </Affix>
        <Content>
            <Divider
              style={{
                background: "#FFFFFF",
                opacity: "0.55",
                alignSelf: "stretch",
                margin: "0px",
                marginTop: "350px",
              }}
            />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: "100%",
                display: "flex",
                // padding: "8 16 8 16",
                // marginTop: "0px",
                color: "white",
                justifyContent: "center",
                // alignItems: "center",
                bottom: "0",
              }}
            />
          </Content> */}

      <Layout className="site-layout !w-[80%]">
        <Outlet />
      </Layout>
    </Layout>
  );
};
export default SidebarNew;
