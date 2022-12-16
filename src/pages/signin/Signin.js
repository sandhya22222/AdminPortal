//! Import libraries & components
import React, { useState } from "react";
import { Layout, Input, Typography } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

//! Import CSS libraries

//! Import user defined services
import { fnUserLoggedInInfo } from "../../services/redux/actions/ActionsUser";

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";
import { BrandLogo, ThbsLogo } from "../../constants/media";

//! Import user defined functions

//! Import user defined CSS
import "./signin.css";

//! Get all required details from .env file
const PortalLoginInfoTitle = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

//! Destructure the components
const { Content } = Layout;
const { Text, Link } = Typography;

const Signin = () => {
  usePageTitle("Admin Portal - Signin");

  const dispatch = useDispatch();
  const [username, setusername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [inValidUsername, setInValidUsername] = useState(false);
  const [inValidUserPassword, setInvalidUserPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    let validValues = 2;
    if (username === "" && userPassword === "") {
      setInValidUsername(true);
      setInvalidUserPassword(true);
      validValues -= 1;
      toast("Please enter username & password", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else if (username === "") {
      setInValidUsername(true);
      toast("Please enter username", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else if (userPassword === "") {
      setInvalidUserPassword(true);
      validValues -= 1;
      toast("Please enter password", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else {
      dispatch(fnUserLoggedInInfo([{ id: 1, name: username }]));
      toast("Successfully signed in", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        onClose: navigate("/dashboard"),
      });
      setUserPassword("");
      setusername("");
    }
  };

  const handleNameChange = (e) => {
    setInValidUsername(false);
    setusername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setInvalidUserPassword(false);
    setUserPassword(e.target.value);
  };

  return (
    <Content className=" temp bg-bottom min-h-screen m-auto">
      <Content className=" text-center m-auto">
        <img src={BrandLogo} className=" mt-5 !inline-block " />
        <Content
          className="bg-white !mt-5 text-center p-10 w-[35%] drop-shadow-2xl"
          style={{ margin: "0 auto" }}
        >
          <Text className=" font-semibold text-2xl ">
            {PortalLoginInfoTitle.title}
          </Text>
          <Input
            style={{ marginTop: "18px", marginBottom: "18px" }}
            prefix={<UserOutlined className="" />}
            placeholder="Username"
            value={username}
            className={`${
              inValidUsername
                ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400"
                : "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
            }`}
            onChange={(e) => {
              handleNameChange(e);
            }}
          />
          <Input.Password
            prefix={<LockOutlined className="" />}
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={userPassword}
            className={`${
              inValidUserPassword
                ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400"
                : "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
            }`}
            onChange={(e) => {
              handlePasswordChange(e);
            }}
          />
          {/* <Content className="mt-3">
          <Button block onClick={handleSubmit}
            icon={<UnlockOutlined className="-pt-12" />}
            className="bg-orange-600  hover:!bg-orange-600 text-white h-9">
            Login
          </Button>
          </Content> */}
          <Content
            className=" bg-black rounded-sm h-10 text-center mt-3 text-white flex justify-center 
            cursor-pointer p-1"
            onClick={handleSubmit}
          >
            <span className=" mr-1">
              <UnlockOutlined />
            </span>
            <span>
              <label className=" pt-1 cursor-pointer"> Login </label>
            </span>
          </Content>
        </Content>
        <Content className="mt-3 text-[#F4F4F4]">
          <Text>A component of </Text>
          <Text underline>
            <Link className=" !text-gray-700" href="" target="_blank">
              DigitMarket
            </Link>
          </Text>
          <Text className=" text-xs">
            <sup className="">TM</sup>
          </Text>
          <Text className=" ml-2">
            A product of Torry Harris Integration Solutions -
          </Text>
          <Text underline>
            <Link
              className=" !text-gray-700"
              href="https://www.torryharris.com/"
              target="_blank"
            >
              torryharris.com
            </Link>
          </Text>
        </Content>
        <img className="my-3 h-[40px] !inline-block" src={ThbsLogo} />
      </Content>
    </Content>
  );
};

export default Signin;
