import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
} from "antd";
import { toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import "./language.css";

const { Title } = Typography;
const { Option } = Select;
const languageAPI = process.env.REACT_APP_DM_LANGUAGE_API;
const { Content } = Layout;

const AddLanguage = () => {
  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] = useState(false);
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [scriptDirection, setScriptDirection] = useState("");
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (e.target.value != "") {
      setIsLanguageFieldEmpty(false)
    }
  };

  const handleLanguageCodeChange = (e) => {
    setLanguageCode(e.target.value);
    if (e.target.value != "") {
      setIsLanguageCodeFieldEmpty(false)
    }
  };

  const handleNativeNameChange = (e) => {
    setNativeName(e.target.value);
  };

  const handleScriptDirectionChange = (value) => {
    setScriptDirection(value);
  };

  const validateLanguageFieldEmptyOrNot = () => {
    // let validValues = 2;
    if (language === "") {
      setIsLanguageFieldEmpty(true);
      // validValues -= 1;
      toast("Please Enter Language Id", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (languageCode === "") {
      setIsLanguageCodeFieldEmpty(true);
      // validValues -= 1;
      toast("Please Enter Language Code", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (language !== "" && languageCode !== "") {
      PostLanguageAPI();
    }
  };

  //post function
  const PostLanguageAPI = () => {
    // const events = [
      // {
        // language: language,
        // language_code: languageCode,
        // native_name: nativeName,
        // writing_script_direction: scriptDirection,
      // }
    // ];
    const paramsData = new FormData();
    paramsData.append("language", language);
    paramsData.append("language_code", languageCode);
    paramsData.append("native_name", nativeName);
    paramsData.append("writing_script_direction", scriptDirection);
    console.log("This is from Params Data---->", paramsData);
    axios
      .post(languageAPI, paramsData)
      .then((res) => {
        console.log("from response----->", res.data);
        console.log("from--->", res);
        if (res.status === 201) {
          if (res.data) {
            toast("Language Details created", {
              position: toast.POSITION.TOP_RIGHT,
              type: "success",
            });
            navigate(-1);
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast("Data already exist", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
      });
  };

  const addLanguageButtonHeader = () => {
    return (
      <>
        <Content className="w-[50%] float-left my-3">
          <Button
            icon={<BsArrowLeft className="w-4 h-4 ml-[6px]" />}
            onClick={() => navigate(-1)}
            className="w-2 h-10 border-[1px] border-solid border-[#393939] box-border py-[6px] px-[16px] mr-[16px]"
          ></Button>
          <Title level={3} className="m-0 inline-block !font-normal">
            Add a Language
          </Title>
        </Content>
      </>
    );
  };

  return (
    <Layout className="p-3">
      {/* <Content className="">
        <Breadcrumb separator="/">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/">Language</Breadcrumb.Item>
          <Breadcrumb.Item active>Add Language</Breadcrumb.Item>
        </Breadcrumb>
      </Content> */}
      <Content className="mt-2">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Language", navigationPath: "/", displayOrder: 2 },
            { title: "Add Language", navigationPath: "", displayOrder: 3 },
          ]}
        />
      </Content>
      {addLanguageButtonHeader()}
      <Content>
        <Row>
          <Col span={14}>
            <Content className="p-3 bg-white mt-0">
              <Content>
                <Typography.Title
                  level={3}
                  className="inline-block !font-normal"
                >
                  Language Details
                </Typography.Title>
                <Content className="my-2">
                  <label className="text-[13px]">
                    Language <sup className="text-red-600 text-sm">*</sup>
                  </label>
                  <Input
                    placeholder="Enter Language Id"
                    value={language}
                    className={`${
                      isLanguageFieldEmpty
                        ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400"
                        : "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                    }`}
                    onChange={(e) => {
                      handleLanguageChange(e);
                    }}
                  />
                </Content>
                <Content className="my-2">
                  <label className="text-[13px]">
                    Language Code<sup className="text-red-600 text-sm">*</sup>
                  </label>
                  <Input
                    placeholder="Enter Language Code"
                    value={languageCode}
                    className={`${
                      isLanguageCodeFieldEmpty
                        ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400"
                        : "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                    }`}
                    onChange={(e) => {
                      handleLanguageCodeChange(e);
                    }}
                  />
                </Content>
                <Content className="my-2">
                  <label className="text-[13px]">Native Name</label>
                  <Input
                    placeholder="Enter Native Name"
                    value={nativeName}
                    onChange={(e) => {
                      handleNativeNameChange(e);
                    }}
                    className={
                      "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                    }
                  />
                </Content>
                <Content className="my-2">
                  <label className="text-[13px]">Script Direction</label>
                  <Select
                    size={"large"}
                    style={{ display: "flex" }}
                    value={scriptDirection}
                    placeholder="---"
                    allowClear
                    onChange={(e) => {
                      handleScriptDirectionChange(e);
                    }}
                  >
                    <Option value="LTR">LTR</Option>
                    <Option value="RTL">RTL</Option>
                  </Select>
                </Content>
              </Content>
            </Content>
            <Content className="mt-3">
              <Button
                style={{ backgroundColor: "#393939" }}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  validateLanguageFieldEmptyOrNot();
                }}
              >
                Save
              </Button>
            </Content>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AddLanguage;
