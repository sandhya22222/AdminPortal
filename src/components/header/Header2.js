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
  ProfileIcon,
} from "../../constants/media";

import util from "../../util/common";
import { useAuth } from "react-oidc-context";

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;

const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const logoutAPI = process.env.REACT_APP_LOGOUT;
const multilingualFunctionalityEnabled =
  process.env.REACT_APP_IS_MULTILINGUAL_ENABLED;

const Header2 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Text } = Typography;
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
    selectedLanguage && selectedLanguage.language_code
  );

  const languageItems = [];
  if (storeLanguages && storeLanguages.length > 1) {
    storeLanguages.forEach((element) => {
      const languageItem = {};
      languageItem["key"] = element.language_code;
      languageItem["label"] = (
        <Tooltip
          title={element.language}
          overlayStyle={{ position: "fixed" }}
          placement="left"
        >
          <div className="!font-normal max-w-[100px] text-ellipsis overflow-hidden">
            {element.language}
          </div>
        </Tooltip>
      );
      languageItems.push(languageItem);
    });
  }

  const userItems = [
    // Todo: Commenting for now, will implement once the details are ready
    {
      label: `${t("labels:profile")}`,
      key: "profile",
      icon: <UserOutlined />,
      // disabled: true,
    },
    {
      label: `${t("labels:logout")}`,
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      util.removeIsAuthorized();
      void auth.signoutRedirect();
    }
    if (e.key === "profile") {
      navigate("dashboard/userprofile");
    }
  };

  const handleLanguageClick = (e) => {
    // Cookies.set("mpaplng", e.key);
    // localStorage.setItem("mpaplng", e.key);
    util.setUserSelectedLngCode(e.key);
    setStoreSelectedLngCode(e.key);
    dispatch(
      fnSelectedLanguage(
        storeLanguages.find((item) => item.language_code === e.key)
      )
    );
    document.body.style.direction = util
      .getSelectedLanguageDirection()
      ?.toLowerCase();
    navigate(0);
  };

  useEffect(() => {
    setStoreSelectedLngCode(selectedLanguage && selectedLanguage.language_code);
  }, [selectedLanguage]);

  return (
    <Content>
      <Header className="fixed z-20 top-0 p-0 !h-12 w-full bg-white drop-shadow-md">
        <Content className="px-3 !py-2 !h-12 flex !justify-between  items-center">
          {/* Left content which displays brand logo and other stuffs */}
          <Content className="!inline-block text-left self-center">
            <a href="/dashboard">
              <img
                //width={180}
                preview={false}
                src={marketPlaceLogo}
                className="!h-[32px]"
              />
            </a>
          </Content>
          {/* Center content to display any item if required */}
          <Content className="!inline-block text-center self-center"></Content>
          {/* Right content to display user menus, login icon, language icon and other stuffs */}
          <Content className="flex flex-row justify-end items-center gap-2">
            {/* Display user dropdown if user is logged in otherwise display login icon */}
            {auth.isAuthenticated && (
              <Dropdown
                menu={{
                  items: userItems,
                  onClick: handleMenuClick,
                }}
                placement="bottom"
                arrow
                trigger={["click"]}
                className="cursor-pointer header-text-color"
                overlayStyle={{ position: "fixed", zIndex: 20 }}
              >
                <Paragraph className="inline-block !mb-0 relative">
                  {/* <Avatar
                    src={AdminIcon}
                    className="!h-8 absolute bottom-[-2px] left-[-30px]"
                  /> */}
                  <Text className="text-lg text-slate-600 pr-1">
                    {t("labels:admin")}
                  </Text>
                  <DownOutlined className="text-xs text-slate-600" />
                </Paragraph>
              </Dropdown>
            )}
            {/* Display language dropdown only if store has more than 1 language.  */}
            {multilingualFunctionalityEnabled === "true" &&
            auth.isAuthenticated &&
            languageItems &&
            languageItems.length > 0 ? (
              <Dropdown
                menu={{
                  items: languageItems,
                  selectable: true,
                  defaultSelectedKeys: [storeSelectedLngCode],
                  onClick: handleLanguageClick,
                  style: { maxHeight: 200, overflowY: "auto" },
                }}
                trigger={["click"]}
                arrow
                className="header-text-color cursor-pointer"
                overlayStyle={{
                  position: "fixed",
                  zIndex: 20,
                }}
              >
                <Paragraph className="!mb-0 ">
                  <TranslationOutlined
                    className="header-text-color"
                    style={{ fontSize: "24px" }}
                  />
                </Paragraph>
              </Dropdown>
            ) : (
              <></>
            )}
          </Content>
        </Content>
      </Header>
    </Content>
  );
};

export default Header2;
