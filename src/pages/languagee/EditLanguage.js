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
  Spin,
  Skeleton,
} from "antd";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";

import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";

//! Import CSS libraries
import { Container } from "reactstrap";

//! Destructure the components
const { Title } = Typography;
const { Option } = Select;

const languageAPI = process.env.REACT_APP_LANGUAGE_API;

toast.configure();

const EditLanguage = () => {
  const search = useLocation().search;
  const _id = new URLSearchParams(search).get("_id");
  const [languageDetails, setLanguageDetails] = useState({
    language: "",
    language_code: "",
    native_name: "",
    writing_script_direction: "",
    lang_support_docs: null,
    lang_file_name: "",
    dm_language_regex: "",
    islanguageDetailsEdited: false,
  });
  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] =
    useState(false);
  const [isRegexFieldEmpty, setIsRegexFieldEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const navigate = useNavigate();

  // hanler for language, language_code, native_name, writing_script_direction
  const languageHandler = (fieldName, value) => {
    let copyofLanguageDetails = { ...languageDetails };
    if (fieldName === "language") {
      copyofLanguageDetails.language = value;
      if (value != "") {
        setIsLanguageFieldEmpty(false);
      }
    } else if (fieldName === "language_code") {
      copyofLanguageDetails.language_code = value;
      if (value != "") {
        setIsLanguageCodeFieldEmpty(false);
      }
    } else if (fieldName === "native_name") {
      copyofLanguageDetails.native_name = value;
    } else if (fieldName === "writing_script_direction") {
      copyofLanguageDetails.writing_script_direction = value;
    } else if (fieldName === "dm_language_regex") {
      copyofLanguageDetails.dm_language_regex = value;
      if (value != "") {
        setIsRegexFieldEmpty(false);
      }
    } else if (fieldName === "lang_support_docs") {
      if (value[0].size < 4 * 1000000) {
        let file = value[0];
        let fileExtension = file.name.split(".").pop();
        copyofLanguageDetails.lang_support_docs = file;
        // setFileData(file);
        // setFileExtension(fileExtension)
        console.log("Final File In Function", file, fileExtension);
      } else {
        toast(`Please select File less than four mb`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "warning",
        });
      }
    }
    copyofLanguageDetails.islanguageDetailsEdited = true;
    setLanguageDetails(copyofLanguageDetails);
  };

  const editLanguageButtonHeader = () => {
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
            Edit Language
          </Title>
        </Content>
      </>
    );
  };

  // language API GET call
  const getLanguageAPI = () => {
    // Enabling skeleton
    setIsDataLoading(true);
    axios
      .get(languageAPI)
      .then((response) => {
        console.log(
          "Response from  edit language server-----> ",
          response.data
        );
        let languageData = response?.data.filter(
          (element) => element.id === parseInt(_id)
        );
        if (languageData && languageData.length > 0) {
          let copyofLanguageDetails = { ...languageDetails };
          copyofLanguageDetails.language = languageData[0].language;
          copyofLanguageDetails.language_code = languageData[0].language_code;
          copyofLanguageDetails.native_name = languageData[0].native_name;
          copyofLanguageDetails.writing_script_direction =
            languageData[0].writing_script_direction;
          copyofLanguageDetails.lang_support_docs =
            languageData[0].lang_support_docs;
          copyofLanguageDetails.lang_file_name =
            languageData[0].lang_support_docs;
          copyofLanguageDetails.dm_language_regex =
            languageData[0].dm_language_regex;
          setLanguageDetails(copyofLanguageDetails);
        }
        // disabling skeleton
        setIsDataLoading(false);
      })
      .catch((error) => {
        // disabling skeleton
        setIsDataLoading(false);
        console.log("errorFromLanguageApi====>", error);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getLanguageAPI();
  }, []);

  const validateLanguageFieldEmptyOrNot = () => {
    // if (languageDetails.language === "") {
    //   setIsLanguageFieldEmpty(true);
    //   toast("Please Enter Language Id", {
    //     autoClose: 5000,
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //   });
    // }
    // if (languageDetails.language_code === "") {
    //   setIsLanguageCodeFieldEmpty(true);
    //   toast("Please Enter Language Code", {
    //     autoClose: 5000,
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //   });
    // }

    if (
      languageDetails.language !== "" &&
      languageDetails.language_code !== "" &&
      languageDetails.dm_language_regex !== "" &&
      languageDetails.islanguageDetailsEdited
    ) {
      editLanguage();
    } else if (
      languageDetails.language === "" ||
      languageDetails.language_code === "" ||
      languageDetails.dm_language_regex === ""
    ) {
      if (languageDetails.language === "") {
        setIsLanguageFieldEmpty(true);
        toast("Please Enter Language Name", {
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
      if (languageDetails.dm_language_regex === "") {
        setIsRegexFieldEmpty(true);
        toast("Please Enter Laguage Regex", {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      }
    } else {
      toast("No Changes Detected !", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "info",
      });
    }
  };

  // Language PUT API call
  const editLanguage = () => {
    const langaugeData = new FormData();
    langaugeData.append("language", languageDetails.language);
    langaugeData.append("language_code", languageDetails.language_code);
    langaugeData.append("dm_language_regex", languageDetails.dm_language_regex);
    langaugeData.append("native_name", languageDetails.native_name);
    langaugeData.append(
      "writing_script_direction",
      languageDetails.writing_script_direction
    );
    if (
      languageDetails.lang_support_docs !== null &&
      typeof languageDetails.lang_support_docs === "object"
    ) {
      langaugeData.append(
        "lang_support_docs",
        languageDetails.lang_support_docs
      );
    }
    console.log("PutObject----->", langaugeData);
    // enabling spinner
    setIsLoading(true);
    axios
      .put(languageAPI, langaugeData, {
        params: {
          _id: parseInt(_id),
        },
      })
      .then(function (response) {
        let copyofLanguageDetails = { ...languageDetails };
        copyofLanguageDetails.islanguageDetailsEdited = false;
        setLanguageDetails(copyofLanguageDetails);
        // disabling spinner
        setIsLoading(false);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          // getLanguageAPI();
          toast("Language edited successfully.", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
          navigate(-1);
        }
      })
      .catch((error) => {
        // disabling spinner
        setIsLoading(false);
        toast(error.response.data.message + "_field in language edition", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log(error.response);
      });
  };

  console.log("language_details", languageDetails);
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
            { title: "Edit Language", navigationPath: "", displayOrder: 3 },
          ]}
        />
      </Content>
      {editLanguageButtonHeader()}

      <Spin tip="Please wait!" size="large" spinning={isLoading}>
        <Content>
          <Row>
            <Col span={16}>
              {isDataLoading ? (
                <Skeleton
                  active
                  paragraph={{
                    rows: 5,
                  }}
                  className="p-3"
                ></Skeleton>
              ) : (
                <>
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
                          placeholder="Enter Language Name"
                          value={languageDetails.language}
                          className={`${
                            isLanguageFieldEmpty
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                              : ""
                          }`}
                          onChange={(e) => {
                            languageHandler("language", e.target.value);
                          }}
                        />
                      </Content>
                      <Content className="my-2">
                        <label className="text-[13px]">
                          Language Code
                          <sup className="text-red-600 text-sm">*</sup>
                        </label>
                        <Input
                          placeholder="Enter Language Code"
                          value={languageDetails.language_code}
                          className={`${
                            isLanguageCodeFieldEmpty
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                              : ""
                          }`}
                          onChange={(e) => {
                            languageHandler("language_code", e.target.value);
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
                          value={languageDetails.dm_language_regex}
                          maxLength={128}
                          className={`${
                            isRegexFieldEmpty
                              ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                              : ""
                          }`}
                          onChange={(e) => {
                            languageHandler(
                              "dm_language_regex",
                              e.target.value
                            );
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
                          defaultValue={
                            languageDetails.writing_script_direction
                          }
                          value={languageDetails.writing_script_direction}
                          onChange={(e) => {
                            languageHandler("writing_script_direction", e);
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
                          onChange={(e) =>
                            languageHandler("lang_support_docs", e.target.files)
                          }
                          accept=".csv"
                        />

                        {languageDetails.lang_file_name !== null ? (
                          <p className="mt-2">
                            <span className="text-red-600">
                              {languageDetails.lang_file_name}{" "}
                            </span>{" "}
                            was uploaded for{" "}
                            <span className="text-red-600">
                              {languageDetails.language}
                            </span>{" "}
                            Language. You can update the file by browsing new
                            file above.
                          </p>
                        ) : (
                          ""
                        )}
                      </Content>
                    </Content>
                  </Content>
                  <Content className="mt-3">
                    <Row>
                      <Col>
                        <Link to="/dashboard/language">
                          <Button
                            // style={{ background: "#FFFFFF" }}
                            className="app-btn-secondary"
                          >
                            {/* <label className="h-5 text-[14px]  text-[#393939] cursor-pointer"> */}
                            Go Back
                            {/* </label> */}
                          </Button>
                        </Link>
                      </Col>
                      <Col className="pl-4">
                        <Button
                          // style={{ backgroundColor: "#393939" }}
                          className=" app-btn-primary"
                          onClick={validateLanguageFieldEmptyOrNot}
                        >
                          {/* <label className=" h-5  text-[14px]  text-[#FFFFFF] cursor-pointer"> */}
                          Update
                          {/* </label> */}
                        </Button>
                      </Col>
                    </Row>
                  </Content>
                </>
              )}
            </Col>
          </Row>
        </Content>
      </Spin>
    </Layout>
  );
};
export default EditLanguage;
