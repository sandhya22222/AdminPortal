import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {makeHttpRequestForRefreshToken} from "../../util/unauthorizedControl"
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Spin,
} from "antd";
import { toast } from "react-toastify";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import "./language.css";

const { Title } = Typography;
const { Option } = Select;
const languageAPI = process.env.REACT_APP_LANGUAGE_API;
const { Content } = Layout;

const AddLanguage = () => {
  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] =
    useState(false);
  const [isRegexFieldEmpty, setIsRegexFieldEmpty] = useState(false);
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [regex, setRegex] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [scriptDirection, setScriptDirection] = useState("LTR");
  const [fileData, setFileData] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileExtensiom, setFileExtension] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setNativeName(e.target.value);
    if (e.target.value != "") {
      setIsLanguageFieldEmpty(false);
    }
  };

  const handleLanguageCodeChange = (e) => {
    setLanguageCode(e.target.value);
    if (e.target.value != "") {
      setIsLanguageCodeFieldEmpty(false);
    }
  };

  const handleRegexChange = (e) => {
    setRegex(e.target.value);
    if (e.target.value != "") {
      setIsRegexFieldEmpty(false);
    }
  };

  const handleNativeNameChange = (e) => {
    setNativeName(e.target.value);
  };

  const handleScriptDirectionChange = (value) => {
    setScriptDirection(value);
  };

  const handleUploadFile = (e) => {
    if (e.target.files[0].size < 4 * 1000000) {
      let file = e.target.files[0];
      let fileExtension = file.name.split(".").pop();
      let fileName = file.name;
      setFileData(file);
      setFileExtension(fileExtension);
      setFileName(fileName);
      console.log("Final FIle In Function", file, fileExtension, fileName);
    } else {
      toast(`Please select File less than four mb`, {
        position: toast.POSITION.TOP_RIGHT,
        type: "warning",
      });
    }
  };

  const validateLanguageFieldEmptyOrNot = () => {
    // let validValues = 2;
    if (language === "") {
      setIsLanguageFieldEmpty(true);
      // validValues -= 1;
      toast("Please Enter Language Name", {
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
    if (regex === "") {
      setIsRegexFieldEmpty(true);
      // validValues -= 1;
      toast("Please Enter Language Regex", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (language !== "" && languageCode !== "" && regex !== "") {
      PostLanguageAPI();
    }
  };

  //post function
  const PostLanguageAPI = () => {
    const paramsData = new FormData();
    paramsData.append("language", language);
    paramsData.append("language_code", languageCode);
    paramsData.append("dm_language_regex", regex);
    paramsData.append("native_name", nativeName);
    paramsData.append("writing_script_direction", scriptDirection);
    if (typeof fileData === "object") {
      paramsData.append("lang_support_docs", fileData);
    }
    console.log("This is from Params Data---->", paramsData);
    // enabling spinner
    setIsLoading(true);
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
            // disabbling spinner
            setIsLoading(false);
            navigate(-1);
          }
        }
      })
      .catch((error) => {
        // disabbling spinner
        setIsLoading(false);
        if (error.response.status === 409) {
          toast("Data already exist", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }else if(error&&error.response&&error.response.status === 401){
          makeHttpRequestForRefreshToken();}else {
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
        <Content className="w-[50%] float-left flex items-center my-3">
          <Link to="/dashboard/language">
            <ArrowLeftOutlined
              role={"button"}
              className={
                "mr-4 text-black  w-12  h-10 border-[1px] border-solid border-[#393939] rounded-md pt-[11px]"
              }
            />
          </Link>

          <Title level={3} className="m-0 inline-block !font-normal">
            Add Language
          </Title>
        </Content>
      </>
    );
  };

  return (
    <Layout>
      <Content className="mt-2">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            {
              title: "Language",
              navigationPath: "/dashboard/language",
              displayOrder: 2,
            },
            { title: "Add Language", navigationPath: "", displayOrder: 3 },
          ]}
        />
      </Content>
      {addLanguageButtonHeader()}
      <Spin tip="Please wait!" size="large" spinning={isLoading}>
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
                      placeholder="Enter Language Name"
                      value={language}
                      className={`${
                        isLanguageFieldEmpty
                          ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                          : ""
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
                          ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleLanguageCodeChange(e);
                      }}
                    />
                  </Content>
                  <Content className="my-2">
                    <label className="text-[13px]">
                      Language Regex
                      <sup className="text-red-600 text-sm">*</sup>
                    </label>
                    <Input
                      placeholder="Enter Language Regex"
                      value={regex}
                      maxLength={124}
                      className={`${
                        isRegexFieldEmpty
                          ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleRegexChange(e);
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
                      // className={
                      //   "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                      // }
                    />
                  </Content>
                  <Content className="my-2">
                    <label className="text-[13px]">Script Direction</label>
                    <Select
                      // size={"large"}
                      style={{ display: "flex" }}
                      value={scriptDirection}
                      onChange={(e) => {
                        handleScriptDirectionChange(e);
                      }}
                    >
                      <Option value="LTR">LTR</Option>
                      <Option value="RTL">RTL</Option>
                    </Select>
                  </Content>
                  <Content className="my-2">
                    <label className="text-[13px] pb-1">
                      Language Supported Document
                    </label>
                    <Input
                      type="file"
                      name="filename"
                      onChange={(e) => handleUploadFile(e)}
                      accept=".csv"
                    />
                  </Content>
                </Content>
              </Content>
              <Content className="mt-3">
                <Row>
                  <Col>
                    <Link to="/dashboard/language">
                      <Button
                        // style={{ background: "#FFFFFF" }}
                        className=" app-btn-secondary"
                      >
                        Discard
                      </Button>
                    </Link>
                  </Col>
                  <Col className="pl-4">
                    <Button
                      style={{ backgroundColor: "#393939" }}
                      className="app-btn-primary"
                      onClick={validateLanguageFieldEmptyOrNot}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Content>
            </Col>
          </Row>
        </Content>
      </Spin>
    </Layout>
  );
};

export default AddLanguage;
