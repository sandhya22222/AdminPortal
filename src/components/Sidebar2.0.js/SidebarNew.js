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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
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

const SidebarNew = (props) => {
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
      icon: <DashboardOutlined className="!text-[#ffffffde]" />,
      label: "Dashboard",
      navigate_to: "/dashboard",
      // children: [],
    },
    {
      key: "2",
      icon: <ShopOutlined className="!text-[#ffffffde]" />,
      label: "Stores",
      navigate_to: "/dashboard/store",
    },
    {
      key: "3",
      icon: <TranslationOutlined className="!text-[#ffffffde]" />,
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
      icon: <DollarCircleOutlined className="!text-[#ffffffde]" />,
      label: "Payment Type",
      navigate_to: "/dashboard/paymenttype",
    },
    // {
    //   key: "5",
    //   icon: <CopyOutlined />,
    //   label: "Online Payment Connector",
    //   navigate_to: "/dashboard/onlinepaymentconnector",
    // },
  ];

  const handlePageRefresh = (navigationPath) => {
    if (pathname !== navigationPath) {
      // navigate(0);
    }
  };
  useEffect(() => {
    switch (pathname.split("/")[2]) {
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
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={252}
          style={{
            overflow: "auto",
            height: "100vh",
            left: 0,
            top: 0,
            bottom: 0,
          }}
          className="!flex-[0_0_20%] min-h-screen border-r-[1px] drop-shadow-[0_0px_2px_rgba(0,0,0,0.15)]"
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
              theme={props.color}
            >
              {myData.map((item) => (
                <Menu.Item
                  icon={item.icon}
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
        </Sider>
      </Affix>
      <Layout className="site-layout !w-[80%]">
        <Outlet />
      </Layout>
    </Layout>
  );
};
export default SidebarNew;
