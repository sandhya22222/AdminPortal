import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Content } from "antd/lib/layout/layout";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Typography,
  Input,
  Select,
  Button,
  Layout,
  Breadcrumb,
} from "antd";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";

//! Import CSS libraries
import { Container } from "reactstrap";

//! Destructure the components
const { Title } = Typography;
const { Option } = Select;

const languageAPI = process.env.REACT_APP_DM_LANGUAGE_API;

toast.configure();

const EditLanguage = () => {
  const search = useLocation().search;
  const _id = new URLSearchParams(search).get("_id");
  const putObject = {};
  const [languageListAPIData, setLanguageListAPIData] = useState();
  // const [isLoadingEditLanguage, setIsLoadingEditLanguage] = useState(true);
  // const [isNetworkErrorEditLanguage, setIsNetworkErrorEditLanguage] =
  //   useState(false);
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [scriptDirection, setScriptDirection] = useState("");
  // const [languageId, setLangaugeId] = useState();
  const [inValidLanguageId, setInValidLanguageId] = useState(false);
  const [inValidLanguageCode, setInValidLanguageCode] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLanguageCodeChange = (e) => {
    setLanguageCode(e.target.value);
  };

  const handleNativeNameChange = (e) => {
    setNativeName(e.target.value);
  };

  const handleScriptDirectionChange = (value) => {
    setScriptDirection(value);
  };

  const editLanguageButtonHeader = () => {
    return (
      <>
        <Content className="w-[50%] float-left my-3">
          <Button
            icon={<ArrowLeftOutlined className="w-4 h-4" />}
            onClick={() => navigate(-1)}
            className="ant-btn mr-4 ant-btn-default ant-btn-icon-only w-12 h-10 border-[1px] border-solid border-[#393939] box-border rounded py-[6px] px-[16px]"
          ></Button>

          <Title level={3} className="m-0 inline-block !font-normal">
            Edit a Vendor
          </Title>
        </Content>
      </>
    );
  };

  // language API GET call
  const getLanguageAPI = () => {
    axios
      .get(languageAPI)
      .then(function (response) {
        console.log(
          "Response from  edit language server-----> ",
          response.data
        );
        setLanguageListAPIData(response.data);
        // setIsLoadingEditLanguage(false);
        // setIsNetworkErrorEditLanguage(false);
      })
      .catch((error) => {
        console.log("errorFromLanguageApi====>", error);
        // setIsNetworkErrorEditLanguage(true);
        // setIsLoadingEditLanguage(false);
      });
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   getLanguageAPI();
  // }, []);

  // useEffect(() => {
  //   if (languageListAPIData && languageListAPIData.length > 0) {
  //     const found = languageListAPIData.find((element) => element.id === _id);
  //     setLanguage(languageListAPIData[0].language);
  //     setLanguageCode(languageListAPIData[0].languageCode);
  //     setNativeName(languageListAPIData[0].nativeName);
  //     setScriptDirection(languageListAPIData[0].scriptDirection);
  //     console.log("found ----->", found);
  //   }
  // }, [_id]);

  useEffect(() => {
    if (_id !== null) {
      var languageData =
        languageListAPIData &&
        languageListAPIData.length > 0 &&
        languageListAPIData.filter((element) => element.id === parseInt(_id));

      if (languageListAPIData && languageListAPIData.length > 0) {
        setLanguage(languageData.language);
        setLanguageCode(languageData.language_code);
        setNativeName(languageData.native_name);
        setScriptDirection(languageData.scriptDirection);
      }

      console.log("found---->", languageData);
      console.log("found---->", _id);
    }
  }, [_id]);

  const validateFieldForLanguage = () => {
    let validValues = 2;
    if (language === "") {
      setInValidLanguageId(true);
      validValues -= 1;
      toast("Please Enter Language Id", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (languageCode === "") {
      setInValidLanguageCode(true);
      validValues -= 1;
      toast("Please Enter Language Code", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    // if (validValues === 2) {
    //   if (
    //     languageListAPIData &&
    //     languageListAPIData.length > 0 &&
    //     languageCode === languageListAPIData[0].languageCode &&
    //     language !== languageListAPIData[0].language
    //   ) {
    //     putObject.language = language;
    //     editLanguagePutCall(putObject);
    //   } else if (
    //     languageListAPIData &&
    //     languageListAPIData.length > 0 &&
    //     language === languageListAPIData[0].language &&
    //     languageCode !== languageListAPIData[0].languageCode
    //   ) {
    //     putObject.languageCode = languageCode;
    //     editLanguagePutCall(putObject);
    //   } else if (
    //     languageListAPIData &&
    //     languageListAPIData.length > 0 &&
    //     language !== languageListAPIData[0].language &&
    //     languageCode !== languageListAPIData[0].languageCode
    //   ) {
    //     putObject.language = language;
    //     putObject.languageCode = languageCode;
    //     editLanguagePutCall(putObject);
    //   }
  };

  // Language PUT API call
  const editLanguagePutCall = (putObject) => {
    console.log("PutObject----->", putObject);
    axios
      .put(
        languageAPI,
        putObject
        //   {
        //   params: {
        //     _id: parseInt(_id),
        //     language: language,
        //     language_code: languageCode,
        //   },
        // }
      )
      .then(function (response) {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          getLanguageAPI();
          toast("Edit Language is Successfully Done! ", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
        toast(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response);
      });
  };

  return (
    <Layout className="p-3">
      {/* <Content className="">
        <Breadcrumb separator="/">
          <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item href="/">Language</Breadcrumb.Item>
          <Breadcrumb.Item>Add Language</Breadcrumb.Item>
        </Breadcrumb>
      </Content> */}
      <Content className="mt-2">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Language", navigationPath: "/", displayOrder: 2 },
            { title: "Edit Language", navigationPath: "", displayOrder: 3 },
          ]}
        />
      </Content>
      {editLanguageButtonHeader()}
      <Content>
        <Row>
          <Col span={16}>
            <Content className="bg-white">
              <Content className="p-3">
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
                      inValidLanguageId
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
                      inValidLanguageCode
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
                onClick={() => {
                  editLanguagePutCall();
                  validateFieldForLanguage();
                }}
                // onClick={validateFieldForLanguage}
                style={{ backgroundColor: "#393939" }}
                type="primary"
                htmlType="submit"
              >
                Update
              </Button>
            </Content>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default EditLanguage;
