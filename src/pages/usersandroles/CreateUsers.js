import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Input,
  Row,
  Col,
  Spin,
  Tooltip,
  Select,
  Switch,
  Skeleton,
} from "antd";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import MarketplaceToaster from "../../util/marketplaceToaster";
import util from "../../util/common";
import validator from "validator";

//! Import CSS libraries

const userAPI = process.env.REACT_APP_USERS_API;

const groupsAPI = process.env.REACT_APP_GROUPS_API;
const userNameMinLength = process.env.REACT_APP_USERNAME_MIN_LENGTH;
const userNameMaxLength = process.env.REACT_APP_USERNAME_MAX_LENGTH;
const passwordMinLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH;
const passwordMaxLength = process.env.REACT_APP_PASSWORD_MAX_LENGTH;
const nameMinLength = process.env.REACT_APP_NAME_MIN_LENGTH;
const nameMaxLength = process.env.REACT_APP_NAME_MAX_LENGTH;
const emailMaxLength = process.env.REACT_APP_EMAIL_MAX_LENGTH;
const usersAllAPI = process.env.REACT_APP_USERS_ALL_API;

const { Title } = Typography;
const { Content } = Layout;

const CreateUsers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const search = useLocation().search;
  const [isLoading, setIsLoading] = useState(false);
  const [isGroupsLoading, setIsGroupsLoading] = useState(true);
  const [isGroupsNetworkError, setIsGroupsNetworkError] = useState(false);
  const [pageAction, setPageAction] = useState();
  const [selectRole, setSelectRole] = useState();
  // const [selectType, setSelectType] = useState();
  const [groupsServerData, setGroupsServerData] = useState([]);
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userStatus, setUserStatus] = useState(false);
  const [invalidUserName, setInvalidUserName] = useState(false);
  const [invalidEmailId, setInvalidEmailId] = useState(false);
  const [invalidPassword, setInValidPassword] = useState(false);
  const [invalidRole, setInvalidRole] = useState(false);
  const [roleSelectData, setRoleSelectData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUserDetailFetching, setIsUserDetailFetching] = useState(false);
  const [isUserDetailsEditted, setIsUserDetailsEditted] = useState(false);

  //Get call of groups
  const findAllGroupLists = () => {
    MarketplaceServices.findAll(groupsAPI, { is_marketplace_role: true }, true)

      .then(function (response) {
        console.log("Groups get call response-->", response.data.response_body);
        setGroupsServerData(response.data.response_body);
        setIsGroupsLoading(false);
        setIsGroupsNetworkError(false);
      })
      .catch(function (error) {
        console.log("grouplist get error call response-->", error);
        setIsGroupsLoading(false);
        setIsGroupsNetworkError(true);
      });
  };

  //!Post call of user to server
  const handlePostUsers = () => {
    setIsLoading(true);
    let dataObject = {};
    // dataObject["realmname"] = sessionStorage.getItem("client");
    dataObject["username"] = userName;
    dataObject["email"] = emailId;
    dataObject["password"] = password;
    dataObject["status"] = userStatus;
    if (firstName !== "") {
      dataObject["firstname"] = firstName;
    }
    if (lastName !== "") {
      dataObject["lastname"] = lastName;
    }
    if (selectRole !== undefined && selectRole !== "") {
      dataObject["groups_mapping"] = selectRole;
    }
    // if (selectType !== undefined && selectRole !== "") {
    //   dataObject["type"] = selectType;
    // }

    MarketplaceServices.save(userAPI, dataObject, null)
      .then(function (response) {
        console.log("server response of user post call", response);
        MarketplaceToaster.showToast(response);
        setIsLoading(false);
        navigate(-1);
      })
      .catch((error) => {
        console.log("server error response of user post call");
        MarketplaceToaster.showToast(error.response);
        setIsLoading(false);
      });
  };

  // validation of user form
  const userFormValidation = () => {
    const emailRegex = /^[A-Za-z\_0-9]{3,64}@[A-Za-z\-]{3,255}\.[A-Za-z]{2,3}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{12,64}$/;
    const userNameRegex = /^[A-Za-z0-9_\- ]+$/;
    let count = 4;
    if (
      userName === "" ||
      emailId === "" ||
      password === "" ||
      selectRole === undefined
    ) {
      count--;
      if (password === "") {
        setInValidPassword(true);
      }
      if (emailId === "") {
        setInvalidEmailId(true);
      }
      if (userName === "") {
        setInvalidUserName(true);
      }
      if (selectRole === undefined) {
        setInvalidRole(true);
      }
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    }
    // else if (userName != "" && emailId === "" && password === "") {
    //   count--;
    //   setInValidPassword(true);
    //   setInvalidEmailId(true);
    //   MarketplaceToaster.showToast(
    //     util.getToastObject(
    //       `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
    //       "error"
    //     )
    //   );
    // } else if (userName != "" && emailId != "" && password === "") {
    //   count--;
    //   setInValidPassword(true);
    //   MarketplaceToaster.showToast(
    //     util.getToastObject(
    //       `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
    //       "error"
    //     )
    //   );
    // } else if (userName != "" && emailId === "" && password != "") {
    //   count--;
    //   MarketplaceToaster.showToast(
    //     util.getToastObject(
    //       `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
    //       "error"
    //     )
    //   );
    // } else if (userName === "" && emailId != "" && password != "") {
    //   count--;
    //   setInvalidUserName(true);
    //   MarketplaceToaster.showToast(
    //     util.getToastObject(
    //       `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
    //       "error"
    //     )
    //   );
    // } else if (userName === "" && emailId === "" && password != "") {
    //   count--;
    //   setInvalidUserName(true);
    //   setInvalidEmailId(true);
    //   MarketplaceToaster.showToast(
    //     util.getToastObject(
    //       `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
    //       "error"
    //     )
    //   );
    // } else if (userName === "" && emailId != "" && password === "") {
    //   count--;
    //   setInvalidUserName(true);
    //   setInValidPassword(true);
    //   MarketplaceToaster.showToast(
    //     util.getToastObject(
    //       `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
    //       "error"
    //     )
    //   );
    // }
    else if (userNameRegex.test(userName) === false) {
      count--;
      setInvalidUserName(true);
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_valid_username")}`,
          "error"
        )
      );
    } else if (
      userNameRegex.test(userName) === true &&
      userName.length < userNameMinLength
    ) {
      count--;
      setInvalidUserName(true);
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_valid_username")}`,
          "error"
        )
      );
    } else if (emailRegex.test(emailId) === false) {
      count--;
      setInvalidEmailId(true);

      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_the_valid_email_address")}`,
          "error"
        )
      );
    } else if (passwordRegex.test(password) === false) {
      count--;
      setInValidPassword(true);

      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t(
            "messages:password_must_contain_minimum_of"
          )} ${passwordMinLength}  ${t("messages:password_error_message")}`,
          "error"
        )
      );
    }

    if (count === 4) {
      handlePostUsers();
    }
  };

  //!Put call of user to server
  const handlePutUsers = () => {
    setIsLoading(true);
    let dataObject = {};
    if (firstName !== "") {
      dataObject["firstname"] = firstName;
    }
    if (lastName !== "") {
      dataObject["lastname"] = lastName;
    }
    dataObject["email"] = emailId;
    if (selectRole) {
      dataObject["groups_mapping"] = [selectRole];
    }
    MarketplaceServices.update(userAPI, dataObject, {
      user_name: userName,
    })
      .then(function (response) {
        console.log("server response of user put call", response);
        MarketplaceToaster.showToast(response);
        setIsLoading(false);
        navigate(-1);
      })
      .catch((error) => {
        console.log("server error response of user put call");
        MarketplaceToaster.showToast(error.response);
        setIsLoading(false);
      });
  };

  const userFormValidationEdit = () => {
    const emailRegex = /^[A-Za-z\_0-9]{3,64}@[A-Za-z\-]{3,255}\.[A-Za-z]{2,3}$/;
    let count = 1;
    if (emailId === "") {
      count--;
      if (emailId === "") {
        setInvalidEmailId(true);
      }
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_the_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (emailRegex.test(emailId) === false) {
      count--;
      setInvalidEmailId(true);
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("messages:please_enter_the_valid_email_address")}`,
          "error"
        )
      );
    }
    if (count === 1) {
      handlePutUsers();
    }
  };

  //handle change of role select
  const handleChangeRole = (value) => {
    setSelectRole(value);
    setInvalidRole(false);
    // if (pageAction != "add") {
      setIsUserDetailsEditted(true);
    // /}
  };

  //handle change of type select
  // const handleChangeType = (value) => {
  //   setSelectType(value);
  // };
  //*Handler for the status change(Active and Inactive)
  const onChange = (checked) => {
    setUserStatus(checked);
    setIsUserDetailsEditted(true);
  };

  //useEffect to form the data for the role dropdown
  useEffect(() => {
    var roleObject = {};
    var roleDropdownArray = [];
    groupsServerData &&
      groupsServerData.length > 0 &&
      groupsServerData.map((element) => {
        roleObject = {};
        roleObject.label = String(element.name).replaceAll("-", " ");
        roleObject.value = element.name;
        roleDropdownArray.push(roleObject);
      });
    console.log("roleDropDownArray", roleDropdownArray);
    setRoleSelectData(roleDropdownArray);
  }, [groupsServerData]);

  //Get call of users
  const findAllUsersLists = (userId) => {
    setIsUserDetailFetching(true);
    MarketplaceServices.findAll(usersAllAPI, null, false)
      .then(function (response) {
        setIsUserDetailFetching(false);
        if (
          response.data &&
          response.data.response_body &&
          response.data.response_body.users
        ) {
          let selectedUserDetails = response.data.response_body.users.filter(
            ({ id }) => id == userId
          );
          console.log(
            "userslist get call response-->",
            response.data.response_body.users,
            "userId",
            userId,
            selectedUserDetails
          );
          if (selectedUserDetails.length > 0) {
            setUserName(selectedUserDetails[0].username);
            setFirstName(selectedUserDetails[0].firstName);
            setLastName(selectedUserDetails[0].lastName);
            setEmailId(selectedUserDetails[0].email);
            setSelectRole(selectedUserDetails[0].groups[0].name);
            setUserStatus(selectedUserDetails[0].enabled);
          }
        }
      })
      .catch(function (error) {
        setIsUserDetailFetching(false);
        console.log("userslist get error call response-->", error);
      });
  };

  //UseEffect to set page action edit or save
  useEffect(() => {
    var pathnameString = pathname
      .substring(pathname.lastIndexOf("/") + 1, pathname.length)
      .split("-");
    setPageAction(pathnameString[0]);
    if (pathnameString[0] !== "add") {
      findAllUsersLists(searchParams.get("id"));
    }
    findAllGroupLists();
    window.scrollTo(0, 0);
  }, []);

  return (
    <Content className="">
      <HeaderForTitle
        title={
          <Tooltip
            title={
              pageAction !== "add"
                ? t("labels:edit_user")
                : t("labels:add_user")
            }
            zIndex={11}
            placement="bottom"
          >
            <Title level={3} className="!font-normal max-w-[800px]" ellipsis>
              {pageAction === "add"
                ? `${t("labels:add_user")} `
                : `${t("labels:edit_user")} `}
            </Title>
          </Tooltip>
        }
        type={"categories"}
        action={pageAction === "add" ? "add" : "edit"}
        showArrowIcon={true}
        saveFunction={userFormValidation}
        isVisible={pageAction === "edit" ? false : true}
        showButtons={false}
      />
      <Content className="!min-h-screen mt-[6.7rem] p-3">
        {isUserDetailFetching ? (
          <Content className="bg-white">
            <Skeleton
              active
              paragraph={{
                rows: 10,
              }}
              className="p-3"
            ></Skeleton>
          </Content>
        ) : (
          <Spin tip={t("labels:please_wait")} size="large" spinning={isLoading}>
            <Content className="bg-white p-3">
              <Row>
                <Col span={18} className="">
                  <Content className="my-3">
                    <Typography className="input-label-color mb-2 flex gap-1">
                      {t("labels:user_name")}
                      <span className="mandatory-symbol-color text-sm ">*</span>
                    </Typography>
                    <Content>
                      <Input
                        className={`${
                          invalidUserName
                            ? "border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400"
                            : " border-solid border-[#C6C6C6]"
                        }`}
                        value={userName}
                        disabled={pageAction !== "add" ? true : false}
                        onChange={(e) => {
                            const alphaWithoutSpaces = /^[a-zA-Z0-9]+$/;
                            if (
                              e.target.value !== "" &&
                              validator.matches(e.target.value, alphaWithoutSpaces)
                            ) {
                              setUserName(String(e.target.value).toLowerCase());
                              setInvalidUserName(false);
                              setIsUserDetailsEditted(true);
                            } else if (e.target.value === "") {
                              setUserName(e.target.value)
                            }
                          }}
                        onBlur={(e) => {
                          setUserName(
                            e.target.value.trim().replace(/\s+/g, " ")
                          );
                        }}
                        maxLength={userNameMaxLength}
                        placeholder={t("placeholders:user_name_placeholder")}
                      />
                    </Content>
                  </Content>
                  <Content className="flex my-3">
                    <Content className=" mr-3">
                      <Typography className="input-label-color mb-2 flex gap-1">
                        {t("labels:first_name")}
                      </Typography>
                      <Content>
                        <Input
                          value={firstName}
                          onChange={(e) => {
                            const { value } = e.target;
                            const regex = /^[a-zA-Z]*$/; // only allow letters
                            if (regex.test(value)) {
                              setFirstName(e.target.value);
                              // if (pageAction != "add") {
                              setIsUserDetailsEditted(true);
                              // }
                            }
                          }}
                          minLength={nameMinLength}
                          maxLength={nameMaxLength}
                          placeholder={t("placeholders:enter_first_name")}
                        />
                      </Content>
                    </Content>
                    <Content className="">
                      <Typography className="input-label-color mb-2 flex gap-1">
                        {t("labels:last_name")}
                      </Typography>

                      <Content>
                        <Input
                          value={lastName}
                          onChange={(e) => {
                            const { value } = e.target;
                            const regex = /^[a-zA-Z]*$/; // only allow letters
                            if (regex.test(value)) {
                              setLastName(e.target.value);
                              // if (pageAction != "add") {
                              setIsUserDetailsEditted(true);
                              // }
                            }
                          }}
                          minLength={nameMinLength}
                          maxLength={nameMaxLength}
                          placeholder={t("placeholders:enter_last_name")}
                        />
                      </Content>
                    </Content>
                  </Content>
                  <Content className="my-3">
                    <Typography className="input-label-color mb-2 flex gap-1">
                      {t("labels:email")}
                      <span className="mandatory-symbol-color text-sm ">*</span>
                    </Typography>

                    <Content>
                      <Input
                        className={`${
                          invalidEmailId
                            ? "border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400"
                            : " border-solid border-[#C6C6C6]"
                        }`}
                        value={emailId}
                        onChange={(e) => {
                          setEmailId(e.target.value.toLowerCase());
                          setInvalidEmailId(false);
                          // if (pageAction != "add") {
                          setIsUserDetailsEditted(true);
                          // }
                        }}
                        onBlur={(e) => {
                          setEmailId(
                            e.target.value.trim().replace(/\s+/g, " ")
                          );
                        }}
                        maxLength={emailMaxLength}
                        placeholder={t("placeholders:enter_email")}
                      />
                    </Content>
                  </Content>
                  {pageAction !== "add" ? (
                    ""
                  ) : (
                    <Content className="my-3">
                      <Typography className="input-label-color mb-2 flex gap-1">
                        {t("labels:password")}
                        <span className="mandatory-symbol-color text-sm ">
                          *
                        </span>
                      </Typography>

                      <Content>
                        <Input.Password
                          className={`${
                            invalidPassword
                              ? "border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400"
                              : " border-solid border-[#C6C6C6]"
                          }`}
                          value={password}
                          disabled={pageAction !== "add" ? true : false}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setInValidPassword(false);
                            setIsUserDetailsEditted(true);
                          }}
                          onBlur={(e) => {
                            setPassword(
                              e.target.value.trim().replace(/\s+/g, " ")
                            );
                          }}
                          minLength={passwordMinLength}
                          maxLength={passwordMaxLength}
                          placeholder={t("placeholders:enter_password")}
                        />
                      </Content>
                    </Content>
                  )}
                  <Content className="flex my-3">
                    <Content>
                      <Typography className="input-label-color mb-2 flex gap-1">
                        {t("labels:status")}
                      </Typography>
                      <Content>
                        <Switch
                          disabled={pageAction !== "add" ? true : false}
                          className={
                            userStatus === true
                              ? "!bg-green-500"
                              : "!bg-gray-400"
                          }
                          checked={userStatus}
                          onChange={onChange}
                          // onClick={() => {
                          //   openModal(switchStatus);
                          // }}
                        />
                      </Content>
                    </Content>
                    <Content className="pl-[4.2rem]">
                      <Typography className="input-label-color mb-2 flex gap-1">
                        {t("labels:role")}
                        <span className="mandatory-symbol-color text-sm ">
                          *
                        </span>
                      </Typography>
                      <Content>
                        <Select
                          style={{
                            width: 665,
                          }}
                          allowClear
                          // onClear={() => {
                          //   console.log("cleared");
                          //   setSelectRole("");
                          // }}
                          status={invalidRole ? "error" : ""}
                          placeholder={t("labels:select_a_role")}
                          value={selectRole}
                          onChange={handleChangeRole}
                          options={roleSelectData}
                        />
                      </Content>
                    </Content>
                  </Content>

                  <Content className="my-2">
                    <Button
                      className="app-btn-secondary"
                      onClick={() => navigate(-1)}
                    >
                      {t("labels:discard")}
                    </Button>
                    <Button
                      onClick={
                        pageAction != "add"
                          ? userFormValidationEdit
                          : userFormValidation
                      }
                      className={`app-btn-primary ml-2
                       `}
                      disabled={
                        pageAction === "add"
                          ? userName != "" ||
                            emailId != "" ||
                            password != "" ||
                            firstName != "" ||
                            lastName != "" ||
                            userStatus ||
                            selectRole
                            ? false
                            : true
                          : !isUserDetailsEditted
                      }
                    >
                      {pageAction === "edit"
                        ? t("labels:update")
                        : t("labels:save")}
                    </Button>
                  </Content>
                </Col>
              </Row>
            </Content>
          </Spin>
        )}
      </Content>
    </Content>
  );
};

export default CreateUsers;
