import React, { useEffect, useState } from "react";
import { Avatar, Layout, Typography, Row, Skeleton } from "antd";
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
const { Content } = Layout;
const { Text, Title } = Typography;

const storeUsersAPI = process.env.REACT_APP_USERS_API;

const UserProfile = () => {
  usePageTitle("Profile");
  const { t } = useTranslation();
  const [storeUsersData, setStoreUsersData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [langDirection, setLangDirection] = useState("ltr");
  const [hideEmail, setHideEmail] = useState("");

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
      <Content className="mt-[7.8rem] ">
        {isLoading ? (
          <Content className="!text-center !p-6">
            <Content className="inline-block shadow-sm  bg-[#FFFFFF] !rounded-md px-8 py-10 w-[500px]">
              <Skeleton
                active
                paragraph={{
                  rows: 3,
                }}
                className="p-3"
              ></Skeleton>
            </Content>
          </Content>
        ) : isNetworkError ? (
          <Content className="!text-center !p-6">
            <Content className="inline-block shadow-sm  bg-[#FFFFFF] !rounded-md px-8 py-10 w-[500px]">
              {t("messages:profile_description")}
            </Content>
          </Content>
        ) : (
          <Content className="!text-center !p-6 !mx-[17rem]">
            <Content className="inline-block">
              <Content className="shadow-sm  bg-[#FFFFFF] !rounded-2xl flex flex-col items-center px-8 py-10 w-[500px]">
                {/* <Row className="mb-2">
                  <Avatar size={104} icon={<UserOutlined />} />
                </Row>
                </Row> */}
                <Row className="mb-2">
                  <Text className="font-medium text-lg">
                    {storeUsersData && storeUsersData.username}
                  </Text>
                </Row>
                <Row className="font-semibold mb-3">
                  <Text to="">{hideEmail && hideEmail}</Text>
                </Row>
                <Content className="flex flex-col items-center">
                  <Row className="mb-2">
                    <Content className="text-md font-medium flex text-right">
                      {t("labels:role")}:{" "}
                    </Content>
                    <Content
                      className={`text-md font-medium ${
                        langDirection === "rtl" ? "!mr-1" : ""
                      }`}
                    >
                      {storeUsersData &&
                        storeUsersData.groups.length > 0 &&
                        storeUsersData.groups.map((ele) => (
                          <span className="ml-1">
                            {ele.name === "" || ele.name === undefined
                              ? "NA"
                              : ele.name}
                          </span>
                        ))}
                    </Content>
                  </Row>
                  <Row className="mb-2">
                    <Content className="text-md font-medium">
                      {t("labels:first_name")}:{" "}
                    </Content>
                    <Content
                      className={`text-md font-medium ${
                        langDirection === "rtl" ? "!mr-1" : "!ml-1"
                      }`}
                    >
                      {(storeUsersData && storeUsersData.firstName === "") ||
                      (storeUsersData && storeUsersData.firstName === undefined)
                        ? "NA"
                        : storeUsersData && storeUsersData.firstName}
                    </Content>
                  </Row>
                  <Row className=" mb-2">
                    <Content className="text-md font-medium">
                      {t("labels:last_name")}:{" "}
                    </Content>
                    <Content
                      className={`text-md font-medium ${
                        langDirection === "rtl" ? "!mr-1" : "!ml-1"
                      }`}
                    >
                      {(storeUsersData && storeUsersData.lastName === "") ||
                      (storeUsersData && storeUsersData.lastName === undefined)
                        ? "NA"
                        : storeUsersData && storeUsersData.lastName}
                    </Content>
                  </Row>
                  <Row className="">
                    <Content className="text-md font-medium">
                      {t("labels:onboarded_on")}:{" "}
                      {/* {getGenerateDateAndTime(
                        storeUsersData && storeUsersData.createdTimestamp,
                        "D MMMM YYYY"
                      )} */}
                    </Content>
                    <Content
                      className={`text-md font-medium ${
                        langDirection === "rtl" ? "!mr-1" : "!ml-1"
                      }`}
                    >
                      {/* {moment(
                        storeUsersData && storeUsersData.createdTimestamp
                      ).format("D MMMM YYYY")} */}
                      {formatTimestamp(
                        storeUsersData &&
                          storeUsersData.createdTimestamp.toString()
                      )}
                    </Content>
                  </Row>
                </Content>
              </Content>
            </Content>
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default UserProfile;
