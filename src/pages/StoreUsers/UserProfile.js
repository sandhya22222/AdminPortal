import React, { useEffect, useState } from "react";
import { Avatar, Layout, Typography, Row, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { getGenerateDateAndTime } from "../../util/util";
const { Content } = Layout;
const { Text, Title } = Typography;

const UserProfile = () => {
  const storeUsersAPI = process.env.REACT_APP_USERS_API;

  const [storeUsersData, setStoreUsersData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const findAllWithoutPageStoreUsers = () => {
    MarketplaceServices.findAllWithoutPage(storeUsersAPI, null, false)
      .then(function (response) {
        console.log(
          "get from  store user server response-----> ",
          response.data
        );
        setStoreUsersData(response.data);
        setIsNetworkError(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error from store all users API ====>", error.response);
        setIsNetworkError(true);
        setIsLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    findAllWithoutPageStoreUsers();
    window.scroll(0, 0);
  }, []);

  return (
    <Content>
      <HeaderForTitle
        title={
          <Content className="">
            <Title level={3} className="!font-normal">
              Profile
            </Title>
          </Content>
        }
      />
      <Content className="mt-[10rem] !min-h-screen !p-6  !mx-[17rem]">
        {isLoading ? (
          <Content className="bg-white">
            <Skeleton
              active
              paragraph={{
                rows: 6,
              }}
              className="p-3"
            ></Skeleton>
          </Content>
        ) : isNetworkError ? (
          <Layout className="p-0 text-center mb-3 bg-[#F4F4F4]">
            <h5>
              {errorMessage
                ? errorMessage
                : " Please wait, we are validating you, if this persists, logout and login."}
            </h5>
          </Layout>
        ) : (
          <Content className=" !text-center">
            <Content className=" shadow-sm  bg-[#FFFFFF] rounded-2xl flex flex-col items-center px-8 py-10 w-[500px]">
              <Row className="mb-2">
                <Avatar size={104} icon={<UserOutlined />} />
              </Row>
              <Row className="mb-2">
                <Text className="font-medium text-lg">
                  {storeUsersData && storeUsersData.username}
                </Text>
              </Row>
              <Row className=" text-sky-600 underline underline-offset-2 mb-3">
                <Link to="">{storeUsersData && storeUsersData.email}</Link>
              </Row>
              <Row className="mb-2">
                <label className="text-md font-medium">
                  First Name :{" "}
                  {(storeUsersData && storeUsersData.firstName === "") ||
                  (storeUsersData && storeUsersData.firstName === undefined)
                    ? "NA"
                    : storeUsersData && storeUsersData.firstName}
                </label>
              </Row>
              <Row className=" mb-2">
                <label className="text-md font-medium">
                  Last Name :{" "}
                  {(storeUsersData && storeUsersData.lastName === "") ||
                  (storeUsersData && storeUsersData.lastName === undefined)
                    ? "NA"
                    : storeUsersData && storeUsersData.lastName}
                </label>
              </Row>
              <Row className="">
                <label className="text-md font-medium">
                  Onboarded on :{" "}
                  {getGenerateDateAndTime(
                    storeUsersData && storeUsersData.createdTimestamp,
                    "D MMMM YYYY"
                  )}
                </label>
              </Row>
            </Content>
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default UserProfile;
