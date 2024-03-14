import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  Layout,
  Tooltip,
  Image,
  Dropdown,
  Avatar,
  Typography,
  Tag,
  Button,
  Select,
} from "antd";
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
import {
  fnSelectedLanguage,
  fnStoreLanguage,
  fnDefaultLanguage,
} from "../../services/redux/actions/ActionStoreLanguage";
import { fnUserProfileInfo } from "../../services/redux/actions/ActionUserProfile";
import {
  BrandLogo,
  AdminIcon,
  DmBrandLogo,
  marketPlaceLogo,
  ProfileIcon,
  menuIcon,
  BackBurgerIcon,
  Collapse,
} from "../../constants/media";

import util from "../../util/common";
import { useAuth } from "react-oidc-context";

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;
const { Option } = Select;

const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const logoutAPI = process.env.REACT_APP_LOGOUT;
const multilingualFunctionalityEnabled =
  process.env.REACT_APP_IS_MULTILINGUAL_ENABLED;
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API;
const storeUsersAPI = process.env.REACT_APP_USERS_API;
const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

console.log("portalInfoTest", portalInfo);
const Header2 = ({ collapsed, setCollapsed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Text } = Typography;
  const auth = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState();

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
  const userProfileInfo = useSelector(
    (state) => state.reducerUserProfileInfo.userProfileInfo
  );
  const languageItems = [];
  if (storeLanguages && storeLanguages.length > 0) {
    storeLanguages.forEach((element) => {
      const languageItem = {};
      languageItem["value"] = element.language_code;
      languageItem["label"] = element.language;
      // (
      //   <Tooltip
      //     title={element.language}
      //     overlayStyle={{ position: "fixed" }}
      //     placement="left"
      //   >
      //     <div className="!font-normal max-w-[100px] text-ellipsis overflow-hidden">
      //       {element.language}
      //     </div>
      //   </Tooltip>
      // );
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

  const handleLanguageClick = (value) => {
    // Cookies.set("mpaplng", e.key);
    // localStorage.setItem("mpaplng", e.key);
    util.setUserSelectedLngCode(value);
    setStoreSelectedLngCode(value);
    dispatch(
      fnSelectedLanguage(
        storeLanguages.find((item) => item.language_code === value)
      )
    );
    document.body.style.direction = util
      .getSelectedLanguageDirection()
      ?.toLowerCase();
    navigate(0);
  };

  const findAllLanguages = () => {
    MarketplaceServices.findAll(languageAPI, { "language-status": 1 }, false)
      .then((response) => {
        console.log(
          "Server response from findAllStoreLanguages",
          response.data.response_body
        );
        const storeLanguages = response.data.response_body;
        const defaultLanguage = storeLanguages.find((item) => item.is_default);

        const userSelectedLanguageCode = util.getUserSelectedLngCode();
        if (userSelectedLanguageCode === undefined) {
          const userSelectedLanguage = defaultLanguage;
          dispatch(fnSelectedLanguage(userSelectedLanguage));
          document.body.style.direction =
            userSelectedLanguage &&
            userSelectedLanguage.writing_script_direction?.toLowerCase();
          // Cookies.set("mpaplng", defaultLanguage.language_code);
          // localStorage.setItem("mpaplng", defaultLanguage.language_code);
        }
        if (util.getUserSelectedLngCode()) {
          let selectedLanguagePresentOrNot =
            storeLanguages &&
            storeLanguages.length > 0 &&
            storeLanguages.filter(
              (ele) => ele.language_code === util.getUserSelectedLngCode()
            );
          if (
            selectedLanguagePresentOrNot &&
            selectedLanguagePresentOrNot.length > 0
          ) {
            const alreadySelectedLanguage = storeLanguages.find(
              (item) => item.language_code === util.getUserSelectedLngCode()
            );
            dispatch(fnSelectedLanguage(alreadySelectedLanguage));
            document.body.style.direction =
              alreadySelectedLanguage &&
              alreadySelectedLanguage.writing_script_direction?.toLowerCase();
          } else {
            const defaultLanguageSelectedLanguage = defaultLanguage;
            console.log(
              "testInDahsboardSelectedLangInHeader#",
              defaultLanguageSelectedLanguage
            );
            dispatch(fnSelectedLanguage(defaultLanguageSelectedLanguage));
            util.setUserSelectedLngCode(
              defaultLanguageSelectedLanguage.language_code
            );
            document.body.style.direction =
              defaultLanguageSelectedLanguage &&
              defaultLanguageSelectedLanguage.writing_script_direction?.toLowerCase();

            // setDependencyForPageRefreshForInvalidSelectedLanguage(true);
            setTimeout(function () {
              navigate(0);
            }, 2000);
          }
        }

        dispatch(fnStoreLanguage(storeLanguages));
        dispatch(fnDefaultLanguage(defaultLanguage));
        // dispatch(fnSelectedLanguage(defaultLanguage));
      })
      .catch((error) => {
        console.log("error-->", error.response);
      });
  };

  const findAllWithoutPageStoreUsers = () => {
    MarketplaceServices.findAllWithoutPage(storeUsersAPI, null, false)
      .then(function (response) {
        console.log(
          "get from  store user server response-----> ",
          response.data
        );
        setUserName(response.data.response_body.username);
        const userName = response.data.response_body.username;
        dispatch(fnUserProfileInfo(userName));
      })
      .catch((error) => {
        console.log("error from store all users API ====>", error.response);
      });
  };

  useEffect(() => {
    findAllLanguages();
    findAllWithoutPageStoreUsers();
  }, []);
  useEffect(() => {
    setStoreSelectedLngCode(selectedLanguage && selectedLanguage.language_code);
  }, [selectedLanguage]);

  const multilingualNameChanging = (value) => {
    let multilingualKey = value.toLowerCase();
    multilingualKey = multilingualKey.replace(/ /g, "_");
    console.log("multilingualKey------>", multilingualKey);

    return multilingualKey;
  };

  return (
    <Content>
      <Header className="fixed z-20 top-0 p-0 !h-12 w-full bg-white drop-shadow-md">
        <Content className="px-3 !py-2 !h-12 flex !justify-between  items-center ">
          {/* Left content which displays brand logo and other stuffs */}
          <div className=" mx-2">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <img src={Collapse} />
                ) : (
                  <img
                    className={`  ${
                      util.getSelectedLanguageDirection()?.toUpperCase() ===
                      "RTL"
                        ? "rotate-180"
                        : ""
                    }`}
                    src={BackBurgerIcon}
                    alt="BackButton"
                  />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              // className="!bg-[var(--mp-brand-color)] hover:bg-[var(--mp-brand-color)]"
              className="hover:none"
              style={{
                width: "100%",
                display: "flex",
                padding: "8 16 8 16",
                marginTop: "4px",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </div>
          <div className="!inline-block text-left self-center mx-2 ">
            <a href="/dashboard">
              <img
                //width={180}
                preview={false}
                src={marketPlaceLogo}
                className="!h-[32px]"
              />
            </a>
          </div>
          <div className=" mx-3 ">
            <Tag className="portalNameTag">
              {t(
                `labels:${multilingualNameChanging(
                  portalInfo && portalInfo.title
                )}`
              )}
            </Tag>
          </div>
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
                    {userName && userName.length > 0
                      ? userName.slice(0, 1).toUpperCase() + userName.slice(1)
                      : userProfileInfo &&
                        userProfileInfo.length > 0 &&
                        userProfileInfo.slice(0, 1).toUpperCase() +
                          userProfileInfo &&
                        userProfileInfo.length > 0 &&
                        userProfileInfo.slice(1)}
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
              // <Dropdown
              //   menu={{
              //     items: languageItems,
              //     selectable: true,
              //     defaultSelectedKeys: [storeSelectedLngCode],
              //     onClick: handleLanguageClick,
              //     style: { maxHeight: 200, overflowY: "auto" },
              //   }}
              //   trigger={["click"]}
              //   arrow
              //   className="header-text-color cursor-pointer"
              //   overlayStyle={{
              //     position: "fixed",
              //     zIndex: 20,
              //   }}
              // >
              //   <Paragraph className="!mb-0 ">
              //     <TranslationOutlined
              //       className="header-text-color"
              //       style={{ fontSize: "24px" }}
              //     />
              //   </Paragraph>
              // </Dropdown>
              <Select
                options={languageItems}
                bordered={false}
                // placeholder="Select Language"
                defaultValue={storeSelectedLngCode}
                onChange={(value) => handleLanguageClick(value)}
                style={{
                  minWidth: "100px",
                  maxWidth: "100px",
                }}
              >
                {languageItems &&
                  languageItems.length &&
                  languageItems.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tooltip
                        title={option.label}
                        overlayStyle={{ position: "fixed", zIndex: 20 }}
                        placement="left"
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {option.label}
                        </span>
                      </Tooltip>
                    </Option>
                  ))}
              </Select>
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
