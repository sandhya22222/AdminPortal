//! Import libraries
import React, { useState, useEffect } from "react";
import { Layout, Menu, Affix, Spin } from "antd";
import {
  Outlet,
  Link,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { FaHome } from "react-icons/fa";
import { LoadingOutlined, GlobalOutlined } from "@ant-design/icons";

//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import "./sidebar.css";

//! Destructure the components
const { Sider, Content } = Layout;

const antIcon = <LoadingOutlined className="text-[10px] hidden" spin />;

//! Global Variables

const Sidebar = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState();
  const [selectedItem, setSelectedItem] = useState([]);
  const [openedItem, setOpenedItem] = useState([]);

  const [loadingEffect, setLoadingEffect] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const params = useParams();
  // testt
  const myData = [
    {
      key: "-1",
      icon: <FaHome />,
      label: "Home",
      navigate_to: "/",
      item: null,
    },
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      navigate_to: "/dashboard",
      // children: [],
    },
    {
      key: "2",
      icon: <GlobalOutlined />,
      label: "Language",
      navigate_to: "/dashboard/vendoraccess",
    },
  ];

  useEffect(() => {
    switch (pathname.split("/")[2]) {
      case "vendoraccess":
        // setOpenedItem("2");
        setSelectedItem("2");
        break;
      //   case "products":
      //     setOpenedItem(["2"]);
      //     setSelectedItem("113");
      //     break;
      //   case "vendor_types":
      //     setOpenedItem(["3"]);
      //     setSelectedItem("114");
      //     break;
      //   case "vendor":
      //     setOpenedItem(["3"]);
      //     setSelectedItem("115");
      //     break;
      //   case "approvals":
      //     setSelectedItem("4");
      //     break;
      //   case "store-settings":
      //     setSelectedItem("5");
      //     break;
      //   case "settings":
      //     setOpenedItem(["5"]);
      //     setSelectedItem("111");
      //     break;
      default:
        setSelectedItem("1");
        break;
    }
  }, [pathname]);

  return (
    <Layout>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Affix offsetTop={65}>
          <Sider
            width={245}
            className="site-layout-background !pt-0 forscroll !bg-[#fff] min-h-screen"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <Spin
              spinning={loadingEffect}
              indicator={antIcon}
              tip="Please Wait..."
            >
              <Menu
                theme={props.color}
                mode="inline"
                className="h-full !text-base"
                selectedKeys={selectedItem}
                openKeys={openedItem}
              >
                {myData.map((item) => (
                  <Menu.Item
                    icon={item.icon}
                    key={item.key}
                    style={{ color: "black" }}
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
        </Affix>
        <Layout>
          <Content className="site-layout-background !bg-[#f4f4f4] min-h-[280px m-0]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Sidebar;
