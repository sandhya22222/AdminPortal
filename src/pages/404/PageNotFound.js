import React from "react";
import { Layout, Typography } from "antd";
import Home from "../home/Home";

const { Content } = Layout;
const { Title } = Typography;

const auth = process.env.REACT_APP_AUTH;
const realmName = process.env.REACT_APP_REALMNAME
const clientId = process.env.REACT_APP_CLIENTID
const keyUrl = process.env.REACT_APP_KEYCLOAK_URL
// const storename = process.env.REACT_APP_STORE_NAME;

const storename = realmName
const keycloakData = {
  url:
  `${keyUrl}/realms/${storename}/protocol/openid-connect/auth?response_type=code&client_id=${storename}-client`,
  realmName: storename,
  clientId: `${storename}-client`,
};

function PageNotFound() {
  const keycloakUrl = `${keyUrl}/realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}`;
  return (
    <>
      {(auth === 'true') &&
        <Layout className="h-[500px]">
          <Content className="mt-[64px] grid justify-items-center align-items-center h-full">
             <Title level={4}>
              The Page you are trying to access is
              <span className="text-red-600 underline">Not Available</span>,
              Please login to access this page <a href={keycloakData.url} onClick={() => sessionStorage.setItem('keycloakData', JSON.stringify(keycloakData))}>Login </a>
            </Title>
          </Content>
        </Layout>}
      {
        (auth === 'false') &&
        <Home isLoggedIn={true} />
      }
    </>
  );
}

export default PageNotFound;

