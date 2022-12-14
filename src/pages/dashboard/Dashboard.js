import { List } from "antd";
import { React, useState } from "react";
import { Container, ListInlineItem, Label, CardText } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { AiFillDashboard, AiFillSetting } from "react-icons/ai";
import "./dashboard.css";
import { Content } from "antd/es/layout/layout";
import { Layout, Typography } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import AntDesignBreadcrumbs from "../../components/AntDesignBreadcrumbs/AntDesignBreadcrumbs";

const { Title, Text } = Typography;
const Dashboard = () => {
  usePageTitle("Admin Portal - Dashboard");

  return (
    <Container fluid className="p-3">
      <Content>
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Dashboard", navigationPath: "", displayOrder: 2 },
          ]}
        />
        <CardText className="  d-flex  align-items-center my-3">
          <DashboardOutlined className="text-1xl me-2 d-flex  align-items-center" />
          <Title level={3} className="!font-normal mb-0">
            Dashboard
          </Title>
        </CardText>
      </Content>
    </Container>
  );
};

export default Dashboard;
