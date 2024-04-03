// //! Import libraries
// import React, { useState, useEffect } from "react";
// import { Layout, Menu, Affix, Spin } from "antd";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import {
//   DashboardOutlined,
//   HomeOutlined,
//   LoadingOutlined,
//   GlobalOutlined,
//   AppstoreOutlined,
// } from "@ant-design/icons";
// import { FaHome } from "react-icons/fa";
// import { AiOutlineHome } from "react-icons/ai";
// //! Import CSS libraries

// //! Import user defined functions

// //! Import user defined CSS
// import "./sidebar.css";

// //! Destructure the components
// const { Sider, Content } = Layout;

// const antIcon = <LoadingOutlined className="text-[10px] hidden" spin />;

// //! Global Variables

// const Sidebar = (props) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [selectedItem, setSelectedItem] = useState([]);
//   const [openedItem, setOpenedItem] = useState([]);
//   const [loadingEffect, setLoadingEffect] = useState(false);
//   const { pathname } = useLocation();

//   const navigate = useNavigate();

//   // testt
//   const myData = [
//     // {
//     //   key: "-1",
//     //   icon: <AiOutlineHome />,
//     //   label: "Home",
//     //   navigate_to: "/",
//     //   item: null,
//     // },
//     {
//       key: "1",
//       icon: <DashboardOutlined />,
//       label: "Dashboard",
//       navigate_to: "/dashboard",
//       // children: [],
//     },
//     {
//       key: "2",
//       icon: <AppstoreOutlined />,
//       label: "Stores",
//       navigate_to: "/dashboard/store",
//     },
//     {
//       key: "3",
//       icon: <GlobalOutlined />,
//       label: "Languages",
//       navigate_to: "/dashboard/language",
//     },
//   ];

//   useEffect(() => {
//     switch (pathname.split("/")[2]) {
//       case "language":
//         setSelectedItem("3");
//         break;
//       case "store":
//         setSelectedItem("2");
//         break;
//       default:
//         setSelectedItem("1");
//         break;
//     }
//   }, [pathname]);

//   return (
//     <Layout>
//       <Layout
//         style={{
//           minHeight: "100vh",
//         }}
//       >
//         <Affix offsetTop={65}>
//           <Sider
//             width={245}
//             className="site-layout-background !pt-0 forscroll !bg-[#fff] min-h-screen"
//             collapsible
//             collapsed={collapsed}
//             onCollapse={(value) => setCollapsed(value)}
//           >
//             <Spin
//               spinning={loadingEffect}
//               indicator={antIcon}
//               tip="Please Wait..."
//             >
//               <Menu
//                 theme={props.color}
//                 mode="inline"
//                 className="h-full !text-base"
//                 selectedKeys={selectedItem}
//                 openKeys={openedItem}
//               >
//                 {myData.map((item) => (
//                   <Menu.Item
//                     icon={item.icon}
//                     key={item.key}
//                     // style={{ color: "black" }}
//                     onClick={() => {
//                       navigate(item.navigate_to);
//                     }}
//                   >
//                     {selectedItem === item.key ? (
//                       <span className="font-semibold ">{item.label}</span>
//                     ) : (
//                       item.label
//                     )}
//                   </Menu.Item>
//                 ))}
//               </Menu>
//             </Spin>
//           </Sider>
//         </Affix>
//         {/* <Layout> */}
//           <Content className="site-layout-background !bg-[#f4f4f4] min-h-[280px m-0] p-3">
//             <Outlet />
//           </Content>
//         {/* </Layout> */}
//       </Layout>
//     </Layout>
//   );
// };
// export default Sidebar;
