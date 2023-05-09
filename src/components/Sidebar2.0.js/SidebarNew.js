//! Import libraries
import React, { useState, useEffect } from "react";
import { Layout, Menu, Affix, Spin } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CopyOutlined,
  LoadingOutlined,
  TranslationOutlined,
  ShopOutlined,
  DollarCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FaHome } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
// import "./sidebar.css";

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
      icon: <DashboardOutlined />,
      label: "Dashboard",
      navigate_to: "/dashboard",
      // children: [],
    },
    {
      key: "2",
      icon: <ShopOutlined />,
      label: "Stores",
      navigate_to: "/dashboard/store",
    },
    {
      key: "3",
      icon: <TranslationOutlined />,
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
      icon: <DollarCircleOutlined />,
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
    <Layout hasSider className="w-full">
      {/* <Affix offsetTop={80}> */}
      <Sider className="bg-white !fixed !max-h-screen !w-[20%] !min-w-[20%] !max-w-[20%] !flex-[0_0_20%] !overflow-auto left-0 bottom-0 top-20 border-r-[1px] drop-shadow-[0_0px_2px_rgba(0,0,0,0.15)]">
        <Spin spinning={loadingEffect} indicator={antIcon} tip="Please Wait...">
          <Menu
            mode="inline"
            className="h-full"
            selectedKeys={selectedItem}
            openKeys={openedItem}
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
                  item.label
                )}
              </Menu.Item>
            ))}
          </Menu>
        </Spin>
      </Sider>
      {/* </Affix> */}
      <Layout className="site-layout !ml-[20%] !w-[80%] !min-h-screen">
        {" "}
        {/* <Content className="site-layout-background !bg-[#f4f4f4] min-h-[280px] mt-20"> */}
        <Outlet />
        {/* </Content> */}
      </Layout>
    </Layout>
  );
};
export default SidebarNew;
