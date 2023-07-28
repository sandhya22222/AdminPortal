import React, { useState, useEffect } from "react";
import { Nav, Collapse, NavbarBrand, Navbar } from "reactstrap";
import { Button, Layout, Menu, Typography } from "antd";
import { BrandLogo, DmBrandLogo } from "../../constants/media";
import { useDispatch, useSelector } from "react-redux";
const { Header, Content, Sider } = Layout;
const { Text } = Typography;
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
  getImageData,
}) => {
  const absoluteStoreImageInfo = useSelector(
    (state) => state.reducerAbsoluteStoreImageInfo.absoluteStoreImageInfo
  );

  console.log("absoluteStoreImageInfo", absoluteStoreImageInfo.value);
  console.log("getImageData", getImageData);
  return (
    <Content>
      <Content>
        <Header className="header">
          <Menu
            className="!h-16 flex "
            style={{
              backgroundColor: headerBackgroundColor,
              // color: headerForegroundColor,
            }}
            mode="horizontal"
          >
            <Content className="!text-start p-3">
              {getImageData && getImageData.length > 0 ? (
                absoluteStoreImageInfo &&
                absoluteStoreImageInfo.type === "store_logo" ? (
                  <img
                    className="w-[170px] !mb-2"
                    src={absoluteStoreImageInfo.value}
                  />
                ) : (
                  <img className="w-[38px] !mb-2" src={DmBrandLogo} />
                )
              ) : (
                <img className="w-[38px] !mb-2" src={DmBrandLogo} />
              )}
            </Content>
            <Content
              className="text-lg grid !items-center !justify-center !pl-40 "
              style={{ color: headerForegroundColor }}
            >
              Header content of the page
            </Content>
          </Menu>
        </Header>
      </Content>
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
