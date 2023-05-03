import React, { useState, useEffect } from "react";
import { Nav, Collapse, NavbarBrand, Navbar } from "reactstrap";
import { Button, Layout, Menu } from "antd";
import { BrandLogo } from "../../constants/media";
import { useDispatch, useSelector } from "react-redux";
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
  storeLogo,
}) => {
  const absoluteStoreImageInfo = useSelector(
    (state) => state.reducerAbsoluteStoreImageInfo.absoluteStoreImageInfo
  );

  return (
    <Content>
      <Header className="header">
        <div className="logo " />
        <Menu
          className="!h-16 "
          style={{
            backgroundColor: headerBackgroundColor,
            color: headerForegroundColor,
          }}
          mode="horizontal"
          defaultSelectedKeys={["2"]}
        >
          <div className="!text-start p-3">
            {absoluteStoreImageInfo.type === "store_logo" ? (
              <img className="w-[38px]" src={absoluteStoreImageInfo.value} />
            ) : (
              <img className="w-[150px] " src={BrandLogo} />
            )}
          </div>
          <div className="!text-center text-lg p-3 ">
            Header content of the page
          </div>
        </Menu>
      </Header>
      <Content
        className={`min-h-[300px] text-center `}
        style={{ backgroundColor: pageBackgroundColor }}
      >
        <Content className="text-center p-24">
          <p
            className={`text-center text-lg text-bold `}
            style={{ color: foreGroundColor }}
          >
            Main content of the page
          </p>
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
        className={`!h-24 flex items-center justify-center`}
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
