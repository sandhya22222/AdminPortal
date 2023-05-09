import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Layout, Tooltip, Image, Dropdown, Avatar, Typography } from "antd";
import {
  TranslationOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./header2.css";

import MarketplaceServices from "../../services/axios/MarketplaceServices";
//! Import user defined services
import { fnUserLoggedInInfo } from "../../services/redux/actions/ActionsUser";

import { BrandLogo, AdminIcon } from "../../constants/media";

import util from "../../util/common";

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;

const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const logoutAPI = process.env.REACT_APP_LOGOUT;

const Header2 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isUserLoggedIn = sessionStorage.getItem("is_loggedIn");


  // const languageItems = [];
  // if (storeLanguages && storeLanguages.length > 1) {
  //   storeLanguages.forEach((element) => {
  //     const languageItem = {};
  //     languageItem["key"] = element.dm_language_code;
  //     languageItem["label"] = element.language_name;
  //     languageItems.push(languageItem);
  //   });
  // }

  const userItems = [
    {
      label: "Profile",
      key: "profile",
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = (e) => {
    console.log("click", e);
    if (e.key === "logout") {
      const refreshToken = sessionStorage.getItem("refresh_token");
      MarketplaceServices.save(umsBaseUrl + logoutAPI, {
        refresh_token: refreshToken,
      })
        .then((response) => {
          // util.logoutUser();
          // sessionStorage.clear();
          // window.location = "/";
        })
        .catch((error) => {})
        .finally(() => {
          util.logoutUser();
        });
    }
  };

  // const handleLanguageClick = (e) => {
  //   Cookies.set("dmvplng", e.key);
  //   localStorage.setItem("dmvplng", e.key);
  //   setStoreSelectedLngCode(e.key);
  //   dispatch(
  //     fnSelectedLanguage(
  //       storeLanguages.find((item) => item.dm_language_code === e.key)
  //     )
  //   );
  //   navigate(0);
  // };

  return (
    <Layout>
      <Header className="fixed z-20 top-0 p-0 !h-20  w-full bg-white drop-shadow-md">
        <Content className="px-3 flex">
          {/* Left content which displays brand logo and other stuffs */}
          <Content className="!inline-block text-left self-center p-1 mt-2">
            <a href="/dashboard">
              <Image
                width={240}
                preview={false}
                src={BrandLogo}
                className="cursor-pointer"
              />
            </a>
          </Content>
          {/* Center content to display any item if required */}
          <Content className="!inline-block text-center self-center"></Content>
          {/* Right content to display user menus, login icon, language icon and other stuffs */}
          <Content className="!inline-block text-right self-center">
            {/* Display user dropdown if user is logged in otherwise display login icon */}
            {isUserLoggedIn ? (
              <Dropdown
                menu={{
                  items: userItems,
                  onClick: handleMenuClick,
                }}
                placement="bottom"
                arrow
                className="cursor-pointer"
              >
                <Paragraph className="inline-block !mb-10 relative">
                  <Avatar
                    src={AdminIcon}
                    className="text-lg absolute bottom-[-2px] left-[-30px]"
                  />
                  <Text className="text-lg text-slate-600 ml-2 mr-1">
                    Dmadmin
                  </Text>
                  <DownOutlined className="text-xs text-slate-600" />
                </Paragraph>
              </Dropdown>
            ) : (
              <></>
              // <Tooltip title="Login">
              //   <Paragraph className="inline-block mb-0 cursor-pointer">
              //     <LoginOutlined className="text-base text-slate-600" />
              //   </Paragraph>
              // </Tooltip>
            )}
            {/* Display language dropdown only if store has more than 1 language. */}
            {/* {languageItems.length > 0 ? (
              <Dropdown
                menu={{
                  items: languageItems,
                  selectable: true,
                  defaultSelectedKeys: [storeSelectedLngCode],
                  onClick: handleLanguageClick,
                }}
                arrow
                className="cursor-pointer ml-3"
              >
                <Paragraph className="inline-block mb-0">
                  <TranslationOutlined className="text-base text-slate-600 headerIcon" />
                </Paragraph>
              </Dropdown>
            ) : (
              <></>
            )} */}
          </Content>
        </Content>
      </Header>
    </Layout>
  );
};

export default Header2;
