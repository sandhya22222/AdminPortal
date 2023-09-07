//! Import libraries & components
import React, { useEffect } from "react";
import { Layout } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";

//! Import user defined functions

//! Import user defined CSS
import "./home.css";
//! Destructure the components
const { Content } = Layout;

//! Get all required details from .env file

const Home = () => {
  usePageTitle("Admin Portal - Home");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [location.search]);

  return (
    <Content className=" temppic grid justify-items-center p-3 h-[100vh] bg-bottom ">
     
    </Content>
  );
};

export default Home;
