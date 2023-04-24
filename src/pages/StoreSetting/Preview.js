import React from "react";
import { Nav, Collapse, NavbarBrand, Navbar } from "reactstrap";
import { Button, Layout, Menu } from "antd";
const { Header, Content, Sider } = Layout;

const Preview = ({
  headerBackgroundColor,
  headerForegroundColor,
  footerBackgroundColor,
  footerForegroundColor,
  pageBackgroundColor,
  foreGroundColor,
  buttonPrimaryBackgroundColor,
  buttonSecondaryBackgroundColor,
  buttonTeritaryBackgroundColor,
  buttonPrimaryForegroundColor,
  buttonSecondaryForegroundColor,
  buttonTeritaryForegroundColor,
}) => {
  const items1 = ["1", "2", "3"].map((key) => ({
    key,
    label: <div className={`text-[${headerForegroundColor}]`}>nav {key}</div>,
  }));

  console.log(
    "foreGroundColor",
    buttonPrimaryForegroundColor,
    buttonSecondaryForegroundColor,
    buttonTeritaryForegroundColor
  );

  return (
    <Content>
      <Header className="header">
        <div className="logo " />
        <Menu
          className={`bg-[${headerBackgroundColor}]`}
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items1}
        />
      </Header>
      <Content className={`bg-[${pageBackgroundColor}] min-h-[200px]`}>
        <p className={`bg-[${foreGroundColor}] text-center mb-2`}>
          This is Main Page
        </p>
        <Content className="text-center">
          <Button
            className={`bg-[${buttonPrimaryBackgroundColor}] text-[${buttonPrimaryForegroundColor}]`}
          >
            Button1
          </Button>
          <Button
            className={`bg-[${buttonSecondaryBackgroundColor}] text-[${buttonSecondaryForegroundColor}] ml-8`}
          >
            Button2
          </Button>
          <Button
            className={`bg-[${buttonTeritaryBackgroundColor}] text-[${buttonTeritaryForegroundColor}] ml-8`}
          >
            Button3
          </Button>
        </Content>
      </Content>
      <Content
        className={`bg-[${footerBackgroundColor}] !h-12 flex items-center justify-center`}
      >
        <p className={`text-[${footerForegroundColor}]`}>This is footer</p>
      </Content>
    </Content>
  );
};

export default Preview;
