import React from "react";
import { Layout, Typography } from "antd";
import { keycloakData } from "../../urlPages/keycloak";

const { Content } = Layout;
const { Title } = Typography;
const keycloakUrl = keycloakData.url
function PageNotFound() {
  return (
    <Layout className="h-[500px]">
    <Content className="mt-[64px] grid justify-items-center align-items-center h-full">
      <Title level={4}>
        The Page you are trying to access is{" "}
        <span className="text-red-600 underline">Not Available</span>, 
        Please login to access this page <a href={keycloakUrl}>Login </a>
      </Title>
    </Content>
    </Layout>
  );
}

export default PageNotFound;

