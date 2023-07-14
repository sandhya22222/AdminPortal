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
import { fnSelectedLanguage } from "../../services/redux/actions/ActionStoreLanguage";
import {
  BrandLogo,
  AdminIcon,
  DmBrandLogo,
  marketPlaceLogo,
} from "../../constants/media";

import util from "../../util/common";
import { useAuth } from "react-oidc-context";

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;

const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const logoutAPI = process.env.REACT_APP_LOGOUT;

const Header2 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigate = useNavigate();

  // const isUserLoggedIn = sessionStorage.getItem("is_loggedIn");
  const storeLanguages = useSelector(
    (state) => state.reducerStoreLanguage.storeLanguage
  );
  const selectedLanguage = useSelector(
    (state) => state.reducerSelectedLanguage.selectedLanguage
  );

  const [storeSelectedLngCode, setStoreSelectedLngCode] = useState(
    selectedLanguage && selectedLanguage.dm_language_code
  );
  const languageItems = [];
  if (storeLanguages && storeLanguages.length > 1) {
    storeLanguages.forEach((element) => {
      const languageItem = {};
      languageItem["key"] = element.dm_language_code;
      languageItem["label"] = element.language_name;
      languageItems.push(languageItem);
    });
  }

  const userItems = [
    // Todo: Commenting for now, will implement once the details are ready
    {
      label: "Profile",
      key: "profile",
      icon: <UserOutlined />,
      // disabled: true,
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = (e) => {
    // console.log("click", e);
    if (e.key === "logout") {
      // const refreshToken = sessionStorage.getItem("refresh_token");
      // MarketplaceServices.save(umsBaseUrl + logoutAPI, {
      //   refresh_token: refreshToken,
      // })
      //   .then((response) => {
      //     // util.logoutUser();
      //     // sessionStorage.clear();
      //     // window.location = "/";
      //   })
      //   .catch((error) => {})
      //   .finally(() => {
      //     util.logoutUser();
      //   });
      void auth.signoutRedirect();
    }
    if (e.key === "profile") {
      navigate("dashboard/userprofile");
    }
  };

  const handleLanguageClick = (e) => {
    Cookies.set("dmaplng", e.key);
    localStorage.setItem("dmaplng", e.key);
    setStoreSelectedLngCode(e.key);
    dispatch(
      fnSelectedLanguage(
        storeLanguages.find((item) => item.dm_language_code === e.key)
      )
    );
    navigate(0);
  };

  useEffect(() => {
    setStoreSelectedLngCode(
      selectedLanguage && selectedLanguage.dm_language_code
    );
  }, [selectedLanguage]);

  return (
    <Content>
      <Header className="fixed z-20 top-0 p-0 !h-12 w-full bg-white drop-shadow-md">
        <Content className="px-3 !py-2 !h-12 flex !justify-between ">
          {/* Left content which displays brand logo and other stuffs */}
          <Content className="!inline-block text-left self-center">
            <a href="/dashboard">
              <Image
                // width={180}
                height={32}
                preview={false}
                src={marketPlaceLogo}
                className="antImage"
              />
            </a>
          </Content>
          {/* Center content to display any item if required */}
          <Content className="!inline-block text-center self-center"></Content>
          {/* Right content to display user menus, login icon, language icon and other stuffs */}
          <Content className="!inline-block text-right self-center">
            {/* Display user dropdown if user is logged in otherwise display login icon */}
            {auth.isAuthenticated ? (
              <Dropdown
                menu={{
                  items: userItems,
                  onClick: handleMenuClick,
                }}
                placement="bottom"
                arrow
                className="cursor-pointer"
              >
                <Paragraph className="inline-block !mb-0 relative">
                  <Avatar
                    src={AdminIcon}
                    className="!h-8 absolute bottom-[-2px] left-[-30px]"
                  />
                  <Content className="ml-2 mr-1 !flex !items-center">
                    <Text className="text-lg text-slate-600 pr-1">Admin</Text>
                    <DownOutlined className="text-xs text-slate-600" />
                  </Content>
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
            {/* {auth.isAuthenticated && languageItems.length > 0 ? (
              <Dropdown
                menu={{
                  items: languageItems,
                  selectable: true,
                  defaultSelectedKeys: [storeSelectedLngCode],
                  onClick: handleLanguageClick,
                }}
                arrow
                className="header-text-color cursor-pointer ml-3"
              >
                <Paragraph className="inline-block mb-0">
                  <TranslationOutlined className=" header-text-color text-base headerIcon !h-[24px]" />
                </Paragraph>
              </Dropdown>
            ) : (
              <></>
            )} */}
          </Content>
        </Content>
      </Header>
    </Content>
  );
};

export default Header2;
