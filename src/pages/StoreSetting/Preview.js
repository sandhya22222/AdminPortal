import React, { useState, useEffect } from "react";
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
  const [storeHeaderBgColor, setStoreHeaderBgColor] = useState();

  const items1 = ["1"].map((key) => ({
    key,
    label: (
      <div
        style={{ color: headerForegroundColor }}
        className="text-center text-lg"
      >
        {" "}
        Header content of the page
      </div>
    ),
  }));

  console.log(
    "foreGroundColor",
    buttonPrimaryForegroundColor,
    buttonSecondaryForegroundColor,
    buttonTeritaryForegroundColor
  );

  useEffect(() => {
    setStoreHeaderBgColor(headerBackgroundColor);
  }, [headerBackgroundColor]);

  return (
    <Content>
      <Header className="header">
        <div className="logo " />
        <Menu
          className="!items-center justify-center text-lg !h-10 "
          style={{
            backgroundColor: headerBackgroundColor,
            color: headerForegroundColor,
          }}
          mode="horizontal"
          defaultSelectedKeys={["2"]}
        >
          Header content of the page
        </Menu>
      </Header>
      <Content
        className={`min-h-[200px]`}
        style={{ backgroundColor: pageBackgroundColor }}
      >
        <p
          className={`text-center text-lg text-bold mb-10 `}
          style={{ color: foreGroundColor }}
        >
          Main content of the page
        </p>
        <Content className="text-center">
          <Button
            // className={`bg-[${buttonPrimaryBackgroundColor}] text-[${buttonPrimaryForegroundColor}]`}
            style={{
              backgroundColor: buttonPrimaryBackgroundColor,
              color: buttonPrimaryForegroundColor,
              border: buttonPrimaryBackgroundColor,
            }}
          >
            Button1
          </Button>
          <Button
            // className={`bg-[${buttonSecondaryBackgroundColor}] text-[${buttonSecondaryForegroundColor}] ml-8`}
            className="ml-8"
            style={{
              backgroundColor: buttonSecondaryBackgroundColor,
              color: buttonSecondaryForegroundColor,
              border: buttonSecondaryBackgroundColor,
            }}
          >
            Button2
          </Button>
          <Button
            // className={`bg-[${buttonTeritaryBackgroundColor}] text-[${buttonTeritaryForegroundColor}] ml-8`}
            className="ml-8"
            style={{
              backgroundColor: buttonTeritaryBackgroundColor,
              color: buttonTeritaryForegroundColor,
              border: buttonTeritaryBackgroundColor,
            }}
          >
            Button3
          </Button>
        </Content>
      </Content>
      <Content
        className={`!h-10 flex items-center justify-center`}
        style={{ backgroundColor: footerBackgroundColor }}
      >
        <p style={{ color: footerForegroundColor }} className="text-lg">
          Footer Content of the page
        </p>
      </Content>
    </Content>
  );
};

export default Preview;
