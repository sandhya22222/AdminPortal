import React, { useEffect, useState } from "react";
import {
  Avatar,
  Layout,
  Typography,
  Row,
  Skeleton,
  Input,
  Button,
  Col,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { getGenerateDateAndTime } from "../../util/util";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { usePageTitle } from "../../hooks/usePageTitle";
import util from "../../util/common";
import StoreModal from "../../components/storeModal/StoreModal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import MarketplaceToaster from "../../util/marketplaceToaster";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";

const { Content } = Layout;
const { Text, Title } = Typography;
const changePasswordAPI = process.env.REACT_APP_CHANGE_PASSWORD_API;
const storeUsersAPI = process.env.REACT_APP_USERS_API;
const maxPasswordLength = process.env.REACT_APP_PASSWORD_MAX_LENGTH;
const minPasswordLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH;

const UserProfile = () => {
  const { t } = useTranslation();
  usePageTitle(t("labels:profile"));
  const [storeUsersData, setStoreUsersData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [langDirection, setLangDirection] = useState("ltr");
  const [hideEmail, setHideEmail] = useState("");
  const [email, setEmail] = useState("");

  const [userName, setUserName] = useState();
  const [relmname, setRelmName] = useState();
  // const [createdDate,setCreatedDate]=useState();
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmpasswordValid, setisConfirmpasswordValid] = useState(true);
  const [isNewpasswordValid, setisNewpasswordValid] = useState(true);
  const [isCurrentpasswordValid, setisCurrentpasswordValid] = useState(true);

  const showPasswordChangeModal = () => {
    setIsPasswordChangeModalOpen(true);
  };

  // saving password
  const handleOkPasswordChangeModal = () => {
    //check wether the currrent password is same as in api call
    // check wether the new password is equal to confirm passsword
    // make the api call for changing the password
    setisConfirmpasswordValid(true);
    setisCurrentpasswordValid(true);
    setisNewpasswordValid(true);
    if (currentPassword === "") {
      setisCurrentpasswordValid(false);
    }
    if (password === "") {
      setisNewpasswordValid(false);
    }
    if (confirmPassword === "") {
      setisConfirmpasswordValid(false);
    }
    if (
      currentPassword !== null &&
      currentPassword !== "" &&
      currentPassword.length > 0
    ) {
      if (validatePassword()) {
        if (password === confirmPassword) {
          changePasswordAPICall();
        } else {
          MarketplaceToaster.showToast(
            util.getToastObject(
              `${t("labels:new_password_and_confirm_password_should_be_same")}`,
              "error"
            )
          );
        }
      } else {
        MarketplaceToaster.showToast(
          util.getToastObject(
            `${t("labels:please_enter_a_valid_password")}`,
            "error"
          )
        );
      }
    } else {
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("labels:plese_enter_your_current_password")}`,
          "error"
        )
      );
    }
  };

  // handeling Closing password modal
  const handleCancelPasswordChangeModal = () => {
    setIsPasswordChangeModalOpen(false);
    setisConfirmpasswordValid(true);
    setisCurrentpasswordValid(true);
    setisNewpasswordValid(true);
    setPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
  };

  // fucntion to validate password
  function validatePassword() {
    // Check for at least 12 characters
    if (password.length < 12) {
      return false;
    }
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    // Check for at least one special character or symbol
    if (!/[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
      return false;
    }
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }
    // Check for at least one number
    if (!/\d/.test(password)) {
      return false;
    }
    return true;
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };
  const handleConfirmPasswordChange = (e) => {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
  };
  const handleCurrnetPasswordChange = (e) => {
    const newPassword = e.target.value;
    setCurrentPassword(newPassword);
  };

  console.log("current pwd:", currentPassword);
  console.log("new password", password);
  console.log("confirm pwd:", confirmPassword);

  // checking wethet the password is valid or not
  useEffect(() => {
    setIsPasswordValid(validatePassword());
  }, [password]);

  const findAllWithoutPageStoreUsers = () => {
    MarketplaceServices.findAllWithoutPage(storeUsersAPI, null, false)
      .then(function (response) {
        setIsNetworkError(false);
        console.log(
          "get from  store user server response-----> ",
          response.data
        );
        setStoreUsersData(response.data.response_body);
        setIsLoading(false);
        const email = response.data.response_body.email;
        setEmail(email);
        const name = response.data.response_body.username;
        setUserName(name);
        console.log("Username ---->: ", userName);
        setRelmName(response.data.response_body.relmname);
        console.log("Relm Name : ", relmname);
        const emailHide =
          email &&
          email.replace(
            /(?<=^\w)\w+(?=\w*?@\w)/,
            (match) =>
              match[0] + "*".repeat(match.length - 2) + match[match.length - 1]
          );
        setHideEmail(emailHide);
      })
      .catch((error) => {
        console.log("error from store all users API ====>", error.response);
        setIsNetworkError(true);
        setIsLoading(false);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          }
        }
      });
  };

  const changePasswordAPICall = () => {
    MarketplaceServices.save(
      changePasswordAPI,
      {
        old_password: currentPassword,
        new_password: password,
      },
      false
    )
      .then(function (response) {
        console.log(
          "response from  change password server response-----> ",
          response.data
        );
        MarketplaceToaster.showToast(response);
        setPassword("");
        setCurrentPassword("");
        setConfirmPassword("");
        setIsPasswordChangeModalOpen(false);
      })
      .catch((error) => {
        console.log("error from change password API ====>", error.response);
        MarketplaceToaster.showToast(error.response);
        setPassword("");
        setCurrentPassword("");
        setConfirmPassword("");
      });
  };

  useEffect(() => {
    if (util.getSelectedLanguageDirection()) {
      setLangDirection(util.getSelectedLanguageDirection()?.toLowerCase());
    }
  }, [util.getSelectedLanguageDirection()]);
  useEffect(() => {
    findAllWithoutPageStoreUsers();
    window.scroll(0, 0);
  }, []);

  const formatTimestamp = (timestamp) => {
    const timestampInSeconds =
      timestamp.length > 10 ? timestamp / 1000 : timestamp;
    const momentObject = moment.unix(timestampInSeconds);

    // Use format with 'D MMMM YYYY' to display only the date
    const formattedDate = momentObject.format("D MMMM YYYY");
    return formattedDate;
  };

  return (
    <Content>
      <HeaderForTitle
        title={
          <Content className="">
            <Title level={3} className="!font-normal">
              {t("labels:profile")}
            </Title>
          </Content>
        }
      />
      <Content className="mt-[9rem] ">
        {isLoading ? (
          <Content className=" bg-white p-3 !mx-4 ">
            <SkeletonComponent />
          </Content>
        ) : isNetworkError ? (
          <Content className="p-3 text-center !mx-4 bg-[#F4F4F4]">
            <p>{t("messages:network_error")}</p>
          </Content>
        ) : (
          // <Content className="!text-center !p-6 !mx-[17rem]">
          //   <Content className="inline-block">
          //     <Content className="shadow-sm  bg-[#FFFFFF] !rounded-2xl flex flex-col items-center px-8 py-10 w-[500px]">
          //       {/* <Row className="mb-2">
          //         <Avatar size={104} icon={<UserOutlined />} />
          //       </Row>
          //       </Row> */}
          //       <Row className="mb-2">
          //         <Text className="font-medium text-lg">
          //           {storeUsersData && storeUsersData.username}
          //         </Text>
          //       </Row>
          //       <Row className="font-semibold mb-3">
          //         <Text to="">{hideEmail && hideEmail}</Text>
          //       </Row>
          //       <Content className="flex flex-col items-center">
          //         <Row className="mb-2">
          //           <Content className="text-md font-medium flex text-right">
          //             {t("labels:role")}:{" "}
          //           </Content>
          //           <Content
          //             className={`text-md font-medium ${
          //               langDirection === "rtl" ? "!mr-1" : ""
          //             }`}
          //           >
          //             {storeUsersData &&
          //               storeUsersData.groups.length > 0 &&
          //               storeUsersData.groups.map((ele) => (
          //                 <span className="ml-1">
          //                   {/* {ele.name === "" || ele.name === undefined
          //                     ? "NA"
          //                     : ele.name} */}
          //                     {ele.name}
          //                 </span>
          //               ))}
          //           </Content>
          //         </Row>
          //         <Row className="mb-2">
          //           <Content className="text-md font-medium">
          //             {t("labels:first_name")}:{" "}
          //           </Content>
          //           <Content
          //             className={`text-md font-medium ${
          //               langDirection === "rtl" ? "!mr-1" : "!ml-1"
          //             }`}
          //           >
          //             {/* {(storeUsersData && storeUsersData.firstName === "") ||
          //             (storeUsersData && storeUsersData.firstName === undefined)
          //               ? "NA"
          //               : storeUsersData && storeUsersData.firstName} */}
          //               {storeUsersData && storeUsersData.firstName}
          //           </Content>
          //         </Row>
          //         <Row className=" mb-2">
          //           <Content className="text-md font-medium">
          //             {t("labels:last_name")}:{" "}
          //           </Content>
          //           <Content
          //             className={`text-md font-medium ${
          //               langDirection === "rtl" ? "!mr-1" : "!ml-1"
          //             }`}
          //           >
          //             {/* {(storeUsersData && storeUsersData.lastName === "") ||
          //             (storeUsersData && storeUsersData.lastName === undefined)
          //               ? "NA"
          //               : storeUsersData && storeUsersData.lastName} */}
          //               {storeUsersData && storeUsersData.lastName}
          //           </Content>
          //         </Row>
          //         <Row className="">
          //           <Content className="text-md font-medium">
          //             {t("labels:onboarded_on")}:{" "}
          //             {/* {getGenerateDateAndTime(
          //               storeUsersData && storeUsersData.createdTimestamp,
          //               "D MMMM YYYY"
          //             )} */}
          //           </Content>
          //           <Content
          //             className={`text-md font-medium ${
          //               langDirection === "rtl" ? "!mr-1" : "!ml-1"
          //             }`}
          //           >
          //             {/* {moment(
          //               storeUsersData && storeUsersData.createdTimestamp
          //             ).format("D MMMM YYYY")} */}
          //             {formatTimestamp(
          //               storeUsersData &&
          //                 storeUsersData.createdTimestamp.toString()
          //             )}
          //           </Content>
          //         </Row>
          //       </Content>
          //     </Content>
          //   </Content>
          // </Content>
          <Content className="mx-3 my-24">
            <Content className="w-[100%] bg-white my-3 p-2 rounded-md shadow-sm">
              <div className="flex gap-2">
                {/* <img
                  src={
                    "https://images.unsplash.com/photo-1566275529824-cca6d008f3da?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvdG98ZW58MHx8MHx8fDA%3D"
                  }
                  alt="Profile"
                  className="w-16 aspect-square rounded-[50%] overflow-hidden"
                /> */}
                <Avatar size={64} icon={<UserOutlined />} />
                <div className="flex flex-col justify-center">
                  <Typography className="input-label-color  m-0 items-center">
                    <span className="text-3xl">
                      {storeUsersData &&
                      storeUsersData.username &&
                      storeUsersData.username.length > 0
                        ? storeUsersData.username.slice(0, 1).toUpperCase() +
                          storeUsersData.username.slice(1)
                        : null}
                    </span>{" "}
                    <span>
                      {t("labels:onboarded_on")}{" "}
                      {getGenerateDateAndTime(
                        storeUsersData && storeUsersData.createdTimestamp,
                        "MMM D YYYY"
                      ).replace(/(\w{3} \d{1,2}) (\d{4})/, "$1, $2")}
                    </span>
                  </Typography>
                  <Typography className="text-black !mt-1 !mb-0 !mx-0">
                    {storeUsersData &&
                      storeUsersData.groups.length > 0 &&
                      storeUsersData.groups.map((ele) => (
                        <span>{ele.name.replace(/-/g, " ")}</span>
                      ))}
                  </Typography>
                </div>
              </div>
            </Content>

            <Content className="w-[100%] bg-white my-4 p-3 rounded-md shadow-sm">
              <Row gutter={25} className="pb-2">
                <Col span={12}>
                  <Typography className="input-label-color">
                    {t("labels:first_name")}
                  </Typography>
                </Col>
                <Col>
                  <Typography className="input-label-color">
                    {t("labels:last_name")}
                  </Typography>
                </Col>
              </Row>
              <Row gutter={25} className="pb-2">
                <Col span={12}>
                  <Input
                    value={storeUsersData && storeUsersData.firstName}
                    disabled
                  />
                </Col>
                <Col span={12}>
                  <Input
                    value={storeUsersData && storeUsersData.lastName}
                    disabled
                  />
                </Col>
                {/* <Col span={12}>
                  <Typography className="border border-gray-300 p-2 rounded-md min-h-[38px]">
                    {storeUsersData && storeUsersData.firstName}
                  </Typography>
                </Col>
                <Col span={12}>
                  <Typography className="border border-gray-300 p-2 rounded-md min-h-[38px]">
                    {storeUsersData && storeUsersData.lastName}
                  </Typography>
                </Col> */}
              </Row>
              <Row className="pb-2">
                <Col>
                  <Typography className="input-label-color">
                    {t("labels:email")}
                  </Typography>
                </Col>
              </Row>
              <Row gutter={25}>
                <Col span={12}>
                  {/* <Typography className="border border-gray-300 p-2 rounded-md min-h-[38px]">
                    {email}
                  </Typography> */}
                  <Input value={email} disabled />
                </Col>
                <Col>
                  <Button
                    onClick={showPasswordChangeModal}
                    className="min-h-[38px] app-btn-secondary"
                  >
                    {t("labels:change_password")}
                  </Button>
                </Col>
              </Row>
              <Typography className="input-label-color py-2">
                {t("labels:profile_picture")}
              </Typography>
              {/* <img
                src={
                  "https://images.unsplash.com/photo-1566275529824-cca6d008f3da?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvdG98ZW58MHx8MHx8fDA%3D"
                }
                alt="Profile"
                className=" w-24 aspect-square "
              /> */}
              <Avatar shape="square" size={64} icon={<UserOutlined />} />
            </Content>
          </Content>
        )}
      </Content>
      {/* Change password modal */}
      {isPasswordChangeModalOpen ? (
        <StoreModal
          isVisible={isPasswordChangeModalOpen}
          title={t("labels:change_password")}
          okCallback={() => handleOkPasswordChangeModal()}
          cancelCallback={() => handleCancelPasswordChangeModal()}
          okButtonText={`${t("labels:save")}`}
          cancelButtonText={`${t("labels:cancel")}`}
          isOkButtonDisabled={
            password === "" && currentPassword === "" && confirmPassword === ""
          }
          isSpin={""}
          width={1000}
        >
          <hr />
          <Content className="mt-2">
            <Row gutter={50}>
              <Col span={12}>
                <Content>
                  <Typography className="input-label-color py-2">
                    {t("labels:current_password")}
                  </Typography>
                  <Input.Password
                    placeholder={t("placeholders:enter_password")}
                    status={isCurrentpasswordValid ? "" : "error"}
                    maxLength={maxPasswordLength}
                    minLength={minPasswordLength}
                    value={currentPassword}
                    onChange={handleCurrnetPasswordChange}
                  />
                </Content>
              </Col>
            </Row>
            <Row gutter={50} className="mt-6 mb-2">
              <Col span={12}>
                <Content className="mb-2">
                  <Typography className="input-label-color py-2">
                    {t("labels:new_password")}
                  </Typography>

                  <Input.Password
                    placeholder={t("placeholders:enter_your_new_password")}
                    value={password}
                    status={
                      isNewpasswordValid
                        ? password && !isPasswordValid
                          ? "error"
                          : ""
                        : "error"
                    }
                    maxLength={maxPasswordLength}
                    minLength={minPasswordLength}
                    onChange={handlePasswordChange}
                  />
                  {password && !isPasswordValid && (
                    <div style={{ color: "red" }}>
                      {t("labels:please_enter_a_valid_password")}
                    </div>
                  )}
                </Content>
                <Content>
                  <Typography className="input-label-color py-2">
                    {t("labels:confirm_password")}
                  </Typography>
                  <Input.Password
                    placeholder={t("placeholders:enter_your_confirm_password")}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    status={isConfirmpasswordValid ? "" : "error"}
                    maxLength={maxPasswordLength}
                    minLength={minPasswordLength}
                    className={
                      password &&
                      confirmPassword &&
                      password !== "" &&
                      confirmPassword !== "" &&
                      password !== confirmPassword
                        ? "custom-error-input"
                        : null
                    }
                  />
                  {password &&
                    confirmPassword &&
                    password !== "" &&
                    confirmPassword !== "" &&
                    password !== confirmPassword && (
                      <div style={{ color: "red" }}>
                        {t("messages:password_mismatch")}
                      </div>
                    )}
                </Content>
              </Col>
              <Col span={12} className=" border-l-2 border-gray-300">
                <Content>
                  <Title level={5}>
                    {t("labels:your_password_must_contain")}
                  </Title>
                  <p>
                    <IoMdCheckmarkCircleOutline
                      style={{
                        color: `${
                          password && password.length >= 12
                            ? "green"
                            : "initial"
                        }`,
                        display: "inline",
                      }}
                    />{" "}
                    {t("messages:atleast_12_charecters")}
                  </p>
                  <p>
                    <IoMdCheckmarkCircleOutline
                      style={{
                        color: `${
                          password && /[A-Z]/.test(password)
                            ? "green"
                            : "initial"
                        }`,
                        display: "inline",
                      }}
                    />{" "}
                    {t("messages:one_or_more_upper_case_letter")}
                  </p>
                  <p>
                    <IoMdCheckmarkCircleOutline
                      style={{
                        color: `${
                          password &&
                          /[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)
                            ? "green"
                            : "initial"
                        }`,
                        display: "inline",
                      }}
                    />{" "}
                    {t("messages:one_or_more_special_charecter_or_symbols")}
                  </p>
                  <p>
                    <IoMdCheckmarkCircleOutline
                      style={{
                        color: `${
                          password && /[a-z]/.test(password)
                            ? "green"
                            : "initial"
                        }`,
                        display: "inline",
                      }}
                    />{" "}
                    {t("messages:one_or_more_lower_case_letters")}
                  </p>
                  <p>
                    <IoMdCheckmarkCircleOutline
                      style={{
                        color: `${
                          password && /[\d]/.test(password)
                            ? "green"
                            : "initial"
                        }`,
                        display: "inline",
                      }}
                    />{" "}
                    {t("messages:one_or_more_numbers")}
                  </p>
                </Content>
              </Col>
            </Row>
          </Content>
          <hr />
        </StoreModal>
      ) : null}
    </Content>
  );
};

export default UserProfile;
