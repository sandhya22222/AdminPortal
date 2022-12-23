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
  const _id = new URLSearchParams(search).get("_id");;
  const [languageDetails, setLanguageDetails] = useState({
        language: "",
        language_code: "",
        native_name: "",
        writing_script_direction: "",
        islanguageDetailsEdited: false
  })
  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] = useState(false);
  const navigate = useNavigate();

  // hanler for language, language_code, native_name, writing_script_direction
  const languageHandler = (fieldName, value) => {
    let copyofLanguageDetails = { ...languageDetails }
    if (fieldName === "language") {
      copyofLanguageDetails.language = value;
      if (value != "") {
        setIsLanguageFieldEmpty(false)
      }
    } else if (fieldName === "language_code") {
      copyofLanguageDetails.language_code = value;
      if (value != "") {
        setIsLanguageCodeFieldEmpty(false)
      }
    } else if (fieldName === "native_name") {
      copyofLanguageDetails.native_name = value
    } else if (fieldName === "writing_script_direction") {
      copyofLanguageDetails.writing_script_direction = value
    }
    copyofLanguageDetails.islanguageDetailsEdited = true
    setLanguageDetails(copyofLanguageDetails)
  }
  
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
            Edit Language
          </Title>
        </Content>
      </>
    );
  };

  // language API GET call
  const getLanguageAPI = () => {
    axios
      .get(languageAPI)
      .then((response) => {
        console.log(
          "Response from  edit language server-----> ", response.data
        );
        let languageData = response?.data.filter((element) => element.id === parseInt(_id));
        if (languageData && languageData.length > 0) {
          let copyofLanguageDetails = {...languageDetails}
          copyofLanguageDetails.language = languageData[0].language
          copyofLanguageDetails.language_code = languageData[0].language_code
          copyofLanguageDetails.native_name = languageData[0].native_name
          copyofLanguageDetails.writing_script_direction = languageData[0].writing_script_direction
          setLanguageDetails(copyofLanguageDetails)
        }
      })
      .catch((error) => {
        console.log("errorFromLanguageApi====>", error);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getLanguageAPI();
  }, []);

 
  const validateLanguageFieldEmptyOrNot = () => {
    if (languageDetails.language === "") {
      setIsLanguageFieldEmpty(true);
      toast("Please Enter Language Id", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (languageDetails.language_code === "") {
      setIsLanguageCodeFieldEmpty(true);
      toast("Please Enter Language Code", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }

    if(languageDetails.language !== "" && languageDetails.language_code !== "" && languageDetails.islanguageDetailsEdited){
      editLanguage()
    }
   
  };

  // Language PUT API call
  const editLanguage = () => {
    const langaugeData = new FormData();
    langaugeData.append("language", languageDetails.language);
    langaugeData.append("language_code", languageDetails.language_code);
    langaugeData.append("native_name", languageDetails.native_name);
    langaugeData.append("writing_script_direction", languageDetails.writing_script_direction)
    console.log("PutObject----->", langaugeData);
    axios
      .put(
        languageAPI,
        langaugeData,
          {
          params: {
            _id: parseInt(_id)
          },
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          // getLanguageAPI();
          toast("Language edited sucessfully.", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
        toast(error.response.data.message + "_field in language edition", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response);
      });
  };


  console.log("language_details", languageDetails)
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
                    value={languageDetails.language}
                    className={`${
                      isLanguageFieldEmpty
                        ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400"
                        : "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                    }`}
                    onChange={(e) => {
                      languageHandler("language", e.target.value);
                    }}
                  />
                </Content>
                <Content className="my-2">
                  <label className="text-[13px]">
                    Language Code<sup className="text-red-600 text-sm">*</sup>
                  </label>
                  <Input
                    placeholder="Enter Language Code"
                    value={languageDetails.language_code}
                    className={`${
                      isLanguageCodeFieldEmpty
                        ? "border-red-400 h-10 border-[1px] border-solid focus:border-red-400 hover:border-red-400"
                        : "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                    }`}
                    onChange={(e) => {
                      languageHandler("language_code", e.target.value);
                    }}
                  />
                </Content>
                <Content className="my-2">
                  <label className="text-[13px]">Native Name</label>
                  <Input
                    placeholder="Enter Native Name"
                    value={languageDetails.native_name}
                    onChange={(e) => {
                      languageHandler("native_name", e.target.value);
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
                    defaultValue={languageDetails.writing_script_direction}
                    value={languageDetails.writing_script_direction}
                    placeholder="---"
                    allowClear
                    onChange={(e) => {
                      languageHandler("writing_script_direction",e);
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
                  validateLanguageFieldEmptyOrNot();
                }}
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
