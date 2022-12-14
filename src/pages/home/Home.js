import React from "react";
import { Container } from "reactstrap";
import { Button, Layout } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './home.css'
import { usePageTitle } from "../../hooks/usePageTitle";

const Home = () => {
  usePageTitle("Home")

  const persistedUserLoggedInInfo = useSelector(
    (state) => state.reducerUserLoggedInfo.userLoggedInfo
  );
  return (
    <Container fluid className=" temppic grid justify-items-center p-3 h-[90vh] bg-bottom ">
      <h3>Welcome to Digit Market</h3>
      <h4>DM Admin Portal</h4>
      <h5 className="">This page is under Construction</h5>
      {typeof persistedUserLoggedInInfo !== "undefined" ?

        <Link to="dashboard">
          <Button className="!h-10 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
            Go to Dashboard
          </Button>
        </Link>

        :
        <Link to="/signin">
          <Button className="!h-10 mt-5 !bg-[#393939] text-white !border-[1px] !border-solid !border-[#393939] !box-border !rounded !pl-[15px]">
            Signin
          </Button>
        </Link>

      }

    </Container>
  );
};

export default Home;
