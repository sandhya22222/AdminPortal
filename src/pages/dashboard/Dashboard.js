//! Import libraries & components
import { React } from "react";
import { Layout, Typography } from "antd";
import { DashboardOutlined } from "@ant-design/icons";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { usePageTitle } from "../../hooks/usePageTitle";

//! Import user defined functions

//! Import user defined CSS
import "./dashboard.css";

//! Get all required details from .env file

//! Destructure the components
const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  usePageTitle("Admin Portal - Dashboard");

  return (
    <Content className="p-3">
      <AntDesignBreadcrumbs
        data={[
          { title: "Home", navigationPath: "/", displayOrder: 1 },
          { title: "Dashboard", navigationPath: "", displayOrder: 2 },
        ]}
      />
      <Content className="  d-flex  align-items-center my-3">
        <DashboardOutlined className="text-1xl me-2 d-flex  align-items-center" />
        <Title level={3} className="!font-normal mb-0">
          Dashboard
        </Title>
      </Content>
    </Content>
  );
};

export default Dashboard;
