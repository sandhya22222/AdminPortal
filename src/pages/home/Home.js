//! Import libraries & components
import React from "react";
import { Button, Layout, Typography } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";

//! Import user defined functions

//! Import user defined CSS
import "./home.css";

//! Get all required details from .env file

//! Destructure the components
const { Title } = Typography;
const { Content } = Layout;

const Home = () => {
  usePageTitle("Home");

  const persistedUserLoggedInInfo = useSelector(
    (state) => state.reducerUserLoggedInfo.userLoggedInfo
  );
  return (
    <Content className=" temppic grid justify-items-center p-3 h-[75vh] bg-bottom ">
      <Title level={4}>This is Home page</Title>
      {typeof persistedUserLoggedInInfo !== "undefined" ? (
        <Link to="dashboard">
          <Button className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <Link to="/signin">
          <Button className="!h-10 mt-5 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
            Signin
          </Button>
        </Link>
      )}
    </Content>
  );
};

export default Home;
